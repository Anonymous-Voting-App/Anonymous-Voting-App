import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

import prisma from './prisma_test_client';

jest.mock('./prisma_test_client', () => ({
    __esModule: true,
    default: mockDeep<PrismaClient>()
}));

beforeEach(() => {
    mockReset(prismaMock);
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
