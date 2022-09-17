import { Request, Response } from 'express';

// This module contains common responses in consistent format

//
// Ok
//

/**
 * 200 Ok
 */
export const ok = (req: Request, res: Response, data: unknown) => {
    return res.status(200).json(data);
};

/**
 * 201 Created
 */
export const created = (req: Request, res: Response, data: unknown = null) => {
    if (!data) {
        return res.status(201).json({
            code: 201,
            message: 'Created'
        });
    }

    return res.status(201).json(data);
};

/**
 * 204 No Content
 */
export const noContent = (req: Request, res: Response) => {
    return res.status(204).json({
        code: 204,
        message: 'No Content'
    });
};

//
// User errors
//

/**
 * 400 Bad Request
 */
export const badRequest = (req: Request, res: Response) => {
    return res.status(400).json({
        code: 400,
        message: 'Bad Request'
    });
};

/**
 * 401 Unauthorized
 */
export const unauthorized = (req: Request, res: Response) => {
    return res.status(401).json({
        code: 401,
        message: 'Unauthorized'
    });
};

/**
 * 404 Not Found
 */
export const notFound = (req: Request, res: Response) => {
    return res.status(404).json({
        code: 404,
        message: 'Not Found'
    });
};

//
// Internal errors
//

/**
 * 500 Internal Server Error
 */
export const internalServerError = (req: Request, res: Response) => {
    return res.status(500).json({
        code: 500,
        message: 'Internal Server Error'
    });
};

/**
 * 501 Not Implemented
 */
export const notImplemented = (req: Request, res: Response) => {
    return res.status(501).json({
        code: 501,
        message: 'Not Implemented'
    });
};

/**
 * 503 Service Unavailable
 */
export const serviceUnavailable = (req: Request, res: Response) => {
    return res.status(503).json({
        code: 503,
        message: 'Service Unavailable'
    });
};

/**
 * Custom
 */
export const custom = (
    req: Request,
    res: Response,
    code: number,
    message: string
) => {
    return res.status(code).json({
        code,
        message
    });
};
