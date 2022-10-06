import { PrismaClientInitializationError } from '@prisma/client/runtime';
import { Request, Response } from 'express';

import logger from '../utils/logger';
import prisma from '../utils/prismaHandler';

export const checkHealth = async (req: Request, res: Response) => {
    try {
        // Test the connection to the database
        await prisma.poll.findFirst();
        return res.json({
            server: true,
            database: true
        });
    } catch (e: unknown) {
        logger.error('Unable to reach database');

        if (e instanceof PrismaClientInitializationError) {
            logger.error(e.message);
        }

        return res.json({
            server: true,
            database: false
        });
    }
};
