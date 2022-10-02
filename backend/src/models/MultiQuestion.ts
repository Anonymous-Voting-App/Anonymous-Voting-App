import { pre, post } from '../utils/designByContract';
import Answer from './Answer';
import Question from './Question';
import User from './User';
import * as IPolling from './IPolling';
import * as IMultiQuestion from './IMultiQuestion';
import { PrismaClient } from '@prisma/client';

/**
 * A Question that can have sub-questions.
 */
export default class MultiQuestion extends Question {
    _type = 'multi';
    _subQuestions: { [id: string]: Question } = {};

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

    constructor(database?: PrismaClient) {
        super(database);
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
            const subQuestion = this.subQuestions()[id];

            delete this.subQuestions()[id];

            await subQuestion.createNewInDatabaseAsOption(this.id());

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
        return super.newDatabaseObject();
    }

    /**
     * Sets instance's properties from given question object
     * received from the database.
     */
    setFromDatabaseData(questionData: IMultiQuestion.QuestionData): void {
        super.setFromDatabaseData(questionData);

        if (Array.isArray(questionData.options)) {
            for (let i = 0; i < questionData.options.length; i++) {
                const optionData = questionData.options[i];
                const subQuestion = new Question();

                subQuestion.setFromOptionData(optionData);

                this.subQuestions()[subQuestion.id()] = subQuestion;
            }
        }
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
        answerer: User
    ): Promise<null | Answer> {
        pre('answerData is of type object', typeof answerData === 'object');
        pre('answerer is of type User', answerer instanceof User);

        if (this.answerDataIsAcceptable(answerData)) {
            const subQuestion = this.subQuestions()[answerData.subQuestionId];

            subQuestion.setDatabase(this.database());

            const answer = await subQuestion.answerAsOption(
                answerData.answer,
                answerer,
                this.id()
            );

            if (answer instanceof Answer) {
                this.answers()[answer.id()] = answer;
            }

            return answer;
        }

        return null;
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

        pre(
            'answerData.answer is of type object',
            typeof answerData.answer === 'object'
        );

        let result = false;

        if (typeof answerData.subQuestionId === 'string') {
            const subQuestion = this.subQuestions()[answerData.subQuestionId];

            if (subQuestion instanceof Question) {
                result = subQuestion.answerDataIsAcceptable(answerData.answer);
            }
        }

        return result;
    }

    /**
     * A data object of the question's non-sensitive public information.
     */
    publicDataObj(): IPolling.MultiQuestionData {
        const result = super.publicDataObj() as IPolling.MultiQuestionData;

        result.subQuestions = {};

        for (const id in this.subQuestions()) {
            const question = this.subQuestions()[id];
            result.subQuestions[question.id()] = question.publicDataObj();
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
        super.setFromRequest(request);

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

        for (let i = 0; i < subQuestions.length; i++) {
            const subQuestionData = subQuestions[i];
            const subQuestion = new Question();

            subQuestion.setDatabase(this.database());
            subQuestion.setFromRequest(subQuestionData);

            this.subQuestions()[subQuestion.id()] = subQuestion;
        }
    }
}
