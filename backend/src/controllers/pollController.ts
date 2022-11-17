import { Request, Response } from 'express';
import prisma from '../utils/prismaHandler';
import VotingService from '../services/VotingService';
import Logger from '../utils/logger';
import * as responses from '../utils/responses';
import * as IPolling from '../models/IPolling';
import * as IVotingService from '../services/IVotingService';
import QuestionFactory from '../models/QuestionFactory';
import { AssertionError } from 'assert';
import BadRequestError from '../utils/badRequestError';
import WebFingerprintFactory from '../models/user/WebFingerprintFactory';
import Fingerprint from '../models/user/IdentifyingFeature';

const internalServerError = (
    method: string,
    req: Request,
    res: Response
): Response => {
    Logger.error(`Error occured when calling ${method} service`);
    return responses.internalServerError(req, res);
};

function makeIdentityFactory() {
    const identityFactory = new WebFingerprintFactory(prisma);

    identityFactory.setUseIp(true);
    identityFactory.setUseCookie(true);

    return identityFactory;
}

function makeFingerprint(req: Request) {
    const identityFactory = makeIdentityFactory();

    const userIdentity = identityFactory.createFromExpressRequest(req);

    userIdentity.setSamenessCheck('oneOf');

    return userIdentity;
}

const callService = async (
    method: keyof VotingService,
    req: Request,
    res: Response
): Promise<Response> => {
    const service = new VotingService(prisma, new QuestionFactory(prisma));
    const userIdentity = makeFingerprint(req);

    try {
        if (typeof service[method] !== 'function') {
            return internalServerError(method, req, res);
        }

        type serviceFunction = (
            body: string | IPolling.PollRequest | IVotingService.AnswerData,
            userIdentity: Fingerprint
        ) => IPolling.PollData | IPolling.AnswerData | null;

        const poll = await (service[method] as unknown as serviceFunction)(
            req.body,
            userIdentity
        );

        // Poll not found
        if (poll === null) {
            return responses.notFound(req, res);
        } else if (typeof poll === 'object') {
            // Location headers not correct on local runtime!
            if (method === 'createPoll') {
                const location = `/poll/${poll.id}`;
                return responses.created(req, res, location, poll);
            } else if (method === 'answerPoll') {
                const location = `/poll/${req.body.publicId}/answers`;
                return responses.created(req, res, location, poll);
            }

            return responses.ok(req, res, poll);
        }

        return internalServerError(method, req, res);
    } catch (e: unknown) {
        // Bad request
        if (e instanceof AssertionError) {
            Logger.warn(`Bad Request: ${e.message}`);
            Logger.warn(e.stack);
            return responses.badRequest(req, res);
        } else if (e instanceof BadRequestError) {
            Logger.warn(`Bad Request: ${e.message}`);
            Logger.warn(e.stack);
            return responses.badRequest(req, res);
        }

        if (e instanceof Error) {
            Logger.error(e.message);
            Logger.error(e.stack);
        }

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
    try {
        req.body = req.params.publicId;
    } catch (e) {
        return responses.badRequest(req, res);
    }

    return await callService('getPollAnswers', req, res);
};

export const getPollResults = async (req: Request, res: Response) => {
    try {
        req.body = req.params.publicId;
    } catch (e) {
        return responses.badRequest(req, res);
    }

    return await callService('getPollResults', req, res);
};

export const getPublicPoll = async (req: Request, res: Response) => {
    try {
        req.body = req.params.publicId;
    } catch (e) {
        return responses.badRequest(req, res);
    }

    return await callService('getPollWithPublicId', req, res);
};

export const getPrivatePoll = async (req: Request, res: Response) => {
    try {
        req.body = req.params.privateId;
    } catch (e) {
        return responses.badRequest(req, res);
    }

    return await callService('getPollWithPrivateId', req, res);
};
