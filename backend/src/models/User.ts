import { pre, post } from '../utils/designByContract';
import * as IPolling from '../models/IPolling';
/* import { PrismaClient } from '@prisma/client'; */

interface PrismaClient {
    [prop: string]: any;
}

/**
 * A user of the anonymous voting app.
 * Can be connected to the database.
 * The user can be identified either with ip
 * or cookie or accountId.
 * Only registered users have account ids.
 * The same User class is used for registered users
 * and anonymous users.
 */

export default class User {
    _ip: string = '';

    _cookie: string = '';

    _accountId: string = '';

    _loadedFromDatabase: boolean = false;

    _database!: PrismaClient;

    _id: string = '';

    _createdInDatabase: boolean = false;

    /** Whether new user entry in database has been created from this instance. */

    createdInDatabase(): boolean {
        return this._createdInDatabase;
    }

    /** Sets value of createdInDatabase. */

    setCreatedInDatabase(createdInDatabase: boolean): void {
        pre(
            'argument createdInDatabase is of type boolean',
            typeof createdInDatabase === 'boolean'
        );

        this._createdInDatabase = createdInDatabase;

        post(
            '_createdInDatabase is createdInDatabase',
            this._createdInDatabase === createdInDatabase
        );
    }

    /** Database id of user. */

    id(): string {
        return this._id;
    }

    /** Sets value of id. */

    setId(id: string): void {
        pre('argument id is of type string', typeof id === 'string');

        this._id = id;

        post('_id is id', this._id === id);
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

    /** Whether the user has been loaded from the database. */

    loadedFromDatabase(): boolean {
        return this._loadedFromDatabase;
    }

    /** Account id of user if user is registered. */

    accountId(): string {
        return this._accountId;
    }

    /** Sets value of accountId. */

    setAccountId(accountId: string): void {
        pre(
            'argument accountId is of type string',
            typeof accountId === 'string'
        );

        this._accountId = accountId;

        post('_accountId is accountId', this._accountId === accountId);
    }

    /** Possible cookie (active or inactive) the account has. */

    cookie(): string {
        return this._cookie;
    }

    /** Sets value of cookie. */

    setCookie(cookie: string): void {
        pre('argument cookie is of type string', typeof cookie === 'string');

        this._cookie = cookie;

        post('_cookie is cookie', this._cookie === cookie);
    }

    /** IP address of the user. Mostly needed for identifying anonymous users. */

    ip(): string {
        return this._ip;
    }

    /** Sets value of ip. */

    setIp(ip: string): void {
        pre('argument ip is of type string', typeof ip === 'string');

        this._ip = ip;

        post('_ip is ip', this._ip === ip);
    }

    /**
     * New Prisma query object for finding the user in the database.
     */

    findSelfInDatabaseQuery(): { [prop: string]: any } {
        var orArr = [];

        /* if ( this.ip(  ).length > 0 ) {
            
            orArr.push( { ip: this.ip(  ) } );
            
        }
        
        if ( this.cookie(  ).length > 0 ) {
            
            orArr.push( { cookie: this.cookie(  ) } );
            
        }
        
        if ( this.accountId(  ).length > 0 ) {
            
            orArr.push( { accountId: this.accountId(  ) } );
            
        } */

        if (this.accountId().length > 0) {
            orArr.push({ id: this.accountId() });
        }

        return {
            where: {
                OR: orArr
            }
        };
    }

    constructor() {}

    /**
     * Sets the user object's values from given data returned by the database.
     */

    setFromDatabaseData(userData: {
        id: string;

        ip?: string;

        cookie?: string;

        accountId?: string;
    }): void {
        pre('userData is of type object', typeof userData === 'object');

        pre('userData.id is of type string', typeof userData.id === 'string');

        this.setId(userData.id);
    }

    /**
     * Whether poll with the same id can be found in the
     * Prisma database.
     */

    async existsInDatabase(): Promise<boolean> {
        var result = false;

        if (
            this.id().length > 0 ||
            this.ip().length > 0 ||
            this.cookie().length > 0 ||
            this.accountId().length > 0
        ) {
            result =
                (await this._database.user.findFirst(
                    this.findSelfInDatabaseQuery()
                )) !== null;
        }

        return result;
    }

    /**
     * Makes new object in Prisma database from the values
     * of the properties of this instance.
     */

    async createNewInDatabase(): Promise<void> {
        var data = await this._database.user.create({
            data: this.newDatabaseObject()
        });

        this.setFromDatabaseData(data);

        this._createdInDatabase = true;
    }

    /**
     * A new Prisma-compatible object used for when creating a
     * database entry for the user.
     */

    newDatabaseObject(): any {
        return {
            name: 'dummy-name',

            email: 'dummy-email',

            password: 'dummy-password'
        };
    }

    /**
     * Loads the user's info from the database.
     * If user is not in database, then does nothing.
     * If the user was found in the database, then
     * .loadedFromDatabase() becomes true.
     */

    async loadFromDatabase(): Promise<void> {
        pre(
            'either id, ip, cookie or accountId is set',
            this.id().length > 0 ||
                this.ip().length > 0 ||
                this.cookie().length > 0 ||
                this.accountId().length > 0
        );

        var data = await this._database.user.findFirst(
            this.findSelfInDatabaseQuery()
        );

        if (data !== null) {
            this.setFromDatabaseData(data);

            this._loadedFromDatabase = true;
        }
    }

    /**
     * Whether the user can be identified at least somehow.
     * The user can be identified if they have either a
     * cookie, ip or account id set.
     */

    isIdentifiable(): boolean {
        return true;

        var result = false;

        if (this.ip().length > 0) {
            result = true;
        } else if (this.accountId().length > 0) {
            result = true;
        } else if (this.cookie().length > 0) {
            result = true;
        }

        return result;
    }

    /**
     * A data object of the user's non-sensitive public information.
     */

    publicDataObj(): IPolling.UserData {
        return {
            id: this.id()
        };
    }

    /**
     * Whether user has an id that is according
     * to the v4 uuid standard.
     */

    hasV4Uuid(): boolean {
        return this.id().length === 32 || this.id().length === 36;
    }
}
