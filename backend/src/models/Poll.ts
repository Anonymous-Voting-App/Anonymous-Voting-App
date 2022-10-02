import { pre, post } from '../utils/designByContract';
import User from './User';
import Question from './Question';
import Answer from './Answer';
import * as IPolling from './IPolling';
import * as IPoll from './IPoll';
import * as IQuestion from './IQuestion';
import MultiQuestionCollection from './MultiQuestionCollection';
import MultiQuestion from './MultiQuestion';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

/**
 * A voting poll that can have questions and an owner.
 * Also has link ids to the poll's admin view
 * and public view. Linked to Prisma database.
 */
export default class Poll {
    _id = '';
    _name = '';
    _type = '';
    _owner!: User;
    _publicId = '';
    _privateId = '';
    _questions: { [id: string]: Question } = {};
    _answers: { [id: string]: Answer } = {};
    _database: PrismaClient;
    _loadedFromDatabase = false;
    _createdInDatabase = false;

    /** Whether new database entry has been made from this instance. */
    createdInDatabase(): boolean {
        return this._createdInDatabase;
    }

    /** Sets value of createdInDatabase. */
    setCreatedInDatabase(createdInDatabase: boolean): void {
        pre(
            'argument createdInDatabase is of type boolean',
            typeof createdInDatabase === 'boolean'
        );

        this._createdInDatabase = createdInDatabase;

        post(
            '_createdInDatabase is createdInDatabase',
            this._createdInDatabase === createdInDatabase
        );
    }

    /**
     * Whether Poll instance has been populated
     * with data from database
     */
    loadedFromDatabase(): boolean {
        return this._loadedFromDatabase;
    }

    /** Sets value of loadedFromDatabase. */
    setLoadedFromDatabase(loadedFromDatabase: boolean): void {
        pre(
            'argument loadedFromDatabase is of type boolean',
            typeof loadedFromDatabase === 'boolean'
        );

        this._loadedFromDatabase = loadedFromDatabase;

        post(
            '_loadedFromDatabase is loadedFromDatabase',
            this._loadedFromDatabase === loadedFromDatabase
        );
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

    /** Answers given to poll. */
    answers(): { [id: string]: Answer } {
        return this._answers;
    }

    /** Sets value of answers. */
    setAnswers(answers: { [id: string]: Answer }): void {
        pre('argument answers is of type object', typeof answers === 'object');

        this._answers = answers;

        post('_answers is answers', this._answers === answers);
    }

    /** Questions that are part of poll. */
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

    /**
     * Private id of the poll. Knowing the private id
     * is meant to give access to editing the poll.
     */
    privateId(): string {
        return this._privateId;
    }

    /** Sets value of privateId. */
    setPrivateId(privateId: string): void {
        pre(
            'argument privateId is of type string',
            typeof privateId === 'string'
        );

        this._privateId = privateId;

        post('_privateId is privateId', this._privateId === privateId);
    }

    /**
     * Public id of the poll. Knowing
     * the public id is meant to allow answering the poll.
     */
    publicId(): string {
        return this._publicId;
    }

    /** Sets value of publicId. */
    setPublicId(publicId: string): void {
        pre(
            'argument publicId is of type string',
            typeof publicId === 'string'
        );

        this._publicId = publicId;

        post('_publicId is publicId', this._publicId === publicId);
    }

    /**
     * Who owns the poll. Can be an unidentifiable owner
     * since the poll can be edited just by knowing
     * the private id.
     */
    owner(): User {
        return this._owner;
    }

    /** Sets value of owner. */
    setOwner(owner: User): void {
        pre('argument owner is of type User', owner instanceof User);

        this._owner = owner;

        post('_owner is owner', this._owner === owner);
    }

    /**
     * A type the poll can have. Can be used to
     * differentiate polls into types as desired.
     */
    type(): string {
        return this._type;
    }

    /** Sets value of type. */
    setType(type: string): void {
        pre('argument type is of type string', typeof type === 'string');

        this._type = type;

        post('_type is type', this._type === type);
    }

    /** Name of the poll. */
    name(): string {
        return this._name;
    }

    /** Sets value of name. */
    setName(name: string): void {
        pre('argument name is of type string', typeof name === 'string');

        this._name = name;

        post('_name is name', this._name === name);
    }

    /** Unique database id of the poll. */
    id(): string {
        return this._id;
    }

    /** Sets value of id. */
    setId(id: string): void {
        pre('argument id is of type string', typeof id === 'string');

        this._id = id;

        post('_id is id', this._id === id);
    }

    /**
     *
     */
    async _createPollInDatabase(): Promise<IPoll.PollData> {
        return await this._database.poll.create({
            data: this.newDatabaseObject()
        });
    }

    /**
     *
     */
    async _createQuestionsInDatabase(
        pollData: IPoll.PollData
    ): Promise<{ [prop: string]: any }> {
        const questions = new MultiQuestionCollection(
            this.database(),
            this.questions() as { [id: string]: MultiQuestion }
        );

        questions.setPollId(pollData.id);
        await questions.createNewInDatabase();

        this.setQuestions(questions.questions());

        return questions.databaseData();
    }

    constructor(database: PrismaClient) {
        pre('database is of type object', typeof database === 'object');

        this._database = database;
    }

    /**
     * Creates new database object in Prisma database
     * from the properties of this instance.
     */
    async createNewInDatabase(): Promise<void> {
        pre('poll is new', this.id() === '');

        const pollData = await this._createPollInDatabase();
        const questionsData = await this._createQuestionsInDatabase(pollData);

        pollData.questions = Object.values(questionsData);

        this.setFromDatabaseData(pollData, true);
        this._createdInDatabase = true;
    }

    /**
     * Object that can be given to Prisma database to add
     * the information of this instance into the database.
     */
    newDatabaseObject(): IPoll.NewPollData {
        pre('name is set', this.name().length > 0);
        pre('privateId is set', this.privateId().length > 0);
        pre('publicId is set', this.publicId().length > 0);
        pre('owner is set', this.owner() instanceof User);
        pre('owner has v4 uuid', this.owner().hasV4Uuid());

        const result: IPoll.NewPollData = {
            name: this.name(),
            adminLink: this.privateId(),
            pollLink: this.publicId(),
            resultLink: '',
            creatorId: this.owner().id()
        };

        if (this.owner() instanceof User) {
            result.creatorId = this.owner().id();
        }

        return result;
    }

    /**
     * Query object inside where property to use
     * when trying to find this poll in database.
     */
    findSelfInDatabaseQuery(): { [prop: string]: any } {
        const subQueries: Array<object> = [];

        const query = { OR: subQueries };

        if (this.id().length > 0) {
            subQueries.push({ id: this.id() });
        }

        if (this.publicId().length > 0) {
            subQueries.push({ pollLink: this.publicId() });
        }

        if (this.privateId().length > 0) {
            subQueries.push({ adminLink: this.privateId() });
        }

        return query;
    }

    /**
     * Whether poll can be found in the
     * Prisma database.
     */
    async existsInDatabase(): Promise<boolean> {
        pre(
            'either id, publicId or privateId is set',
            this.id().length > 0 ||
                this.publicId().length > 0 ||
                this.privateId().length > 0
        );

        const result = await this._database.poll.findFirst({
            where: this.findSelfInDatabaseQuery()
        });

        // Don't use strict check as that returns true for undefined
        return result != null;
    }

    /**
     * Populates info of the poll with data retrieved
     * from database. If poll with not found in database,
     * does nothing. If poll was found, .loadedFromDatabase() becomes true.
     */
    async loadFromDatabase(): Promise<void> {
        pre(
            'either id, publicId or privateId is set',
            this.id().length > 0 ||
                this.publicId().length > 0 ||
                this.privateId().length > 0
        );

        const pollData = await this._database.poll.findFirst({
            where: this.findSelfInDatabaseQuery(),
            include: {
                questions: {
                    include: {
                        options: true
                    }
                }
            }
        });

        if (pollData !== null) {
            this.setFromDatabaseData(pollData);

            this._loadedFromDatabase = true;
        }
    }

    /**
     * Manually populates info of the poll with data object
     * that's been retrieved from the database beforehand.
     */
    setFromDatabaseData(pollData: IPoll.PollData, omitQuestions = false): void {
        pre('pollData.id is of type string', typeof pollData.id === 'string');
        pre(
            'pollData.name is of type string',
            typeof pollData.name === 'string'
        );
        pre(
            'pollData.pollLink is of type string',
            typeof pollData.pollLink === 'string'
        );
        pre(
            'pollData.adminLink is of type string',
            typeof pollData.adminLink === 'string'
        );
        pre(
            'pollData.questions is of type Array',
            Array.isArray(pollData.questions)
        );

        this.setId(pollData.id);
        this.setName(pollData.name);

        // Not actually ever a string. Just a quick fix so unit tests don't break.
        if (typeof pollData.type === 'string') {
            this.setType(pollData.type);
        }

        if (typeof pollData.creator === 'object') {
            const owner = new User();

            owner.setFromDatabaseData(pollData.creator as any);

            this.setOwner(owner);
        }

        this.setPublicId(pollData.pollLink);
        this.setPrivateId(pollData.adminLink);

        if (!omitQuestions) {
            this.setQuestionsFromDatabaseData(pollData.questions || []);
        }

        this.setAnswersFromDatabaseData(pollData.questions || []);
    }

    /**
     * Manually populates info of the poll's questions with data
     * that's been retrieved from the database beforehand.
     */
    setQuestionsFromDatabaseData(questionsData: Array<any>): void {
        for (let i = 0; i < questionsData.length; i++) {
            const questionData = questionsData[i];

            const question = new MultiQuestion();

            question.setFromDatabaseData(questionData);

            this.questions()[question.id()] = question;
        }
    }

    /**
     * Manually populates info of the poll's answers with data
     * that's been retrieved from the database beforehand.
     */
    setAnswersFromDatabaseData(questionsData: Array<any>): void {
        let answersData: Array<any> = [];

        for (let i = 0; i < questionsData.length; i++) {
            const question = questionsData[i];

            answersData = answersData.concat(question.votes);
        }

        for (let i = 0; i < answersData.length; i++) {
            const answerData = answersData[i];

            const answer = new Answer();

            answer.setFromDatabaseData(answerData);

            this.answers()[answer.id()] = answer;
        }
    }

    /**
     * Gives an answer to a question in the poll from given user.
     * Makes all needed modifications
     * to database and returns Answer object representing
     * the created answer.
     * If given answer data is not of acceptable format for the question,
     * does nothing and returns undefined.
     */
    async answer(
        questionId: string,
        answerData: IQuestion.AnswerData,
        user: User
    ): Promise<Answer | null> {
        pre(
            'poll has question',
            this.questions()[questionId] instanceof Question
        );

        if (this.userHasRightToAnswerPoll(user)) {
            const question = this.questions()[questionId];
            question.setDatabase(this.database());

            const answer = await question.answer(answerData, user);

            if (answer instanceof Answer) {
                this.answers()[answer.id()] = answer;
            }

            return answer;
        } else {
            return null;
        }
    }

    /**
     * Whether given user has a right to answer the poll.
     * A user might not have a right to answer if they
     * have already answered the poll, for example.
     */
    userHasRightToAnswerPoll(user: User): boolean {
        return true;
    }

    /**
     * Generates a new random string and sets
     * .publicId() with it.
     */
    generatePublicId(): void {
        this._publicId = uuidv4();
    }

    /**
     * Generates a new random string and sets
     * .privateId() with it.
     */
    generatePrivateId(): void {
        this._privateId = uuidv4();
    }

    /**
     * Data object of the Poll's information that
     * should be privately available only to someone
     * with editing access to the poll. For example,
     * the poll's owner.
     */
    privateDataObj(): IPolling.PollData {
        const result: IPolling.PollData = {
            id: this.id(),
            name: this.name(),
            publicId: this.publicId(),
            privateId: this.privateId(),
            type: this.type(),
            questions: this.questionsDataObjs(),
            answers: this.answersDataObjs()
        };

        if (this.owner() instanceof User) {
            result.owner = this.owner().publicDataObj();
        }

        return result;
    }

    /**
     * Data object of the Poll's information that
     * should be publically available to someone aware of
     * the poll's existence (i.e a voter).
     */
    publicDataObj(): IPolling.PollData {
        const result: IPolling.PollData = {
            id: this.id(),
            name: this.name(),
            publicId: this.publicId(),
            type: this.type(),
            questions: this.questionsDataObjs()
        };

        return result;
    }

    /**
     * Poll's questions as non-sensitive public data objects.
     */
    questionsDataObjs(): { [id: string]: IPolling.QuestionData } {
        const result: { [prop: string]: any } = {};

        for (const id in this.questions()) {
            const question = this.questions()[id];

            result[question.id()] = question.publicDataObj();
        }

        return result;
    }

    /**
     * Poll's answers as data objects. Contain sensitive information.
     * Contains the information of who the answerers are.
     */
    answersDataObjs(): { [id: string]: IPolling.AnswerData } {
        const result: { [prop: string]: any } = {};

        for (const id in this.answers()) {
            const answer = this.answers()[id];

            result[answer.id()] = answer.privateDataObj();
        }

        return result;
    }

    /**
     * Populates the Poll's questions with Questions made from
     * given data objects representing information for new questions.
     */
    setQuestionsFromRequests(requests: Array<IQuestion.QuestionRequest>): void {
        pre('requests is of type Array', Array.isArray(requests));

        pre(
            'poll has no questions set beforehand',
            Object.keys(this.questions()).length === 0
        );

        let id = 0;

        for (let i = 0; i < requests.length; i++) {
            const request = requests[i];
            const question = new MultiQuestion();

            question.setDatabase(this.database());
            question.setFromRequest(request);

            id++;

            this.questions()[id.toString()] = question;
        }
    }

    /**
     * Adds instance's information to database according to
     * a PollRequest request object and User, who is the owner of the poll.
     */
    async createInDatabaseFromRequest(
        request: IPolling.PollRequest,
        owner: User
    ): Promise<void> {
        this.setFromRequest(request, owner);
        this.generateIds();
        await this.createNewInDatabase();
    }

    /**
     * Sets the instance's information from a PollRequest request object.
     */
    setFromRequest(request: IPolling.PollRequest, owner: User): void {
        this.setOwner(owner);
        this.setName(request.name);
        this.setQuestionsFromRequests(request.questions);
    }

    /**
     * Generates new .privateId() and .publicId() for poll.
     */
    generateIds(): void {
        this.generatePrivateId();
        this.generatePublicId();
    }
}