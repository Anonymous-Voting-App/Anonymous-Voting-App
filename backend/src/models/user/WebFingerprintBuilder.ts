import { PrismaClient } from '@prisma/client';
import { Request } from 'express';
import { pre, post } from '../../utils/designByContract';
import CookieIdentifier from './CookieIdentifier';
import IPIdentifier from './IPIdentifier';
import Fingerprint from './Fingerprint';

/**
 *
 */

export default class WebFingerprintBuilder {
    _useIP = false;
    _result!: Fingerprint;
    _database: PrismaClient;

    /**  */

    database(): PrismaClient {
        return this._database;
    }

    /** Sets value of database. */

    setDatabase(database: PrismaClient): void {
        pre(
            'database is of type PrismaClient',
            database instanceof PrismaClient
        );

        this._database = database;

        post('_database is database', this._database === database);
    }

    /**  */

    result(): Fingerprint {
        return this._result;
    }

    /** Sets value of result. */

    setResult(result: Fingerprint): void {
        pre(
            'argument result is of type Fingerprint',
            result instanceof Fingerprint
        );

        this._result = result;

        post('_result is result', this._result === result);
    }

    /**  */

    useIP(): boolean {
        return this._useIP;
    }

    /** Sets value of useIP. */

    setUseIP(useIP: boolean): void {
        pre('argument useIP is of type boolean', typeof useIP === 'boolean');

        this._useIP = useIP;

        post('_useIP is useIP', this._useIP === useIP);
    }

    constructor(database: PrismaClient) {
        this._database = database;

        this.reset();
    }

    /**
     *
     */

    addIP(ip: string): void {
        this.result()
            .identifiers()
            .push(new IPIdentifier(this.database()).initialize(ip));
    }

    /**
     *
     */

    addCookie(cookie: string): void {
        this.result()
            .identifiers()
            .push(new CookieIdentifier(this.database()).initialize(cookie));
    }

    /**
     *
     */

    addNewCookie(): void {
        const cookie = new CookieIdentifier(this.database());

        cookie.generate();

        this.result().identifiers().push(cookie);
    }

    /**
     *
     */

    reset(): void {
        this.setResult(new Fingerprint(this.database()));
    }

    /**
     *
     */

    build(): Fingerprint {
        const result = this.result();

        this.reset();

        return result;
    }
}
