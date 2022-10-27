import { PrismaClient } from '@prisma/client';
import { pre, post } from '../utils/designByContract';
import Answer from './Answer';
import * as IAnswer from './IAnswer';
import * as IQuestion from './IQuestion';

/**
 * Collection of Answer instances.
 */

export default class AnswerCollection {
    _answers: { [id: string]: Answer } = {};
    _database: PrismaClient;

    /** Database the collection is connected to. */

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

    /** Answers in the collection. */

    answers(): { [id: string]: Answer } {
        return this._answers;
    }

    /** Sets value of answers. */

    setAnswers(answers: { [id: string]: Answer }): void {
        pre('argument answers is of type object', typeof answers === 'object');

        this._answers = answers;

        post('_answers is answers', this._answers === answers);
    }

    /**
     * Creates new Answer instance from given database data object for answer
     * and adds it to poll's answers.
     */

    _addNewAnswerFromDatabaseData(answerData: IAnswer.DatabaseData): void {
        const answer = new Answer();

        answer.setFromDatabaseData(answerData);

        this.answers()[answer.id()] = answer;
    }

    /**
     * Extracts list of answer database objects from given
     * list of question database objects.
     */

    _answersDbDataFromQuestionsDbData(
        questionsData: Array<IQuestion.DatabaseData>
    ): Array<IAnswer.DatabaseData> {
        let answersData: Array<IAnswer.DatabaseData> = [];

        for (let i = 0; i < questionsData.length; i++) {
            const question = questionsData[i];

            if (Array.isArray(question.votes)) {
                answersData = answersData.concat(question.votes);
            }
        }

        return answersData;
    }

    constructor(database: PrismaClient) {
        this._database = database;
    }

    /**
     * Manually populates info of the collection's answers from question data
     * that's been retrieved from the database beforehand.
     */

    setFromQuestionsDatabaseData(
        questionsData: Array<IQuestion.DatabaseData>
    ): void {
        const answersData =
            this._answersDbDataFromQuestionsDbData(questionsData);

        this.setFromDatabaseData(answersData);
    }

    /**
     * Makes new Answers from given database data objects
     * and adds them to collection.
     */

    setFromDatabaseData(answersData: Array<IAnswer.DatabaseData>): void {
        for (let i = 0; i < answersData.length; i++) {
            this._addNewAnswerFromDatabaseData(answersData[i]);
        }
    }
}
