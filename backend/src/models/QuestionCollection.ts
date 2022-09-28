import { pre, post } from "../utils/designByContract";
import Question from "./Question";

/* import { PrismaClient } from '@prisma/client'; */

interface PrismaClient {
    
    [ prop: string ]: any
    
}

/**
 * Collection of Question instances.
 */

export default class QuestionCollection {
    
    _database: PrismaClient;
	
    _questions: { [ id: string ]: Question } = {  };
    
    _pollId: string = "";

    _databaseData: Array<{ [ prop: string ]: any }> = [  ];
	
	/** 
     * Latest data received from database corresponding to the 
     * instances in this collection. Updates each time 
     * .setFromDatabaseData() is called.
     */
	
	databaseData(): Array<{ [ prop: string ]: any }> {
		
		return this._databaseData;
		
	}
	
    /** Sets value of databaseData. */
        
    setDatabaseData(databaseData: Array<{ [ prop: string ]: any }>): void {
        
        pre("argument databaseData is of type Array<object>", Array.isArray(databaseData));
	
        this._databaseData = databaseData;
        
        post("_databaseData is databaseData", this._databaseData === databaseData);
        
    }
	
	/** Questions in the collection. */
	
	questions(): { [ id: string ]: Question } {
		
		return this._questions;
		
	}
	
    /** Sets value of questions. */
        
    setQuestions(questions: { [ id: string ]: Question }): void {
        
        pre("argument questions is of type object", typeof questions === "object");
	
        this._questions = questions;
        
        post("_questions is questions", this._questions === questions);
        
    }

	/** Database the question collection is connected to. */
	
	database(): PrismaClient {
		
		return this._database;
		
	}
	
    /** Sets value of database. */
        
    setDatabase(database: PrismaClient): void {
        
        // pre("argument database is of type PrismaClient", database instanceof PrismaClient);
	
        this._database = database;
        
        post("_database is database", this._database === database);
        
    }

    constructor(database: PrismaClient, questions: { [ id: string ]: Question } = {  }) {
    
        pre("database is of type object", typeof database === "object");

        this._database = database;
        
        this._questions = questions;
    
    }
    
    /**
     * Adds new question instance to collection. 
     * Id of question is used as key for when adding to 
     * .questions().
     */
    
    add( question: Question ): void {
        
        pre("question is of type Question", question instanceof Question);
        
        this.questions(  )[ question.id(  ) ] = question;
        
    }

    /**
     * Creates instances into collection according 
     * to data given in array of database objects for 
     * questions.
     */
    
    setFromDatabaseObj( questionsData: Array<any> ): void {

        for ( let i = 0; i < questionsData.length; i++ ) {
            
            var questionData = questionsData[i];

            questionData.votes = [  ];
            
            var question = new Question(  );

            question.setFromDatabaseData( questionData )

            this.questions(  )[ questionData.id ] = question;
            
        }
        
    }

    /**
     * Loads questions into collection from 
     * database by querying with pollId.
     */
    
    async loadFromDatabase(  ): Promise<{ [ prop: string ]: any }> {
        
        var questionsData = ( await ( this.database(  ).question.findMany( 
            { 
                where: { 

                    pollId: this.pollId(  )

                }
            }
        ) ) );

        this.setQuestions( {  } );
        
        this.setFromDatabaseObj( questionsData );
        
        return questionsData;
        
    }
    
    /**
     * Creates database entries from instances 
     * in this collection.
     */
    
    async createNewInDatabase(  ): Promise<void> {
        
        pre("database is set", typeof this.database(  ) === "object");

        pre("there is at least one question", Object.keys( this.questions(  ) ).length > 0);

        await this.database(  ).question.createMany( { data: this.newDatabaseObject(  ) } );

        var questionsData = ( await ( this.database(  ).question.findMany( 
            { 
                where: { 

                    pollId: this.pollId(  )

                }
            }
        ) ) );

        this.setQuestions( {  } );

        for ( let i = 0; i < questionsData.length; i++ ) {
            
            var questionData = questionsData[i];

            questionData.votes = [  ];
            
            var question = new Question(  );

            question.setFromDatabaseData( questionData )

            this.questions(  )[ questionData.id ] = question;
            
        }
        
        return questionsData;

    }
    
    /**
     * Array of collection's question objects that can 
     * be added to database.
     */
    
    newDatabaseObject(  ): Array<{ [ prop: string ]: any }> {
        
        var result = [  ];
        
        for ( let id in this.questions(  ) ) {
            
            let question = this.questions(  )[ id ];
            
            result.push( question.newDatabaseObject(  ) );
            
        }
        
        return result;
        
    }
    
    /**
     * Sets pollId for collection as well 
     * as all Questions in collection.
     */
    
    setPollId( pollId: string ): void {
        
        pre("pollId is of type string", typeof pollId === "string");

        this._pollId = pollId;

        for ( let id in this.questions(  ) ) {
            
            let question = this.questions(  )[ id ];
            
            question.setPollId( pollId );
            
        }
        
    }
    
    /**
     * The pollId of the collection. If collection has questions, 
     * returns the pollId of the first question found. 
     * If not, returns the static pollId property of the collection.
     */
    
     pollId(  ): string {
        
        if ( Object.keys( this.questions(  ) ).length > 0 ) {
            
            return this.questions(  )[ Object.keys( this.questions(  ) )[ 0 ] ].pollId(  );
            
        }
        
        return this._pollId;
        
    }

}