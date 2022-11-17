import { Request, Response } from 'express';
import prisma from '../utils/prismaHandler';
import * as AccountManager from '../services/AccountManager';
import * as responses from '../utils/responses';
import * as Auth from '../services/Auth';
import logger from '../utils/logger';

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
        const code = await AccountManager.createUser(
            email,
            password,
            username,
            firstname,
            lastname,
            prisma
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
            return responses.custom(req, res, 201, 'Created');
        }

        if (code === 500) {
            return responses.custom(req, res, 500, 'Internal server error');
        }

        logger.error(`Error while creating account`);
        return responses.custom(req, res, 500, 'Unknown error');
    } catch (e: unknown) {
        logger.error(`Error while creating account: ${e}`);
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

        const data = await AccountManager.verifyUser(
            username,
            password,
            prisma
        );

        if (data === null) {
            return responses.custom(
                req,
                res,
                400,
                'Username or password is incorrect'
            );
        }

        return res.json({
            token: Auth.signToken(data),
            user: data
        });
    } catch (e: unknown) {
        logger.error(`Error while creating account: ${e}`);
        return responses.custom(req, res, 500, 'Unknown error');
    }
};
