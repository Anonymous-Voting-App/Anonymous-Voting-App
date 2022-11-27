import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/Auth';
import { isAdmin } from '../services/AccountManager';
import * as responses from '../utils/responses';
import prisma from '../utils/prismaHandler';
import logger from '../utils/logger';

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
        try {
            const user = verifyToken(req);

            if (!user) {
                req.User = undefined;
                return next();
            }

            req.User = user;
            return next();
        } catch (e: unknown) {
            logger.error(e);
            return responses.internalServerError(req, res);
        }
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
        try {
            const user = req.User;

            if (!user) {
                return responses.unauthorized(req, res);
            }

            req.UserIsAdmin = await isAdmin(user.userName, prisma);
            return next();
        } catch (e: unknown) {
            logger.error(e);
            return responses.internalServerError(req, res);
        }
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
        try {
            const user = req.User;

            if (!user) {
                return responses.unauthorized(req, res);
            }

            const userIsAdmin = await isAdmin(user.userName, prisma);
            req.UserIsAdmin = userIsAdmin;

            if (!userIsAdmin) {
                return responses.forbidden(req, res);
            }

            return next();
        } catch (e: unknown) {
            logger.error(e);
            return responses.internalServerError(req, res);
        }
    };

    return middleware;
};
