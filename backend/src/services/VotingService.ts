import { pre, post } from '../utils/designByContract';
import User from '../models/user/User';
import Poll from '../models/Poll';
import * as IPolling from '../models/IPolling';
import * as IVotingService from './IVotingService';
import { PrismaClient } from '@prisma/client';
import QuestionFactory from '../models/QuestionFactory';
import Fingerprint from '../models/user/Fingerprint';
import DatabasedObjectCollection from '../models/database/DatabasedObjectCollection';

/**
 * Service of the anonymous voting app
 * offering all voting / polling functionalities.
 */
export default class VotingService {
    _database: PrismaClient;
    _questionFactory: QuestionFactory;

    /** A factory the service uses for creating new Questions. */

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

    /** Database the VotingService uses. */
    database(): PrismaClient {
        return this._database;
    }

    /** Sets value of database. */
    setDatabase(database: PrismaClient): void {
        this._database = database;

        post('_database is database', this._database === database);
    }

    /**
     * New Poll instance with given publicId and loaded
     * from database.
     */

    async _loadPollWithPublicId(publicId: string): Promise<Poll> {
        const poll = new Poll(this.database(), this.questionFactory());

        poll.setPublicId(publicId);

        await poll.loadFromDatabase();

        return poll;
    }

    /**
     * New Poll instance with given privateId and loaded
     * from database.
     */

    async _loadPollWithPrivateId(privateId: string): Promise<Poll> {
        const poll = new Poll(this.database(), this.questionFactory());

        poll.setPrivateId(privateId);

        await poll.loadFromDatabase();

        return poll;
    }

    /**
     * Answers a poll when poll is already assumed to exist.
     */

    async _answerExistingPoll(
        poll: Poll,
        answerData: IVotingService.AnswerData,
        userIdentity: Fingerprint
    ): Promise<void> {
        await poll.answer(answerData.answers, userIdentity);
    }

    constructor(database: PrismaClient, questionFactory: QuestionFactory) {
        pre('database is of type object', typeof database === 'object');

        this._database = database;
        this._questionFactory = questionFactory;
    }

    /**
     * Creates a new poll with given information.
     * If poll was created, returns created poll info.
     * If not, returns null.
     */
    async createPoll(
        pollOptions: IPolling.PollRequest,
        user: User
    ): Promise<IPolling.PollData | null> {
        pre('pollOptions is of type object', typeof pollOptions === 'object');
        pre(
            'pollOptions.name is of type string',
            typeof pollOptions.name === 'string'
        );
        pre(
            'pollOptions.type is of type string',
            typeof pollOptions.type === 'string'
        );
        pre(
            'pollOptions.questions is of type Array',
            Array.isArray(pollOptions.questions)
        );
        pre(
            'there is at least one question in the poll',
            pollOptions.questions.length > 0
        );

        const poll = new Poll(this.database(), this.questionFactory());

        await poll.createInDatabaseFromRequest(pollOptions, user);
        return poll.privateDataObj();
    }

    /**
     * Deletes poll with given privateId. If no such poll found,
     * does nothing and returns null.
     */
    async deletePoll(
        privateId: string
    ): Promise<IVotingService.SuccessObject | null> {
        pre('privateId is of type string', typeof privateId === 'string');

        const poll = await this._loadPollWithPrivateId(privateId);

        if (poll.loadedFromDatabase()) {
            await poll.delete();

            return { success: true };
        }

        return null;
    }

    /**
     * Edits existing poll based on given data.
     */
    async editPoll(
        editOptions: IPolling.PollEditRequest
    ): Promise<IVotingService.SuccessObject | null> {
        pre('editOptions is of type object', typeof editOptions === 'object');
        pre(
            'editOptions.privateId is of type string',
            typeof editOptions.privateId === 'string'
        );
        pre(
            'editOptions.name? is of type string',
            typeof editOptions.name === 'string' ||
                editOptions.name === undefined
        );
        pre(
            'editOptions.owner? is of type string',
            typeof editOptions.owner === 'string' ||
                editOptions.owner === undefined
        );
        pre(
            'editOptions.visualFlags? is of type array',
            Array.isArray(editOptions.visualFlags) ||
                editOptions.visualFlags === undefined
        );

        const poll = await this._loadPollWithPrivateId(editOptions.privateId);

        if (poll.loadedFromDatabase()) {
            await poll.updateFromEditRequest(editOptions);
            return { success: true };
        }

        return null;
    }

    /**
     * Returns a poll having given public id.
     * If no such poll exists, return null.
     */
    async getPollWithPublicId(
        publicId: string
    ): Promise<IPolling.PollData | null> {
        pre('publicId is of type string', typeof publicId === 'string');

        const poll = new Poll(this.database(), this.questionFactory());

        poll.setPublicId(publicId);

        if (await poll.existsInDatabase()) {
            await poll.loadFromDatabase();

            return poll.publicDataObj();
        }

        return null;
    }

    /**
     * Returns answers for poll with given public id.
     * If no such poll exists, returns null.
     */
    async getPollAnswers(
        publicId: string
    ): Promise<IPolling.AnswersData | null> {
        pre('publicId is of type string', typeof publicId === 'string');

        const poll = new Poll(this.database(), this.questionFactory());

        poll.setPublicId(publicId);

        if (await poll.existsInDatabase()) {
            await poll.loadFromDatabase();

            return { answers: poll.answersDataObjs() };
        }

        return null;
    }

    /**
     * Returns results for poll with given public id.
     * The results contain question answer counts and
     * percentages.
     * If no such poll exists, returns null.
     */
    async getPollResults(
        publicId: string
    ): Promise<IPolling.ResultData | null> {
        pre('publicId is of type string', typeof publicId === 'string');

        const poll = new Poll(this.database(), this.questionFactory());

        poll.setPublicId(publicId);

        if (await poll.existsInDatabase()) {
            await poll.loadFromDatabase();

            return poll.resultDataObj();
        }

        return null;
    }

    /**
     * Returns a poll having given private id.
     * If no such poll exists, returns null.
     */
    async getPollWithPrivateId(
        privateId: string
    ): Promise<IPolling.PollData | null> {
        pre('privateId is of type string', typeof privateId === 'string');

        const poll = await this._loadPollWithPrivateId(privateId);

        if (poll.loadedFromDatabase()) {
            return poll.privateDataObj();
        }

        return null;
    }

    /**
     * Returns polls that contain the given search string
     * in their name.
     */
    async searchPollsByName(
        searchText: string
    ): Promise<{ data: Array<IPolling.PollData> } | null> {
        pre('searchText is of type string', typeof searchText === 'string');

        const polls = new DatabasedObjectCollection(
            new Poll(this.database(), this.questionFactory())
        );

        await polls.loadFromDatabase({
            where: { name: { contains: searchText } },
            include: { questions: false, creator: true }
        });

        return {
            data: Object.values(
                await polls.gather('privateDataObj')
            ) as Array<IPolling.PollData>
        };
    }

    /**
     * Returns a user's own polls.
     */
    async getUserPolls(
        userId: string
    ): Promise<{ data: Array<IPolling.PollData> } | null> {
        pre('userId is of type string', typeof userId === 'string');

        const polls = new DatabasedObjectCollection(
            new Poll(this.database(), this.questionFactory())
        );

        await polls.loadFromDatabase({
            where: { creatorId: userId },
            include: { questions: false, creator: true }
        });

        return {
            data: Object.values(
                await polls.gather('privateDataObj')
            ) as Array<IPolling.PollData>
        };
    }

    /**
     * Answers a poll that has given publicId.
     * If poll was answered successfully, returns success object.
     * If not, returns null.
     */
    async answerPoll(
        answerData: IVotingService.AnswerData,
        user: User
    ): Promise<IVotingService.SuccessObject | null> {
        pre('answerData is of type object', typeof answerData === 'object');

        pre(
            'answerData.publicId is of type string',
            typeof answerData.publicId === 'string'
        );

        pre(
            'answerData.answers is of type Array',
            Array.isArray(answerData.answers)
        );

        const poll = await this._loadPollWithPublicId(answerData.publicId);

        if (poll.loadedFromDatabase()) {
            await this._answerExistingPoll(
                poll,
                answerData,
                user.fingerprint()
            );
        } else {
            return null;
        }

        return {
            success: true,
            fingerprint: user.fingerprint().privateDataObj()
        };
    }
}
