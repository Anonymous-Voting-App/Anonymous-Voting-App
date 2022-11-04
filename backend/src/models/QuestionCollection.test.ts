import { prismaMock } from '../utils/prisma_singleton';
import QuestionCollection from './QuestionCollection';
import QuestionFactory from './QuestionFactory';

describe('QuestionCollection', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('loadFromDatabase', () => {
        // Test is broken due to changing
        // QuestionCollection.loadFromDatabase()
        // to no longer fetch questions from database using pollId.
        // - Joonas Halinen 17.10.2022
        test.skip('Load questions from database', async () => {
            prismaMock.question.findFirst.mockResolvedValueOnce({
                id: 'q1',
                createdAt: new Date(),
                updatedAt: new Date(),
                pollId: 'p1',
                typeName: 'free',
                visualType: 'default',
                parentId: 'parent1',
                minValue: -1,
                maxValue: -1,
                step: -1,
                title: 'title',
                description: 'description'
            });

            prismaMock.question.findFirst.mockResolvedValueOnce({
                id: 'q2',
                createdAt: new Date(),
                updatedAt: new Date(),
                pollId: 'p1',
                typeName: 'free',
                visualType: 'default',
                parentId: 'parent1',
                minValue: -1,
                maxValue: -1,
                step: -1,
                title: 'title',
                description: 'description'
            });

            const questions = new QuestionCollection(
                prismaMock,
                {},
                new QuestionFactory(prismaMock)
            );

            questions.setPollId('p1');

            await questions.loadFromDatabase();

            expect(Object.keys(questions.questions())).toEqual(['q1', 'q2']);

            let question = questions.questions()['q1'];

            expect(question.id()).toBe('q1');
            expect(question.pollId()).toBe('p1');
            expect(question.title()).toBe('title');
            expect(question.description()).toBe('description');

            question = questions.questions()['q2'];

            expect(question.id()).toBe('q2');
            expect(question.pollId()).toBe('p1');
            expect(question.title()).toBe('title');
            expect(question.description()).toBe('description');
        });
    });
});
