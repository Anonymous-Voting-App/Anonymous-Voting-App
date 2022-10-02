import { pre, post } from '../utils/designByContract';
import User from '../models/User';
import Poll from '../models/Poll';
import Answer from '../models/Answer';
import * as IPolling from '../models/IPolling';
import * as IVotingService from './IVotingService';
import UserManager from './/UserManager';
import { PrismaClient } from '@prisma/client';

/**
 * Service of the anonymous voting app
 * offering all voting / polling functionalities.
 */
export default class VotingService {
    _userManager: UserManager;
    _database: PrismaClient;

    /** Database the VotingService uses. */
    database(): PrismaClient {
        return this._database;
    }

    /** Sets value of database. */
    setDatabase(database: PrismaClient): void {
        this._database = database;

        post('_database is database', this._database === database);
    }

    /** UserManager the voting service uses for accessing / editing the app's users. */
    userManager(): UserManager {
        return this._userManager;
    }

    /** Sets value of userManager. */
    setUserManager(userManager: UserManager): void {
        pre(
            'argument userManager is of type UserManager',
            userManager instanceof UserManager
        );

        this._userManager = userManager;

        post('_userManager is userManager', this._userManager === userManager);
    }

    constructor(database: PrismaClient) {
        pre('database is of type object', typeof database === 'object');

        this._database = database;
        this._userManager = new UserManager(database);
    }

    /**
     * Creates a new poll with given information.
     * If poll was created, returns created poll info.
     * If not, returns null.
     */
    async createPoll(
        pollOptions: IPolling.PollRequest
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
            'pollOptions.owner is of type object',
            typeof pollOptions.owner === 'object'
        );
        pre(
            'pollOptions.owner.ip is of type string',
            typeof pollOptions.owner.ip === 'string' || !pollOptions.owner.ip
        );
        pre(
            'pollOptions.owner.cookie is of type string',
            typeof pollOptions.owner.cookie === 'string' ||
                !pollOptions.owner.cookie
        );
        pre(
            'pollOptions.owner.accountId is of type string',
            typeof pollOptions.owner.accountId === 'string'
        );
        pre(
            'there is at least one question in the poll',
            pollOptions.questions.length > 0
        );

        const poll = new Poll(this.database());
        const user = await this.userManager().getUser(pollOptions.owner);

        if (!(user instanceof User)) {
            throw new Error('User not found.');
        }

        await poll.createInDatabaseFromRequest(pollOptions, user);
        return poll.privateDataObj();
    }

    /**
     * Returns a poll having given public id.
     * If no such poll exists, return null.
     */
    async getPollWithPublicId(
        publicId: string
    ): Promise<IPolling.PollData | null> {
        pre('publicId is of type string', typeof publicId === 'string');

        const poll = new Poll(this.database());

        poll.setPublicId(publicId);

        if (await poll.existsInDatabase()) {
            await poll.loadFromDatabase();

            return poll.publicDataObj();
        }

        return null;
    }

    /**
     * Answers a poll that has given publicId.
     * If poll was answered successfully, returns created answer
     * info. If not, returns null.
     */
    async answerPoll(
        answerData: IVotingService.AnswerData
    ): Promise<IPolling.AnswerData | null> {
        pre('answerData is of type object', typeof answerData === 'object');

        pre(
            'answerData.publicId is of type string',
            typeof answerData.publicId === 'string'
        );

        pre(
            'answerData.answer is of type object',
            typeof answerData.answer === 'object'
        );

        // Currently returns just the same dummy user for any answer request.
        const user = await this.userManager().getUser(answerData.answerer);

        if (!(user instanceof User)) {
            throw new Error('User not found.');
        }

        const poll = new Poll(this.database());

        poll.setPublicId(answerData.publicId);

        await poll.loadFromDatabase();

        if (poll.loadedFromDatabase()) {
            const answer = await poll.answer(
                answerData.questionId,
                answerData.answer,
                user as User
            );

            if (answer instanceof Answer) {
                return answer.privateDataObj();
            }
        } else {
            throw new Error('Poll with given public id not found.');
        }

        return null;
    }
}
