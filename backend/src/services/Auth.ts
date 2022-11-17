import { sign, verify } from 'jsonwebtoken';
import { Request } from 'express';
import logger from '../utils/logger';
import { UserData } from './IAccountManager';

export const signToken = (data: UserData) => {
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
        throw new Error('JWT secret must be given');
    }

    return sign(data, JWT_SECRET, { expiresIn: '48h', subject: data.id });
};

export const verifyToken = (req: Request): UserData | null => {
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
        throw new Error('JWT secret must be given');
    }

    try {
        const token = req.headers.authorization;

        if (!token) {
            return null;
        }

        const values = token.split(' ');
        const type = values[0];
        const jwt = values[1];

        if (type.toLowerCase() !== 'bearer') {
            return null;
        }

        // As the throw by `verify` is expected, created
        // separate catch for it so that unexpected errors
        // can be handled separately
        try {
            const jwtPayload = verify(jwt, JWT_SECRET);
            return jwtPayload as UserData;
        } catch (e: unknown) {
            // Expected throw if jwt is not valid
            return null;
        }
    } catch (e: unknown) {
        // Unexpected error
        logger.error(e);
        return null;
    }
};
