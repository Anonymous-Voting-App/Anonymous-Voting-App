import MultiQuestion from './MultiQuestion';
import Question from './Question';
import Answer from './Answer';
import User from './User';
import { prismaMock } from '../utils/prisma_singleton';

jest.mock('./Answer');

describe('MultiQuestion', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('answerDataIsAcceptable', () => {
        test('Answer data correct', () => {
            const question = new MultiQuestion();
            const subQuestion = new Question();

            subQuestion.setId('sub-id');
            question.subQuestions()[subQuestion.id()] = subQuestion;

            expect(
                question.answerDataIsAcceptable({
                    subQuestionIds: ['sub-id'],
                    answer: [
                        {
                            answer: 'sub-answer'
                        }
                    ]
                })
            ).toBe(true);

            expect(
                question.answerDataIsAcceptable({
                    subQuestionIds: ['does-not-exist'],
                    answer: [
                        {
                            answer: 'sub-answer'
                        }
                    ]
                })
            ).toBe(false);
        });
    });

    describe('answer', () => {
        test('Successfully answer multi question', async () => {
            const calls: Array<string> = [];

            Answer.prototype.createNewInDatabase = jest.fn(async () => {
                calls.push('createNewInDatabase');
            });
            Answer.prototype.setDatabase = jest.fn(async () => {
                calls.push('setDatabase');
            });
            Answer.prototype.setQuestionId = jest.fn(async () => {
                calls.push('setQuestionId');
            });
            Answer.prototype.setValue = jest.fn(async () => {
                calls.push('setValue');
            });
            Answer.prototype.setAnswerer = jest.fn(async () => {
                calls.push('setAnswerer');
            });

            const user = makeAnswerer();

            const question = new MultiQuestion();
            const subQuestion = new Question();

            question.setId('q1');
            subQuestion.setId('sub-id');
            question.subQuestions()[subQuestion.id()] = subQuestion;
            question.setDatabase(prismaMock);

            const requestObj = {
                subQuestionIds: ['sub-id'],
                answer: [
                    {
                        answer: 'test-value'
                    }
                ]
            };

            await question.answer(requestObj, user);

            expect(Answer.prototype.setFromRequest).toHaveBeenNthCalledWith(
                1,
                requestObj,
                user,
                'q1'
            );

            expect(Answer.prototype.setFromRequest).toHaveBeenNthCalledWith(
                2,
                requestObj.answer[0],
                user,
                'sub-id'
            );

            expect(Answer.prototype.createNewInDatabase).toHaveBeenCalledTimes(
                2
            );
            expect(calls[calls.length - 1]).toBe('createNewInDatabase');
        });

        test('Question not found', async () => {
            const question = new MultiQuestion();
            const subQuestion = new Question();

            subQuestion.setId('sub-id');

            question.subQuestions()[subQuestion.id()] = subQuestion;
            question.setDatabase(prismaMock);

            const user = makeAnswerer();

            try {
                await question.answer(
                    {
                        subQuestionIds: ['does-not-exist'],
                        answer: [
                            {
                                answer: true
                            }
                        ]
                    },
                    user
                );
            } catch (e) {
                if (e instanceof Error) {
                    expect(e.message).toBe('sub-question with given id exists');
                }
            }
        });
    });

    describe('setFromDatabaseData', () => {
        test('Set multi question from database data', () => {
            const question = new MultiQuestion();

            Question.prototype.answerCount = jest.fn(() => 2);
            Question.prototype.setAnswerCount = jest.fn();
            Question.prototype.setAnswerPercentage = jest.fn();

            question.setFromDatabaseData({
                id: 'id',
                title: 'title',
                description: 'description',
                pollId: 'pollId',
                parentId: null,
                type: 'type',
                typeName: 'multi',
                visualType: 'default',
                minValue: 1,
                maxValue: 1,
                votes: [],
                subQuestions: [
                    {
                        id: 'sub-id',
                        title: 'title',
                        description: 'description',
                        pollId: 'pollId',
                        parentId: 'id',
                        type: 'type',
                        visualType: 'default',
                        typeName: 'free',
                        votes: []
                    }
                ]
            });

            expect(question.id()).toBe('id');
            expect(question.pollId()).toBe('pollId');
            expect(question.type()).toBe('multi');
            expect(question.minAnswers()).toBe(1);
            expect(question.maxAnswers()).toBe(1);
            expect(Object.keys(question.subQuestions())).toEqual(['sub-id']);

            const subQuestion = question.subQuestions()['sub-id'];

            expect(subQuestion.id()).toBe('sub-id');
            expect(subQuestion.title()).toBe('title');
            expect(subQuestion.type()).toBe('free');

            expect(Question.prototype.setAnswerCount).toHaveBeenNthCalledWith(
                1,
                2
            );
            expect(Question.prototype.setAnswerCount).toHaveBeenNthCalledWith(
                2,
                2
            );
            expect(
                Question.prototype.setAnswerPercentage
            ).toHaveBeenNthCalledWith(1, 1);
            expect(Question.prototype.setAnswerCount).toHaveBeenCalledTimes(2);
            expect(
                Question.prototype.setAnswerPercentage
            ).toHaveBeenCalledTimes(1);
        });
    });

    describe('newDatabaseObject', () => {
        test('Create new multi question database object', () => {
            const question = new MultiQuestion();

            question.setId('id');
            question.setType('type');
            question.setDescription('description');
            question.setTitle('title');
            question.setPollId('pollId');

            const subQuestion = new Question();

            subQuestion.setId('sub-id');
            subQuestion.setType('sub-type');
            subQuestion.setDescription('sub-description');
            subQuestion.setTitle('sub-title');
            subQuestion.setPollId('sub-pollId');
            question.subQuestions()[subQuestion.id()] = subQuestion;

            expect(question.newDatabaseObject()).toEqual({
                typeId: '7b76d1c6-8f40-4509-8317-ce444892b1ee',
                pollId: 'pollId',
                maxValue: 1,
                minValue: 1,
                parentId: undefined,
                typeName: 'type',
                title: 'title',
                description: 'description'
            });
        });
    });

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
