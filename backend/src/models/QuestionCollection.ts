import { pre, post } from '../utils/designByContract';
import Question from './Question';
import * as IQuestion from './IQuestion';
import * as IQuestionCollection from './IQuestionCollection';
import { PrismaClient } from '@prisma/client';
import QuestionFactory from './QuestionFactory';

/**
 * Collection of Question instances.
 */
export default class QuestionCollection {
    _database: PrismaClient;
    _questions: { [id: string]: Question } = {};
    _pollId = '';
    _databaseData: Array<IQuestion.DatabaseData> = [];
    _questionFactory: QuestionFactory;

    /** A QuestionFactory the collection uses to create new Questions. */

    questionFactory(): QuestionFactory {
        return this._questionFactory;
    }

    /** Sets value of questionFactory. */

    setQuestionFactory(questionFactory: QuestionFactory): void {
        pre(
            'argument questionFactory is of type QuestionFactory',
            questionFactory instanceof QuestionFactory
        );

        this._questionFactory = questionFactory;

        post(
            '_questionFactory is questionFactory',
            this._questionFactory === questionFactory
        );
    }

    /**
     * Latest data received from database corresponding to the
     * instances in this collection. Updates each time
     * .setFromDatabaseData() is called.
     */
    databaseData(): Array<IQuestion.DatabaseData> {
        return this._databaseData;
    }

    /** Sets value of databaseData. */
    setDatabaseData(databaseData: Array<IQuestion.DatabaseData>): void {
        pre(
            'argument databaseData is of type Array<object>',
            Array.isArray(databaseData)
        );

        this._databaseData = databaseData;

        post(
            '_databaseData is databaseData',
            this._databaseData === databaseData
        );
    }

    /** Questions in the collection. */
    questions(): { [id: string]: Question } {
        return this._questions;
    }

    /** Sets value of questions. */
    setQuestions(questions: { [id: string]: Question }): void {
        pre(
            'argument questions is of type object',
            typeof questions === 'object'
        );

        this._questions = questions;

        post('_questions is questions', this._questions === questions);
    }

    /** Database the question collection is connected to. */
    database(): PrismaClient {
        return this._database;
    }

    /** Sets value of database. */
    setDatabase(database: PrismaClient): void {
        this._database = database;

        post('_database is database', this._database === database);
    }

    /**
     * Makes new Question instances from given database data object for question
     * and adds them into collection.
     */

    _addNewQuestionFromDatabaseData(
        questionData: IQuestion.DatabaseData
    ): void {
        questionData.votes = [];

        const question = new Question();
        question.setFromDatabaseData(questionData);

        this.questions()[questionData.id] = question;
    }

    /**
     * Creates given Question with given id in database and
     * updates it to the correct key in collection. Question
     * is assumed to already be prepared with values
     * in such a way that it can be created in the database.
     */

    async _createNewQuestionInDatabase(
        question: Question,
        id: string
    ): Promise<void> {
        delete this.questions()[id];

        await question.createNewInDatabase();

        this.questions()[question.id()] = question;
    }

    constructor(
        database: PrismaClient,
        questions: { [id: string]: Question } = {},
        questionFactory: QuestionFactory
    ) {
        pre('database is of type object', typeof database === 'object');

        this._database = database;
        this._questions = questions;
        this._questionFactory = questionFactory;
    }

    /**
     * Adds new question instance to collection.
     * Id of question is used as key for when adding to
     * .questions().
     */
    add(question: Question): void {
        pre('question is of type Question', question instanceof Question);

        this.questions()[question.id()] = question;
    }

    /**
     * Creates instances into collection according
     * to data given in array of database objects for
     * questions.
     */
    setFromDatabaseObj(questionsData: Array<IQuestion.DatabaseData>): void {
        for (let i = 0; i < questionsData.length; i++) {
            this._addNewQuestionFromDatabaseData(questionsData[i]);
        }
    }

    /**
     * Database query object to use when wanting to find collection's
     * questions in database.
     */

    findSelfInDatabaseQuery(): IQuestionCollection.FindSelfInDbQuery {
        return {
            where: {
                pollId: this.pollId()
            }
        };
    }

    /**
     * Loads questions into collection from
     * database.
     */
    async loadFromDatabase(): Promise<void> {
        for (const id in this.questions()) {
            const question = this.questions()[id];

            await question.loadFromDatabase();
        }
    }

    /**
     * Creates database entries from instances
     * in this collection and updates self to reflect database state.
     */
    async createNewInDatabase(): Promise<void> {
        pre('database is set', typeof this.database() === 'object');
        pre(
            'there is at least one question',
            Object.keys(this.questions()).length > 0
        );

        for (const id in this.questions()) {
            await this._createNewQuestionInDatabase(this.questions()[id], id);
        }

        await this.loadFromDatabase();
    }

    /**
     * Array of collection's question objects that can
     * be added to database.
     */
    newDatabaseObject(): Array<IQuestion.NewQuestionData> {
        const result = [];

        for (const id in this.questions()) {
            const question = this.questions()[id];
            result.push(question.newDatabaseObject());
        }

        return result;
    }

    /**
     * Sets pollId for collection as well
     * as all Questions in collection.
     */
    setPollId(pollId: string): void {
        pre('pollId is of type string', typeof pollId === 'string');

        this._pollId = pollId;

        for (const id in this.questions()) {
            const question = this.questions()[id];
            question.setPollId(pollId);
        }
    }

    /**
     * The pollId of the collection. If collection has questions,
     * returns the pollId of the first question found.
     * If not, returns the static pollId property of the collection.
     */
    pollId(): string {
        if (Object.keys(this.questions()).length > 0) {
            return this.questions()[Object.keys(this.questions())[0]].pollId();
        }

        return this._pollId;
    }
}
