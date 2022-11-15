import { sign, verify } from 'jsonwebtoken';
import { Request } from 'express';

const JWT_SECRET = process.env.JWT_SECRET;

if (JWT_SECRET === undefined || typeof JWT_SECRET !== 'string') {
    throw new Error('JWT secret must be given');
}

export const signToken = (username: string) => {
    return sign({ user: username }, JWT_SECRET, { expiresIn: '48h' });
};

export const verifyToken = (req: Request) => {
    //let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    //let jwtSecretKey = process.env.JWT_SECRET_KEY;
    try {
        let token = req.headers.authorization;

        if (token === null || token === undefined) {
            return false;
        }

        const value = token.split(' ');
        const bearer = value[1];
        token = bearer;

        const verified = verify(token, JWT_SECRET);
        if (verified) {
            return true;
        } else {
            // Access Denied
            return false;
        }
    } catch (error) {
        // Access Denied
        return false;
    }
};
