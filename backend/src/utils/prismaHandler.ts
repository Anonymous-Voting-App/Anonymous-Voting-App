import { PrismaClient } from '@prisma/client';

// Re use single Prisma instance
// https://www.prisma.io/docs/guides/performance-and-optimization/connection-management

const prisma = new PrismaClient();

export default prisma;
