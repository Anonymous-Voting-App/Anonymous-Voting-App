import { PollData } from '../models/IPolling';
import User from '../models/user/User';
import Fingerprint from '../models/user/Fingerprint';
import UserManager from './UserManager';
import Poll from '../models/Poll';
import * as IPolling from '../models/IPolling';
import { prismaMock } from '../utils/prisma_singleton';
import VotingService from './VotingService';
import Answer from '../models/Answer';
import QuestionFactory from '../models/QuestionFactory';
import BadRequestError from '../utils/badRequestError';
import DatabasedObjectCollection from '../models/database/DatabasedObjectCollection';

jest.mock('./UserManager');
jest.mock('../models/Poll');
jest.mock('../models/database/DatabasedObjectCollection');

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
                visualFlags: ['test'],
                questions: [
                    {
                        title: '',
                        description: '',
                        type: 'question-type',
                        visualType: 'default',
                        id: 'q1',
                        pollId: '1'
                    }
                ],
                answers: []
            };

            Poll.prototype.createInDatabaseFromRequest = jest
                .fn()
                .mockReturnValueOnce(Promise<void>);

            Poll.prototype.privateDataObj = jest
                .fn()
                .mockReturnValueOnce(mockResponse);

            const service = new VotingService(
                prismaMock,
                new QuestionFactory(prismaMock)
            );

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
            const service = new VotingService(
                prismaMock,
                new QuestionFactory(prismaMock)
            );

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

                expect(true).toBeFalsy();
            } catch (e: unknown) {
                if (e instanceof BadRequestError) {
                    expect(e.message).toBe('User not found.');
                } else {
                    expect(true).toBeFalsy();
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

            const service = new VotingService(
                prismaMock,
                new QuestionFactory(prismaMock)
            );

            const answersData = [
                {
                    questionId: 'q1',
                    data: {
                        answer: {
                            subQuestionId: 'o1',
                            answer: {
                                answer: true
                            }
                        }
                    }
                }
            ];

            await service.answerPoll(
                {
                    publicId: '1',
                    answers: answersData
                },
                createMockUser()
            );

            expect(Poll.prototype.answer).toHaveBeenCalledTimes(1);
            expect(Poll.prototype.answer).toHaveBeenCalledWith(
                answersData,
                createMockUser()
            );
        });

        test('Poll does not exist', async () => {
            const service = new VotingService(
                prismaMock,
                new QuestionFactory(prismaMock)
            );

            try {
                await service.answerPoll(
                    {
                        publicId: '1',
                        answers: [
                            {
                                questionId: 'q1',
                                data: {
                                    answer: true
                                }
                            }
                        ]
                    },
                    createMockUser()
                );
            } catch (e: unknown) {
                expect(e instanceof Error).toBe(true);
                expect((e as Error).message).toBe(
                    'Poll with publicId 1 could not be found.'
                );
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
                visualFlags: ['test'],
                questions: [
                    {
                        title: '',
                        description: '',
                        type: 'question-type',
                        visualType: 'default',
                        id: 'q1',
                        pollId: '1'
                    }
                ]
            });

            const service = new VotingService(
                prismaMock,
                new QuestionFactory(prismaMock)
            );
            const poll = await service.getPollWithPublicId('publicId');

            checkPoll(poll, false);
        });

        test('Poll does not exist', async () => {
            Poll.prototype.existsInDatabase = jest
                .fn()
                .mockReturnValueOnce(false);

            const service = new VotingService(
                prismaMock,
                new QuestionFactory(prismaMock)
            );
            const poll = await service.getPollWithPublicId('does-not-exist');

            expect(poll).toBe(null);
        });
    });

    describe('getPollAnswers', () => {
        test('getPollAnswers for existing poll', async () => {
            const mockAnswerDataObjs = [
                {
                    id: 'id',
                    questionId: 'question-id',
                    value: 'true',
                    answerer: { id: 'answerer-id' }
                }
            ];

            Poll.prototype.existsInDatabase = jest
                .fn()
                .mockReturnValueOnce(true);
            Poll.prototype.setPublicId = jest.fn();
            Poll.prototype.loadFromDatabase = jest.fn();
            Poll.prototype.answersDataObjs = jest
                .fn()
                .mockReturnValueOnce(mockAnswerDataObjs);

            const service = new VotingService(
                prismaMock,
                new QuestionFactory(prismaMock)
            );

            const answers = await service.getPollAnswers('test-id');

            expect(answers).toEqual({ answers: mockAnswerDataObjs });
            expect(Poll.prototype.setPublicId).toHaveBeenCalledWith('test-id');
        });
    });

    describe('getPollResults', () => {
        test('getPollResults for existing poll', async () => {
            const mockResultObj = { test: '1' };

            Poll.prototype.existsInDatabase = jest
                .fn()
                .mockReturnValueOnce(true);
            Poll.prototype.setPublicId = jest.fn();
            Poll.prototype.loadFromDatabase = jest.fn();
            Poll.prototype.resultDataObj = jest
                .fn()
                .mockReturnValueOnce(mockResultObj);

            const service = new VotingService(
                prismaMock,
                new QuestionFactory(prismaMock)
            );

            const results = await service.getPollResults('test-id');

            expect(results).toEqual(mockResultObj);
            expect(Poll.prototype.loadFromDatabase).toHaveBeenCalled();
            expect(Poll.prototype.setPublicId).toHaveBeenCalledWith('test-id');
        });
    });

    describe('editPoll', () => {
        test('existing poll is edited', async () => {
            Poll.prototype.updateFromEditRequest = jest.fn();
            Poll.prototype.loadedFromDatabase = jest
                .fn()
                .mockReturnValueOnce(true);
            Poll.prototype.loadFromDatabase = jest.fn();

            const editData = {
                name: 'test',
                privateId: 'p1'
            };

            const service = new VotingService(
                prismaMock,
                new QuestionFactory(prismaMock)
            );

            await service.editPoll(editData);

            expect(Poll.prototype.updateFromEditRequest).toHaveBeenCalled();
        });

        test('non-existing poll is not edited', async () => {
            Poll.prototype.updateFromEditRequest = jest.fn();
            Poll.prototype.loadedFromDatabase = jest
                .fn()
                .mockReturnValueOnce(false);
            Poll.prototype.loadFromDatabase = jest.fn();

            const editData = {
                name: 'test',
                privateId: 'p1'
            };

            const service = new VotingService(
                prismaMock,
                new QuestionFactory(prismaMock)
            );

            await service.editPoll(editData);

            expect(Poll.prototype.updateFromEditRequest).not.toHaveBeenCalled();
        });
    });

    describe('searchPolls', () => {
        test('sends correct query & returns gathered privateDataObjs', async () => {
            DatabasedObjectCollection.prototype.loadFromDatabase = jest.fn();
            DatabasedObjectCollection.prototype.gather = jest
                .fn()
                .mockResolvedValue({ '1': 'a', '2': 'b' });

            const service = new VotingService(
                prismaMock,
                new QuestionFactory(prismaMock)
            );

            const polls = await service.searchPollsByName('test');

            expect(
                DatabasedObjectCollection.prototype.gather
            ).toHaveBeenCalledWith('privateDataObj');
            expect(polls).toEqual({ data: ['a', 'b'] });
        });
    });

    const createMockUser = () => {
        const user = new Fingerprint(prismaMock);
        user.setId('1eb1cfae-09e7-4456-85cd-e2edfff80544');
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
        expect(poll?.questions).toEqual([
            {
                title: '',
                description: '',
                type: 'question-type',
                visualType: 'default',
                id: 'q1',
                pollId: '1'
            }
        ]);

        expect(poll?.visualFlags).toEqual(['test']);

        if (isPrivate) {
            expect(poll?.answers).toEqual([]);
        }
    };
});
