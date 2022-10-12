import { prismaMock } from '../utils/prisma_singleton';
import Poll from './Poll';
import Question from './Question';
import User from './User';
import * as IPoll from './IPoll';

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
                value: 'answer',
                voterId: '1'
            });

            const poll = new Poll(prismaMock);
            poll.setId('pollId');

            const question = new Question();
            question.setDatabase(prismaMock);
            question.setId('question-id');
            question.setType('type');
            question.setDescription('description');
            question.setTitle('title');
            question.setPollId('pollId');

            poll.questions()[question.id()] = question;

            const user = makeAnswerer();

            const answer = await poll.answer(
                'question-id',
                {
                    answer: 'answer'
                },
                user
            );

            expect(answer?.createdInDatabase()).toBe(true);
            expect(answer?.questionId()).toBe('question-id');
            expect(answer?.answerer().id()).toBe('1');
        });
    });

    describe('setAnswersFromDatabaseData', () => {
        test('Set answers with data from database', () => {
            const poll = new Poll(prismaMock);

            poll.setAnswersFromDatabaseData([
                {
                    id: '1',
                    pollId: '1',
                    type: 'type',
                    title: 'title',
                    description: 'description',
                    votes: [
                        {
                            id: '1',
                            questionId: '1',
                            value: 'value',
                            voterId: '1',
                            voter: {
                                ip: '',
                                cookie: '',
                                accountId: '',
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
            const poll = new Poll(prismaMock);

            poll.setId('1');

            poll.setQuestionsFromDatabaseData([
                {
                    id: '1',
                    pollId: '1',
                    type: 'type',
                    title: 'title',
                    description: 'description',
                    votes: []
                }
            ]);

            expect(Object.keys(poll.questions()).length).toBe(1);

            const question = poll.questions()['1'];

            expect(question.id()).toBe('1');
            expect(question.pollId()).toBe('1');
            expect(question.type()).toBe('type');
        });
    });

    describe('setFromDatabaseData', () => {
        test('Set data from database data', () => {
            const poll = new Poll(prismaMock);

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
            // This should be changed, just set it as any in hurry - Joonas Hiltunen 02.10.2022
            prismaMock.poll.findFirst.mockResolvedValue(
                dummyDatabaseData as any
            );

            const poll = new Poll(prismaMock);

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

            const poll = new Poll(prismaMock);

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
                isActive: true
            });

            const poll = new Poll(prismaMock);

            poll.setId('1');
            poll.setDatabase(prismaMock);

            expect(await poll.existsInDatabase()).toBe(true);
        });

        test('Poll not found in database', async () => {
            prismaMock.poll.findFirst.mockResolvedValue(null);

            const poll = new Poll(prismaMock);

            poll.setId('1');
            poll.setDatabase(prismaMock);

            expect(await poll.existsInDatabase()).toBe(false);
        });
    });

    describe('newDatabaseObject', () => {
        test('Create new database object for poll', () => {
            const poll = new Poll(prismaMock);

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

    const dummyDatabaseData = {
        id: '1',
        name: 'name',
        type: 'type',
        pollLink: 'publicId',
        adminLink: 'privateId',
        creator: {
            ip: 'ip',
            cookie: 'cookie',
            accountId: 'accountId',
            id: '1'
        },
        questions: [
            {
                id: '1',
                pollId: '1',
                type: 'type',
                title: 'title',
                description: 'description',
                votes: [
                    {
                        id: '1',
                        questionId: '1',
                        value: 'value',
                        voter: {
                            ip: '',
                            cookie: '',
                            accountId: '',
                            id: '1'
                        }
                    }
                ]
            }
        ]
    };

    const makeAnswerer = () => {
        const answerer = new User();

        answerer.setId('1');
        answerer.setIp('test-ip');
        answerer.setAccountId('test-account-id');
        answerer.setCookie('test-cookie');
        answerer.setDatabase(prismaMock);

        return answerer;
    };
});
