import { PrismaClient } from '@prisma/client';
import { AnswerData } from './IQuestion';
import * as IBooleanQuestion from './IBooleanQuestion';
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

    /**
     *
     */

    trueAnswerCount(): number {
        return this.countAnswersWithValue('true');
    }

    /**
     *
     */

    falseAnswerCount(): number {
        return this.countAnswersWithValue('false');
    }

    /**
     *
     */

    trueAnswerPercentage(): number {
        return this.trueAnswerCount() / this.answerCount();
    }

    /**
     *
     */

    falseAnswerPercentage(): number {
        return this.falseAnswerCount() / this.answerCount();
    }

    /**
     *
     */

    /* resultDataObj(  ): IBooleanQuestion.ResultData {
        
        const result = super.resultDataObj(  );
        
        result.trueAnswerCount = this.trueAnswerCount(  );
        result.falseAnswerCount = this.falseAnswerCount(  );
        result.trueAnswerPercentage = this.trueAnswerPercentage(  );
        result.falseAnswerPercentage = this.falseAnswerPercentage(  );

        return result as IBooleanQuestion.ResultData;
        
    } */
}
