import { prismaMock } from '../utils/prisma_singleton';
import BooleanQuestion from './BooleanQuestion';
import MultiQuestion from './MultiQuestion';
import NumberQuestion from './NumberQuestion';
import Question from './Question';
import QuestionFactory from './QuestionFactory';
import ScaleQuestion from './ScaleQuestion';

describe('QuestionFactory', () => {
    describe('createFreeFormQuestion', () => {
        test('Returns expected Question', () => {
            const factory = new QuestionFactory(prismaMock);

            const question = factory.createFreeFormQuestion();

            checkFreeForm(question);
        });
    });

    describe('createMultiQuestion', () => {
        test('Returns expected MultiQuestion', () => {
            const factory = new QuestionFactory(prismaMock);

            const question = factory.createMultiQuestion();

            checkMulti(question);
        });
    });

    describe('createNumberQuestion', () => {
        test('Returns expected NumberQuestion', () => {
            const factory = new QuestionFactory(prismaMock);

            const question = factory.createNumberQuestion({ step: 0.001 });

            checkNumber(question);
        });
    });

    describe('createScaleQuestion', () => {
        test('Returns expected ScaleQuestion', () => {
            const factory = new QuestionFactory(prismaMock);

            const question = factory.createScaleQuestion({
                minValue: -2,
                maxValue: 4,
                step: 0.001
            });

            checkScale(question);
        });
    });

    describe('createBooleanQuestion', () => {
        test('Returns expected BooleanQuestion', () => {
            const factory = new QuestionFactory(prismaMock);

            const question = factory.createBooleanQuestion();

            checkBoolean(question);
        });
    });

    describe('createFromType', () => {
        test('Creating each existing type of question creates expected question', () => {
            const factory = new QuestionFactory(prismaMock);

            checkScale(
                factory.createFromType('scale', {
                    minValue: -2,
                    maxValue: 4,
                    step: 0.001
                }) as ScaleQuestion
            );

            checkBoolean(factory.createFromType('boolean') as BooleanQuestion);
            checkNumber(
                factory.createFromType('number', {
                    step: 0.001
                }) as NumberQuestion
            );
            checkMulti(factory.createFromType('multi') as MultiQuestion);
            checkFreeForm(factory.createFromType('free') as Question);
        });

        test('Creating non-existent type is not allowed', () => {
            const factory = new QuestionFactory(prismaMock);

            try {
                factory.createFromType('does-not-exist');
            } catch (e) {
                expect((e as Error).message).toBe('type exists in factory');
            }
        });
    });

    function checkBoolean(question: BooleanQuestion) {
        expect(question instanceof BooleanQuestion).toBe(true);
        expect(question.database()).toBe(prismaMock);
    }

    function checkScale(question: ScaleQuestion) {
        expect(question instanceof ScaleQuestion).toBe(true);
        expect(question.database()).toBe(prismaMock);
        expect(question.minValue()).toBe(-2);
        expect(question.maxValue()).toBe(4);
        expect(question.step()).toBe(0.001);
    }

    function checkNumber(question: NumberQuestion) {
        expect(question instanceof NumberQuestion).toBe(true);
        expect(question.database()).toBe(prismaMock);
        expect(question.step()).toBe(0.001);
    }

    function checkMulti(question: MultiQuestion) {
        expect(question instanceof MultiQuestion).toBe(true);
        expect(question.database()).toBe(prismaMock);
    }

    function checkFreeForm(question: Question) {
        expect(question instanceof Question).toBe(true);
        expect(question.database()).toBe(prismaMock);
    }
});
