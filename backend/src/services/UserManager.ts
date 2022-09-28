import User from "../models/User";
import { pre, post } from "../utils/designByContract";
/* import { PrismaClient } from '@prisma/client'; */

interface PrismaClient {
    
    [ prop: string ]: any
    
}

/**
 * A service for accessing and editing the anonymous 
 * voting app's users in the database.
 */

export default class UserManager {
    
    _database!: PrismaClient;

    _users: { [ id: string ]: User } = {  };
    
    /** Users that are being managed. */
    
    users(): { [ id: string ]: User } {
        
        return this._users;
        
    }
    
    /** Sets value of users. */
        
    setUsers(users: { [ id: string ]: User }): void {
        
        pre("argument users is of type object", typeof users === "object");
    
        this._users = users;
        
        post("_users is users", this._users === users);
        
    }
    
    /** Database the user info is stored in. */
    
    database(): PrismaClient {
        
        return this._database;
        
    }
    
    /** Sets value of database. */
        
    setDatabase(database: PrismaClient): void {
        
        /* pre("argument database is of type PrismaClient", database instanceof PrismaClient); */
    
        this._database = database;
        
        post("_database is database", this._database === database);
        
    }

    constructor( database: PrismaClient ) {
    
        pre("database is of type object", typeof database === "object");

        this._database = database;
    
    }
    
    /**
     * Creates new user with given options 
     * in database. Returns new user 
     * if it was created.
     */
    
    async createUser( userOptions: {
        
        ip?: string,
        
        cookie?: string
        
    } ): Promise<User | null> {
        
        pre("userOptions is of type object", typeof userOptions === "object");
        
        var user = new User(  );
        
        user.setDatabase( this.database(  ) );
        
        if ( typeof userOptions.ip === "string" ) {
            
            user.setIp( userOptions.ip );
            
        }
        
        if ( typeof userOptions.cookie === "string" ) {
            
            user.setCookie( userOptions.cookie );
            
        }
        
        await user.createNewInDatabase(  );
        
        if ( user.createdInDatabase(  ) ) {
            
            return user;
            
        }
        
        return null;

    }
    
    /**
     * Whether user with any of the given information 
     * exists in database.
     */
    
    async userExists( userOptions: {
            
        ip: string,
        
        cookie: string,
        
        accountId: string
        
    } ): Promise<boolean> {
        
        pre("userOptions is of type object", typeof userOptions === "object");
        
        pre("userOptions.ip is of type string", typeof userOptions.ip === "string");
        
        pre("userOptions.cookie is of type string", typeof userOptions.cookie === "string");
        
        pre("userOptions.accountId is of type string", typeof userOptions.accountId === "string");

        var user = new User(  );
        
        user.setDatabase( this.database(  ) );
        
        user.setIp( userOptions.ip );
        
        user.setCookie( userOptions.cookie );
        
        user.setAccountId( userOptions.accountId );
        
        return await user.existsInDatabase(  );
        
    }
    
    /**
     * User with either given ip, cookie or accountId. 
     * If such user does not exist in database, 
     * returns undefined.
     */
    
    async getUser( userOptions: {

        id?: string,
            
        ip: string,
        
        cookie: string,
        
        accountId: string
        
    } ): Promise<User | null> {
        
        /* pre("userOptions is of type object", typeof userOptions === "object");
        
        pre("userOptions.ip is of type string", typeof userOptions.ip === "string");
        
        pre("userOptions.cookie is of type string", typeof userOptions.cookie === "string");
        
        pre("userOptions.accountId is of type string", typeof userOptions.accountId === "string"); */

        var user = new User(  );
        
        user.setDatabase( this.database(  ) );
        
        user.setId( "1eb1cfae-09e7-4456-85cd-e2edfff80544" );
        
        user.setIp( "" );
        
        user.setCookie( "" );
        
        // Hard coded account id of a dummy user
        // as a temporary solution so that 
        // voting without having a user account possible.
        user.setAccountId( "1eb1cfae-09e7-4456-85cd-e2edfff80544" );
        
        await user.loadFromDatabase(  );
        
        if ( user.loadedFromDatabase(  ) ) {
            
            return user;
            
        }
        
        return null;
        
    }
    
}