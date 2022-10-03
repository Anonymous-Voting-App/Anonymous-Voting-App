import { PollData } from '../models/IPolling';
import User from '../models/User';
import UserManager from './UserManager';
import Poll from '../models/Poll';
import * as IPolling from '../models/IPolling';
import { prismaMock } from '../utils/prisma_singleton';
import VotingService from './VotingService';
import Answer from '../models/Answer';

jest.mock('./UserManager');
jest.mock('../models/Poll');

describe('VotingService', () => {
    beforeEach(() => {
        jest.resetAllMocks();

        UserManager.prototype.getUser = jest
            .fn()
            .mockResolvedValueOnce(createMockUser());
    });

    describe('createPoll', () => {
        test('Create new poll', async () => {
            const mockResponse: IPolling.PollData = {
                id: '1',
                name: 'name',
                type: 'type',
                publicId: 'publicId',
                privateId: 'privateId',
                questions: {
                    q1: {
                        title: '',
                        description: '',
                        type: 'question-type',
                        id: 'q1',
                        pollId: '1'
                    }
                },
                answers: {}
            };

            Poll.prototype.createInDatabaseFromRequest = jest
                .fn()
                .mockReturnValueOnce(Promise<void>);

            Poll.prototype.privateDataObj = jest
                .fn()
                .mockReturnValueOnce(mockResponse);

            const service = new VotingService(prismaMock);

            const poll = await service.createPoll({
                name: 'name',
                type: 'type',
                questions: [
                    {
                        title: 'question-title',
                        description: 'question-description',
                        type: 'question-type'
                    }
                ],
                owner: {
                    id: 'd1b44abe-b336-497d-8148-11166b7c2489',
                    ip: '',
                    cookie: '',
                    accountId: ''
                }
            });

            checkPoll(poll, true);
        });

        test('User not found', async () => {
            UserManager.prototype.getUser = jest
                .fn()
                .mockResolvedValueOnce(null);
            const service = new VotingService(prismaMock);

            try {
                await service.createPoll({
                    name: 'name',
                    type: 'type',
                    questions: [
                        {
                            title: 'question-title',
                            description: 'question-description',
                            type: 'question-type'
                        }
                    ],
                    owner: {
                        id: 'd1b44abe-b336-497d-8148-11166b7c2489',
                        ip: '',
                        cookie: '',
                        accountId: ''
                    }
                });

                fail('User found');
            } catch (e: unknown) {
                if (e instanceof Error) {
                    expect(e.message).toBe('User not found.');
                } else {
                    fail('Other kind of error');
                }
            }
        });
    });

    describe('answerPoll', () => {
        test('Answer a poll', async () => {
            Poll.prototype.loadedFromDatabase = jest
                .fn()
                .mockReturnValueOnce(true);

            Poll.prototype.answer = jest
                .fn()
                .mockImplementationOnce(async () => {
                    const mockAnswer = new Answer();
                    mockAnswer._questionId = 'q1';
                    mockAnswer._answerer = createMockUser();
                    mockAnswer._id = 'a1';
                    return mockAnswer;
                });

            const service = new VotingService(prismaMock);

            const answer = await service.answerPoll({
                publicId: '1',
                questionId: 'q1',
                answer: {
                    subQuestionId: 'o1',
                    answer: {
                        answer: true
                    }
                },
                answerer: {
                    ip: '1',
                    cookie: '2',
                    accountId: '3'
                }
            });

            expect(typeof answer).toBe('object');
            expect(answer?.id).toBe('a1');
            expect(answer?.questionId).toBe('q1');
            expect(answer?.answerer).toEqual({
                id: '1eb1cfae-09e7-4456-85cd-e2edfff80544'
            });
        });

        test('Poll does not exist', async () => {
            const service = new VotingService(prismaMock);

            try {
                await service.answerPoll({
                    publicId: '1',
                    questionId: 'q1',
                    answer: {
                        answer: true
                    },
                    answerer: {
                        ip: '1',
                        cookie: '2',
                        accountId: '3'
                    }
                });

                fail('Poll did exist');
            } catch (e: unknown) {
                if (e instanceof Error) {
                    expect(e.message).toBe(
                        'Poll with given public id not found.'
                    );
                } else {
                    fail('Other kind of error');
                }
            }
        });
    });

    describe('getPollWithPublicId', () => {
        test('Get poll with public id', async () => {
            Poll.prototype.existsInDatabase = jest
                .fn()
                .mockReturnValueOnce(true);

            Poll.prototype.publicDataObj = jest.fn().mockReturnValueOnce({
                id: '1',
                name: 'name',
                publicId: 'publicId',
                type: 'type',
                questions: {
                    q1: {
                        title: '',
                        description: '',
                        type: 'question-type',
                        id: 'q1',
                        pollId: '1'
                    }
                }
            });

            const service = new VotingService(prismaMock);
            const poll = await service.getPollWithPublicId('publicId');

            checkPoll(poll, false);
        });

        test('Poll does not exist', async () => {
            Poll.prototype.existsInDatabase = jest
                .fn()
                .mockReturnValueOnce(false);

            const service = new VotingService(prismaMock);
            const poll = await service.getPollWithPublicId('does-not-exist');

            expect(poll).toBe(null);
        });
    });

    const createMockUser = () => {
        const user = new User();
        user.setDatabase(prismaMock);
        user.setId('1eb1cfae-09e7-4456-85cd-e2edfff80544');
        user.setIp('');
        user.setCookie('');
        return user;
    };

    const checkPoll = (poll: PollData | null, isPrivate: boolean) => {
        expect(typeof poll === 'object').toBe(true);
        expect(poll?.id).toBe('1');
        expect(poll?.name).toBe('name');
        expect(poll?.publicId).toBe('publicId');

        if (isPrivate) {
            expect(poll?.privateId).toBe('privateId');
        }

        expect(poll?.type).toBe('type');
        expect(poll?.questions).toEqual({
            q1: {
                title: '',
                description: '',
                type: 'question-type',
                id: 'q1',
                pollId: '1'
            }
        });

        if (isPrivate) {
            expect(poll?.answers).toEqual({});
        }
    };
});