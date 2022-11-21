import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import WebFingerprintBuilder from './WebFingerprintBuilder';
import { pre, post } from '../../utils/designByContract';
import Fingerprint from './Fingerprint';

/**
 *
 */

export default class WebFingerprintFactory {
    _database: PrismaClient;
    _useIp = true;
    _useCookie = true;

    /**  */

    useCookie(): boolean {
        return this._useCookie;
    }

    /** Sets value of useCookie. */

    setUseCookie(useCookie: boolean): void {
        pre(
            'argument useCookie is of type boolean',
            typeof useCookie === 'boolean'
        );

        this._useCookie = useCookie;

        post('_useCookie is useCookie', this._useCookie === useCookie);
    }

    /**  */

    useIp(): boolean {
        return this._useIp;
    }

    /** Sets value of useIp. */

    setUseIp(useIp: boolean): void {
        pre('argument useIp is of type boolean', typeof useIp === 'boolean');

        this._useIp = useIp;

        post('_useIp is useIp', this._useIp === useIp);
    }

    /**  */

    database(): PrismaClient {
        return this._database;
    }

    /** Sets value of database. */

    setDatabase(database: PrismaClient): void {
        pre(
            'argument database is of type PrismaClient',
            database instanceof PrismaClient
        );

        this._database = database;

        post('_database is database', this._database === database);
    }

    _stripIPV6Prefix(ip: string) {
        if (ip.includes('::ffff:')) {
            return ip.replace('::ffff:', '');
        }

        return ip;
    }

    _ipFromRequest(req: Request) {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        if (typeof ip === 'string') {
            return this._stripIPV6Prefix(Array.isArray(ip) ? ip[0] : ip);
        } else {
            // Temporary
            throw new Error('Error: Internal server error');
        }
    }

    /**
     *
     */

    _addCookieFromExpressReq(
        req: Request,
        builder: WebFingerprintBuilder
    ): void {
        if (typeof req.body.cookie === 'string' && req.body.cookie.length > 0) {
            builder.addCookie(req.body.cookie);
        } else {
            builder.addNewCookie();
        }
    }

    constructor(database: PrismaClient) {
        this._database = database;
    }

    /**
     *
     */

    createFromExpressRequest(req: Request): Fingerprint {
        const identityBuilder = new WebFingerprintBuilder(this.database());

        if (this.useIp()) {
            identityBuilder.addIP(this._ipFromRequest(req));
        }

        if (this.useCookie()) {
            this._addCookieFromExpressReq(req, identityBuilder);
        }

        return identityBuilder.build();
    }
}
