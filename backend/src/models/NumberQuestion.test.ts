import NumberQuestion from './NumberQuestion';

describe('NumberQuestion', () => {
    describe('isValidValue', () => {
        test('Valid value is recognized when not discrete', () => {
            const question = new NumberQuestion();

            expect(question.isValidValue(1)).toBe(true);
            expect(question.isValidValue(-1)).toBe(true);
            expect(question.isValidValue(0)).toBe(true);
            expect(question.isValidValue(0.001)).toBe(true);
        });

        test('Valid decimal value is recognized when discrete', () => {
            const question = new NumberQuestion();

            question.setStep(0.001);

            expect(question.isValidValue(0.001)).toBe(true);
            expect(question.isValidValue(0.002)).toBe(true);
            expect(question.isValidValue(-0.004)).toBe(true);
            expect(question.isValidValue(0)).toBe(true);
        });

        test('Invalid decimal value is rejected when discrete', () => {
            const question = new NumberQuestion();

            question.setStep(0.001);

            expect(question.isValidValue(0.00123)).toBe(false);
            expect(question.isValidValue(-0.0431234)).toBe(false);
        });
    });

    describe('answerDataIsAcceptable', () => {
        test('Answer data with valid number is accepted', () => {
            const question = new NumberQuestion();

            question.setStep(0.001);

            expect(
                question.answerDataIsAcceptable({
                    answer: 0.002
                })
            ).toBe(true);
        });

        test('Answer data with invalid number is rejected', () => {
            const question = new NumberQuestion();

            question.setStep(0.001);

            expect(
                question.answerDataIsAcceptable({
                    answer: 0.001234
                })
            ).toBe(false);
        });
    });
});
