import { pre, post } from '../utils/designByContract';
import User from '../models/User';
import Poll from '../models/Poll';
import * as IPolling from '../models/IPolling';
import * as IVotingService from './IVotingService';
import * as IUserManager from './IUserManager';
import UserManager from './/UserManager';
import { PrismaClient } from '@prisma/client';
import QuestionFactory from '../models/QuestionFactory';
import BadRequestError from '../utils/badRequestError';

/**
 * Service of the anonymous voting app
 * offering all voting / polling functionalities.
 */
export default class VotingService {
    _userManager: UserManager;
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
     * User retrieved from database with given user data
     * if one exists. Throws error if user not found.
     */

    async _tryGettingUser(userData: IUserManager.UserOptions): Promise<User> {
        // Currently returns just the same dummy user for any answer request.
        const user = await this.userManager().getUser(userData);

        if (!(user instanceof User)) {
            // Make this return 401
            throw new Error('User not found.');
        }

        return user;
    }

    /**
     * Answers a poll when poll is already assumed to exist.
     */

    async _answerExistingPoll(
        poll: Poll,
        answerData: IVotingService.AnswerData,
        user: User
    ): Promise<void> {
        await poll.answer(
            answerData.questionId,
            answerData.answer,
            user as User
        );
    }

    constructor(database: PrismaClient, questionFactory: QuestionFactory) {
        pre('database is of type object', typeof database === 'object');

        this._database = database;
        this._questionFactory = questionFactory;
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

        const poll = new Poll(this.database(), this.questionFactory());
        const user = await this.userManager().getUser(pollOptions.owner);

        if (!user) {
            throw new BadRequestError('User not found.');
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

        const poll = new Poll(this.database(), this.questionFactory());

        poll.setPrivateId(privateId);

        if (await poll.existsInDatabase()) {
            await poll.loadFromDatabase();

            return poll.privateDataObj();
        }

        return null;
    }

    /**
     * Answers a poll that has given publicId.
     * If poll was answered successfully, returns success object.
     * If not, returns null.
     */
    async answerPoll(
        answerData: IVotingService.AnswerData
    ): Promise<IVotingService.SuccessObject | null> {
        pre('answerData is of type object', typeof answerData === 'object');

        pre(
            'answerData.publicId is of type string',
            typeof answerData.publicId === 'string'
        );

        pre(
            'answerData.answer is of type object',
            typeof answerData.answer === 'object'
        );

        const user = await this._tryGettingUser(answerData.answerer);

        const poll = await this._loadPollWithPublicId(answerData.publicId);

        if (poll.loadedFromDatabase()) {
            await this._answerExistingPoll(poll, answerData, user);
        } else {
            return null;
        }

        return { success: true };
    }
}
