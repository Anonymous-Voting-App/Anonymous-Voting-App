import { NextFunction, Request, Response } from 'express';
import { validationResult, ValidationError } from 'express-validator';
import logger from '../utils/logger';
import * as responses from '../utils/responses';

export const validationResultHandler = () => {
    const middleware = (req: Request, res: Response, next: NextFunction) => {
        try {
            const errorFormatter = ({ msg }: ValidationError) => {
                return `${msg}`;
            };

            const errors = validationResult(req).formatWith(errorFormatter);

            if (!errors.isEmpty()) {
                return responses.custom(req, res, 400, {
                    code: 400,
                    message: errors.array()
                });
            }

            next();
        } catch (e: unknown) {
            logger.error(e);
            return responses.internalServerError(req, res);
        }
    };

    return middleware;
};
