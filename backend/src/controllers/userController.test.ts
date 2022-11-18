import * as userController from './userController';
import * as AccountManager from '../services/AccountManager';
import { Request, Response } from 'express';
import * as responses from '../utils/responses';
import { UserData } from '../services/IAccountManager';
import * as Auth from '../services/Auth';

// Mock logger to disable error logs during tests
jest.mock('../utils/logger');
jest.mock('../services/AccountManager');
jest.mock('../utils/responses');
jest.mock('../services/Auth');

const mockedAccountManager = jest.mocked(AccountManager);
const mockedResponses = jest.mocked(responses);
const mockedAuth = jest.mocked(Auth);

describe('userController', () => {
    let request: Partial<Request>;
    let response: Partial<Response>;

    beforeEach(() => {
        jest.resetAllMocks();

        const mockResponse = () => {
            const res: Partial<Response> = {};
            res.status = jest.fn().mockReturnValue(res);
            res.json = jest.fn().mockReturnValue(res);
            return res;
        };

        response = mockResponse();
    });

    describe('createAccount', () => {
        beforeEach(() => {
            request = {
                body: {
                    email: 'test@email.com',
                    password: 'testPassword',
                    username: 'testUsername',
                    firstname: 'Test',
                    lastname: 'User'
                }
            };
        });

        test('Should return 400 if username or email already exist', async () => {
            mockedAccountManager.createUser.mockResolvedValueOnce(400);

            await userController.createAccount(
                request as Request,
                response as Response
            );

            expect(mockedResponses.custom).toBeCalledTimes(1);
            expect(mockedResponses.custom).toBeCalledWith(
                request,
                response,
                400,
                'Username or email already exist'
            );
        });

        test('Should return 201 if account creation was successful', async () => {
            mockedAccountManager.createUser.mockResolvedValueOnce(200);

            await userController.createAccount(
                request as Request,
                response as Response
            );

            expect(mockedResponses.custom).toBeCalledTimes(1);
            expect(mockedResponses.custom).toBeCalledWith(
                request,
                response,
                201,
                'Created'
            );
        });

        test('Should return 500 if there was error while creating account', async () => {
            mockedAccountManager.createUser.mockResolvedValueOnce(500);

            await userController.createAccount(
                request as Request,
                response as Response
            );

            expect(mockedResponses.internalServerError).toBeCalledTimes(1);
            expect(mockedResponses.internalServerError).toBeCalledWith(
                request,
                response
            );
        });

        test('Should return 500 if create user returns incorrect code', async () => {
            mockedAccountManager.createUser.mockResolvedValueOnce(503);

            await userController.createAccount(
                request as Request,
                response as Response
            );

            expect(mockedResponses.internalServerError).toBeCalledTimes(1);
            expect(mockedResponses.internalServerError).toBeCalledWith(
                request,
                response
            );
        });

        test('Should handle errors being thrown', async () => {
            mockedAccountManager.createUser.mockImplementationOnce(() => {
                throw new Error('Test error');
            });

            await userController.createAccount(
                request as Request,
                response as Response
            );

            expect(mockedResponses.internalServerError).toBeCalledTimes(1);
            expect(mockedResponses.internalServerError).toBeCalledWith(
                request,
                response
            );
        });
    });

    describe('login', () => {
        beforeEach(() => {
            request = {
                body: {
                    password: 'testPassword',
                    username: 'testUsername'
                }
            };
        });

        test('Should return 400 if user could not be verified', async () => {
            mockedAccountManager.verifyUser.mockResolvedValueOnce(null);

            await userController.login(
                request as Request,
                response as Response
            );

            expect(mockedResponses.custom).toBeCalledTimes(1);
            expect(mockedResponses.custom).toBeCalledWith(
                request,
                response,
                400,
                'Username or password is incorrect'
            );
        });

        test('Should return token and data if successful', async () => {
            const data: UserData = {
                id: 'f2fdaf0b-6a09-4671-9650-b2a0fea4de4b',
                email: 'test@email.com',
                userName: 'testUsername',
                firstName: 'Test',
                lastName: 'User'
            };

            mockedAccountManager.verifyUser.mockResolvedValueOnce(data);
            mockedAuth.signToken.mockReturnValueOnce('fakeJwt');

            await userController.login(
                request as Request,
                response as Response
            );

            expect(mockedResponses.custom).toBeCalledTimes(1);
            expect(mockedResponses.custom).toBeCalledWith(
                request,
                response,
                200,
                {
                    token: 'fakeJwt',
                    user: data
                }
            );
        });

        test('Should handle errors being thrown', async () => {
            mockedAccountManager.verifyUser.mockImplementationOnce(() => {
                throw new Error('Test error');
            });

            await userController.login(
                request as Request,
                response as Response
            );

            expect(mockedResponses.internalServerError).toBeCalledTimes(1);
            expect(mockedResponses.internalServerError).toBeCalledWith(
                request,
                response
            );
        });
    });
});
