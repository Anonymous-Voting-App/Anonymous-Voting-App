import { Request } from 'express';
import { signToken, verifyToken } from './Auth';
import jsonwebtoken from 'jsonwebtoken';
import { UserData } from './IAccountManager';

// Mock logger to disable error logs during tests
jest.mock('../utils/logger');

jest.mock('jsonwebtoken');
const mockedJwt = jest.mocked(jsonwebtoken);

describe('Auth', () => {
    let mockRequest: Partial<Request>;

    beforeEach(() => {
        jest.resetAllMocks();

        process.env.JWT_SECRET = 'test';
    });

    describe('signToken', () => {
        const testData: UserData = {
            id: 'e44b6e5e-dd62-4b4f-85f2-2aebc0d94c3c',
            userName: 'testUsername',
            firstName: 'test',
            lastName: 'user',
            email: 'test@email.com'
        };

        test('Should throw if Jwt_SECRET not set', () => {
            delete process.env.JWT_SECRET;

            expect(() => signToken(testData)).toThrowError(
                'JWT secret must be given'
            );
        });

        test('Should sign JWT with 48h expiry and set id as subject', () => {
            signToken(testData);

            expect(mockedJwt.sign).toHaveBeenCalledTimes(1);
            expect(mockedJwt.sign).toHaveBeenCalledWith(testData, 'test', {
                expiresIn: '48h',
                subject: testData.id
            });
        });
    });

    describe('verifyToken', () => {
        beforeEach(() => {
            mockRequest = {
                headers: {
                    authorization: 'Bearer testToken'
                }
            };
        });

        test('Should throw when JWT_SECRET is not set', () => {
            delete process.env.JWT_SECRET;

            expect(() => verifyToken(mockRequest as Request)).toThrowError(
                'JWT secret must be given'
            );
        });

        test('Should return null when token is not set', () => {
            delete mockRequest.headers?.authorization;

            const res = verifyToken(mockRequest as Request);

            expect(res).toBeNull();
            expect(mockedJwt.verify).not.toBeCalled();
        });

        test('Should return null when authorization scheme is not Bearer', () => {
            mockRequest = {
                headers: {
                    authorization: 'Basic user:pw'
                }
            };

            const res = verifyToken(mockRequest as Request);

            expect(res).toBeNull();
            expect(mockedJwt.verify).not.toBeCalled();
        });

        test('Should return null when token is not valid', () => {
            mockedJwt.verify.mockImplementationOnce(() => {
                throw new Error('JWT not valid');
            });

            const res = verifyToken(mockRequest as Request);

            expect(res).toBeNull();
            expect(mockedJwt.verify).toBeCalledTimes(1);
        });

        test('Should return user data when token is valid', () => {
            const testData: UserData = {
                id: 'e44b6e5e-dd62-4b4f-85f2-2aebc0d94c3c',
                userName: 'testUsername',
                firstName: 'test',
                lastName: 'user',
                email: 'test@email.com'
            };

            mockedJwt.verify.mockImplementationOnce(() => testData);

            const res = verifyToken(mockRequest as Request);

            expect(res).not.toBeNull();
            expect(res).toEqual(testData);
            expect(mockedJwt.verify).toBeCalledTimes(1);
        });
    });
});
