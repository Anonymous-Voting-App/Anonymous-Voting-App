import { pre, post } from '../utils/designByContract';
import User from './user/User';
import Question from './Question';
import Answer from './Answer';
import * as IPolling from './IPolling';
import * as IPoll from './IPoll';
import * as IQuestion from './IQuestion';
import * as IUser from './user/IUser';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import QuestionFactory from './QuestionFactory';
import AnswerCollection from './AnswerCollection';
import QuestionCollection from './QuestionCollection';
import Fingerprint from './user/Fingerprint';
import ForbiddenError from '../utils/forbiddenError';

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
    _questionFactory: QuestionFactory;
    _answerCount = 0;
    _visualFlags: Array<string> = [  ];
	
	/**  */
	
	visualFlags(): Array<string> {
		
		return this._visualFlags;
		
	}
	
    /** Sets value of visualFlags. */
        
    setVisualFlags(visualFlags: Array<string>): void {
        
        pre("argument visualFlags is of type Array<string>", Array.isArray(visualFlags));
	
        this._visualFlags = visualFlags;
        
        post("_visualFlags is visualFlags", this._visualFlags === visualFlags);
        
    }

    /** How many times the poll has been answered. */

    answerCount(): number {
        return this._answerCount;
    }

    /** Sets value of answerCount. */

    setAnswerCount(answerCount: number): void {
        pre(
            'argument answerCount is of type number',
            typeof answerCount === 'number'
        );

        this._answerCount = answerCount;

        post('_answerCount is answerCount', this._answerCount === answerCount);
    }

    /** A QuestionFactory the Poll uses to create new Questions. */

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
     * Creates entry / entries with according info
     * for poll in database.
     */
    async _createPollInDatabase(): Promise<IPoll.DatabaseData> {
        return await this._database.poll.create({
            data: this.newDatabaseObject()
        });
    }

    /**
     * Creates poll's questions in database.
     */
    async _createQuestionsInDatabase(
        pollData: IPoll.DatabaseData
    ): Promise<Array<IQuestion.DatabaseData>> {
        const questions = new QuestionCollection(
            this.database(),
            this.questions() as { [id: string]: Question },
            this.questionFactory()
        );

        questions.setPollId(pollData.id);
        await questions.createNewInDatabase();

        this.setQuestions(questions.questions());

        return questions.databaseData();
    }

    /**
     * Saves Answer as poll's answer if not null.
     */

    _possiblySaveAnswer(answer: Answer | null): void {
        if (answer instanceof Answer) {
            this.answers()[answer.id()] = answer;
        }
    }

    /**
     * Answers poll with no answer rights checks.
     * The user is assumed to have the right to answer the poll.
     */

    async _answerWithRights(
        questionId: string,
        answerData: IQuestion.AnswerData,
        answerer: Fingerprint
    ): Promise<void> {
        const question = this.questions()[questionId];
        question.setDatabase(this.database());

        await question.answer(answerData, answerer);
    }

    /**
     *
     */

    async _answerQuestionsWithRights(
        answers: Array<IQuestion.Answer>,
        answerer: Fingerprint
    ): Promise<void> {
        for (let i = 0; i < answers.length; i++) {
            const answer = answers[i];

            await this._answerWithRights(
                answer.questionId,
                answer.data,
                answerer
            );
        }
    }

    /**
     * Makes new MultiQuestion from given request object
     * and adds it to poll's questions.
     */

    _addNewQuestionFromRequest(
        request: IQuestion.QuestionRequest,
        id: number
    ): void {
        const question = this.questionFactory().createFromType(
            request.type,
            request
        );

        question.setDatabase(this.database());
        question.setFromRequest(request);

        this.questions()[id.toString()] = question;
    }

    /**
     * Sets the parentAnswerCount property of all
     * the poll's questions to be the poll's answerCount.
     */

    _setQuestionsParentAnswerCount(): void {
        for (const id in this.questions()) {
            const question = this.questions()[id];

            question.setParentAnswerCount(this.answerCount());
        }
    }

    /**
     * Makes new question from given database data
     * and adds it to the poll's questions.
     */

    _setQuestionFromDatabaseData(questionData: IQuestion.DatabaseData): void {
        // Question database data (questionData) is used here as an options object
        // to the factory. The database field names happen to match
        // with the options object interfaces. This should
        // be changed in the future in case the database objects become
        // different from the options objects.
        // - Joonas Halinen 17.10.2022
        const question = this.questionFactory().createFromType(
            questionData.typeName,
            questionData
        );

        question.setParentAnswerCount(this.answerCount());
        question.setFromDatabaseData(questionData);

        this.questions()[question.id()] = question;
    }

    /**
     * Whether given answer has corresponding question in
     * poll. If so, alreadyMatched is updated accordingly.
     * If alreadyMatched already contains the corresponding question id,
     * returns false.
     */

    _answerMatchesQuestion(
        alreadyMatched: { [questionId: string]: boolean },
        answer: IQuestion.Answer
    ): boolean {
        if (
            alreadyMatched[answer.questionId] !== true &&
            this.questions()[answer.questionId] instanceof Question
        ) {
            alreadyMatched[answer.questionId] = true;

            return true;
        } else {
            return false;
        }
    }

    /**
     * Whether given answers match the questions of this poll.
     * As in, whether for each of the answer there
     * exists a question in the poll with the same id.
     * Also demands that there are no duplicate answers for the
     * same question.
     */

    _answersMatchQuestions(answers: Array<IQuestion.Answer>): boolean {
        const alreadyMatched: { [questionId: string]: boolean } = {};

        for (let i = 0; i < answers.length; i++) {
            if (!this._answerMatchesQuestion(alreadyMatched, answers[i])) {
                return false;
            }
        }

        return true;
    }

    /**
     * Whether poll's question accepts given answer data.
     */

    _questionAcceptsAnswer(
        questionId: string,
        data: IQuestion.AnswerData
    ): boolean {
        const question = this.questions()[questionId];

        return question.answerDataIsAcceptable(data);
    }

    /**
     * Whether all poll's questions accept the
     * answer datas given.
     */

    _questionsAcceptAnswers(answers: Array<IQuestion.Answer>): boolean {
        for (let i = 0; i < answers.length; i++) {
            const answer = answers[i];

            if (!this._questionAcceptsAnswer(answer.questionId, answer.data)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Whether given array of answer objects is a valid
     * collection of answers for this poll. Only checks whether the question's
     * match the poll's questions adequately, does not check answer validity
     * for each question separately.
     */

    _answersIsValid(answers: Array<IQuestion.Answer>): boolean {
        if (answers.length !== Object.keys(this.questions()).length) {
            return false;
        }

        return (
            this._answersMatchQuestions(answers) &&
            this._questionsAcceptAnswers(answers)
        );
    }

    /**
     * Answers poll without checking if the answerer has right to answer.
     */

    async _answerPollWithRights(
        answers: Array<IQuestion.Answer>,
        answerer: Fingerprint
    ): Promise<void> {
        await answerer.ensureExistsInDatabase();
        await this._answerQuestionsWithRights(answers, answerer);
        await this.incrementAnswerCount();
    }

    /**
     * How many times the given answerer has answered
     * this poll in the database.
     */

    async _countUserAnswersInDb(answerer: Fingerprint): Promise<number> {
        return await this.database().vote.count({
            where: {
                AND: [{ voterId: answerer.id() }, { pollId: this.id() }]
            }
        });
    }

    constructor(database: PrismaClient, questionFactory: QuestionFactory) {
        pre('database is of type object', typeof database === 'object');

        this._database = database;
        this._questionFactory = questionFactory;
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
    newDatabaseObject(): IPoll.NewDatabaseObject {
        pre('name is set', this.name().length > 0);
        pre('privateId is set', this.privateId().length > 0);
        pre('publicId is set', this.publicId().length > 0);
        pre('owner is set', this.owner() instanceof User);
        pre('owner has v4 uuid', this.owner().hasV4Uuid());

        return {
            name: this.name(),
            adminLink: this.privateId(),
            pollLink: this.publicId(),
            resultLink: '',
            creatorId: this.owner().id(),
            visualFlags: this.visualFlags(  )
        };
    }

    /**
     * Query object inside where property to use
     * when trying to find this poll in database.
     */
    findSelfInDatabaseQuery(): IPoll.FindSelfInDbQuery {
        const subQueries: Array<{ [identifyingProp: string]: string }> = [];

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
     * Finds poll in database and returns found database object.
     */

    async findSelfInDatabase(): Promise<IPoll.DatabaseData | null> {
        return await this._database.poll.findFirst({
            where: this.findSelfInDatabaseQuery(),
            include: {
                questions: {
                    // The query right now probably does not support
                    // fetching sub-questions or sub-answers recursively for more than 1 level.
                    // - Joonas Halinen 16.10.2022
                    where: { parentId: null },
                    include: {
                        subQuestions: {
                            include: {
                                votes: true
                            }
                        },
                        votes: {
                            include: {
                                subVotes: true
                            }
                        }
                    }
                }
            }
        });
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

        const pollData = await this.findSelfInDatabase();

        if (pollData !== null) {
            this.setFromDatabaseData(pollData);

            this._loadedFromDatabase = true;
        }
    }

    /**
     * Makes new User from given database data
     * and sets it to be poll's owner.
     */

    setOwnerFromDatabaseData(ownerData: IUser.DatabaseData): void {
        if (typeof ownerData === 'object') {
            const owner = new User();

            owner.setFromDatabaseData(ownerData);

            this.setOwner(owner);
        }
    }

    /**
     * Manually populates info of the poll with data object
     * that's been retrieved from the database beforehand.
     */
    setFromDatabaseData(
        pollData: IPoll.DatabaseData,
        omitQuestions = false
    ): void {
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
        this.setOwnerFromDatabaseData(pollData);
        this.setPublicId(pollData.pollLink);
        this.setPrivateId(pollData.adminLink);
        this.setAnswerCount(pollData.answerCount);
        this.setVisualFlags( pollData.visualFlags );

        if (!omitQuestions) {
            this.setQuestionsFromDatabaseData(pollData.questions || []);
        }

        this.setAnswersFromDatabaseData(pollData.questions || []);
    }

    /**
     * Manually populates info of the poll's questions with data
     * that's been retrieved from the database beforehand.
     * The properties of Poll are assumed to have already been
     * set from database data.
     */
    setQuestionsFromDatabaseData(
        questionsData: Array<IQuestion.DatabaseData>
    ): void {
        for (let i = 0; i < questionsData.length; i++) {
            const questionData = questionsData[i];

            this._setQuestionFromDatabaseData(questionData);
        }
    }

    /**
     * Manually populates info of the poll's answers with data
     * that's been retrieved from the database beforehand.
     */
    setAnswersFromDatabaseData(
        questionsData: Array<IQuestion.DatabaseData>
    ): void {
        const answers = new AnswerCollection(this.database());

        answers.setFromQuestionsDatabaseData(questionsData);

        this.setAnswers(answers.answers());
    }

    /**
     * Answers all questions directly under the poll from given user.
     * Makes all needed modifications to database.
     * If answers is not acceptable to poll
     * or the poll's questions, does nothing and throws BadRequestError.
     */
    async answer(
        answers: Array<IQuestion.Answer>,
        answerer: Fingerprint
    ): Promise<void> {
        pre('given answers is valid', this._answersIsValid(answers));

        if (!(await this.hasBeenAnsweredBy(answerer))) {
            await this._answerPollWithRights(answers, answerer);
        } else {
            throw new ForbiddenError(
                `User does not have right to answer poll ${this.publicId()}.`
            );
        }
    }

    /**
     * Whether given user has answered the poll previously.
     */
    async hasBeenAnsweredBy(answerer: Fingerprint): Promise<boolean> {
        return false;

        // Disabled since we don't do any double-vote blocking
        // on the backend for now.
        // - Joonas Halinen 21.11.2022
        /* await answerer.loadFromDatabase();

        if (answerer.wasFoundInDatabase()) {
            return ( (await this._countUserAnswersInDb(answerer)) !== 0 );
        } else {
            return false;
        } */
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
            answers: this.answersDataObjs(),
            visualFlags: this.visualFlags(  )
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
            questions: this.questionsDataObjs(),
            visualFlags: this.visualFlags(  )
        };

        return result;
    }

    /**
     * Poll's questions as non-sensitive public data objects.
     */
    questionsDataObjs(): IPolling.QuestionData[] {
        const result: IPolling.QuestionData[] = [];

        for (const id in this.questions()) {
            const question = this.questions()[id];

            result.push(question.publicDataObj());
        }

        return result;
    }

    /**
     * Poll's answers as data objects. Contain sensitive information.
     * Contains the information of who the answerers are.
     */
    answersDataObjs(): IPolling.AnswerData[] {
        const result: IPolling.AnswerData[] = [];

        for (const id in this.answers()) {
            const answer = this.answers()[id];

            result.push(answer.privateDataObj());
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
            id++;

            this._addNewQuestionFromRequest(requests[i], id);
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
        if ( Array.isArray( request.visualFlags ) ) {
            this.setVisualFlags( request.visualFlags );
        }
        this.setQuestionsFromRequests(request.questions);
    }

    /**
     * Generates new .privateId() and .publicId() for poll.
     */
    generateIds(): void {
        this.generatePrivateId();
        this.generatePublicId();
    }

    /**
     * Answer result statistics for all the poll's questions.
     */

    questionsResultObjs(): Array<IQuestion.ResultData> {
        const result: IQuestion.ResultData[] = [];

        for (const id in this.questions()) {
            const question = this.questions()[id];

            result.push(question.resultDataObj());
        }

        return result;
    }

    /**
     * A data object containing the poll's answer result
     * statistics for the poll and its whole question tree.
     */

    resultDataObj(): IPolling.ResultData {
        const result: IPolling.ResultData = {
            name: this.name(),
            publicId: this.publicId(),
            type: this.type(),
            answerCount: this.answerCount(),
            questions: this.questionsResultObjs(),
            visualFlags: this.visualFlags(  )
        };

        return result;
    }

    /**
     * Increments the answerCount property of the instance
     * and in the database by 1.
     */

    async incrementAnswerCount(): Promise<void> {
        await this.database().poll.update({
            where: { id: this.id() },

            data: {
                answerCount: {
                    increment: 1
                }
            }
        });

        this.setAnswerCount(this.answerCount() + 1);
        this._setQuestionsParentAnswerCount();
    }
}
