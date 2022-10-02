import Question from './Question';
import User from './User';
import Answer from './Answer';
import { prismaMock } from '../utils/prisma_singleton';

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

            const answer = await question.answer(
                {
                    type: 'test-type',
                    answer: 'test-value'
                },
                answerer
            );

            expect(answer instanceof Answer).toBe(true);
            expect(answer?.questionId()).toBe('test-question-id');
            expect(answer?.value()).toBe('test-value');
            expect(answer?.answerer().id()).toBe('1');
            expect(answer?.createdInDatabase()).toBe(true);
        });
    });

    describe('setFromDatabaseData', () => {
        test('Set answer from database', () => {
            const question = new Question();

            question.setFromDatabaseData({
                id: 'test-id',
                title: 'test-title',
                description: 'test-description',
                pollId: 'test-pollId',
                type: 'test-type',
                votes: []
            });

            expect(question.id()).toBe('test-id');
            expect(question.pollId()).toBe('test-pollId');
        });
    });

    describe('newDatabaseObject', () => {
        test('Create a new database object for answer', () => {
            const question = new Question();

            question.setTitle('test-title');
            question.setDescription('test-description');
            question.setType('test-type');
            question.setPollId('test-poll-id');

            expect(question.newDatabaseObject().pollId).toBe('test-poll-id');
            expect(
                typeof question.newDatabaseObject().typeId === 'string'
            ).toBe(true);
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
