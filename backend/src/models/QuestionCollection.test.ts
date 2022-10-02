import { prismaMock } from '../utils/prisma_singleton';
import QuestionCollection from './QuestionCollection';

describe('QuestionCollection', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('loadFromDatabase', () => {
        test('Load questions from database', async () => {
            prismaMock.question.findMany.mockResolvedValue([
                {
                    id: 'q1',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    pollId: 'p1',
                    typeId: '7b76d1c6-8f40-4509-8317-ce444892b1ee'
                },
                {
                    id: 'q2',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    pollId: 'p1',
                    typeId: '7b76d1c6-8f40-4509-8317-ce444892b1ee'
                }
            ]);

            const questions = new QuestionCollection(prismaMock);

            questions.setPollId('p1');

            await questions.loadFromDatabase();

            expect(Object.keys(questions.questions())).toEqual(['q1', 'q2']);

            let question = questions.questions()['q1'];

            expect(question.id()).toBe('q1');
            expect(question.pollId()).toBe('p1');

            question = questions.questions()['q2'];

            expect(question.id()).toBe('q2');
            expect(question.pollId()).toBe('p1');
        });
    });
});
