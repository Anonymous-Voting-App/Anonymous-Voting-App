import { pre, post } from "../utils/designByContract";
import Answer from "./Answer";
import Question from "./Question";
import User from "./User";
import * as IPolling from "../models/IPolling";
import { PrismaClient } from "@prisma/client";

/**
 * 
 */

export default class MultiQuestion extends Question {

    _type: string = "multi";

    _subQuestions: { [ id: string ]: Question } = {  };
    
    /**  */
    
    subQuestions(): { [ id: string ]: Question } {
        
        return this._subQuestions;
        
    }
    
    /** Sets value of subQuestions. */
        
    setSubQuestions(subQuestions: { [ id: string ]: Question }): void {
        
        pre("argument subQuestions is of type object", typeof subQuestions === "object");
    
        this._subQuestions = subQuestions;
        
        post("_subQuestions is subQuestions", this._subQuestions === subQuestions);
        
    }

    constructor( database?: PrismaClient ) {
    
        super( database );
    
    }

    /**
     * 
     */
    
    hasSubQuestions(  ): boolean {
        
        return Object.keys( this.subQuestions(  ) ).length > 0;
        
    }

    /**
     * 
     */
    
    async createSubQuestionsInDatabase(  ): Promise<void> {
        
        for ( let id in this.subQuestions(  ) ) {
            
            let subQuestion = this.subQuestions(  )[ id ];
            
            delete this.subQuestions(  )[ id ];
            
            await subQuestion.createNewInDatabaseAsOption( this.id(  ) );
            
            this.subQuestions(  )[ subQuestion.id(  ) ] = subQuestion;

        }
        
    }

    /**
     * 
     */
    
    async createNewInDatabase(  ): Promise<void> {

        await super.createNewInDatabase(  );
        
        if ( this.hasSubQuestions(  ) ) {
            
            await this.createSubQuestionsInDatabase(  );
            
        }
        
    }

    /**
     * Makes new object from the instance's info that can 
     * be added to Prisma database.
     */
    
     newDatabaseObject(  ): { [ prop: string ]: any } {
        
        var obj = super.newDatabaseObject(  );
        
        return obj;
        
    }

    /**
     * Sets instance's properties from given question object 
     * received from the database.
     */
    
    setFromDatabaseData( questionData: {
        
        id: string,
        
        title?: string,
        
        description?: string,
        
        pollId: string,
        
        type: string,
        
        votes: Array<any>,
        
        [ extra: string ]: any,
        
        options?: Array<{ option: string, questionId: string, id: string }>
        
    } ): void {

        super.setFromDatabaseData( questionData );
        
        if ( Array.isArray( questionData.options ) ) {
            
            for ( let i = 0; i < questionData.options.length; i++ ) {
            
                var optionData = questionData.options[i];
                
                var subQuestion = new Question(  );
                
                subQuestion.setFromOptionData( optionData as unknown as any );
                
                this.subQuestions(  )[ subQuestion.id(  ) ] = subQuestion;
                
            }
            
        }
        
    }

    /**
     * Gives an answer to the question from given user. 
     * Makes all needed modifications 
     * to database and returns Answer object representing 
     * the created answer.
     * If given answer data is not of acceptable format for the question,
     * does nothing and returns undefined. 
     * Answers sub-question with id of answerData.subQuestionId.
     */
    
    async answer( answerData: {
        
        subQuestionId: string,

        answer: {
        
            answer: any,
    
            [ extra: string ]: any
            
        },

        [ extra: string ]: any
        
    }, answerer: User ): Promise<Answer> {
        
        pre("answerData is of type object", typeof answerData === "object");
        
        pre("answerer is of type User", answerer instanceof User);

        if ( this.answerDataIsAcceptable( answerData ) ) {
            
            var subQuestion = this.subQuestions(  )[ answerData.subQuestionId ];

            subQuestion.setDatabase( this.database(  ) );

            var answer = await subQuestion.answerAsOption( answerData.answer, answerer, this.id(  ) );
            
            if ( answer instanceof Answer ) {
                
                this.answers(  )[ answer.id(  ) ] = answer;
                
            }
            
            return answer;

        }
        
    }

    /**
     * Whether given answer data is of acceptable format. 
     * In other words, whether the given answer is really an 
     * answer to the question. To multi-questions 
     * answerData.answer is the answer data to the sub-question indicated by 
     * answerData.subQuestionId. If answerData.subQuestionId is 
     * not a valid sub-question id, answer data is not acceptable. 
     * The data given in answerData.answer is 
     * passed to the sub-question to validate.
     */
    
     answerDataIsAcceptable( answerData: {
        
        subQuestionId?: string,

        answer: {
        
            answer: any,
    
            [ extra: string ]: any
            
        },

        [ extra: string ]: any
        
    } ): boolean {
        
        pre("answerData is of type object", typeof answerData === "object");

        pre("answerData.answer is of type object", typeof answerData.answer === "object");

        var result = false;
        
        if ( typeof answerData.subQuestionId === "string" ) {
            
            var subQuestion = this.subQuestions(  )[ answerData.subQuestionId ];

            if ( subQuestion instanceof Question ) {
                
                result = subQuestion.answerDataIsAcceptable( answerData.answer );
                
            }
            
        }
        
        return result;
        
    }

    /**
     * A data object of the question's non-sensitive public information.
     */
    
    publicDataObj(  ): IPolling.MultiQuestionData {
        
        var result = super.publicDataObj(  ) as IPolling.MultiQuestionData;

        result.subQuestions = {  };

        for ( let id in this.subQuestions(  ) ) {
            
            let question = this.subQuestions(  )[ id ];
            
            result.subQuestions[ question.id(  ) ] = question.publicDataObj(  );
            
        }
        
        return result;
        
    }
    
    /**
     * 
     */
    
     /* newChoicesQuery(  ): Array<{ [ prop: string ]: any }> {
        
        var result = [  ];
        
        for ( let id in this.subQuestions(  ) ) {
            
            let subQuestion = this.subQuestions(  )[ id ];
            
            result.push( subQuestion.newDatabaseObjectAsOption( this.id(  ) ) );
            
        }
        
        return result;
        
    } */
    
    /**
     * 
     */
    
     countSubQuestions(  ): number {
        
        return Object.keys( this.subQuestions(  ) ).length;
        
    }

    /**
     * Populates the Question's fields data from 
     * given data object representing information for a new question.
     */
    
    setFromRequest( request: IPolling.QuestionRequest ): void {
        
        super.setFromRequest( request );
        
        if ( Array.isArray( request.subQuestions ) ) {
            
            this.setSubQuestionsFromRequest( request.subQuestions );
            
        }
        
    }
    
    /**
     * 
     */
    
    setSubQuestionsFromRequest( subQuestions: Array<IPolling.QuestionRequest> ): void {
        
        pre("subQuestions is of type Array", Array.isArray(subQuestions));
        
        for ( let i = 0; i < subQuestions.length; i++ ) {
            
            var subQuestionData = subQuestions[i];
            
            var subQuestion = new Question(  );
            
            subQuestion.setDatabase( this.database(  ) );
            
            subQuestion.setFromRequest( subQuestionData );

            this.subQuestions(  )[ subQuestion.id(  ) ] = subQuestion;
            
        }
        
    }
    
}