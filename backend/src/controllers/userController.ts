import { Request, Response } from 'express';
import * as AccountManager from '../services/AccountManager';
import * as responses from '../utils/responses';
import * as auth from '../services/auth';

export const createAccount = async (req: Request, res: Response) => {
    try {
        const password = req.body.password;
        const email = req.body.email;
        const username = req.body.username;
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;

        if (password == null) {
            return responses.custom(req, res, 400, 'Password can not be empty');
        }
        if (email == null) {
            return responses.custom(req, res, 400, 'Email can not be empty');
        }
        if (username == null) {
            return responses.custom(req, res, 400, 'Username can not be empty');
        }
        if (firstname == null) {
            return responses.custom(
                req,
                res,
                400,
                'First name can not be empty'
            );
        }
        if (lastname == null) {
            return responses.custom(
                req,
                res,
                400,
                'Last name can not be empty'
            );
        }

        // password checks
        if (password.length < 6) {
            return responses.custom(
                req,
                res,
                400,
                'Password must be at least 6 characters'
            );
        }

        // email checks
        const regexEmailValidation =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!email.match(regexEmailValidation)) {
            return responses.custom(req, res, 400, 'Email must be valid');
        }

        // account creation
        const code = await AccountManager.CreateUser(
            email,
            password,
            username,
            firstname,
            lastname
        );
        if (code === 400) {
            return responses.custom(
                req,
                res,
                400,
                'Username or email already exist'
            );
        }

        if (code === 200) {
            return responses.created(req, res);
        }

        if (code === 500) {
            return responses.custom(req, res, 500, 'Internal server error');
        }
        return responses.custom(req, res, 500, 'Unknown error');
    } catch {
        return responses.custom(req, res, 500, 'Unknown error');
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const password = req.body.password;
        // const email = req.body.email;
        const username = req.body.username;

        if (password == null) {
            return responses.custom(req, res, 400, 'Password can not be empty');
        }
        if (username == null) {
            return responses.custom(req, res, 400, 'Username can not be empty');
        }

        const data = await AccountManager.verify(username, password);
        if (data === null) {
            return responses.custom(
                req,
                res,
                400,
                'Username or password is incorrect'
            );
        }

        return res.json({
            token: auth.signToken(username),
            user: data
        });
    } catch {
        return responses.custom(req, res, 500, 'Unknown error');
    }
};

export const test = async (req: Request, res: Response) => {
    const isLoggedIn = auth.verifyToken(req);
    if (isLoggedIn) {
        return responses.ok(req, res, {});
    }
    return responses.forbidden(req, res);
};
