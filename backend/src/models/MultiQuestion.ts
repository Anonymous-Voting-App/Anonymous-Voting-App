import { pre, post } from '../utils/designByContract';
import Question from './Question';
import User from './user/User';
import * as IPolling from './IPolling';
import * as IQuestion from './IQuestion';
import * as IMultiQuestion from './IMultiQuestion';
import { PrismaClient } from '@prisma/client';
import Answer from './Answer';
import BadRequestError from '../utils/badRequestError';
import QuestionFactory from './QuestionFactory';
import Fingerprint from './user/Fingerprint';

/**
 * A Question that can have sub-questions.
 */
export default class MultiQuestion extends Question {
    _type = 'multi';
    _subQuestions: { [id: string]: Question } = {};
    _minAnswers = 1;
    _maxAnswers = 1;
    _factory: QuestionFactory;

    /**  */

    factory(): QuestionFactory {
        return this._factory;
    }

    /** Sets value of factory. */

    setFactory(factory: QuestionFactory): void {
        pre(
            'factory is of type QuestionFactory',
            factory instanceof QuestionFactory
        );

        this._factory = factory;

        post('_factory is factory', this._factory === factory);
    }

    /**
     * Maximum amount of sub-answers the question can
     * at most take in a single answer. Setting this to -1
     * will mean there is no maximum.
     */

    maxAnswers(): number {
        return this._maxAnswers;
    }

    /** Sets value of maxAnswers. */

    setMaxAnswers(maxAnswers: number): void {
        pre(
            'argument maxAnswers is of type number',
            typeof maxAnswers === 'number'
        );

        this._maxAnswers = maxAnswers;

        post('_maxAnswers is maxAnswers', this._maxAnswers === maxAnswers);
    }

    /**
     * Minimum amount of sub-answers the question will
     * accept in a single answer. Setting this to -1 will mean
     * there is no minimum.
     */

    minAnswers(): number {
        return this._minAnswers;
    }

    /** Sets value of minAnswers. */

    setMinAnswers(minAnswers: number): void {
        pre(
            'argument minAnswers is of type number',
            typeof minAnswers === 'number'
        );

        this._minAnswers = minAnswers;

        post('_minAnswers is minAnswers', this._minAnswers === minAnswers);
    }

    /** Sub-questions of the instance. */
    subQuestions(): { [id: string]: Question } {
        return this._subQuestions;
    }

    /** Sets value of subQuestions. */
    setSubQuestions(subQuestions: { [id: string]: Question }): void {
        pre(
            'argument subQuestions is of type object',
            typeof subQuestions === 'object'
        );

        this._subQuestions = subQuestions;

        post(
            '_subQuestions is subQuestions',
            this._subQuestions === subQuestions
        );
    }

    /**
     * Makes new Question instances with data according to given
     * array of question database objects.
     */
    _setSubQuestionsFromDatabaseOptions(
        options: Array<IQuestion.QuestionDataOptions>
    ): void {
        for (let i = 0; i < options.length; i++) {
            const optionData = options[i];
            const subQuestion = new Question();

            subQuestion.setFromOptionData(optionData);

            this.subQuestions()[subQuestion.id()] = subQuestion;
        }
    }

    /**
     * Makes sub-Questions from given database data
     * and adds them as sub-questions. Assumes that the MultiQuestion's
     * own info has been set beforehand.
     */

    _setSubQuestionsFromDatabaseData(
        subQuestions: Array<IQuestion.DatabaseData>
    ): void {
        for (let i = 0; i < subQuestions.length; i++) {
            const subQuestion = this._factory.createFromType(
                subQuestions[i].typeName,
                subQuestions[i]
            );

            subQuestion.setParentAnswerCount(this.answerCount());
            subQuestion.setFromDatabaseData(subQuestions[i]);

            this.subQuestions()[subQuestion.id()] = subQuestion;
        }
    }

    /**
     * Gives an answer to a sub-question of the multi-question.
     */
    async _answerSubQuestion(
        subQuestion: Question,
        answerData: IQuestion.AnswerData,
        answerer: Fingerprint,
        ownAnswerId: string
    ): Promise<void> {
        await subQuestion.answer(answerData, answerer, ownAnswerId);
    }

    /**
     * Gives answers to all given sub-questions according
     * to corresponding answer data given.
     */

    async _answerSubQuestions(
        subQuestions: Array<Question>,
        answerData: IMultiQuestion.AnswerData,
        answerer: Fingerprint,
        ownAnswerId: string
    ): Promise<void> {
        for (let i = 0; i < subQuestions.length; i++) {
            await this._answerSubQuestion(
                subQuestions[i],
                answerData.answer[i],
                answerer,
                ownAnswerId
            );
        }
    }

    /**
     * All sub-questions having given ids.
     */

    _gatherSubQuestions(subQuestionIds: Array<string>): Array<Question> {
        const subQuestions: Array<Question> = [];

        for (let i = 0; i < subQuestionIds.length; i++) {
            const subQuestion = this.subQuestions()[subQuestionIds[i]];

            subQuestion.setDatabase(this.database());

            subQuestions.push(subQuestion);
        }

        return subQuestions;
    }

    /**
     * Answers the multi-question without regarding
     * sub-questions.
     */

    async _answerOwnQuestion(
        answerData: IMultiQuestion.AnswerData,
        answerer: Fingerprint
    ): Promise<Answer> {
        answerData = Object.assign({}, answerData);

        return (await super.answer(answerData, answerer)) as Answer;
    }

    /**
     * Answer the multi-question with data assumed
     * to be in acceptable format.
     */
    async _answerWithAcceptableData(
        answerData: IMultiQuestion.AnswerData,
        answerer: Fingerprint
    ): Promise<void> {
        const subQuestions = this._gatherSubQuestions(
            answerData.subQuestionIds
        );

        const ownAnswer = await this._answerOwnQuestion(answerData, answerer);

        await this._answerSubQuestions(
            subQuestions,
            answerData,
            answerer,
            ownAnswer.id()
        );
    }

    /**
     * Whether answer data is acceptable
     * to sub-question of multi-question.
     */

    _subQuestionAnswerDataIsAcceptable(
        subQuestionId: string,
        answer: IQuestion.AnswerData
    ): boolean {
        let result = false;

        const subQuestion = this.subQuestions()[subQuestionId];

        if (subQuestion instanceof Question) {
            result = subQuestion.answerDataIsAcceptable(answer);
        }

        return result;
    }

    /**
     * Whether the given answer data objects are
     * acceptable to all sub-questions having given sub-question ids.
     * The order of the sub-question ids should be the same as
     * the answer objects.
     */

    _answerDataIsAcceptableToSubQuestions(
        subQuestionIds: Array<string>,
        answer: Array<IQuestion.AnswerData>
    ): boolean {
        for (let i = 0; i < subQuestionIds.length; i++) {
            const subQuestionId = subQuestionIds[i];

            if (
                !this._subQuestionAnswerDataIsAcceptable(
                    subQuestionId,
                    answer[i]
                )
            ) {
                return false;
            }
        }

        return true;
    }

    /**
     * Makes new Question instance from given request data object
     * and adds it as a sub-question.
     */
    _setSubQuestionFromRequest(
        id: number,
        subQuestionData: IMultiQuestion.QuestionRequest
    ): void {
        const subQuestion = this._factory.createFromType(
            subQuestionData.type,
            subQuestionData
        );

        subQuestion.setDatabase(this.database());
        subQuestion.setFromRequest(subQuestionData);

        this.subQuestions()[id.toString()] = subQuestion;
    }

    /**
     * Whether given answerData is acceptable to the multi-question
     * without taking into consideration the sub-questions.
     */

    _answerDataIsAcceptableToMultiQuestion(
        answerData: IMultiQuestion.AnswerData
    ): boolean {
        return (
            Array.isArray(answerData.subQuestionIds) &&
            Array.isArray(answerData.answer) &&
            answerData.subQuestionIds.length === answerData.answer.length &&
            this.amountOfAnswersIsAcceptable(
                answerData.subQuestionIds.length
            ) &&
            this.hasSubQuestionIds(answerData.subQuestionIds)
        );
    }

    /**
     * Sub-Question of the multi-question
     * with needed properties instantiated
     * for use as a sub-question.
     */

    _getPreparedSubQuestion(id: string): Question {
        const subQuestion = this.subQuestions()[id];

        subQuestion.setPollId(this.pollId());

        subQuestion.setParentId(this.id());

        subQuestion.setDatabase(this.database());

        return subQuestion;
    }

    constructor(database: PrismaClient) {
        super(database);
        this._factory = new QuestionFactory(database);
    }

    /**
     * Whether the instance has any sub-questions.
     */
    hasSubQuestions(): boolean {
        return Object.keys(this.subQuestions()).length > 0;
    }

    /**
     * Adds all information about the MultiQuestion instance's
     * sub-questions into database and updates all the instance's sub-questions' information
     * afterwards to match the database.
     */
    async createSubQuestionsInDatabase(): Promise<void> {
        for (const id in this.subQuestions()) {
            const subQuestion = this._getPreparedSubQuestion(id);

            delete this.subQuestions()[id];

            await subQuestion.createNewInDatabase();

            this.subQuestions()[subQuestion.id()] = subQuestion;
        }
    }

    /**
     * Adds all information about the MultiQuestion instance
     * into database and updates all the instance's information
     * afterwards to match the database.
     */
    async createNewInDatabase(): Promise<void> {
        await super.createNewInDatabase();

        if (this.hasSubQuestions()) {
            await this.createSubQuestionsInDatabase();
        }
    }

    /**
     * Makes new object from the instance's info that can
     * be added to Prisma database.
     */
    newDatabaseObject(): IMultiQuestion.NewQuestionData {
        const obj = super.newDatabaseObject();

        obj.minValue = this.minAnswers();
        obj.maxValue = this.maxAnswers();

        return obj;
    }

    /**
     * Sets instance's properties from given question object
     * received from the database.
     */
    setFromDatabaseData(questionData: IMultiQuestion.DatabaseData): void {
        super.setFromDatabaseData(questionData);

        this.setMinAnswers(questionData.minValue as number);
        this.setMaxAnswers(questionData.maxValue as number);

        if (Array.isArray(questionData.subQuestions)) {
            this._setSubQuestionsFromDatabaseData(questionData.subQuestions);
        }
    }

    /**
     * Whether multi-question has sub-questions with corresponding
     * ids.
     */

    hasSubQuestionIds(subQuestionIds: Array<string>): boolean {
        for (let i = 0; i < subQuestionIds.length; i++) {
            const subQuestionId = subQuestionIds[i];

            if (!(this.subQuestions()[subQuestionId] instanceof Question)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Gives an answer to the question from given user.
     * Makes all needed modifications
     * to database and returns Answer object representing
     * the created answer.
     * If given answer data is not of acceptable format for the question,
     * does nothing and returns undefined.
     * Answers sub-question with id of answerData.subQuestionId.
     */
    async answer(
        answerData: IMultiQuestion.AnswerData,
        answerer: Fingerprint
    ): Promise<void> {
        pre('answerData is of type object', typeof answerData === 'object');
        pre('answerer is of type Fingerprint', answerer instanceof Fingerprint);
        pre(
            'sub-questions with given ids exist',
            this.hasSubQuestionIds(answerData.subQuestionIds)
        );

        if (this.answerDataIsAcceptable(answerData)) {
            await this._answerWithAcceptableData(answerData, answerer);
        } else {
            throw new BadRequestError('Invalid answer data.');
        }
    }

    /**
     * Whether the multi-question has maximum amount
     * of answers set. Maximum of -1 means maximum is not set.
     */

    hasMaxAnswers(): boolean {
        return this.maxAnswers() >= 0;
    }

    /**
     * Whether the multi-question has minimum amount
     * of answers set. Minimum of -1 means maximum is not set.
     */

    hasMinAnswers(): boolean {
        return this.minAnswers() >= 0;
    }

    /**
     * Whether the amount of answers given is acceptable
     * according to the set minAnswers and maxAnswers of
     * the instance.
     */

    amountOfAnswersIsAcceptable(amountOfAnswers: number): boolean {
        if (this.hasMaxAnswers()) {
            if (this.hasMinAnswers()) {
                return (
                    amountOfAnswers >= this.minAnswers() &&
                    amountOfAnswers <= this.maxAnswers()
                );
            } else {
                return amountOfAnswers <= this.maxAnswers();
            }
        } else {
            if (this.hasMinAnswers()) {
                return amountOfAnswers >= this.minAnswers();
            } else {
                return true;
            }
        }
    }

    /**
     * Whether given answer data is of acceptable format.
     * In other words, whether the given answer is really an
     * answer to the question. To multi-questions
     * answerData.answer is the answer data to the sub-question indicated by
     * answerData.subQuestionId. If answerData.subQuestionId is
     * not a valid sub-question id, answer data is not acceptable.
     * The data given in answerData.answer is
     * passed to the sub-question to validate.
     */
    answerDataIsAcceptable(answerData: IMultiQuestion.AnswerData): boolean {
        pre('answerData is of type object', typeof answerData === 'object');

        let result = false;

        if (this._answerDataIsAcceptableToMultiQuestion(answerData)) {
            result = this._answerDataIsAcceptableToSubQuestions(
                answerData.subQuestionIds,
                answerData.answer
            );
        }

        return result;
    }

    /**
     * A data object of the question's non-sensitive public information.
     */
    publicDataObj(): IPolling.MultiQuestionData {
        const result = super.publicDataObj() as IPolling.MultiQuestionData;

        result.minAnswers = this.minAnswers();
        result.maxAnswers = this.maxAnswers();

        result.subQuestions = [];

        for (const id in this.subQuestions()) {
            const question = this.subQuestions()[id];
            result.subQuestions.push(question.publicDataObj());
        }

        return result;
    }

    /**
     * How many sub-questions the MultiQuestion has.
     */
    countSubQuestions(): number {
        return Object.keys(this.subQuestions()).length;
    }

    /**
     * Populates the Question's fields data from
     * given data object representing information for a new question.
     */
    setFromRequest(request: IMultiQuestion.QuestionRequest): void {
        pre(
            'request.minAnswers is of type number',
            typeof request.minAnswers === 'number'
        );
        pre(
            'request.maxAnswers is of type number',
            typeof request.maxAnswers === 'number'
        );

        super.setFromRequest(request);

        this.setMinAnswers(request.minAnswers as number);
        this.setMaxAnswers(request.maxAnswers as number);

        if (Array.isArray(request.subQuestions)) {
            this.setSubQuestionsFromRequest(request.subQuestions);
        }
    }

    /**
     * Populates the instance with sub-question Question instances
     * according to given array of question request information.
     */
    setSubQuestionsFromRequest(
        subQuestions: Array<IMultiQuestion.QuestionRequest>
    ): void {
        pre('subQuestions is of type Array', Array.isArray(subQuestions));

        let id = 0;

        for (let i = 0; i < subQuestions.length; i++) {
            this._setSubQuestionFromRequest(id, subQuestions[i]);
            id++;
        }
    }

    /**
     * Answer result statistics of sub-questions.
     */

    subQuestionResultDataObjs(): Array<IQuestion.ResultData> {
        const dataObjs = [];

        for (const id in this.subQuestions()) {
            const subQuestion = this.subQuestions()[id];

            dataObjs.push(subQuestion.resultDataObj());
        }

        return dataObjs;
    }

    /**
     * Data object containing the answer result statistics
     * of the multi-question. Contains result statistics
     * for sub-questions as well.
     */

    resultDataObj(): IMultiQuestion.ResultData {
        const result = super.resultDataObj();

        result.subQuestions = this.subQuestionResultDataObjs();
        result.answerValueStatistics = [];

        return result as IMultiQuestion.ResultData;
    }
}
