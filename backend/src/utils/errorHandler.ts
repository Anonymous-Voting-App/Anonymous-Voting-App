/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import logger from './logger';

import { internalServerError } from './responses';

const errorHandler = () => {
    const middleware = async (
        error: Error,
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        if (error && error.message) logger.error(error.message);
        else logger.error('No message');

        internalServerError(req, res);
    };

    return middleware;
};

export default errorHandler;
