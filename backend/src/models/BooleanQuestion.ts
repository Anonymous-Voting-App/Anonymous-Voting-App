import { PrismaClient } from '@prisma/client';
import { AnswerData } from './IQuestion';
import * as IQuestion from './IQuestion';
import * as IBooleanQuestion from './IBooleanQuestion';
import Question from './Question';

/**
 * A yes / no question. Accepts true / false
 * as answer.
 */

export default class BooleanQuestion extends Question {
    _type = 'boolean';

    /**
     * Answer statistics of the boolean question for
     * each answer value. Contains two objects, one for true
     * and one of false. Even if either has 0 answers given,
     * the object is still included into the statistics (different from
     * the default behavious in Question, where non-answered values are excluded).
     */

    _trueFalseAnswerStatistics(): Array<IQuestion.AnswerValueStatistic> {
        const falseAnswers = this.parentAnswerCount() - this.answerCount();

        return [
            {
                value: 'true',
                count: this.parentAnswerCount(),
                percentage: this._calculateAnswerPercentage(
                    this.parentAnswerCount(),
                    this.parentAnswerCount()
                )
            },

            {
                value: 'false',
                count: falseAnswers,
                percentage: this._calculateAnswerPercentage(
                    falseAnswers,
                    this.parentAnswerCount()
                )
            }
        ];
    }

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
     * Sets the boolean question's properties from
     * given database data. .answerCount() of a boolean
     * question is always the same as the parent's answerCount.
     * Thus, answerPercentage() is also always 1.
     */

    setFromDatabaseData(questionData: IQuestion.DatabaseData): void {
        super.setFromDatabaseData(questionData);

        this.setAnswerCount(this.parentAnswerCount());

        this.setAnswerPercentage(1);
    }

    /**
     * How many times true has been answered.
     */

    trueAnswerCount(): number {
        return this.countAnswersWithValue('true');
    }

    /**
     * How many times false has been answered.
     */

    falseAnswerCount(): number {
        return this.countAnswersWithValue('false');
    }

    /**
     * The ratio of true answers to the question's total answers.
     */

    trueAnswerPercentage(): number {
        return this._calculateAnswerPercentage(
            this.trueAnswerCount(),
            this.answerCount()
        );
    }

    /**
     * The ratio of false answers to the question's total answers.
     */

    falseAnswerPercentage(): number {
        return this._calculateAnswerPercentage(
            this.falseAnswerCount(),
            this.answerCount()
        );
    }

    /**
     * Data object with the boolean question's answer result
     * statistics.
     */

    resultDataObj(): IBooleanQuestion.ResultData {
        const result = super.resultDataObj();

        result.trueAnswerCount = this.trueAnswerCount();
        result.falseAnswerCount = this.falseAnswerCount();
        result.trueAnswerPercentage = this.trueAnswerPercentage();
        result.falseAnswerPercentage = this.falseAnswerPercentage();
        result.answerValueStatistics = this._trueFalseAnswerStatistics();

        return result as IBooleanQuestion.ResultData;
    }
}
