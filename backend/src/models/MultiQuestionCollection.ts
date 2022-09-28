import { pre, post } from "../utils/designByContract";
import MultiQuestion from "./MultiQuestion";
import Question from "./Question";
import QuestionCollection from "./QuestionCollection";

/* import { PrismaClient } from '@prisma/client'; */

interface PrismaClient {
    
    [ prop: string ]: any
    
}

/**
 * Collection of MultiQuestion instances.
 */

export default class MultiQuestionCollection extends QuestionCollection {
    
    constructor( database: PrismaClient, questions: { [ id: string ]: MultiQuestion } ) {
    
        super( database, questions );
    
    }
    
    /**
     * 
     */
    
    /* newChoicesQuery(  ): Array<{ [ prop: string ]: any }> {
        
        var result = [  ];
        
        for ( let id in this.questions(  ) ) {
            
            let question = this.questions(  )[ id ];
            
            if ( question instanceof MultiQuestion && question.countSubQuestions(  ) > 0 ) {
                
                result = result.concat( question.newChoicesQuery(  ) );
                
            }
            
        }
        
        return result;
        
    } */

    /**
     * Populates collection with MultiQuestions according 
     * to given array of data objects retrieved 
     * from database.
     */
    
     setFromDatabaseObj( questionsData: Array<any> ): void {

        super.setFromDatabaseObj( questionsData );

        for ( let i = 0; i < questionsData.length; i++ ) {
            
            var questionData = questionsData[i];

            questionData.votes = [  ];
            
            var question = new MultiQuestion(  );

            question.setFromDatabaseData( questionData );

            this.questions(  )[ questionData.id ] = question;
            
        }
        
    }

    /**
     * 
     */
        
    /* setIdsFromDatabaseObj( questionsData: Array<any> ): void {

        super.setFromDatabaseObj( questionsData );

        for ( let i = 0; i < questionsData.length; i++ ) {
            
            var questionData = questionsData[i];

            var question = this.questions(  )[ questionData.id ];

            if ( question instanceof Question ) {
                
                question.setId( questionData.id );
                
            }
            
        }
        
    } */
    
    /**
     * Retrieves questions from database and 
     * populates the collection with according MultiQuestion instances.
     */
    
    async loadFromDatabase(  ): Promise<{ [ prop: string ]: any }> {
        
        pre("question collection is empty", Object.keys( this.questions(  ) ).length == 0);

        var questionsData = ( await ( this.database(  ).question.findMany( 
            { 
                where: { 

                    pollId: this.pollId(  )

                },
                
                include: {
                    
                    options: true
                    
                }
            }
        ) ) );
        
        this.setFromDatabaseObj( questionsData );
        
        return questionsData;
        
    }

    /**
     * 
     */
    
     /* async loadIdsFromDatabase(  ): Promise<{ [ prop: string ]: any }> {

        var questionsData = ( await ( this.database(  ).question.findMany( 
            { 
                where: { 

                    pollId: this.pollId(  )

                }
            }
        ) ) );
        
        this.setIdsFromDatabaseObj( questionsData );
        
        return questionsData;
        
    } */

    /**
     * 
     */
    
    /* async createNewInDatabase(  ): Promise<{ [ prop: string ]: any }> {

        pre("database is set", typeof this.database(  ) === "object");

        pre("there is at least one question", Object.keys( this.questions(  ) ).length > 0);

        await this.database(  ).question.createMany( { data: this.newDatabaseObject(  ) } );
        
        this.setQuestions( {  } );

        await this.loadIdsFromDatabase(  );

        var query = this.newChoicesQuery(  );
        
        await this.database(  ).option.createMany( {
            
            data: query
            
        } );
        
        this.setQuestions( {  } );

        return ( await this.loadFromDatabase(  ) );

    } */

    /**
     * Adds information to database according 
     * to the information present in this collection's instances.
     */
    
     async createNewInDatabase(  ): Promise<void> {

        pre("database is set", typeof this.database(  ) === "object");

        pre("there is at least one question", Object.keys( this.questions(  ) ).length > 0);

        for ( let id in this.questions(  ) ) {
            
            let question = this.questions(  )[ id ];
            
            delete this.questions(  )[ id ];

            await question.createNewInDatabase(  );

            this.databaseData(  ).push( question.databaseData(  ) );
            
            this.questions(  )[ question.id(  ) ] = question;

        }

    }
    
}