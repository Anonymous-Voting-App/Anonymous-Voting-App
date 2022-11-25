import User from '../models/user/User';
import { pre, post } from '../utils/designByContract';
import { PrismaClient } from '@prisma/client';
import * as IUserManager from './IUserManager';

/**
 * A service for accessing and editing the anonymous
 * voting app's users in the database.
 */
export default class UserManager {
    _database!: PrismaClient;
    _users: { [id: string]: User } = {};

    /** Users that are being managed. */
    users(): { [id: string]: User } {
        return this._users;
    }

    /** Sets value of users. */
    setUsers(users: { [id: string]: User }): void {
        pre('argument users is of type object', typeof users === 'object');

        this._users = users;

        post('_users is users', this._users === users);
    }

    /** Database the user info is stored in. */
    database(): PrismaClient {
        return this._database;
    }

    /** Sets value of database. */
    setDatabase(database: PrismaClient): void {
        this._database = database;

        post('_database is database', this._database === database);
    }

    constructor(database: PrismaClient) {
        pre('database is of type object', typeof database === 'object');

        this._database = database;
    }

    /**
     * Whether user with any of the given information
     * exists in database.
     */
    async userExists(userOptions: IUserManager.UserOptions): Promise<boolean> {
        pre('userOptions is of type object', typeof userOptions === 'object');
        pre(
            'userOptions.ip is of type string',
            typeof userOptions.ip === 'string'
        );
        pre(
            'userOptions.cookie is of type string',
            typeof userOptions.cookie === 'string'
        );
        pre(
            'userOptions.accountId is of type string',
            typeof userOptions.accountId === 'string'
        );

        const user = new User();
        user.setDatabase(this.database());

        return await user.existsInDatabase();
    }

    /**
     * User with either given ip, cookie or accountId.
     * If such user does not exist in database,
     * returns undefined.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getUser(userOptions: IUserManager.UserOptions): Promise<User | null> {
        const user = new User();

        user.setDatabase(this.database());

        // Hard coded account id of a dummy user
        // as a temporary solution so that
        // voting without having a user account possible.
        user.setId('1eb1cfae-09e7-4456-85cd-e2edfff80544');

        await user.loadFromDatabase();

        if (user.loadedFromDatabase()) {
            return user;
        }

        return null;
    }
}
