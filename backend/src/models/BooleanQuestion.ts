import { PrismaClient } from '@prisma/client';
import { AnswerData } from './IQuestion';
import Question from './Question';

/**
 * A yes / no question. Accepts true / false
 * as answer.
 */

export default class BooleanQuestion extends Question {
    _type = 'boolean';

    constructor(database?: PrismaClient) {
        super(database);
    }

    /**
     * Whether given answer data object is acceptable to the question.
     * The answer property of the object must be a boolean to be accepted.
     */

    answerDataIsAcceptable(answerData: AnswerData): boolean {
        return (
            typeof answerData === 'object' &&
            typeof answerData.answer === 'boolean'
        );
    }
}
