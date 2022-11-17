import { prismaMock } from '../utils/prisma_singleton';
import Poll from './Poll';
import Question from './Question';
import User from './user/User';
import * as IPoll from './IPoll';
import QuestionFactory from './QuestionFactory';
import {
    Poll as PrismaPoll,
    Question as PrismaQuestion,
    Option as PrismaOption,
    Vote as PrismaVote
} from '@prisma/client';
import Fingerprint from './user/Fingerprint';

describe('Poll', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('answer', () => {
        test('Answer to a poll', async () => {
            prismaMock.vote.create.mockResolvedValue({
                id: '',
                createdAt: new Date(),
                questionId: 'question-id',
                parentId: null,
                value: 'answer',
                voterId: '1'
            });

            const poll = new Poll(prismaMock, new QuestionFactory(prismaMock));
            poll.setId('pollId');

            const question = new Question();

            question.answer = jest.fn();

            question.setDatabase(prismaMock);
            question.setId('question-id');
            question.setType('type');
            question.setDescription('description');
            question.setTitle('title');
            question.setPollId('pollId');

            poll.questions()[question.id()] = question;

            const user = makeAnswerer();

            await poll.answer(
                [
                    {
                        questionId: 'question-id',
                        data: {
                            answer: 'answer'
                        }
                    }
                ],
                user
            );

            expect(question.answer).toHaveBeenCalledTimes(1);
            expect(question.answer).toHaveBeenCalledWith(
                {
                    answer: 'answer'
                },
                user
            );
            expect(poll.answerCount()).toBe(1);
            expect(prismaMock.poll.update).toHaveBeenCalled();
        });
        test('Double answering is blocked', async () => {
            const poll = new Poll(prismaMock, new QuestionFactory(prismaMock));
            poll.setId('1');

            const question = new Question();
            question.setId('question-id');
            poll.questions()[question.id()] = question;

            const user = makeAnswerer();

            Fingerprint.prototype.loadFromDatabase = jest.fn();
            Fingerprint.prototype.wasFoundInDatabase = jest
                .fn()
                .mockResolvedValue(true);

            try {
                await poll.answer(
                    [
                        {
                            questionId: 'question-id',
                            data: {
                                answer: 'answer'
                            }
                        }
                    ],
                    user
                );

                expect(true).toBe(false);
            } catch (e) {
                if (e instanceof Error) {
                    expect(e.message).toBe(
                        'User does not have right to answer poll 1.'
                    );
                } else {
                    expect(true).toBe(false);
                }
            }
        });
    });

    describe('setAnswersFromDatabaseData', () => {
        test('Set answers with data from database', () => {
            const poll = new Poll(prismaMock, new QuestionFactory(prismaMock));

            poll.setAnswersFromDatabaseData([
                {
                    id: '1',
                    pollId: '1',
                    type: 'type',
                    typeName: 'free',
                    visualType: 'default',
                    title: 'title',
                    description: 'description',
                    parentId: null,
                    votes: [
                        {
                            id: '1',
                            questionId: '1',
                            value: 'value',
                            voterId: '1',
                            parentId: null,
                            voter: {
                                ip: '',
                                idCookie: '',
                                fingerprintJsId: '',
                                id: '1'
                            }
                        }
                    ]
                }
            ]);

            expect(Object.keys(poll.answers()).length).toBe(1);

            const answer = poll.answers()['1'];

            expect(answer.id()).toBe('1');
            expect(answer.questionId()).toBe('1');
            expect(answer.value()).toBe('value');
            expect(answer.answerer().id()).toBe('1');
        });
    });

    describe('setQuestionsFromDatabaseData', () => {
        test('Set questions with data from database', () => {
            const poll = new Poll(prismaMock, new QuestionFactory(prismaMock));

            poll.setId('1');
            poll.setAnswerCount(2);

            poll.setQuestionsFromDatabaseData([
                {
                    id: '1',
                    pollId: '1',
                    type: 'type',
                    typeName: 'free',
                    visualType: 'default',
                    title: 'title',
                    description: 'description',
                    parentId: null,
                    votes: []
                }
            ]);

            expect(Object.keys(poll.questions()).length).toBe(1);

            const question = poll.questions()['1'];

            expect(question.id()).toBe('1');
            expect(question.pollId()).toBe('1');
            expect(question.type()).toBe('free');
            expect(question.answerPercentage()).toBe(0);
        });
    });

    describe('setFromDatabaseData', () => {
        test('Set data from database data', () => {
            const poll = new Poll(prismaMock, new QuestionFactory(prismaMock));

            poll.setFromDatabaseData(dummyDatabaseData as IPoll.DatabaseData);

            expect(poll.id()).toBe('1');
            expect(poll.name()).toBe('name');
            expect(poll.publicId()).toBe('publicId');
            expect(poll.privateId()).toBe('privateId');

            const owner = poll.owner();

            expect(owner.id()).toBe('1');
            expect(Object.keys(poll.questions())).toEqual(['1']);
            expect(Object.keys(poll.answers())).toEqual(['1']);
        });
    });

    describe('loadFromDatabase', () => {
        test('Load poll from database', async () => {
            prismaMock.poll.findFirst.mockResolvedValue(dummyDatabaseData);

            const poll = new Poll(prismaMock, new QuestionFactory(prismaMock));

            poll.setId('1');
            poll.setDatabase(prismaMock);

            await poll.loadFromDatabase();

            expect(poll.loadedFromDatabase()).toBe(true);
            expect(poll.id()).toBe('1');
            expect(poll.name()).toBe('name');
            expect(poll.publicId()).toBe('publicId');
            expect(poll.privateId()).toBe('privateId');

            const owner = poll.owner();

            expect(owner.id()).toBe('1');
            expect(Object.keys(poll.questions())).toEqual(['1']);
            expect(Object.keys(poll.answers())).toEqual(['1']);
        });

        test('Poll not found in database', async () => {
            prismaMock.poll.findFirst.mockResolvedValue(null);

            const poll = new Poll(prismaMock, new QuestionFactory(prismaMock));

            poll.setId('1');
            poll.setDatabase(prismaMock);

            await poll.loadFromDatabase();

            expect(poll.loadedFromDatabase()).toBe(false);
        });
    });

    describe('existsInDatabase', () => {
        test('Check if poll exists from database', async () => {
            prismaMock.poll.findFirst.mockResolvedValue({
                id: '1',
                createdAt: new Date(),
                updatedAt: new Date(),
                name: 'name',
                creatorId: 'id',
                adminLink: 'link',
                pollLink: 'link',
                resultLink: 'link',
                isActive: true,
                answerCount: 0
            });

            const poll = new Poll(prismaMock, new QuestionFactory(prismaMock));

            poll.setId('1');
            poll.setDatabase(prismaMock);

            expect(await poll.existsInDatabase()).toBe(true);
        });

        test('Poll not found in database', async () => {
            prismaMock.poll.findFirst.mockResolvedValue(null);

            const poll = new Poll(prismaMock, new QuestionFactory(prismaMock));

            poll.setId('1');
            poll.setDatabase(prismaMock);

            expect(await poll.existsInDatabase()).toBe(false);
        });
    });

    describe('newDatabaseObject', () => {
        test('Create new database object for poll', () => {
            const poll = new Poll(prismaMock, new QuestionFactory(prismaMock));

            poll.setFromDatabaseData(dummyDatabaseData as IPoll.DatabaseData);
            poll.owner().setId('d1b44abe-b336-497d-8148-11166b7c2489');

            const data = poll.newDatabaseObject();

            expect(data).toEqual({
                name: 'name',
                creatorId: 'd1b44abe-b336-497d-8148-11166b7c2489',
                adminLink: 'privateId',
                pollLink: 'publicId',
                resultLink: ''
            });
        });
    });

    describe('resultDataObj', () => {
        test('Create new result object for poll', () => {
            const poll = new Poll(prismaMock, new QuestionFactory(prismaMock));

            poll.setFromDatabaseData(dummyDatabaseData as IPoll.DatabaseData);
            poll.owner().setId('d1b44abe-b336-497d-8148-11166b7c2489');
            poll.questions()['1'].setAnswerCount(2);
            poll.questions()['1'].setAnswerPercentage(0.2);

            const data = poll.resultDataObj();

            expect(data).toEqual({
                name: 'name',
                publicId: 'publicId',
                type: '',
                answerCount: 0,
                questions: [
                    {
                        title: '',
                        description: '',
                        type: 'free',
                        visualType: 'default',
                        id: '1',
                        pollId: '1',
                        answerCount: 2,
                        answerPercentage: 0.2,
                        answerValueStatistics: [
                            {
                                count: 1,
                                percentage: 0.5,
                                value: 'value'
                            }
                        ]
                    }
                ]
            });
        });
    });

    const dummyDatabaseData: PrismaPoll & {
        questions: (PrismaQuestion & {
            options: PrismaOption[];
            votes: PrismaVote[];
        })[];
    } = {
        createdAt: new Date(),
        updatedAt: new Date(),
        id: '1',
        name: 'name',
        pollLink: 'publicId',
        adminLink: 'privateId',
        resultLink: 'publicId',
        isActive: true,
        creatorId: '1',
        answerCount: 0,
        questions: [
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                maxValue: null,
                minValue: null,
                parentId: null,
                step: null,
                typeName: 'free',
                visualType: 'default',
                description: '',
                title: '',
                id: '1',
                pollId: '1',
                votes: [
                    {
                        createdAt: new Date(),
                        id: '1',
                        questionId: '1',
                        value: 'value',
                        parentId: '1',
                        voterId: '1'
                    }
                ],
                options: []
            }
        ]
    };

    const makeAnswerer = () => {
        const answerer = new Fingerprint(prismaMock);

        answerer.setId('1');

        return answerer;
    };
});
