import * as AccountManager from './AccountManager';
import bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import { prismaMock } from '../utils/prisma_singleton';

// Mock logger to disable error logs during tests
jest.mock('../utils/logger');

const existingUser: User = {
    id: '148b3506-ec08-413a-8f77-c05c0b4b65cf',
    createdAt: new Date(),
    updatedAt: new Date(),
    email: 'test@email.com',
    emailVerified: false,
    password: bcrypt.hashSync('testPw', 10),
    username: 'TestUser',
    firstname: 'Test',
    lastname: 'User',
    isAdmin: true
};

describe('AccountManager', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('createUser', () => {
        test('Should handle errors being thrown', async () => {
            prismaMock.user.findFirst.mockImplementationOnce(() => {
                throw new Error('test error');
            });

            const res = await AccountManager.createUser(
                'notTheSame@email.com',
                'testPw',
                'notSameUsername',
                existingUser.firstname,
                existingUser.lastname,
                prismaMock
            );

            expect(res).toEqual(500);
        });

        test('Should return 400 when email exists', async () => {
            prismaMock.user.findFirst.mockResolvedValueOnce(existingUser); // Email
            prismaMock.user.findFirst.mockResolvedValueOnce(existingUser); // Username

            const res = await AccountManager.createUser(
                existingUser.email,
                'testPw',
                'notSameUsername',
                existingUser.firstname,
                existingUser.lastname,
                prismaMock
            );

            expect(res).toEqual(400);
            expect(prismaMock.user.findFirst).toHaveBeenCalledTimes(2);
        });

        test('Should return 400 when username exists', async () => {
            prismaMock.user.findFirst.mockResolvedValueOnce(existingUser); // Email
            prismaMock.user.findFirst.mockResolvedValueOnce(existingUser); // Username

            const res = await AccountManager.createUser(
                'notTheSame@email.com',
                'testPw',
                existingUser.username,
                existingUser.firstname,
                existingUser.lastname,
                prismaMock
            );

            expect(res).toEqual(400);
            expect(prismaMock.user.findFirst).toHaveBeenCalledTimes(2);
        });

        test('Should create user when email and username are unique', async () => {
            prismaMock.user.findFirst.mockResolvedValueOnce(null); // Email
            prismaMock.user.findFirst.mockResolvedValueOnce(null); // Username

            const res = await AccountManager.createUser(
                'notTheSame@email.com',
                'testPw',
                'notSameUsername',
                existingUser.firstname,
                existingUser.lastname,
                prismaMock
            );

            expect(res).toEqual(200);
            expect(prismaMock.user.findFirst).toHaveBeenCalledTimes(2);
            expect(prismaMock.user.create).toHaveBeenCalledTimes(1);
        });
    });

    describe('verifyUser', () => {
        test('Should handle error being thrown', async () => {
            prismaMock.user.findFirst.mockImplementationOnce(() => {
                throw new Error('test error');
            });

            const res = await AccountManager.verifyUser(
                existingUser.username,
                'testPw',
                prismaMock
            );

            expect(res).toBeNull();
        });

        test('Should return null if username does not exist', async () => {
            prismaMock.user.findFirst.mockResolvedValueOnce(null);

            const res = await AccountManager.verifyUser(
                'notSameUsername',
                existingUser.password,
                prismaMock
            );

            expect(res).toBeNull();
            expect(prismaMock.user.findFirst).toHaveBeenCalledTimes(1);
        });

        test('Should return null if password is not correct', async () => {
            prismaMock.user.findFirst.mockResolvedValueOnce(existingUser);

            const res = await AccountManager.verifyUser(
                existingUser.username,
                'wrongPassword',
                prismaMock
            );

            expect(res).toBeNull();
            expect(prismaMock.user.findFirst).toHaveBeenCalledTimes(1);
        });

        test('Should return UserData when password matches', async () => {
            prismaMock.user.findFirst.mockResolvedValueOnce(existingUser);

            const res = await AccountManager.verifyUser(
                existingUser.username,
                'testPw',
                prismaMock
            );

            expect(res).toEqual({
                id: existingUser.id,
                firstName: existingUser.firstname,
                lastName: existingUser.lastname,
                email: existingUser.email,
                userName: existingUser.username
            });
            expect(prismaMock.user.findFirst).toHaveBeenCalledTimes(1);
        });
    });

    describe('isAdmin', () => {
        test('Should handle error being thrown', async () => {
            prismaMock.user.findFirst.mockImplementationOnce(() => {
                throw new Error('test error');
            });

            const res = await AccountManager.isAdmin(
                existingUser.username,
                prismaMock
            );
            expect(res).toEqual(false);
        });

        test('Should return false if user does not exist', async () => {
            prismaMock.user.findFirst.mockResolvedValueOnce(null);

            const res = await AccountManager.isAdmin('notRealUser', prismaMock);

            expect(res).toEqual(false);
            expect(prismaMock.user.findFirst).toHaveBeenCalledTimes(1);
        });

        test('Should return value of "isAdmin" if user exists', async () => {
            prismaMock.user.findFirst.mockResolvedValueOnce(existingUser);

            const res = await AccountManager.isAdmin(
                existingUser.username,
                prismaMock
            );

            expect(res).toEqual(existingUser.isAdmin);
            expect(prismaMock.user.findFirst).toHaveBeenCalledTimes(1);
        });
    });
});
