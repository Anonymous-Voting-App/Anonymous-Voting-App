import { pre, post } from '../../utils/designByContract';
import * as IUser from './/IUser';
import { PrismaClient } from '@prisma/client';
import Fingerprint from './IdentifyingFeature';
import SecurelyExposable from '../objects/SecurelyExposable';
import DatabasedObject from '../database/DatabasedObject';

/**
 * A registered user of the anonymous voting app.
 * Can be connected to the database.
 */
export default class User implements DatabasedObject, SecurelyExposable {
    _loadedFromDatabase = false;
    _database!: PrismaClient;
    _id = '';
    _createdInDatabase = false;
    _fingerprint!: Fingerprint;
    _userName = '';
    _firstName = '';
    _lastName = '';
    _email = '';

    /**  */

    email(): string {
        return this._email;
    }

    /** Sets value of email. */

    setEmail(email: string): void {
        pre('argument email is of type string', typeof email === 'string');

        this._email = email;

        post('_email is email', this._email === email);
    }

    /**  */

    lastName(): string {
        return this._lastName;
    }

    /** Sets value of lastName. */

    setLastName(lastName: string): void {
        pre(
            'argument lastName is of type string',
            typeof lastName === 'string'
        );

        this._lastName = lastName;

        post('_lastName is lastName', this._lastName === lastName);
    }

    /**  */

    firstName(): string {
        return this._firstName;
    }

    /** Sets value of firstName. */

    setFirstName(firstName: string): void {
        pre(
            'argument firstName is of type string',
            typeof firstName === 'string'
        );

        this._firstName = firstName;

        post('_firstName is firstName', this._firstName === firstName);
    }

    /**  */

    userName(): string {
        return this._userName;
    }

    /** Sets value of userName. */

    setUserName(userName: string): void {
        pre(
            'argument userName is of type string',
            typeof userName === 'string'
        );

        this._userName = userName;

        post('_userName is userName', this._userName === userName);
    }

    /**  */

    fingerprint(): Fingerprint {
        return this._fingerprint;
    }

    /** Sets value of fingerprint. */

    setFingerprint(fingerprint: Fingerprint): User {
        pre(
            'argument fingerprint is of type Fingerprint',
            fingerprint instanceof Fingerprint
        );

        this._fingerprint = fingerprint;

        post('_fingerprint is fingerprint', this._fingerprint === fingerprint);

        return this;
    }

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
        this._database = database;

        post('_database is database', this._database === database);
    }

    /** Whether the user has been loaded from the database. */
    loadedFromDatabase(): boolean {
        return this._loadedFromDatabase;
    }

    constructor(database?: PrismaClient) {
        if (database !== undefined) {
            this._database = database;
        }
    }

    databaseTable(): string {
        return 'user';
    }

    createNewInDatabase(): void {
        throw new Error('Method not implemented.');
    }

    clone(): DatabasedObject {
        const user = new User();

        Object.assign(user, this);

        return user;
    }

    /**
     * New Prisma query object for finding the user in the database.
     */
    findSelfInDatabaseQuery(): IUser.FindSelfDatabaseQuery {
        // For now this should be enough - Joonas Hiltunen 02.10.2022
        return {
            where: {
                id: this.id()
            }
        };
    }

    /**
     * Sets the user object's values from given data returned by the database.
     */
    setFromDatabaseData(userData: IUser.DatabaseData): void {
        pre('userData is of type object', typeof userData === 'object');
        pre('userData.id is of type string', typeof userData.id === 'string');

        this.setId(userData.id);
        this.setFirstName(userData.firstname);
        this.setLastName(userData.lastname);
        this.setUserName(userData.username);
        this.setEmail(userData.email);
    }

    /**
     * Whether poll with the same id can be found in the
     * Prisma database.
     */
    async existsInDatabase(): Promise<boolean> {
        let result = false;

        if (this.id().length > 0) {
            result =
                (await this._database.user.findFirst(
                    this.findSelfInDatabaseQuery()
                )) !== null;
        }

        return result;
    }

    /**
     * Loads the user's info from the database.
     * If user is not in database, then does nothing.
     * If the user was found in the database, then
     * .loadedFromDatabase() becomes true.
     */
    async loadFromDatabase(): Promise<void> {
        pre('id is set', this.id().length > 0);

        const data = await this._database.user.findFirst(
            this.findSelfInDatabaseQuery()
        );

        if (data !== null) {
            this.setFromDatabaseData(data);

            this._loadedFromDatabase = true;
        }
    }

    /**
     * A data object of the user's non-sensitive public information.
     */
    publicDataObj(): IUser.PublicData {
        return {
            id: this.id()
        };
    }

    /**
     * A data object of the user's sensitive private information.
     */
    privateDataObj(): IUser.PrivateData {
        return {
            id: this.id(),
            userName: this.userName(),
            firstName: this.firstName(),
            lastName: this.lastName(),
            email: this.email()
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
