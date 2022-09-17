import { Request, Response } from 'express';
import { mocked } from 'jest-mock';
import { internalServerError } from './responses';
import Logger from './logger';

import errorHandler from './errorHandler';

jest.mock('./responses');
jest.mock('./logger');

const mockedInternalServerError = mocked(internalServerError, {
    shallow: false
});
const mockedLogger = mocked(Logger, { shallow: false });

describe('errorHandler', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.Mock;

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {};
        mockNext = jest.fn();

        jest.resetAllMocks();
    });

    test('Should log "No message" if not given error message', async () => {
        const error = new Error();

        await errorHandler()(
            error,
            mockRequest as Request,
            mockResponse as Response,
            mockNext
        );

        expect(mockNext).not.toBeCalled();
        expect(mockedInternalServerError).toBeCalledTimes(1);
        expect(mockedLogger.error).toBeCalledWith('No message');
    });

    test('Should log error message if given', async () => {
        const error = new Error('msg');

        await errorHandler()(
            error,
            mockRequest as Request,
            mockResponse as Response,
            mockNext
        );

        expect(mockNext).not.toBeCalled();
        expect(mockedInternalServerError).toBeCalledTimes(1);
        expect(mockedLogger.error).toBeCalledWith('msg');
    });
});
