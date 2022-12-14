import { pre, post } from '../utils/designByContract';
import User from './user/User';
import * as IPolling from './IPolling';
import * as IAnswer from './IAnswer';
import * as IUser from './user/IUser';
import { PrismaClient } from '@prisma/client';
import Fingerprint from './user/Fingerprint';
import * as IFingerprint from './user/IFingerprint';

/**
 * An answer to a Question. Has the id of the question it
 * is an answer to. Has the User that gave the answer.
 * The actual answer data is stored in string property .value().
 * Can be connected to Prisma database.
 */
export default class Answer {
    _questionId = '';
    _value: string | number | boolean | object = '';
    _answerer!: Fingerprint;
    _loadedFromDatabase = false;
    _createdInDatabase = false;
    _id = '';
    _database!: PrismaClient;
    _subAnswers: { [id: string]: Answer } = {};
    _parentId = '';
    _pollId = '';

    /**  */

    pollId(): string {
        return this._pollId;
    }

    /** Sets value of pollId. */

    setPollId(pollId: string): void {
        pre('argument pollId is of type string', typeof pollId === 'string');

        this._pollId = pollId;

        post('_pollId is pollId', this._pollId === pollId);
    }

    /** Id of a possible parent Answer. */

    parentId(): string {
        return this._parentId;
    }

    /** Sets value of parentId. */

    setParentId(parentId: string): void {
        pre(
            'argument parentId is of type string',
            typeof parentId === 'string'
        );

        this._parentId = parentId;

        post('_parentId is parentId', this._parentId === parentId);
    }

    /**
     * Possible sub-answers the answer may have.
     */

    subAnswers(): { [id: string]: Answer } {
        return this._subAnswers;
    }

    /** Sets value of subAnswers. */

    setSubAnswers(subAnswers: { [id: string]: Answer }): void {
        pre(
            'argument subAnswers is of type object',
            typeof subAnswers === 'object'
        );

        this._subAnswers = subAnswers;

        post('_subAnswers is subAnswers', this._subAnswers === subAnswers);
    }

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

    /** The Fingerprint that gave the answer. */
    answerer(): Fingerprint {
        return this._answerer;
    }

    /** Sets value of answerer. */
    setAnswerer(answerer: Fingerprint): void {
        pre(
            'argument answerer is of type Fingerprint',
            answerer instanceof Fingerprint
        );

        this._answerer = answerer;

        post('_answerer is answerer', this._answerer === answerer);
    }

    /** The actual answer data. Format of the answer string depends on
     * the question type. Answer does not take into
     * consideration whether the answer value itself is in a correct format
     * or not.
     */
    value(): string | number | boolean | object {
        return this._value;
    }

    /** Sets value of value. */
    setValue(value: string | number | boolean | object): void {
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
     * Sets fields from given database data that are not optional.
     */
    _setMandatoriesFromDatabaseData(answerData: IAnswer.DatabaseData): void {
        this.setId(answerData.id);
        this.setQuestionId(answerData.questionId);
        this.setValue(answerData.value);
        this.setPollId(answerData.pollId);
    }

    /**
     * Makes a new User from given database data object for user.
     */
    _makeAnswerer(answererData: IFingerprint.DatabaseData): Fingerprint {
        const answerer = new Fingerprint(this.database());

        answerer.setFromDatabaseData(answererData);

        return answerer;
    }

    /**
     *
     */

    _makeAnswererWithId(id: string): Fingerprint {
        const answerer = new Fingerprint(this.database());

        answerer.setId(id);

        return answerer;
    }

    /**
     * Makes a new User from given answer database data object.
     */
    _makeAnswererFromDatabaseData(
        answerData: IAnswer.DatabaseData
    ): Fingerprint | undefined {
        let answerer: Fingerprint | undefined;

        if (typeof answerData.voter === 'object') {
            answerer = this._makeAnswerer(answerData.voter);
        } else if (typeof answerData.voterId == 'string') {
            answerer = this._makeAnswererWithId(answerData.voterId);
        }

        return answerer;
    }

    /**
     * Sets own optional fields from given database data object.
     */
    _setOptionalsFromDatabaseData(answerData: IAnswer.DatabaseData): void {
        const answerer: Fingerprint | undefined =
            this._makeAnswererFromDatabaseData(answerData);

        if (answerer !== undefined) {
            this.setAnswerer(answerer);
        }

        if (Array.isArray(answerData.subVotes)) {
            this.setSubAnswersFromDatabaseData(answerData.subVotes);
        }
    }

    /**
     * Makes new sub-Answer for this Answer from
     * database data and adds it as a sub-answer.
     */

    _addNewSubAnswerFromDatabaseData(
        subAnswerData: IAnswer.DatabaseData
    ): void {
        const subAnswer = new Answer(this.database());

        subAnswer.setParentId(this.id());

        subAnswer.setFromDatabaseData(subAnswerData);

        this.subAnswers()[subAnswer.id()] = subAnswer;
    }

    /**
     * Makes new sub-Answer for this Answer from
     * rqeuest data and adds it as a sub-answer.
     */

    _addNewSubAnswerFromRequest(
        subRequest: IAnswer.Request,
        answerer: Fingerprint,
        questionId: string,
        id: string
    ): void {
        const subAnswer = new Answer(this.database());

        subAnswer.setFromRequest(subRequest, answerer, questionId);

        this.subAnswers()[id] = subAnswer;
    }

    /**
     * Sets the information of the Answer from a request object
     * containing sub-answers. Note: Method currently not fully implemented.
     * Currently does not actually instantiate sub-answers.
     */

    _setFromNestedRequest(
        request: IAnswer.Request,
        answerer: Fingerprint,
        questionId: string
    ): void {
        this.setValue('');
        this.setAnswerer(answerer);
        this.setQuestionId(questionId);
    }

    /**
     * Sets the information of the Answer from a request object
     * that does not contain sub-answers.
     */

    _setFromShallowRequest(
        request: IAnswer.Request,
        answerer: Fingerprint,
        questionId: string
    ): void {
        this.setValue(request.answer.toString());
        this.setAnswerer(answerer);
        this.setQuestionId(questionId);
    }

    constructor(database?: PrismaClient) {
        if (database !== undefined) {
            this._database = database;
        }
    }

    /**
     * Makes new sub-Answers for this Answer from
     * database data and adds them as sub-answers.
     */

    setSubAnswersFromDatabaseData(
        subAnswerDatas: Array<IAnswer.DatabaseData>
    ): void {
        for (let i = 0; i < subAnswerDatas.length; i++) {
            const subAnswerData = subAnswerDatas[i];

            this._addNewSubAnswerFromDatabaseData(subAnswerData);
        }
    }

    /**
     * Sets the instance properties from an object
     * received from the Prisma database.
     */
    setFromDatabaseData(answerData: IAnswer.DatabaseData): void {
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

        this._setMandatoriesFromDatabaseData(answerData);

        this._setOptionalsFromDatabaseData(answerData);
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
     * Database objects (objects that can be added to database)
     * for all the sub-answers of this answer.
     */

    newSubVoteDatabaseObjects(): Array<IAnswer.NewAnswerData> {
        const objs: Array<IAnswer.NewAnswerData> = [];

        for (const id in this.subAnswers()) {
            const subAnswer = this.subAnswers()[id];

            objs.push(subAnswer.newDatabaseObject());
        }

        return objs;
    }

    /**
     * New object that can be added to Prisma database. Constructed from the values
     * of the properties of this instance.
     */
    newDatabaseObject(): IAnswer.NewAnswerData {
        pre('questionId is set', this.questionId().length > 0);
        pre('answerer is set', this.answerer() instanceof Fingerprint);
        pre('answerer is identifiable', this.answerer().isIdentifiable());

        const obj: IAnswer.NewAnswerData = {
            questionId: this.questionId(),
            value: this.value().toString(),
            voterId: this.answerer().id(),
            pollId: this.pollId(),
            parentId: this.parentId().length > 0 ? this.parentId() : null
        };

        if (Object.keys(this.subAnswers()).length > 0) {
            obj.subVotes = this.newSubVoteDatabaseObjects();
        }

        return obj;
    }

    /**
     * Info objects of all the sub-answers of this answer.
     */

    subAnswersDataObjs(): Array<IPolling.AnswerData> {
        const objs: Array<IPolling.AnswerData> = [];

        for (const id in this.subAnswers()) {
            const subAnswer = this.subAnswers()[id];

            objs.push(subAnswer.publicDataObj());
        }

        return objs;
    }

    /**
     * A data object of the answer containing sensitive information.
     * Contains information of who the answerer is.
     */

    publicDataObj(): IPolling.AnswerData {
        return {
            id: this.id(),
            questionId: this.questionId(),
            value: this.value(),
            subAnswers: this.subAnswersDataObjs()
        };
    }

    /**
     * Sets answer's information from a request object.
     */

    setFromRequest(
        request: IAnswer.Request,
        answerer: Fingerprint,
        questionId: string
    ): void {
        if (Array.isArray(request.answer)) {
            this._setFromNestedRequest(request, answerer, questionId);
        } else {
            this._setFromShallowRequest(request, answerer, questionId);
        }
    }

    /**
     * Sets answer's sub-answers and their information from a request object.
     */

    setSubAnswersFromRequest(
        request: IAnswer.Request,
        answerer: Fingerprint,
        questionId: string
    ): void {
        pre('request.answer is of type Array', Array.isArray(request.answer));

        let id = 0;

        for (
            let i = 0;
            i < (request.answer as Array<IAnswer.Request>).length;
            i++
        ) {
            id++;

            const subRequestData = (request.answer as Array<IAnswer.Request>)[
                i
            ];

            this._addNewSubAnswerFromRequest(
                subRequestData,
                answerer,
                questionId,
                id.toString()
            );
        }
    }

    /**
     * Whether the answer is a leaf answer, i.e it does not
     * have sub-answers.
     */

    isLeafAnswer(): boolean {
        return Object.keys(this.subAnswers()).length === 0;
    }

    /**
     * How many of the answer's tree of shallow
     * immediate sub-answers are leaf nodes.
     * Excludes the root answer itself.
     */

    leafSubAnswerCount(): number {
        let result = 0;

        for (const id in this.subAnswers()) {
            const subAnswer = this.subAnswers()[id];

            if (subAnswer.isLeafAnswer()) {
                result += 1;
            }
        }

        return result;
    }

    /**
     * How many of the answer's tree of answers are leaf nodes
     * excluding the root answer itself. Thus, if the
     * answer itself is a leaf node, then the count will still
     * be 0.
     */

    subAnswerCount(): number {
        let result = this.leafSubAnswerCount();

        for (const id in this.subAnswers()) {
            const subAnswer = this.subAnswers()[id];

            result += subAnswer.subAnswerCount();
        }

        return result;
    }

    /**
     * How many of the answer's tree of answers are leaf nodes.
     */

    count(): number {
        if (this.isLeafAnswer()) {
            return 1;
        } else {
            return this.subAnswerCount();
        }
    }
}
