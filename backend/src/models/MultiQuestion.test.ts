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
                    subQuestionId: 'sub-id',
                    answer: {
                        answer: 'sub-answer'
                    }
                })
            ).toBe(true);

            expect(
                question.answerDataIsAcceptable({
                    subQuestionId: 'does-not-exist',
                    answer: {
                        answer: 'sub-answer'
                    }
                })
            ).toBe(false);
        });
    });

    describe('answer', () => {
        test.todo('Successfully answer multi question');

        test.skip('Successfully answer multi question', async () => {
            const user = makeAnswerer();

            // The test is not actually testing anything at the moment
            // since it manually sets the functions to return the expected values.
            // - Joonas Halinen 2022.10.13
            Answer.prototype.value = jest.fn().mockReturnValue('true');
            Answer.prototype.questionId = jest.fn().mockReturnValue('q1');
            Answer.prototype.answerer = jest.fn().mockReturnValue(user);
            Answer.prototype.createdInDatabase = jest
                .fn()
                .mockReturnValue(true);

            const question = new MultiQuestion();
            const subQuestion = new Question();

            question.setId('q1');
            subQuestion.setId('sub-id');
            question.subQuestions()[subQuestion.id()] = subQuestion;
            question.setDatabase(prismaMock);

            const answer = await question.answer(
                {
                    subQuestionId: 'sub-id',
                    answer: {
                        answer: true
                    }
                },
                user
            );

            expect(answer instanceof Answer).toBe(true);
            expect(answer?.value()).toBe('true');
            expect(answer?.questionId()).toBe('q1');
            expect(answer?.answerer()).toBe(user);
            expect(answer?.createdInDatabase()).toBe(true);
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
                        subQuestionId: 'does-not-exist',
                        answer: {
                            answer: true
                        }
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

            question.setFromDatabaseData({
                id: 'id',
                title: 'title',
                description: 'description',
                pollId: 'pollId',
                type: 'type',
                votes: [],
                options: [
                    {
                        id: 'sub-id',
                        questionId: 'id',
                        option: 'option'
                    }
                ]
            });

            expect(question.id()).toBe('id');
            expect(question.pollId()).toBe('pollId');
            expect(question.type()).toBe('type');
            expect(Object.keys(question.subQuestions())).toEqual(['sub-id']);

            const subQuestion = question.subQuestions()['sub-id'];

            expect(subQuestion.id()).toBe('sub-id');
            expect(subQuestion.title()).toBe('option');
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
                pollId: 'pollId'
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
