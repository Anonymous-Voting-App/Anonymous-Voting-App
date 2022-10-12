import { pre } from '../utils/designByContract';
import MultiQuestion from './MultiQuestion';
import * as IMultiQuestion from './IMultiQuestion';
import * as IMultiQuestionCollection from './IMultiQuestionCollection';
import QuestionCollection from './QuestionCollection';
import { PrismaClient } from '@prisma/client';

/**
 * Collection of MultiQuestion instances.
 */
export default class MultiQuestionCollection extends QuestionCollection {
    constructor(
        database: PrismaClient,
        questions?: { [id: string]: MultiQuestion }
    ) {
        super(database, questions);
    }

    /**
     * Makes new MultiQuestion from given database data object
     * and adds it into collection.
     */

    _addNewMultiQuestionFromDatabaseData(
        questionData: IMultiQuestion.DatabaseData
    ): void {
        questionData.votes = [];

        const question = new MultiQuestion();
        question.setFromDatabaseData(questionData);

        this.questions()[questionData.id] = question;
    }

    /**
     * Creates in database a question in the collection
     * having given id.
     */

    async _createQuestionInDatabase(questionId: string): Promise<void> {
        const question = this.questions()[questionId];

        delete this.questions()[questionId];

        await question.createNewInDatabase();

        this.databaseData().push(question.databaseData());
        this.questions()[question.id()] = question;
    }

    /**
     * Populates collection with MultiQuestions according
     * to given array of data objects retrieved
     * from database.
     */
    setFromDatabaseObj(
        questionsData: Array<IMultiQuestion.DatabaseData>
    ): void {
        super.setFromDatabaseObj(questionsData);

        for (let i = 0; i < questionsData.length; i++) {
            this._addNewMultiQuestionFromDatabaseData(questionsData[i]);
        }
    }

    /**
     * Query object to use when wanting to find
     * the question collection in database.
     */

    findSelfFromDatabaseQuery(): IMultiQuestionCollection.FindSelfDbQuery {
        return {
            where: {
                pollId: this.pollId()
            },
            include: {
                options: true
            }
        };
    }

    /**
     * Retrieves questions from database and
     * populates the collection with according MultiQuestion instances.
     */
    async loadFromDatabase(): Promise<Array<IMultiQuestion.DatabaseData>> {
        pre(
            'question collection is empty',
            Object.keys(this.questions()).length == 0
        );

        const questionsData: Array<IMultiQuestion.DatabaseData> =
            await this.database().question.findMany(
                this.findSelfFromDatabaseQuery()
            );

        this.setFromDatabaseObj(questionsData);

        return questionsData;
    }

    /**
     * Adds information to database according
     * to the information present in this collection's instances.
     */
    async createNewInDatabase(): Promise<void> {
        pre('database is set', typeof this.database() === 'object');

        pre(
            'there is at least one question',
            Object.keys(this.questions()).length > 0
        );

        for (const id in this.questions()) {
            await this._createQuestionInDatabase(id);
        }
    }
}
