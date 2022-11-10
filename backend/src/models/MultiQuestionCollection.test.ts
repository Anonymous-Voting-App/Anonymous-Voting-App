import MultiQuestionCollection from './MultiQuestionCollection';
import MultiQuestion from './MultiQuestion';
import { prismaMock } from '../utils/prisma_singleton';
import QuestionFactory from './QuestionFactory';

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
                    typeName: 'free',
                    visualType: 'default',
                    parentId: 'parent1',
                    minValue: -1,
                    maxValue: -1,
                    step: -1,
                    title: 'title',
                    description: 'description'
                },
                {
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
                }
            ]);

            const collection = new MultiQuestionCollection(
                prismaMock,
                {},
                new QuestionFactory(prismaMock)
            );

            collection.setPollId('p1');
            await collection.loadFromDatabase();

            expect(Object.keys(collection.questions())).toEqual(['q1', 'q2']);

            const questions = Object.values(collection.questions());

            expect(questions[0].id()).toBe('q1');
            expect(questions[1].id()).toBe('q2');
        });

        test('No questions in database', async () => {
            prismaMock.question.findMany.mockResolvedValue([]);

            const collection = new MultiQuestionCollection(
                prismaMock,
                {},
                new QuestionFactory(prismaMock)
            );

            collection.setPollId('find-nothing');

            await collection.loadFromDatabase();

            expect(collection.questions()).toEqual({});
        });
    });

    describe('createNewInDatabase', () => {
        test('Create new multi question collection in database', async () => {
            prismaMock.question.create
                .mockResolvedValueOnce({
                    id: 'q1',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    pollId: 'p1',
                    typeName: 'multi',
                    visualType: 'default',
                    parentId: '',
                    minValue: -1,
                    maxValue: -1,
                    step: -1,
                    title: 'title',
                    description: 'description'
                })
                .mockResolvedValue({
                    id: 's1',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    pollId: 'p1',
                    typeName: 'multi',
                    visualType: 'default',
                    parentId: 'q1',
                    minValue: -1,
                    maxValue: -1,
                    step: -1,
                    title: 'title',
                    description: 'description'
                });

            const collection = new MultiQuestionCollection(
                prismaMock,
                {},
                new QuestionFactory(prismaMock)
            );
            const question = new MultiQuestion(prismaMock);

            question.setFromRequest({
                title: 'title',
                description: 'description',
                type: 'multi',
                minAnswers: 1,
                maxAnswers: 1,
                subQuestions: [
                    {
                        title: 'sub-title',
                        description: 'sub-description',
                        type: 'free'
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
