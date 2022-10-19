import { PrismaClient } from '@prisma/client';
import { pre, post } from '../utils/designByContract';
import BooleanQuestion from './BooleanQuestion';
import NumberQuestion from './NumberQuestion';
import * as IQuestionFactory from './IQuestionFactory';
import MultiQuestion from './MultiQuestion';
import Question from './Question';
import ScaleQuestion from './ScaleQuestion';

/**
 * A factory for different kinds of basic Question objects.
 * Recognized type names and their Question classes are:
 *      "free": Question,
 *      "multi": MultiQuestion,
 *      "number": NumberQuestion,
 *      "scale": ScaleQuestion,
 *      "boolean": BooleanQuestion
 */

export default class QuestionFactory {
    _constructors: IQuestionFactory.QuestionConstructors = {
        free: this.createFreeFormQuestion,
        multi: this.createMultiQuestion,
        number: this.createNumberQuestion,
        scale: this.createScaleQuestion as IQuestionFactory.QuestionConstructor,
        boolean: this.createBooleanQuestion
    };

    _database!: PrismaClient;

    /** Database that is set to all new Questions created. */

    database(): PrismaClient {
        return this._database;
    }

    /** Sets value of database. */

    setDatabase(database: PrismaClient): void {
        pre(
            'argument database is of type PrismaClient',
            database instanceof PrismaClient
        );

        this._database = database;

        post('_database is database', this._database === database);
    }

    /** Question constructor methods of the factory. */

    constructors(): IQuestionFactory.QuestionConstructors {
        return this._constructors;
    }

    constructor(database: PrismaClient) {
        this._database = database;
    }

    /**
     * Whether given question type name is recognized by the factory.
     */

    hasType(type: string): boolean {
        return typeof this.constructors()[type] === 'function';
    }

    /**
     * Constructor method of the factory for a question of
     * given type name.
     */

    getConstructor(type: string): IQuestionFactory.QuestionConstructor {
        pre('type exists in factory', this.hasType(type));

        return this.constructors()[
            type
        ] as IQuestionFactory.QuestionConstructor;
    }

    /**
     * Creates new Question from given type name.
     */

    createFromType(
        type: string,
        options?: IQuestionFactory.QuestionOptions
    ): Question {
        pre('type exists in factory', this.hasType(type));

        return this.getConstructor(type).apply(this, [options]);
    }

    /**
     * New plain Question instance.
     */

    createFreeFormQuestion(): Question {
        return new Question(this.database());
    }

    /**
     * New MultiQuestion instance.
     */

    createMultiQuestion(): MultiQuestion {
        return new MultiQuestion(this.database());
    }

    /**
     * New NumberQuestion instance.
     */

    createNumberQuestion(
        options?: IQuestionFactory.NumberQuestionOptions
    ): NumberQuestion {
        pre('options is of type object', typeof options === 'object');

        options = options as IQuestionFactory.ScaleQuestionOptions;

        const question = new NumberQuestion(this.database());

        if (typeof options.step === 'number') {
            question.setStep(options.step);
        }

        return question;
    }

    /**
     * New ScaleQuestion instance.
     */

    createScaleQuestion(
        options?: IQuestionFactory.ScaleQuestionOptions
    ): ScaleQuestion {
        pre('options is of type object', typeof options === 'object');

        options = options as IQuestionFactory.ScaleQuestionOptions;

        pre(
            'options.minValue is of type number',
            typeof options.minValue === 'number'
        );
        pre(
            'options.maxValue is of type number',
            typeof options.maxValue === 'number'
        );

        const question = new ScaleQuestion(
            this.database(),
            options.minValue,
            options.maxValue
        );

        if (typeof options.step === 'number') {
            question.setStep(options.step);
        }

        return question;
    }

    /**
     * New BooleanQuestion instance.
     */

    createBooleanQuestion(): BooleanQuestion {
        return new BooleanQuestion(this.database());
    }
}
