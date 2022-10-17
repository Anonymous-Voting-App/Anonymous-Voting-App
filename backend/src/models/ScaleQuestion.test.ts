import ScaleQuestion from './ScaleQuestion';
import { prismaMock } from '../utils/prisma_singleton';
import NumberQuestion from './NumberQuestion';

describe('ScaleQuestion', () => {
    describe('numberIsWithinRange', () => {
        test('Numbers within range are accepted', () => {
            const question = new ScaleQuestion(prismaMock, -2, 4);

            expect(question.numberIsWithinRange(-2)).toBe(true);
            expect(question.numberIsWithinRange(4)).toBe(true);
            expect(question.numberIsWithinRange(0)).toBe(true);
            expect(question.numberIsWithinRange(0.001)).toBe(true);
        });

        test('Numbers not within range are rejected', () => {
            const question = new ScaleQuestion(prismaMock, -2, 4);

            expect(question.numberIsWithinRange(-2.00001)).toBe(false);
            expect(question.numberIsWithinRange(4.00001)).toBe(false);
            expect(question.numberIsWithinRange(10)).toBe(false);
            expect(question.numberIsWithinRange(-6)).toBe(false);
        });
    });

    describe('answerDataIsAcceptable', () => {
        test('Answer data with valid number is accepted', () => {
            const question = new ScaleQuestion(prismaMock, -2, 4);

            expect(
                question.answerDataIsAcceptable({
                    answer: 0
                })
            ).toBe(true);
        });

        test('Answer data with invalid number is not accepted', () => {
            const question = new ScaleQuestion(prismaMock, -2, 4);

            expect(
                question.answerDataIsAcceptable({
                    answer: 8
                })
            ).toBe(false);
        });
    });

    describe('newDatabaseObject', () => {
        test(`New database object is NumberQuestion's database object
                with minValue and maxValue added to it`, () => {
            const question = new ScaleQuestion(prismaMock, -2, 4);

            const referenceObj =
                NumberQuestion.prototype.newDatabaseObject.apply(question);

            referenceObj.minValue = -2;
            referenceObj.maxValue = 4;

            expect(question.newDatabaseObject()).toEqual(referenceObj);
        });
    });
});
