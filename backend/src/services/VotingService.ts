import { pre, post } from "../utils/designByContract";
import User from "../models/User";
import Poll from "../models/Poll";
import Answer from '../models/Answer';
import * as IPolling from "../models/IPolling";
import UserManager from ".//UserManager";
import QuestionCollection from "../models/QuestionCollection";
/* import { PrismaClient } from '@prisma/client'; */

interface PrismaClient {
    
    [ prop: string ]: any
    
}

/**
 * Service of the anonymous voting app 
 * offering all voting / polling functionalities.
 */

export default class VotingService {

    _userManager: UserManager;

    _database: PrismaClient;
	
	/** Database the VotingService uses. */
	
	database(): PrismaClient {
		
		return this._database;
		
	}
	
    /** Sets value of database. */
        
    setDatabase(database: PrismaClient): void {
        
        /* pre("argument database is of type PrismaClient", database instanceof PrismaClient); */
	
        this._database = database;
        
        post("_database is database", this._database === database);
        
    }
	
	/** UserManager the voting service uses for accessing / editing the app's users. */
	
	userManager(): UserManager {
		
		return this._userManager;
		
	}
	
    /** Sets value of userManager. */
        
    setUserManager(userManager: UserManager): void {
        
        pre("argument userManager is of type UserManager", userManager instanceof UserManager);
	
        this._userManager = userManager;
        
        post("_userManager is userManager", this._userManager === userManager);
        
    }

    constructor( database: PrismaClient ) {
    
        pre("database is of type object", typeof database === "object");

        this._database = database;
        
        this._userManager = new UserManager( database );
    
    }
    
    /**
     * Creates a new poll with given information. 
     * If poll was created, returns created poll info. 
     * If not, returns null.
     */
    
    async createPoll( pollOptions: { 

        name: string,

        type: string,

        questions: Array<IPolling.QuestionRequest>
        
        owner: {

            id: string,
            
            ip: string,
            
            cookie: string,
            
            accountId: string
            
        }

    } ): Promise<IPolling.PollData | void> {
        
        pre("pollOptions is of type object", typeof pollOptions === "object");
        
        pre("pollOptions.name is of type string", typeof pollOptions.name === "string");

        pre("pollOptions.type is of type string", typeof pollOptions.type === "string");
        
        pre("pollOptions.questions is of type Array", Array.isArray(pollOptions.questions));

        pre("pollOptions.owner is of type object", typeof pollOptions.owner === "object");

        pre("pollOptions.owner.ip is of type string", typeof pollOptions.owner.ip === "string");

        pre("pollOptions.owner.cookie is of type string", typeof pollOptions.owner.cookie === "string");

        pre("pollOptions.owner.accountId is of type string", typeof pollOptions.owner.accountId === "string");

        pre("there is at least one question in the poll", pollOptions.questions.length > 0);

        var poll = new Poll( this.database(  ) );

        var user = await this.userManager(  ).getUser( pollOptions.owner );
        
        if ( !( user instanceof User ) ) {
            
            throw new Error( "Error: invalid user id" );
            
        }

        await poll.createInDatabaseFromRequest( pollOptions, user );

        return poll.privateDataObj(  );

    }
    
    /**
     * Returns a poll having given public id. 
     * If no such poll exists, return null.
     */
    
    async getPollWithPublicId( publicId: string ): Promise<IPolling.PollData | void> {

        pre("publicId is of type string", typeof publicId === "string");

        var poll = new Poll( this.database(  ) );
        
        poll.setPublicId( publicId );
        
        if ( await poll.existsInDatabase(  ) ) {
            
            await poll.loadFromDatabase(  );

            return poll.publicDataObj(  );
            
        }
        
        return null;
        
    }
    
    /**
     * Answers a poll that has given publicId. 
     * If poll was answered successfully, returns created answer 
     * info. If not, returns null.
     */
    
    async answerPoll( answerData: {
        
        publicId: string,

        questionId: string,

        answer: {
        
            answer: any,
    
            [ extra: string ]: any,
            
        },
        
        answerer: {
            
            ip: string,
            
            cookie: string,
            
            accountId: string
            
        }
        
    } ): Promise<IPolling.AnswerData | void> {
        
        pre("answerData is of type object", typeof answerData === "object");
        
        pre("answerData.publicId is of type string", typeof answerData.publicId === "string");
        
        pre("answerData.answer is of type object", typeof answerData.answer === "object");
        
        // pre("answerData.answerer is of type object", typeof answerData.answerer === "object");

        var user: User | void;

        /* if ( !( await this.userManager(  ).userExists( answerData.answerer ) ) ) {
            
            user = await this.userManager(  ).createUser( answerData.answerer );
            
        } */

        // Currently returns just the same dummy user for any answer request.
        user = await this.userManager(  ).getUser( answerData.answerer );

        if ( !( user instanceof User ) ) {
            
            throw new Error( "Error: user not found." );
            
        }

        var poll = new Poll( this.database(  ) );
        
        poll.setPublicId( answerData.publicId );

        await poll.loadFromDatabase(  );
        
        if ( poll.loadedFromDatabase(  ) ) {
            
            var answer = await poll.answer( answerData.questionId, answerData.answer, user as User );

            if ( answer instanceof Answer ) {
                
                return answer.privateDataObj(  );
                
            }
            
        } else {
            
            throw new Error( "Error: poll with given public id not found." );
            
        }
        
        return null;
        
    }
    
}