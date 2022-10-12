import { pre, post } from '../utils/designByContract';
import User from './/User';
import Answer from './Answer';
import * as IPolling from './IPolling';
import * as IQuestion from './IQuestion';
import * as IAnswer from './IAnswer';
import { PrismaClient } from '@prisma/client';

/**
 * A question that a Poll can have. Connected to Prisma database.
 * Different question types so far are: multichoice.
 * A user can .answer() the question to give their answer to it,
 * modifying the database.
 */
export default class Question {
    _title = '';
    _description = '';
    _type = '';
    _id = '';
    _pollId = '';
    _database!: PrismaClient;
    _answers: { [id: string]: Answer } = {};
    _databaseData!: IQuestion.DatabaseData;

    /** Latest database data object. Updated whenever .setFromDatabaseData() is called. */
    databaseData(): IQuestion.DatabaseData {
        return this._databaseData;
    }

    /** Sets value of databaseData. */
    setDatabaseData(databaseData: IQuestion.DatabaseData): void {
        pre(
            'argument databaseData is of type object',
            typeof databaseData === 'object'
        );

        this._databaseData = databaseData;

        post(
            '_databaseData is databaseData',
            this._databaseData === databaseData
        );
    }

    /** Answers that have been given to the question. */
    answers(): { [id: string]: Answer } {
        return this._answers;
    }

    /** Sets value of answers. */
    setAnswers(answers: { [id: string]: Answer }): void {
        pre('argument answers is of type object', typeof answers === 'object');

        this._answers = answers;

        post('_answers is answers', this._answers === answers);
    }

    /** Prisma database the instance is connected to. */
    database(): PrismaClient {
        return this._database;
    }

    /** Sets value of database. */
    setDatabase(database: PrismaClient): void {
        //pre("argument database is of type PrismaClient", database instanceof PrismaClient);

        this._database = database;

        post('_database is database', this._database === database);
    }

    /** Unique database id of the poll the question is for. */
    pollId(): string {
        return this._pollId;
    }

    /** Sets value of pollId. */
    setPollId(pollId: string): void {
        pre('argument pollId is of type string', typeof pollId === 'string');

        this._pollId = pollId;

        post('_pollId is pollId', this._pollId === pollId);
    }

    /** Unique database id of the question. */
    id(): string {
        return this._id;
    }

    /** Sets value of id. */
    setId(id: string): void {
        pre('argument id is of type string', typeof id === 'string');

        this._id = id;

        post('_id is id', this._id === id);
    }

    /** Type of the question. The Question class is a generic
     * question that can take any freeform answer string.
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

    /** Description of the question describing the question
     * to a user.
     */
    description(): string {
        return this._description;
    }

    /** Sets value of description. */
    setDescription(description: string): void {
        pre(
            'argument description is of type string',
            typeof description === 'string'
        );

        this._description = description;

        post('_description is description', this._description === description);
    }

    /** Title or name of the question. */
    title(): string {
        return this._title;
    }

    /** Sets value of title. */
    setTitle(title: string): void {
        pre('argument title is of type string', typeof title === 'string');

        this._title = title;

        post('_title is title', this._title === title);
    }

    /**
     * Makes new Answer instances from given database data objects
     * and sets them as question's answers.
     */

    _setAnswersFromDatabaseData(
        answersData: Array<IAnswer.DatabaseData>
    ): void {
        for (let i = 0; i < answersData.length; i++) {
            const answerData = answersData[i];
            const answer = new Answer();

            answer.setFromDatabaseData(answerData);

            this.answers()[answer.id()] = answer;
        }
    }

    /**
     * Makes new answer from given data and
     * adds it as answer to question.
     */

    async _addNewAnswer(
        answerData: IQuestion.AnswerData,
        answerer: User,
        parentId?: string
    ): Promise<Answer> {
        const answer = this.makeAnswer(answerData, answerer);

        answer.setQuestionId(
            typeof parentId === 'string' ? parentId : this.id()
        );

        await answer.createNewInDatabase();

        this.answers()[answer.id()] = answer;

        return answer;
    }

    constructor(database?: PrismaClient) {
        if (typeof database === 'object') {
            this._database = database;
        }
    }

    /**
     * Adds instance's information to database.
     */
    async createNewInDatabase(): Promise<void> {
        pre('pollId is set', this.pollId().length > 0);

        const data = await this._database.question.create({
            data: this.newDatabaseObject()
        });

        this.setFromDatabaseData(data);
    }

    /**
     * Adds the question's information to the database as an option
     * into the option table.
     */
    async createNewInDatabaseAsOption(parentId: string): Promise<void> {
        pre('parentId is of type string', typeof parentId === 'string');

        pre('question is new', this.id().length == 0);

        const data = await this._database.option.create({
            data: this.newDatabaseObjectAsOption(parentId)
        });

        this.setFromOptionDatabaseData(data);
    }

    /**
     * Makes new object from the instance's info that can
     * be added to Prisma database.
     */
    newDatabaseObject(): IQuestion.NewQuestionData {
        return {
            // A test type that is in the database already.
            // The schema demands some kind of typeId
            // even though question type are not currently used for anything.
            typeId: '7b76d1c6-8f40-4509-8317-ce444892b1ee',
            pollId: this.pollId()
        };
    }

    /**
     * Sets instance's properties from given question object
     * received from the database.
     */
    setFromDatabaseData(questionData: IQuestion.DatabaseData): void {
        pre('questionData is of type object', typeof questionData === 'object');

        pre(
            'questionData.id is of type string',
            typeof questionData.id === 'string'
        );

        pre(
            'questionData.pollId is of type string',
            typeof questionData.pollId === 'string'
        );

        this.setId(questionData.id);

        if (typeof questionData.title === 'string') {
            this.setTitle(questionData.title);
        }

        if (typeof questionData.description === 'string') {
            this.setDescription(questionData.description);
        }

        this.setPollId(questionData.pollId);

        // Not actually ever a string. Just a quick fix so unit tests don't break.
        if (typeof questionData.type === 'string') {
            this.setType(questionData.type);
        }

        if (Array.isArray(questionData.votes)) {
            this._setAnswersFromDatabaseData(questionData.votes);
        } else {
            questionData.votes = [];
        }

        this.setDatabaseData(questionData);
    }

    /**
     * Sets the instance's information from an option object
     * received from the option database table.
     */
    setFromOptionDatabaseData(optionData: IQuestion.OptionData): void {
        pre('optionData is of type object', typeof optionData === 'object');

        pre(
            'optionData.id is of type string',
            typeof optionData.id === 'string'
        );

        pre(
            'optionData.questionId is of type string',
            typeof optionData.questionId === 'string'
        );

        this.setId(optionData.id);
    }

    /**
     * Creates new Answer for question
     * with given data. The question id of the Answer
     * is set to this question's id.
     */

    makeAnswer(answerData: IQuestion.AnswerData, answerer: User): Answer {
        const answer = new Answer();

        answer.setDatabase(this._database);
        answer.setQuestionId(this.id());
        answer.setValue(answerData.answer);
        answer.setAnswerer(answerer);

        return answer;
    }

    /**
     * Gives an answer to the question from given user.
     * Makes all needed modifications
     * to database and returns Answer object representing
     * the created answer.
     * If given answer data is not of acceptable format for the question,
     * does nothing and returns undefined.
     */
    async answer(
        answerData: IQuestion.AnswerData,
        answerer: User
    ): Promise<Answer | null> {
        pre('answerData is of type object', typeof answerData === 'object');
        pre('answerer is of type User', answerer instanceof User);

        if (this.answerDataIsAcceptable(answerData)) {
            return this._addNewAnswer(answerData, answerer);
        }

        throw new Error('Error: Answer data is not acceptable.');
    }

    /**
     * Gives an answer to the question but
     * treating the answer instance in the database
     * through the 'option' table.
     */
    async answerAsOption(
        answerData: IQuestion.AnswerData,
        answerer: User,
        parentId: string
    ): Promise<Answer> {
        pre('answerData is of type object', typeof answerData === 'object');

        pre('answerer is of type User', answerer instanceof User);

        if (this.answerDataIsAcceptable(answerData)) {
            return this._addNewAnswer(answerData, answerer, parentId);
        }

        throw new Error('Error: Answer data is not acceptable.');
    }

    /**
     * Whether given answer data is of acceptable format.
     * In other words, whether the given answer is really an
     * answer to the question. In the Question base class, any kind
     * of answer (except undefined) is accepted but inheriting sub-classes are
     * allowed to set their own criteria. The variable type of
     * answerData.answer is also left up to inheriting sub-classes to restrict
     * if they so wish.
     */
    answerDataIsAcceptable(answerData: IQuestion.AnswerData): boolean {
        pre('answerData is of type object', typeof answerData === 'object');

        return answerData.answer !== undefined;
    }

    /**
     * A data object of the question's non-sensitive public information.
     */
    publicDataObj(): IPolling.QuestionData {
        return {
            id: this.id(),
            title: this.title(),
            description: this.description(),
            type: this.type(),
            pollId: this.pollId()
        };
    }

    /**
     * Populates the Question's fields data from
     * given data object representing information for a new question.
     */
    setFromRequest(request: IQuestion.QuestionRequest): void {
        this.setTitle(request.title);
        this.setDescription(request.description);
    }

    /**
     * A new object that can be added to database with this instance's information.
     * Has the form required for adding to the option table.
     */
    newDatabaseObjectAsOption(parentId: string): IQuestion.NewOptionData {
        return {
            option: this.title(),
            questionId: parentId
        };
    }

    /**
     * Sets the instance's information from an object
     * receive from the option database table.
     */
    setFromOptionData(optionData: IQuestion.QuestionDataOptions): void {
        pre('optionData is of type object', typeof optionData === 'object');

        pre(
            'optionData.option is of type string',
            typeof optionData.option === 'string'
        );

        pre(
            'optionData.id is of type string',
            typeof optionData.id === 'string'
        );

        this.setTitle(optionData.option);
        this.setId(optionData.id);
    }
}
