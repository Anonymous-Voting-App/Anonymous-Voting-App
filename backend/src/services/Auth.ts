import { sign, verify } from 'jsonwebtoken';
import { Request } from 'express';
import logger from '../utils/logger';
import { UserData } from './IAccountManager';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT secret must be given');
}

export const signToken = (data: UserData) => {
    return sign(data, JWT_SECRET, { expiresIn: '48h', subject: data.id });
};

export const verifyToken = (req: Request): UserData | null => {
    try {
        const token = req.headers.authorization;

        if (token === null || token === undefined) {
            return null;
        }

        const values = token.split(' ');
        const bearer = values[1];

        const verified = verify(bearer, JWT_SECRET);
        if (verified) {
            return verified as UserData;
        } else {
            // Access Denied
            return null;
        }
    } catch (e: unknown) {
        // Access Denied
        logger.error(`Error while verifying token: ${e}`);
        return null;
    }
};
