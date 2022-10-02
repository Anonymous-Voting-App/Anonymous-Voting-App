import { pre, post } from '../utils/designByContract';
import User from './User';
import * as IPolling from './IPolling';
import * as IAnswer from './IAnswer';
import { PrismaClient } from '@prisma/client';

/**
 * An answer to a Question. Has the id of the question it
 * is an answer to. Has the User that gave the answer.
 * The actual answer data is stored in string property .value().
 * Can be connected to Prisma database.
 */
export default class Answer {
    _questionId = '';
    _value: any = '';
    _answerer!: User;
    _loadedFromDatabase = false;
    _createdInDatabase = false;
    _id = '';
    _database!: PrismaClient;

    /** Prisma database the instance is connected to. */
    database(): PrismaClient {
        return this._database;
    }

    /** Sets value of database. */
    setDatabase(database: PrismaClient): void {
        this._database = database;
        post('_database is database', this._database === database);
    }

    /** Unique id of the answer. Same as in database. */
    id(): string {
        return this._id;
    }

    /** Sets value of id. */
    setId(id: string): void {
        pre('argument id is of type string', typeof id === 'string');

        this._id = id;

        post('_id is id', this._id === id);
    }

    /** Whether an answer object has been created in the database from this instance. */
    createdInDatabase(): boolean {
        return this._createdInDatabase;
    }

    /** Whether the instance has had its data populates from the database. */
    loadedFromDatabase(): boolean {
        return this._loadedFromDatabase;
    }

    /** The User that gave the answer. */
    answerer(): User {
        return this._answerer;
    }

    /** Sets value of answerer. */
    setAnswerer(answerer: User): void {
        pre('argument answerer is of type User', answerer instanceof User);

        this._answerer = answerer;

        post('_answerer is answerer', this._answerer === answerer);
    }

    /** The actual answer data. Format of the answer string depends on
     * the question type. Answer does not take into
     * consideration whether the answer value itself is in a correct format
     * or not.
     */
    value(): any {
        return this._value;
    }

    /** Sets value of value. */
    setValue(value: any): void {
        this._value = value;

        post('_value is value', this._value === value);
    }

    /** Database id of the Question that was answered. */
    questionId(): string {
        return this._questionId;
    }

    /** Sets value of questionId. */
    setQuestionId(questionId: string): void {
        pre(
            'argument questionId is of type string',
            typeof questionId === 'string'
        );

        this._questionId = questionId;

        post('_questionId is questionId', this._questionId === questionId);
    }

    /**
     * Sets the instance properties from an object
     * received from the Prisma database.
     */
    setFromDatabaseData(answerData: IAnswer.AnswerData): void {
        pre('answerData is of type object', typeof answerData === 'object');

        pre(
            'answerData.id is of type string',
            typeof answerData.id === 'string'
        );

        pre(
            'answerData.questionId is of type string',
            typeof answerData.questionId === 'string'
        );

        pre(
            'answerData.value is of type string',
            typeof answerData.value === 'string'
        );

        this.setId(answerData.id);
        this.setQuestionId(answerData.questionId);
        this.setValue(answerData.value);

        let answerer;

        if (typeof answerData.voter === 'object') {
            answerer = new User();
            answerer.setFromDatabaseData(answerData.voter);
        } else if (typeof answerData.voterId == 'string') {
            answerer = new User();
            answerer.setFromDatabaseData({ id: answerData.voterId });
        }

        if (answerer !== undefined) {
            this.setAnswerer(answerer);
        }
    }

    /**
     * Makes new object in Prisma database from the values
     * of the properties of this instance.
     */
    async createNewInDatabase(): Promise<void> {
        const data = await this._database.vote.create({
            data: this.newDatabaseObject()
        });

        this.setFromDatabaseData(data);
        this._createdInDatabase = true;
    }

    /**
     * New object that can be added to Prisma database. Constructed from the values
     * of the properties of this instance.
     */
    newDatabaseObject(): IAnswer.NewAnswerData {
        pre('questionId is set', this.questionId().length > 0);
        pre('answerer is set', this.answerer() instanceof User);
        pre('answerer is identifiable', this.answerer().isIdentifiable());
        pre('answerer id is set', this.answerer().id().length > 0);

        return {
            questionId: this.questionId(),
            value: this.value().toString(),
            voterId: this.answerer().id()
        };
    }

    /**
     * A data object of the answer containing sensitive information.
     * Contains information of who the answerer is.
     */

    privateDataObj(): IPolling.AnswerData {
        return {
            id: this.id(),
            questionId: this.questionId(),
            value: this.value(),
            answerer: this.answerer().publicDataObj()
        };
    }
}
