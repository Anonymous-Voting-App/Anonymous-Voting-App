import { Request, Response } from 'express';
import prisma from '../utils/prismaHandler';

export const checkHealth = async (req: Request, res: Response) => {
    try {
        // Test the connection to the database
        await prisma.poll.findFirst();
        return res.json({
            server: true,
            database: true
        });
    } catch {
        return res.json({
            server: true,
            database: false
        });
    }
};
