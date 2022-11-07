import { PrismaClientInitializationError } from '@prisma/client/runtime';
import { Request, Response } from 'express';

import logger from '../utils/logger';
import prisma from '../utils/prismaHandler';

export const checkHealth = async (req: Request, res: Response) => {
    return res.json({
        server: true
    });
};

export const checkDbHealth = async (req: Request, res: Response) => {
    try {
        // Test the connection to the database
        console.debug('Checking health of database');
        await prisma.poll.findFirst();
        console.debug('Check for database health was successful');

        return res.json({
            server: true,
            database: true
        });
    } catch (e: any) {
        console.error('Unable to reach database');
        logger.error('Unable to reach database');

        console.debug(e.message);
        console.debug(e.stack);

        if (e instanceof PrismaClientInitializationError) {
            logger.error(e.message);
        }

        return res.json({
            server: true,
            database: false
        });
    }
};
