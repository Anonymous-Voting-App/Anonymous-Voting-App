"use strict"


describe( "", (  ) => {
    
    var Question = require( ".//Question" ).default;
    var User = require( ".//User" ).default;
    var Answer = require( ".//Answer" ).default;
    var testDb = require( "../utils/testDb" );
    
    test( "answerDataIsAcceptable happy case", (  ) => {
        
        var question = new Question(  );
        
        question.setType( "test-type" );
        
        var acceptable = question.answerDataIsAcceptable( { answer: "test-value" } );
        
        expect( acceptable ).toBe( true );

    } );

    test( "answerDataIsAcceptable no argument", (  ) => {
        
        var question = new Question(  );
        
        try {
            
            var acceptable = question.answerDataIsAcceptable(  );
            
            expect( true ).toBe( false );
            
        } catch (e) {
            
            expect( e.message ).toBe( "answerData is of type object" );
            
        }

    } );
    
    test( "answer happy case", async (  ) => {
        
        var db = testDb.makeTestDb(  );

        db.vote = {
            
            create: function ( query ) {
                
                return {
                
                    id: "a1",
                    
                    questionId: "test-question-id",
                    
                    value: "test-value",
                    
                    voter: { id: "1" }
                    
                };
                
            }
            
        };

        var question = new Question(  );
        
        question.setId( "test-question-id" );
        
        question.setTitle( "test-title" );
        
        question.setDescription( "test-description" );
        
        question.setType( "test-type" );
        
        question.setPollId( "test-poll-id" );

        question.setDatabase( db );
        
        var answerer = makeAnswerer(  );

        var answer = await question.answer( {
            
            type: "test-type",
            
            answer: "test-value"
            
        }, answerer );
        
        expect( answer instanceof Answer ).toBe( true );
        
        expect( answer.questionId(  ) ).toBe( "test-question-id" );
        
        expect( answer.value(  ) ).toBe( "test-value" );
        
        expect( answer.answerer(  ).id(  ) ).toBe( "1" );
        
        expect( answer.createdInDatabase(  ) ).toBe( true );
        
    } );
    
    test( "answer non-acceptable answer data", async (  ) => {
        
        var question = new Question(  );
        
        question.setId( "test-question-id" );
        
        question.setTitle( "test-title" );
        
        question.setDescription( "test-description" );
        
        question.setType( "test-type" );
        
        question.setPollId( "test-poll-id" );

        question.setDatabase( testDb.makeTestDb(  ) );
        
        var answerer = makeAnswerer(  );

        try {
            
            var answer = await question.answer( {  }, answerer );
            
            expect( true ).toBe( false );
            
        } catch (e) {
            
            expect( e.message ).toBe( "Error: Answer data is not acceptable." );
            
        }
        
    } );
    
    test( "answer invalid answerer", async (  ) => {
        
        var question = new Question(  );
        
        question.setId( "test-question-id" );
        
        question.setTitle( "test-title" );
        
        question.setDescription( "test-description" );
        
        question.setType( "test-type" );
        
        question.setPollId( "test-poll-id" );

        question.setDatabase( testDb.makeTestDb(  ) );

        try {
            
            var answer = await question.answer( { type: "test-type", answer: "test-value" }, undefined );
        
            expect( answer ).toBe( undefined );
            
            expect( true ).toBe( false );
            
        } catch (e) {
            
            expect( e.message ).toBe( "answerer is of type User" );
            
        }
        
    } );
    
    test( "setFromDatabaseData happy case", (  ) => {
        
        var question = new Question(  );
        
        question.setFromDatabaseData( {
            
            id: "test-id",
            
            title: "test-title", 
            
            description: "test-description",
            
            pollId: "test-pollId",
            
            type: "test-type",
            
            votes: [  ]
            
        } );
        
        expect( question.id(  ) ).toBe( "test-id" );
        
        /* expect( question.title(  ) ).toBe( "test-title" );
        
        expect( question.description(  ) ).toBe( "test-description" ); */
        
        expect( question.pollId(  ) ).toBe( "test-pollId" );
        
        // expect( question.type(  ) ).toBe( "test-type" );
        
    } );
    
    test( "newDatabaseObject happy case", (  ) => {
        
        var question = new Question(  );
        
        question.setTitle( "test-title" );
        
        question.setDescription( "test-description" );
        
        question.setType( "test-type" );
        
        question.setPollId( "test-poll-id" );
        
        expect( question.newDatabaseObject(  ).pollId ).toBe( "test-poll-id" );

        expect( typeof question.newDatabaseObject(  ).typeId === "string" ).toBe( true );
        
    } );

    function makeAnswerer(  ) {
        
        var answerer = new User(  );
        
        answerer.setId( "1" );
        
        answerer.setIp( "test-ip" );
        
        answerer.setAccountId( "test-account-id" );
        
        answerer.setCookie( "test-cookie" );
        
        answerer.setDatabase( testDb.makeTestDb(  ) );
        
        return answerer;
        
    }
    
} );