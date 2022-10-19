import { pre, post } from '../utils/designByContract';
import { PrismaClient } from '@prisma/client';
import NumberQuestion from './NumberQuestion';
import { AnswerData } from './IQuestion';
import * as IQuestion from './IQuestion';
import * as IScaleQuestion from './IScaleQuestion';
import * as IPolling from './IPolling';

/**
 * A question that takes as answer a number
 * between a preset range of accepted number values.
 */

export default class ScaleQuestion extends NumberQuestion {
    _type = 'scale';

    _minValue: number;

    _maxValue: number;

    /** Maximum value the answer number can at most be. */

    maxValue(): number {
        return this._maxValue;
    }

    /** Sets value of maxValue. */

    setMaxValue(maxValue: number): void {
        pre(
            'argument maxValue is of type number',
            typeof maxValue === 'number'
        );

        this._maxValue = maxValue;

        post('_maxValue is maxValue', this._maxValue === maxValue);
    }

    /** Minimum value the answer number should at least be. */

    minValue(): number {
        return this._minValue;
    }

    /** Sets value of minValue. */

    setMinValue(minValue: number): void {
        pre(
            'argument minValue is of type number',
            typeof minValue === 'number'
        );

        this._minValue = minValue;

        post('_minValue is minValue', this._minValue === minValue);
    }

    constructor(database: PrismaClient, minValue: number, maxValue: number) {
        super(database);

        pre('minValue is of type number', typeof minValue === 'number');
        pre('maxValue is of type number', typeof maxValue === 'number');

        this._minValue = minValue;
        this._maxValue = maxValue;
    }

    /**
     * Whether given number is within the range
     * of accepted values.
     */

    numberIsWithinRange(num: number): boolean {
        return num >= this.minValue() && num <= this.maxValue();
    }

    /**
     * Whether given answer data is acceptable.
     * Answer data is acceptable if it is a valid answer to a
     * NumberQuestion and the given number value is within range.
     */

    answerDataIsAcceptable(answerData: AnswerData): boolean {
        return (
            super.answerDataIsAcceptable(answerData) &&
            this.numberIsWithinRange(answerData.answer as number)
        );
    }

    /**
     * Makes new object from the instance's info that can
     * be added to Prisma database.
     */
    newDatabaseObject(): IScaleQuestion.NewQuestionData {
        const obj = super.newDatabaseObject() as IScaleQuestion.NewQuestionData;

        obj.minValue = this.minValue();
        obj.maxValue = this.maxValue();

        return obj;
    }

    /**
     * Populates the Question's fields data from
     * given data object representing information for a new question.
     */
    setFromRequest(request: IQuestion.QuestionRequest): void {
        pre(
            'request.minValue is of type number',
            typeof request.minValue === 'number'
        );
        pre(
            'request.maxValue is of type number',
            typeof request.maxValue === 'number'
        );

        super.setFromRequest(request);

        this.setMinValue(request.minValue as number);
        this.setMaxValue(request.maxValue as number);
    }

    /**
     * Sets instance's properties from given question object
     * received from the database.
     */
    setFromDatabaseData(questionData: IQuestion.DatabaseData): void {
        pre(
            'questionData.minValue is of type number',
            typeof questionData.minValue === 'number'
        );
        pre(
            'questionData.maxValue is of type number',
            typeof questionData.minValue === 'number'
        );

        super.setFromDatabaseData(questionData);

        this.setMinValue(questionData.minValue as number);
        this.setMaxValue(questionData.maxValue as number);
    }

    /**
     * A data object of the question's non-sensitive public information.
     */
    publicDataObj(): IPolling.QuestionData {
        const obj = super.publicDataObj();

        obj.minValue = this.minValue();
        obj.maxValue = this.maxValue();

        return obj;
    }
}
