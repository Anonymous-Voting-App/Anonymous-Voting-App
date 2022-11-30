import { pre, post } from '../../utils/designByContract';
import * as IUser from './/IUser';
import { PrismaClient } from '@prisma/client';
import Fingerprint from './Fingerprint';
import SecurelyExposable from '../objects/SecurelyExposable';
import DatabasedObject from '../database/DatabasedObject';
import bcrypt from 'bcryptjs';

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
    _isAdmin = false;
    _password = '';

    /**  */

    password(): string {
        return this._password;
    }

    /** Sets value of password. */

    setPassword(password: string): void {
        pre(
            'argument password is of type string',
            typeof password === 'string'
        );

        this._password = password;

        post('_password is password', this._password === password);
    }

    /**  */

    isAdmin(): boolean {
        return this._isAdmin;
    }

    /** Sets value of isAdmin. */

    setIsAdmin(isAdmin: boolean): void {
        pre(
            'argument isAdmin is of type boolean',
            typeof isAdmin === 'boolean'
        );

        this._isAdmin = isAdmin;

        post('_isAdmin is isAdmin', this._isAdmin === isAdmin);
    }

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
        this.setIsAdmin(userData.isAdmin);
        this.setPassword(userData.password);
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
            id: this.id(),
            userName: this.userName()
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
            email: this.email(),
            isAdmin: this.isAdmin(),
            password: this.password()
        };
    }

    /**
     * Whether user has an id that is according
     * to the v4 uuid standard.
     */
    hasV4Uuid(): boolean {
        return this.id().length === 32 || this.id().length === 36;
    }

    /**
     * Sets User instance's info from an object
     * containing the private data of the user.
     */

    setFromPrivateDataObj(obj: IUser.PrivateData): void {
        pre('obj.id is of type string', typeof obj.id === 'string');
        pre('obj.userName is of type string', typeof obj.userName === 'string');
        pre(
            'obj.firstName is of type string',
            typeof obj.firstName === 'string'
        );
        pre('obj.lastName is of type string', typeof obj.lastName === 'string');
        pre('obj.email is of type string', typeof obj.email === 'string');

        this.setId(obj.id);
        this.setUserName(obj.userName);
        this.setFirstName(obj.firstName);
        this.setLastName(obj.lastName);
        this.setEmail(obj.email);
    }

    /**
     * Deletes the user from the database.
     */

    async delete(): Promise<void> {
        pre('this.id(  ) is of type string', typeof this.id() === 'string');
        pre('id is set', this.id().length > 0);

        await this.database().user.delete({
            where: { id: this.id() }
        });
    }

    /**
     * Object that can be used to create new user in database.
     */

    newDatabaseObject(): IUser.NewDatabaseObject {
        return {
            firstname: this.firstName(),
            lastname: this.lastName(),
            email: this.email(),
            isAdmin: this.isAdmin(),
            username: this.userName(),
            password: this.password()
        };
    }

    /**
     * Updates user in database to match all the instance's values.
     */

    async updateInDatabase(): Promise<void> {
        await this.database().user.update({
            where: { id: this.id() },
            data: this.newDatabaseObject()
        });
    }

    /**
     * Updates user in database according to
     * given fields and values to update.
     */

    async updateFromEditRequest(req: IUser.EditRequest): Promise<void> {
        await this.setFromEditRequest(req);

        await this.updateInDatabase();
    }

    /**
     * Sets the User instance's information from
     * an object that contains new values to update
     * for the user.
     */

    async setFromEditRequest(req: IUser.EditRequest): Promise<void> {
        if (typeof req.email === 'string') {
            this.setEmail(req.email);
        }

        if (typeof req.firstName === 'string') {
            this.setFirstName(req.firstName);
        }

        if (typeof req.lastName === 'string') {
            this.setLastName(req.lastName);
        }

        if (typeof req.userName === 'string') {
            this.setUserName(req.userName);
        }

        if (typeof req.password === 'string') {
            this.setPassword(await bcrypt.hash(req.password, 10));
        }

        if (typeof req.isAdmin === 'boolean') {
            this.setIsAdmin(req.isAdmin);
        }
    }
}
