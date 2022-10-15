import { Request, Response } from 'express';
import prisma from '../utils/prismaHandler';
import VotingService from '../services/VotingService';
import Logger from '../utils/logger';
import * as responses from '../utils/responses';
import * as IPolling from '../models/IPolling';
import * as IVotingService from '../services/IVotingService';

const internalServerError = (
    method: string,
    req: Request,
    res: Response
): Response => {
    Logger.error(`Error occured when calling ${method} service`);
    return responses.internalServerError(req, res);
};

const callService = async (
    method: keyof VotingService,
    req: Request,
    res: Response
): Promise<Response> => {
    const service = new VotingService(prisma);

    try {
        if (typeof service[method] !== 'function') {
            return internalServerError(method, req, res);
        }

        type serviceFunction = (
            body: string | IPolling.PollRequest | IVotingService.AnswerData
        ) => IPolling.PollData | IPolling.AnswerData | null;

        const poll = await (service[method] as unknown as serviceFunction)(
            req.body
        );

        // Poll not found
        if (poll === null) {
            return responses.notFound(req, res);
        } else if (typeof poll === 'object') {
            return responses.ok(req, res, poll);
        }

        return internalServerError(method, req, res);
    } catch (e: unknown) {
        if (e instanceof Error) {
            Logger.error(e.message);
            Logger.error(e.stack);
        }

        // TODO: There **needs** to be separation between 400 and 500 errors here
        // To sent responses, use the error responses found inside responses.ts
        // Joonas Hiltunen 01.10.2022

        return responses.internalServerError(req, res);
    }
};

export const createPoll = async (req: Request, res: Response) => {
    return await callService('createPoll', req, res);
};

export const answerPoll = async (req: Request, res: Response) => {
    try {
        req.body.publicId = req.params.publicId;
    } catch (e) {
        return responses.badRequest(req, res);
    }

    return await callService('answerPoll', req, res);
};

export const getPollAnswers = async (req: Request, res: Response) => {
    // Dummy for future use
    return responses.notImplemented(req, res);
};

export const fetchPublicPoll = async (req: Request, res: Response) => {
    try {
        req.body = req.params.publicId;
    } catch (e) {
        return responses.badRequest(req, res);
    }

    return await callService('getPollWithPublicId', req, res);
};

export const fetchPrivatePoll = async (req: Request, res: Response) => {
    try {
        req.body = req.params.privateId;
    } catch (e) {
        return responses.badRequest(req, res);
    }

    return await callService('getPollWithPrivateId', req, res);
};
