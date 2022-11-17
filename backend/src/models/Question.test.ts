import Question from './Question';
import User from './user/User';
import { prismaMock } from '../utils/prisma_singleton';
import Answer from './Answer';
import Fingerprint from './user/Fingerprint';

describe('Question', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('answerDataIsAcceptable', () => {
        test('Answer data should be acceptable', () => {
            const question = new Question();

            question.setType('test-type');

            const acceptable = question.answerDataIsAcceptable({
                answer: 'test-value'
            });

            expect(acceptable).toBe(true);
        });
    });

    describe('answer', () => {
        test('Create an answer to a question', async () => {
            prismaMock.vote.create.mockResolvedValue({
                id: 'a1',
                createdAt: new Date(),
                questionId: 'test-question-id',
                parentId: null,
                voterId: '1',
                value: 'test-value'
            });

            const question = new Question();

            question.setId('test-question-id');
            question.setTitle('test-title');
            question.setDescription('test-description');
            question.setType('test-type');
            question.setPollId('test-poll-id');
            question.setDatabase(prismaMock);

            const answerer = makeAnswerer();

            await question.answer(
                {
                    answer: 'test-value'
                },
                answerer
            );

            expect(prismaMock.vote.create).toBeCalledWith({
                data: {
                    questionId: 'test-question-id',
                    value: 'test-value',
                    voterId: '1',
                    parentId: null
                }
            });
        });
    });

    describe('setFromDatabaseData', () => {
        test('Set question from database data', () => {
            const question = new Question();

            question.setFromDatabaseData({
                id: 'test-id',
                title: 'test-title',
                description: 'test-description',
                pollId: 'test-pollId',
                parentId: null,
                type: 'test-type',
                typeName: 'free',
                visualType: 'default',
                votes: [
                    {
                        id: 'v1',
                        parentId: '',
                        questionId: 'test-id',
                        value: 'test',
                        voterId: 'voter1'
                    }
                ]
            });

            expect(question.id()).toBe('test-id');
            expect(question.type()).toBe('free');
            expect(question.pollId()).toBe('test-pollId');
            expect(question.answerCount()).toBe(1);
        });
    });

    describe('newDatabaseObject', () => {
        test('Create a new database object for question', () => {
            const question = new Question();

            question.setTitle('test-title');
            question.setDescription('test-description');
            question.setType('test-type');
            question.setPollId('test-poll-id');

            expect(question.newDatabaseObject().pollId).toBe('test-poll-id');
        });
    });

    describe('resultDataObj', () => {
        test('Create a new result object for question', () => {
            const question = new Question();

            question.setId('test-id');
            question.setTitle('test-title');
            question.setDescription('test-description');
            question.setType('test-type');
            question.setPollId('test-poll-id');
            question.setAnswerCount(3);

            question.answers()['1'] = new Answer();
            question.answers()['1'].setValue('test1');
            question.answers()['2'] = new Answer();
            question.answers()['2'].setValue('test1');
            question.answers()['3'] = new Answer();
            question.answers()['3'].setValue('test2');

            expect(question.resultDataObj()).toEqual({
                id: 'test-id',
                title: 'test-title',
                description: 'test-description',
                type: 'test-type',
                pollId: 'test-poll-id',
                answerCount: 3,
                answerPercentage: 1,
                answerValueStatistics: [
                    {
                        value: 'test1',
                        count: 2,
                        percentage: 2 / 3
                    },

                    {
                        value: 'test2',
                        count: 1,
                        percentage: 1 / 3
                    }
                ]
            });
        });
    });

    const makeAnswerer = () => {
        const answerer = new Fingerprint(prismaMock);

        answerer.setId('1');

        return answerer;
    };
});
