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
    _type = 'free';
    _id = '';
    _pollId = '';
    _database!: PrismaClient;
    _answers: { [id: string]: Answer } = {};
    _databaseData!: IQuestion.DatabaseData;
    _parentId = '';
    _answerCount = 0;
    _answerPercentage = 1;
    _visualType!: string;
    _parentAnswerCount = 0;

    /**
     * How many times the parent of the question has been answered.
     * For a question with no multi-question owning it, the parent is the poll.
     */

    parentAnswerCount(): number {
        return this._parentAnswerCount;
    }

    /** Sets value of parentAnswerCount. */

    setParentAnswerCount(parentAnswerCount: number): void {
        pre(
            'argument parentAnswerCount is of type number',
            typeof parentAnswerCount === 'number'
        );

        this._parentAnswerCount = parentAnswerCount;

        post(
            '_parentAnswerCount is parentAnswerCount',
            this._parentAnswerCount === parentAnswerCount
        );
    }

    /** Type property indicating what the question should look like in a UI. */

    visualType(): string {
        return this._visualType;
    }

    /** Sets value of visualType. */

    setVisualType(visualType: string): void {
        pre(
            'argument visualType is of type string',
            typeof visualType === 'string'
        );

        this._visualType = visualType;

        post('_visualType is visualType', this._visualType === visualType);
    }

    /** Ratio of the question's answers to its parent's answers. */

    answerPercentage(): number {
        return this._answerPercentage;
    }

    /** Sets value of answerPercentage. */

    setAnswerPercentage(answerPercentage: number): void {
        pre(
            'argument answerPercentage is of type number',
            typeof answerPercentage === 'number'
        );

        this._answerPercentage = answerPercentage;

        post(
            '_answerPercentage is answerPercentage',
            this._answerPercentage === answerPercentage
        );
    }

    /** How many times the question has been answered. */

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

    /** Id of possible parent Question of the Question. */

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
     * Makes new Answer from given database data
     * and adds it to the question's answers.
     */

    _setAnswerFromDatabaseData(answerData: IAnswer.DatabaseData): Answer {
        const answer = new Answer();

        answer.setFromDatabaseData(answerData);

        this.answers()[answer.id()] = answer;

        return answer;
    }

    /**
     * The ratio of answerCount to parentAnswerCount.
     * If parentAnswerCount is 0, returns 1.
     */

    _calculateAnswerPercentage(
        answerCount: number,
        parentAnswerCount: number
    ): number {
        return parentAnswerCount !== 0 ? answerCount / parentAnswerCount : 1;
    }

    /**
     * Sets the answerPercentage of the instance
     * as the ratio of answerCount to parentAnswerCount.
     * If parentAnswerCount is 0, answerPercentage is always 1.
     */

    _updateAnswerPercentage(): void {
        const percentage = this._calculateAnswerPercentage(
            this.answerCount(),
            this.parentAnswerCount()
        );

        this.setAnswerPercentage(percentage);
    }

    /**
     * Sets the answer count and percentage
     * of the question instance based on given answerCount.
     */

    _setOwnAnswerCounts(answerCount: number): void {
        this.setAnswerCount(answerCount);
        this._updateAnswerPercentage();
    }

    /**
     * Makes new Answer instances from given database data objects
     * and sets them as question's answers.
     */

    _setAnswersFromDatabaseData(
        answersData: Array<IAnswer.DatabaseData>
    ): void {
        let answerCount = this.answerCount();
        for (let i = 0; i < answersData.length; i++) {
            answerCount += this._setAnswerFromDatabaseData(
                answersData[i]
            ).count();
        }
        this._setOwnAnswerCounts(answerCount);
    }

    /**
     * Makes new answer from given data and
     * adds it as answer to question.
     */

    async _addNewAnswer(
        answerData: IQuestion.AnswerData,
        answerer: User,
        parentAnswerId?: string
    ): Promise<Answer> {
        const answer = this.makeAnswer(answerData, answerer, parentAnswerId);

        await answer.createNewInDatabase();

        this.answers()[answer.id()] = answer;

        return answer;
    }

    /**
     * Attemps to set Question's information
     * from database data. If given database data
     * is null, then it is inferred that the question was not found in
     * the database.
     */

    _tryToSetFromDatabaseData(
        databaseData: IQuestion.DatabaseData | null
    ): void {
        if (databaseData !== null) {
            this.setFromDatabaseData(databaseData);
        } else {
            throw new Error(
                `Question ${this.id()} could not be found in database.`
            );
        }
    }

    /**
     * Increments value at given property string in
     * given counts hash map by 1. The value does not need
     * to be set to 0 beforehand if it is undefined.
     */

    _countAnswerValue(counts: { [id: string]: number }, value: string): void {
        if (counts[value] === undefined) {
            counts[value] = 0;
        }

        counts[value]++;
    }

    /**
     * How many times each answer value of question
     * has been answered.
     */

    _answerValueCounts(): { [id: string]: number } {
        const result: { [id: string]: number } = {};

        for (const id in this.answers()) {
            const answer = this.answers()[id];

            this._countAnswerValue(result, answer.value().toString());
        }

        return result;
    }

    /**
     * Answer percentages for each answer value given in
     * answerCounts. Answer percentages are calculated
     * as the percentage of the answer value in relation to
     * the question's answerCount in total.
     */

    _answerValuePercentages(answerCounts: { [id: string]: number }): {
        [id: string]: number;
    } {
        const result: { [id: string]: number } = {};

        for (const value in answerCounts) {
            const answerCount = answerCounts[value];

            result[value] = this._calculateAnswerPercentage(
                answerCount,
                this.answerCount()
            );
        }

        return result;
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
        const result: IQuestion.NewQuestionData = {
            // A test type that is in the database already.
            // The schema demands some kind of typeId
            // even though question type are not currently used for anything.
            typeId: '7b76d1c6-8f40-4509-8317-ce444892b1ee',
            typeName: this.type(),
            pollId: this.pollId(),
            parentId: this.parentId().length > 0 ? this.parentId() : undefined,
            title: this.title(),
            description: this.description()
        };

        if (typeof this.visualType() === 'string') {
            result.visualType = this.visualType();
        }

        return result;
    }

    /**
     * Fetches and populates Question's information from database.
     */

    async loadFromDatabase(): Promise<void> {
        const databaseData = await this.database().question.findFirst({
            where: {
                id: this.id()
            }
        });

        this._tryToSetFromDatabaseData(databaseData);
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

        if (typeof questionData.title === 'string') {
            this.setTitle(questionData.title);
        }

        if (typeof questionData.description === 'string') {
            this.setDescription(questionData.description);
        }

        pre(
            'questionData.visualType is of type string',
            typeof questionData.visualType === 'string'
        );

        // Not actually ever a string. Just a quick fix so unit tests don't break.
        if (typeof questionData.type === 'string') {
            this.setType(questionData.type);
        }

        if (typeof questionData.parentId === 'string') {
            this.setParentId(questionData.parentId);
        }

        if (Array.isArray(questionData.votes)) {
            this._setAnswersFromDatabaseData(questionData.votes);
        } else {
            questionData.votes = [];
        }

        this.setId(questionData.id);
        this.setPollId(questionData.pollId);
        this.setType(questionData.typeName);
        this.setVisualType(questionData.visualType);

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

    makeAnswer(
        answerData: IQuestion.AnswerData,
        answerer: User,
        parentAnswerId?: string
    ): Answer {
        const answer = new Answer(this.database());

        answer.setFromRequest(answerData, answerer, this.id());
        answer.setQuestionId(this.id());

        if (typeof parentAnswerId === 'string') {
            answer.setParentId(parentAnswerId);
        }

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
        answerer: User,
        parentAnswerId?: string
    ): Promise<Answer | void> {
        pre('answerer is of type User', answerer instanceof User);
        if (this.answerDataIsAcceptable(answerData)) {
            return await this._addNewAnswer(
                answerData,
                answerer,
                parentAnswerId
            );
        } else {
            throw new Error('Answer data is not acceptable.');
        }
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
        return (
            typeof answerData === 'object' &&
            typeof answerData.answer === 'string'
        );
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
            visualType: this.visualType(),
            pollId: this.pollId()
        };
    }

    /**
     * Answer statistics for each value given as answer to the question.
     * If an answer value is missing from the returned statistics, then
     * that answer value has 0 answers given to it.
     */

    answerValueStatistics(): Array<IQuestion.AnswerValueStatistic> {
        const answerCounts = this._answerValueCounts();
        const answerPercentages = this._answerValuePercentages(answerCounts);

        const result: Array<IQuestion.AnswerValueStatistic> = [];

        for (const value in answerCounts) {
            result.push({
                value: value,
                count: answerCounts[value],
                percentage: answerPercentages[value]
            });
        }

        return result;
    }

    /**
     * Data object with the answer result statistics
     * of the question.
     */
    resultDataObj(): IQuestion.ResultData {
        return {
            id: this.id(),
            title: this.title(),
            description: this.description(),
            type: this.type(),
            visualType: this.visualType(),
            pollId: this.pollId(),
            answerCount: this.answerCount(),
            answerPercentage: this.answerPercentage(),
            answerValueStatistics: this.answerValueStatistics()
        };
    }

    /**
     * Populates the Question's fields data from
     * given data object representing information for a new question.
     */
    setFromRequest(request: IQuestion.QuestionRequest): void {
        this.setType(request.type);
        this.setTitle(request.title);
        this.setDescription(request.description);

        if (typeof request.visualType === 'string') {
            this.setVisualType(request.visualType);
        }
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

    /**
     * How many answers given to the question have the given value.
     */

    countAnswersWithValue(value: string): number {
        let result = 0;

        for (const id in this.answers()) {
            const answer = this.answers()[id];

            if (answer.value() === value) {
                result++;
            }
        }

        return result;
    }
}
