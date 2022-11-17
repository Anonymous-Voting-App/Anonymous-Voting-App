import { PrismaClient } from '@prisma/client';
import { FindInDbQuery, PrivateData } from './IIdentifyingFeature';
import { DatabaseData, NewDbObject } from './IFingerprint';
import IdentifyingFeature from './IdentifyingFeature';
import { pre, post } from '../../utils/designByContract';
import crypto from 'crypto';

/**
 *
 */

export default class CookieIdentifier extends IdentifyingFeature {

    _cookie = '';

    /**  */

    cookie(): string {
        return this._cookie;
    }

    /** Sets value of cookie. */

    setCookie(cookie: string): void {
        pre('argument cookie is of type string', typeof cookie === 'string');

        this._cookie = cookie;

        post('_cookie is cookie', this._cookie === cookie);
    }

    constructor(database: PrismaClient) {
        super(database);
    }

    /**
     *
     */

    initialize(cookie: string): CookieIdentifier {
        this.setCookie(cookie);

        return this;
    }

    setFromDatabaseData(data: DatabaseData): void {
        this.setCookie(data.idCookie);
    }

    findSelfInDatabaseQuery(): FindInDbQuery {
        return { where: { idCookie: this.cookie() } };
    }

    /**
     *
     */

    generate(): void {
        this.setCookie(crypto.randomUUID());
    }

    addToNewDatabaseObject(obj: NewDbObject): void {
        obj.idCookie = this.cookie(  );
    }

    privateDataObj(): PrivateData {
        return { idCookie: this.cookie(  ) };
    }
}
