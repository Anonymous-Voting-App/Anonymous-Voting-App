import { prismaMock } from '../utils/prisma_singleton';
import BooleanQuestion from './BooleanQuestion';

describe('BooleanQuestion', () => {
    describe('answerDataIsAcceptable', () => {
        test('Answer data with true answer is accepted', () => {
            const question = new BooleanQuestion(prismaMock);

            expect(
                question.answerDataIsAcceptable({
                    answer: true
                })
            ).toBe(true);
        });

        test('Answer data with false answer is not accepted', () => {
            const question = new BooleanQuestion(prismaMock);

            expect(
                question.answerDataIsAcceptable({
                    answer: false
                })
            ).toBe(false);
        });

        test('Answer data with non-boolean answer is not accepted', () => {
            const question = new BooleanQuestion(prismaMock);

            expect(
                question.answerDataIsAcceptable({
                    answer: 'true'
                })
            ).toBe(false);
        });
    });
});
