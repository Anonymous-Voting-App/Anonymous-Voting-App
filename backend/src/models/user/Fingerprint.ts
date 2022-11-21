import { pre, post } from '../../utils/designByContract';
import IdentifyingFeature from './IdentifyingFeature';
import * as IFingerprint from './IFingerprint';
import * as IIdentifyingFeature from './IIdentifyingFeature';
import { PrismaClient } from '@prisma/client';

/**
 *
 */

export default class Fingerprint {
    _identifiers: Array<IdentifyingFeature> = [];
    _samenessCheck: 'oneOf' | 'allOf' = 'oneOf';
    _id = '';
    _wasFoundInDatabase = false;
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

    /**  */

    wasFoundInDatabase(): boolean {
        return this._wasFoundInDatabase;
    }

    /** Sets value of wasFoundInDatabase. */

    setWasFoundInDatabase(wasFoundInDatabase: boolean): void {
        pre(
            'argument wasFoundInDatabase is of type boolean',
            typeof wasFoundInDatabase === 'boolean'
        );

        this._wasFoundInDatabase = wasFoundInDatabase;

        post(
            '_wasFoundInDatabase is wasFoundInDatabase',
            this._wasFoundInDatabase === wasFoundInDatabase
        );
    }

    /**  */

    id(): string {
        return this._id;
    }

    /** Sets value of id. */

    setId(id: string): void {
        pre('argument id is of type string', typeof id === 'string');

        this._id = id;

        post('_id is id', this._id === id);
    }

    /**  */

    samenessCheck(): 'oneOf' | 'allOf' {
        return this._samenessCheck;
    }

    /** Sets value of samenessCheck. */

    setSamenessCheck(samenessCheck: 'oneOf' | 'allOf'): void {
        pre(
            'samenessCheck is of type string',
            typeof samenessCheck === 'string'
        );
        pre(
            'samenessCheck is acceptable',
            samenessCheck === 'oneOf' || samenessCheck === 'allOf'
        );

        this._samenessCheck = samenessCheck;

        post(
            '_samenessCheck is samenessCheck',
            this._samenessCheck === samenessCheck
        );
    }

    /**  */

    identifiers(): Array<IdentifyingFeature> {
        return this._identifiers;
    }

    /** Sets value of identifiers. */

    setIdentifiers(identifiers: Array<IdentifyingFeature>): void {
        pre(
            'argument identifiers is of type Array<IdentifyingFeature>',
            Array.isArray(identifiers)
        );

        this._identifiers = identifiers;

        post('_identifiers is identifiers', this._identifiers === identifiers);
    }

    /**
     *
     */

    _mergeIdentifierPrivateObj(
        privateObj: IFingerprint.PrivateData,
        identifierPrivateObj: IIdentifyingFeature.PrivateData
    ): void {
        for (const prop in identifierPrivateObj) {
            privateObj[prop as keyof IIdentifyingFeature.PrivateData] =
                identifierPrivateObj[
                    prop as keyof IIdentifyingFeature.PrivateData
                ];
        }
    }

    /**
     * 
     */
    
    _setFromCreatedDbData( data: IFingerprint.DatabaseData | undefined ): void {
        
        if ( typeof data === "object" ) {
            
            this.setFromDatabaseData( data );
            
        } else {
            
            throw new Error( "Error: Could not create fingerprint in database." );
            
        }
        
    }

    constructor(database: PrismaClient) {
        this._database = database;
    }

    /**
     *
     */

    allIdentifiersQueryArray(): IFingerprint.AllIdentifiersQueryArray {
        const arr: IFingerprint.AllIdentifiersQueryArray = [];

        for (let i = 0; i < this.identifiers().length; i++) {
            const identifier = this.identifiers()[i];

            arr.push(identifier.findSelfInDatabaseQuery().where);
        }

        return arr;
    }

    /**
     *
     */

    findSelfInDbOrQuery(): IFingerprint.FindInDbOrQuery {
        return { where: { OR: this.allIdentifiersQueryArray() } };
    }

    /**
     *
     */

    findSelfInDbAndQuery(): IFingerprint.FindInDbAndQuery {
        return { where: { AND: this.allIdentifiersQueryArray() } };
    }

    /**
     *
     */

    async databaseMatches(): Promise<number> {
        return 0;
    }

    /**
     *
     */

    isIdentifiable(): boolean {
        return true;
    }

    /**
     *
     */

    setFromDatabaseData(data: IFingerprint.DatabaseData): void {
        pre('data.ip is of type string', typeof data.ip === 'string');
        pre(
            'data.idCookie is of type string',
            typeof data.idCookie === 'string'
        );
        pre('data.id is of type string', typeof data.id === 'string');
        pre(
            'data.fingerprintJsId is of type string',
            typeof data.fingerprintJsId === 'string'
        );

        this.setId(data.id);

        for (let i = 0; i < this.identifiers().length; i++) {
            const identifier = this.identifiers()[i];

            identifier.setFromDatabaseData(data);
        }
    }

    /**
     * 
     */
    
     newDatabaseObject(  ): IFingerprint.NewDbObject {
        
        const obj = {  };

        for ( let i = 0; i < this._identifiers.length; i++ ) {
            
            const identifier = this._identifiers[i];
            
            identifier.addToNewDatabaseObject( obj );
            
        }

        return obj;
        
    }

    /**
     *
     */

    async createNewInDatabase(): Promise<void> {
        
        const data = await this._database.fingerprint.create( {
            
            data: this.newDatabaseObject(  )
            
        } );

        this._setFromCreatedDbData( data );

    }

    /**
     *
     */

    findSelfInDatabaseQuery(): IFingerprint.FindInDbQuery {
        if (this.samenessCheck() === 'oneOf') {
            return this.findSelfInDbOrQuery();
        } else {
            return this.findSelfInDbAndQuery();
        }
    }

    /**
     *
     */

    async loadFromDatabase(): Promise<void> {
        const data = await this.database(  ).fingerprint.findFirst( 
            this.findSelfInDatabaseQuery(  ) as any
        );

        if ( data !== null ) {
            
            this.setFromDatabaseData( data );
            this.setWasFoundInDatabase( true );
            
        }
    }

    /**
     *
     */

    privateDataObj(): IFingerprint.PrivateData {
        const obj: IFingerprint.PrivateData = {};

        for (let i = 0; i < this.identifiers().length; i++) {
            const identifierObj = this.identifiers()[i].privateDataObj();

            this._mergeIdentifierPrivateObj(obj, identifierObj);
        }

        return obj;
    }

    /**
     * 
     */
    
    async ensureExistsInDatabase(  ): Promise<void> {
        
        if ( !this.wasFoundInDatabase(  ) ) {
            
            await this.createNewInDatabase(  );
            
        }
        
    }
}
