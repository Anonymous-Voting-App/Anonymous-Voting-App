import { Request, Response } from 'express';
import prisma from '../utils/prismaHandler';
import * as AccountManager from '../services/AccountManager';
import * as responses from '../utils/responses';
import * as Auth from '../services/Auth';
import logger from '../utils/logger';

export const createAccount = async (req: Request, res: Response) => {
    try {
        const password = req.body.password as string;
        const email = req.body.email as string;
        const username = req.body.username as string;
        const firstname = req.body.firstname as string;
        const lastname = req.body.lastname as string;

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
        const password = req.body.password as string;
        // const email = req.body.email as string;
        const username = req.body.username as string;

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
