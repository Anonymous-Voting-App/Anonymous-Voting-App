import { pre } from '../utils/designByContract';
import MultiQuestion from './MultiQuestion';
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
     * Populates collection with MultiQuestions according
     * to given array of data objects retrieved
     * from database.
     */
    setFromDatabaseObj(questionsData: Array<any>): void {
        super.setFromDatabaseObj(questionsData);

        for (let i = 0; i < questionsData.length; i++) {
            const questionData = questionsData[i];
            questionData.votes = [];

            const question = new MultiQuestion();
            question.setFromDatabaseData(questionData);

            this.questions()[questionData.id] = question;
        }
    }

    /**
     * Retrieves questions from database and
     * populates the collection with according MultiQuestion instances.
     */
    async loadFromDatabase(): Promise<{ [prop: string]: any }> {
        pre(
            'question collection is empty',
            Object.keys(this.questions()).length == 0
        );

        const questionsData = await this.database().question.findMany({
            where: {
                pollId: this.pollId()
            },
            include: {
                options: true
            }
        });

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
            const question = this.questions()[id];

            delete this.questions()[id];

            await question.createNewInDatabase();

            this.databaseData().push(question.databaseData());
            this.questions()[question.id()] = question;
        }
    }
}
