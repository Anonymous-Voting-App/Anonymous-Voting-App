import * as IFingerprint from './IFingerprint';
import { PrismaClient } from '@prisma/client';
import { pre, post } from '../../utils/designByContract';
import * as IIdentifyingFeature from './IIdentifyingFeature';

/**
 *
 */

export default abstract class IdentifyingFeature {
    _database: PrismaClient;

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

    constructor(database: PrismaClient) {
        this._database = database;
    }

    abstract setFromDatabaseData(data: IFingerprint.DatabaseData): void;

    abstract findSelfInDatabaseQuery(): IIdentifyingFeature.FindInDbQuery;

    abstract privateDataObj(): IIdentifyingFeature.PrivateData;

    abstract addToNewDatabaseObject(obj: IFingerprint.NewDbObject): void;
}
