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
    Vote as PrismaVote,
    User as PrismaUser
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
                voterId: '1',
                pollId: 'p1'
            });
            prismaMock.fingerprint.create.mockResolvedValue({
                id: '',
                createdAt: new Date(),
                updatedAt: new Date(),
                ip: 'ip',
                idCookie: 'idCookie',
                fingerprintJsId: 'fingerprintJsId'
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

            poll.hasBeenAnsweredBy = async () => {
                return false;
            };

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
        // Disabled since we don't do any double-vote blocking
        // on the backend for now.
        // - Joonas Halinen 21.11.2022
        test.skip('Double answering is blocked', async () => {
            const poll = new Poll(prismaMock, new QuestionFactory(prismaMock));
            poll.setId('1');
            poll.setPublicId('p1');

            const question = new Question();
            question.setId('question-id');
            poll.questions()[question.id()] = question;

            const user = makeAnswerer();

            Fingerprint.prototype.loadFromDatabase = jest
                .fn()
                .mockResolvedValueOnce(null);
            Fingerprint.prototype.wasFoundInDatabase = jest
                .fn()
                .mockReturnValueOnce(true);
            prismaMock.vote.count.mockResolvedValueOnce(1);

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
                console.log(e);
                if (e instanceof Error) {
                    expect(e.message).toBe(
                        'User does not have right to answer poll p1.'
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
                            pollId: 'p1',
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

            poll.setFromDatabaseData(
                dummyDatabaseData as unknown as IPoll.DatabaseData
            );

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
                answerCount: 0,
                visualFlags: []
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

            poll.setFromDatabaseData(
                dummyDatabaseData as unknown as IPoll.DatabaseData
            );
            poll.owner().setId('d1b44abe-b336-497d-8148-11166b7c2489');
            poll.setVisualFlags(['test']);

            const data = poll.newDatabaseObject();

            expect(data).toEqual({
                name: 'name',
                creatorId: 'd1b44abe-b336-497d-8148-11166b7c2489',
                adminLink: 'privateId',
                pollLink: 'publicId',
                resultLink: '',
                visualFlags: ['test']
            });
        });
    });

    describe('resultDataObj', () => {
        test('Create new result object for poll', () => {
            const poll = new Poll(prismaMock, new QuestionFactory(prismaMock));

            poll.setFromDatabaseData(
                dummyDatabaseData as unknown as IPoll.DatabaseData
            );
            poll.owner().setId('d1b44abe-b336-497d-8148-11166b7c2489');
            poll.questions()['1'].setAnswerCount(2);
            poll.questions()['1'].setAnswerPercentage(0.2);
            poll.setVisualFlags(['test']);

            const data = poll.resultDataObj();

            expect(data).toEqual({
                name: 'name',
                publicId: 'publicId',
                type: '',
                answerCount: 0,
                visualFlags: ['test'],
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

    describe('setFromEditRequest', () => {
        test('edit all possible values', () => {
            const req = {
                name: 'test',
                privateId: 'p1',
                visualFlags: ['test1', 'test2'],
                owner: 'o1'
            };

            const poll = new Poll(prismaMock, new QuestionFactory(prismaMock));

            poll.setFromEditRequest(req);

            expect(poll.name()).toEqual('test');
            expect(poll.privateId()).toEqual('p1');
            expect(poll.visualFlags()).toEqual(['test1', 'test2']);
            expect(poll.owner().id()).toEqual('o1');
        });
    });

    describe('updateInDatabase', () => {
        test('sends expected update to database with normal data', async () => {
            const poll = new Poll(prismaMock, new QuestionFactory(prismaMock));

            poll.setId('1');

            const newDbObj = {
                name: 'test',
                adminLink: 'adminLink',
                publicLink: 'publicLink',
                pollLink: 'pollLink',
                resultLink: 'resultLink',
                creatorId: 'creatorId',
                visualFlags: ['test']
            };

            poll.newDatabaseObject = () => newDbObj;

            await poll.updateInDatabase();

            expect(prismaMock.poll.update).toHaveBeenCalledWith({
                where: { id: '1' },
                data: newDbObj
            });
        });
    });

    const dummyDatabaseData: PrismaPoll & {
        questions: (PrismaQuestion & {
            options: PrismaOption[];
            votes: PrismaVote[];
        })[];
    } & { creator: PrismaUser } = {
        createdAt: new Date(),
        updatedAt: new Date(),
        id: '1',
        name: 'name',
        pollLink: 'publicId',
        adminLink: 'privateId',
        resultLink: 'publicId',
        isActive: true,
        creatorId: '1',
        creator: {
            id: '1',
            firstname: 'first',
            lastname: 'last',
            email: 'email',
            username: 'user',
            password: 'pass',
            isAdmin: true
        } as PrismaUser,
        answerCount: 0,
        visualFlags: [],
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
                        voterId: '1',
                        pollId: 'p1'
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
