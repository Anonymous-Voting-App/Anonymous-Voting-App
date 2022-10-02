import MultiQuestionCollection from './MultiQuestionCollection';
import MultiQuestion from './MultiQuestion';
import { prismaMock } from '../utils/prisma_singleton';

describe('MultiQuestionCollection', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('loadFromDatabase', () => {
        test('Load multi question collection from database', async () => {
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

            const collection = new MultiQuestionCollection(prismaMock);

            collection.setPollId('p1');
            await collection.loadFromDatabase();

            expect(Object.keys(collection.questions())).toEqual(['q1', 'q2']);

            const questions = Object.values(collection.questions());

            expect(questions[0].id()).toBe('q1');
            expect(questions[1].id()).toBe('q2');
        });

        test('No questions in database', async () => {
            prismaMock.question.findMany.mockResolvedValue([]);

            const collection = new MultiQuestionCollection(prismaMock);

            collection.setPollId('find-nothing');

            await collection.loadFromDatabase();

            expect(collection.questions()).toEqual({});
        });
    });

    describe('createNewInDatabase', () => {
        test('Create new multi question collection in database', async () => {
            prismaMock.question.create.mockResolvedValue({
                id: 'q1',
                createdAt: new Date(),
                updatedAt: new Date(),
                pollId: 'p1',
                typeId: '7b76d1c6-8f40-4509-8317-ce444892b1ee'
            });

            prismaMock.option.create.mockResolvedValue({
                id: 's1',
                createdAt: new Date(),
                updatedAt: new Date(),
                option: 'sub-title',
                questionId: 'q1'
            });

            const collection = new MultiQuestionCollection(prismaMock);
            const question = new MultiQuestion(prismaMock);

            question.setFromRequest({
                title: 'title',
                description: 'description',
                type: 'test',
                subQuestions: [
                    {
                        title: 'sub-title',
                        description: 'sub-description',
                        type: 'test'
                    }
                ]
            });

            collection.add(question);
            collection.setPollId('p1');

            await collection.createNewInDatabase();

            expect(Object.keys(collection.questions())).toEqual(['q1']);
            expect(Object.keys(question.subQuestions())).toEqual(['s1']);
        });
    });
});
