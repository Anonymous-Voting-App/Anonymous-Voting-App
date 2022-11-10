import { pre, post } from '../utils/designByContract';
import { PrismaClient } from '@prisma/client';
import { AnswerData } from './IQuestion';
import * as IQuestion from './IQuestion';
import * as IPolling from './IPolling';
import Question from './Question';

/**
 * A question that takes in a number as an answer.
 */

export default class NumberQuestion extends Question {
    _type = 'number';

    _step = -1;

    /**
     * A discrete step the given number must consist of.
     * Or in other words, any valid value must be divisible
     * by step. Step must be an integer.
     * Step = -1 means no step value is set.
     */

    step(): number {
        return this._step;
    }

    /** Sets value of step. */

    setStep(step: number): void {
        pre('argument step is of type number', typeof step === 'number');

        this._step = step;

        post('_step is step', this._step === step);
    }

    /**
     * Rounds given number to 6 decimal places.
     */

    _round(num: number): number {
        return parseFloat(num.toFixed(6));
    }

    constructor(database?: PrismaClient) {
        super(database);
    }

    /**
     * Whether a step value is set.
     */

    isDiscrete(): boolean {
        return this.step() > 0;
    }

    /**
     * Whether given number is a valid answer value.
     */

    isValidValue(num: number): boolean {
        if (this.isDiscrete()) {
            return num % this.step() === 0;
        } else {
            return true;
        }
    }

    /**
     * Whether given answer data is an acceptable answer to
     * the number question. Answer data must contain a number
     * and the number must be a valid number value.
     */

    answerDataIsAcceptable(answerData: AnswerData): boolean {
        return (
            typeof answerData === 'object' &&
            typeof answerData.answer === 'number' &&
            this.isValidValue(answerData.answer)
        );
    }

    /**
     * Makes new object from the instance's info that can
     * be added to Prisma database.
     */
    newDatabaseObject(): IQuestion.NewQuestionData {
        const obj = super.newDatabaseObject() as IQuestion.NewQuestionData;

        obj.step = this.step();

        return obj;
    }

    /**
     * Populates the Question's fields data from
     * given data object representing information for a new question.
     */
    setFromRequest(request: IQuestion.QuestionRequest): void {
        pre('request.step is of type number', typeof request.step === 'number');

        super.setFromRequest(request);

        this.setStep(request.step as number);
    }

    /**
     * Sets instance's properties from given question object
     * received from the database.
     */
    setFromDatabaseData(questionData: IQuestion.DatabaseData): void {
        pre(
            'questionData.step is of type number',
            typeof questionData.step === 'number'
        );

        super.setFromDatabaseData(questionData);

        this.setStep(questionData.step as number);
    }

    /**
     * A data object of the question's non-sensitive public information.
     */
    publicDataObj(): IPolling.QuestionData {
        const obj = super.publicDataObj();

        obj.step = this.step();

        return obj;
    }
}
