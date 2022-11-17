import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/Auth';
import { isAdmin } from '../services/AccountManager';
import * as responses from '../utils/responses';
import prisma from '../utils/prismaHandler';

/**
 * Checks token and adds user to req.User if token contained it
 * @returns
 */
export const authenticate = () => {
    const middleware = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const user = verifyToken(req);

        if (!user) {
            req.User = undefined;
            req.UserIsAdmin = undefined;
            return next();
        }

        req.User = user;
        return next();
    };

    return middleware;
};

/**
 * Check that provided token was valid
 * @prerequisite authenticate
 * @returns
 */
export const requireUser = () => {
    const middleware = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const user = req.User;

        if (!user) {
            return responses.forbidden(req, res);
        }

        req.UserIsAdmin = await isAdmin(user.userName, prisma);
        return next();
    };

    return middleware;
};

/**
 * Check that requesting user has admin rights
 * @prerequisite authenticate
 * @returns
 */
export const requireAdmin = () => {
    const middleware = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const user = req.User;

        if (!user) {
            return responses.forbidden(req, res);
        }

        const userIsAdmin = await isAdmin(user.userName, prisma);
        req.UserIsAdmin = userIsAdmin;

        if (!userIsAdmin) {
            return responses.unauthorized(req, res);
        }

        return next();
    };

    return middleware;
};
