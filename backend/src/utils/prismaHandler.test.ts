import prisma from './prismaHandler';
import { PrismaClient } from '@prisma/client';

describe('prismaHandler', () => {
    test('Should export prisma client as default', () => {
        const realPrisma = new PrismaClient();
        expect(typeof prisma).toEqual(typeof realPrisma);
    });
});
