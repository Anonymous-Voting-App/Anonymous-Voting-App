import { Request, Response, NextFunction } from 'express';
import * as authenticationHandler from './authenticationHandler';
import { verifyToken } from '../services/Auth';
import { isAdmin } from '../services/AccountManager';
import * as responses from '../utils/responses';
import { UserData } from '../services/IAccountManager';

jest.mock('../utils/logger');
jest.mock('../services/Auth');
jest.mock('../utils/responses');
jest.mock('../services/AccountManager');
jest.mock('../utils/prismaHandler');

const mockedVerifyToken = jest.mocked(verifyToken);
const mockedIsAdmin = jest.mocked(isAdmin);
const mockedResponses = jest.mocked(responses);

describe('authenticationHandler', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    const mockNext: NextFunction = jest.fn();
    let data: UserData;

    beforeEach(() => {
        jest.resetAllMocks();

        data = {
            id: '54e293d1-a60d-4ed6-9fa6-a82789158cd5',
            email: 'test@email.com',
            userName: 'username',
            firstName: 'Test',
            lastName: 'User'
        };
    });

    describe('authenticate', () => {
        beforeEach(() => {
            mockRequest = {
                User: undefined,
                UserIsAdmin: undefined
            };
        });

        test('Should call next if user is not set', async () => {
            mockedVerifyToken.mockReturnValueOnce(null);

            await authenticationHandler.authenticate()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith();
            expect(mockRequest.User).toBeUndefined();
            expect(mockRequest.UserIsAdmin).toBeUndefined();
        });

        test('Should set decoded user to request', async () => {
            mockedVerifyToken.mockReturnValueOnce(data);

            await authenticationHandler.authenticate()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith();
            expect(mockRequest.User).toEqual(data);
            expect(mockRequest.UserIsAdmin).toBeUndefined();
        });

        test('Should handle errors being thrown', async () => {
            mockedVerifyToken.mockImplementationOnce(() => {
                throw new Error('test error');
            });

            await authenticationHandler.authenticate()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.internalServerError).toBeCalledTimes(1);
            expect(mockRequest.User).toBeUndefined();
            expect(mockRequest.UserIsAdmin).toBeUndefined();
        });
    });

    describe('requireUser', () => {
        beforeEach(() => {
            mockRequest = {
                User: data
            };
        });

        test('Should return unauthorized if user not set', async () => {
            mockRequest.User = undefined;

            await authenticationHandler.requireUser()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.unauthorized).toBeCalledTimes(1);
            expect(mockRequest.User).toBeUndefined();
            expect(mockRequest.UserIsAdmin).toBeUndefined();
        });

        test('Should check if user is admin and call next', async () => {
            mockedIsAdmin.mockResolvedValueOnce(false);

            await authenticationHandler.requireUser()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith();
            expect(mockRequest.User).toEqual(data);
            expect(mockRequest.UserIsAdmin).toEqual(false);
        });

        test('Should handle errors being thrown', async () => {
            mockedIsAdmin.mockImplementationOnce(() => {
                throw new Error('test error');
            });

            await authenticationHandler.requireUser()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.internalServerError).toBeCalledTimes(1);
            expect(mockRequest.User).toEqual(data);
            expect(mockRequest.UserIsAdmin).toBeUndefined();
        });
    });

    describe('requireAdmin', () => {
        beforeEach(() => {
            mockRequest = {
                User: data
            };
        });

        test('Should return unauthorized if user not set', async () => {
            mockRequest.User = undefined;

            await authenticationHandler.requireAdmin()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.unauthorized).toBeCalledTimes(1);
            expect(mockRequest.User).toBeUndefined();
            expect(mockRequest.UserIsAdmin).toBeUndefined();
        });

        test('Should return forbidden if user is not admin', async () => {
            mockedIsAdmin.mockResolvedValueOnce(false);

            await authenticationHandler.requireAdmin()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.forbidden).toBeCalledTimes(1);
            expect(mockRequest.User).toEqual(data);
            expect(mockRequest.UserIsAdmin).toEqual(false);
        });

        test('Should call next if user is admin', async () => {
            mockedIsAdmin.mockResolvedValueOnce(true);

            await authenticationHandler.requireAdmin()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith();
            expect(mockRequest.User).toEqual(data);
            expect(mockRequest.UserIsAdmin).toEqual(true);
        });

        test('Should handle errors being thrown', async () => {
            mockedIsAdmin.mockImplementationOnce(() => {
                throw new Error('test error');
            });

            await authenticationHandler.requireAdmin()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedResponses.internalServerError).toBeCalledTimes(1);
            expect(mockRequest.User).toEqual(data);
            expect(mockRequest.UserIsAdmin).toBeUndefined();
        });
    });
});
