import { Request, Response } from 'express';
import prisma from '../utils/prismaHandler';
import VotingService from '../services/VotingService';

async function callService(
    method: string,
    req: Request,
    res: Response
): Promise<any> {
    var service = new VotingService(prisma);

    try {
        var poll = await (service as any)[method](req.body);

        if (typeof poll === 'object') {
            return res.json({
                data: poll
            });
        }

        return res.json({
            error: 'Error occured when calling service.'
        });
    } catch (e: any) {
        console.log(e.stack);

        return res.json({
            error: e.message
        });
    }
}

export const createPoll = async (req: Request, res: Response) => {
    return await callService('createPoll', req, res);
};

export const answerPoll = async (req: Request, res: Response) => {
    return await callService('answerPoll', req, res);
};

export const fetchPoll = async (req: Request, res: Response) => {
    try {
        req.body = req.params.publicId;
    } catch (e) {
        return res.json({
            error: 'Error: Missing publicId parameter.'
        });
    }

    return await callService('getPollWithPublicId', req, res);
};
