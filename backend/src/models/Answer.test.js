"use strict"


describe( "", (  ) => {
    
    var Answer = require( ".//Answer" ).default;
    var User = require( ".//User" ).default;
    var testDb = require( "../utils/testDb" );
    
    test( "newDatabaseObject happy case", (  ) => {
        
        var answer = new Answer(  );
        
        answer.setQuestionId( "test-question-id" );
        
        answer.setValue( "test-value" );

        answer.setAnswerer( makeAnswerer(  ) );
        
        expect( answer.newDatabaseObject(  ) ).toEqual( {
            
            questionId: "test-question-id",
            
            value: "test-value",
            
            voterId: "1"
            
        } );
        
    } );
    
    test( "newDatabaseObject question id not set", (  ) => {
        
        var answer = new Answer(  );
        
        answer.setValue( "test-value" );

        answer.setAnswerer( makeAnswerer(  ) );
        
        try {
            
            var obj = answer.newDatabaseObject(  );
            
            expect( true ).toBe( false );
            
        } catch (e) {
            
            expect( e.message ).toBe( "questionId is set" );
            
        }
        
    } );

    test( "newDatabaseObject answerer not set", (  ) => {
        
        var answer = new Answer(  );
        
        answer.setValue( "test-value" );
        
        answer.setQuestionId( "test-question-id" );
        
        try {
            
            var obj = answer.newDatabaseObject(  );
            
            expect( true ).toBe( false );
            
        } catch (e) {
            
            expect( e.message ).toBe( "answerer is set" );
            
        }
        
    } );

    test( "newDatabaseObject answerer not identifiable", (  ) => {
        
        var answer = new Answer(  );
        
        answer.setValue( "test-value" );
        
        answer.setQuestionId( "test-question-id" );
        
        var user = new User(  );

        user.setId( "1" );

        user.isIdentifiable = function (  ) {
            
            return false;
            
        };

        answer.setAnswerer( user );
        
        try {
            
            var obj = answer.newDatabaseObject(  );
            
            expect( true ).toBe( false );
            
        } catch (e) {
            
            expect( e.message ).toBe( "answerer is identifiable" );
            
        }
        
    } );
    
    test( "createNewInDatabase happy case", async (  ) => {
        
        var answer = new Answer(  );
        
        answer.setQuestionId( "test-question-id" );
        
        answer.setValue( "test-value" );

        answer.setAnswerer( makeAnswerer(  ) );
        
        var db = testDb.makeTestDb(  );

        db.vote = {
            
            create: function ( query ) {
                
                expect( query ).toEqual( { data: answer.newDatabaseObject(  ) } );
                
                return {
                
                    id: "a1",
                    
                    questionId: "test-question-id",
                    
                    value: "test-value",
                    
                    voter: { id: "1" }
                    
                };
                
            }
            
        };
        
        answer.setDatabase( db );
        
        expect( answer.createdInDatabase(  ) ).toBe( false );

        await answer.createNewInDatabase(  );
        
        expect( answer.createdInDatabase(  ) ).toBe( true );
        
    } );

    test( "createNewInDatabase data not set", async (  ) => {
        
        var answer = new Answer(  );
        
        var db = testDb.makeTestDb(  );

        db.vote = {
            
            create: function ( query ) {
                
                expect( query ).toEqual( { data: answer.newDatabaseObject(  ) } );
                
                return {
                
                    id: "a1",
                    
                    questionId: "test-question-id",
                    
                    value: "test-value",
                    
                    voter: { id: "1" }
                    
                };
                
            }
            
        };
        
        answer.setDatabase( db );

        try {
            
            await answer.createNewInDatabase(  );
            
            expect( true ).toBe( false );
            
        } catch (e) {
            
            expect( e.message ).toBe( "questionId is set" );
            
        }
        
    } );
    
    test( "setFromDatabaseData happy case", (  ) => {
        
        var answer = new Answer(  );
        
        answer.setFromDatabaseData( databaseData(  ) );
        
        expect( answer.id(  ) ).toBe( "test-id" );
        
        expect( answer.questionId(  ) ).toBe( "test-question-id" );
        
        expect( answer.value(  ) ).toBe( "test-value" );
        
        expect( answer.answerer(  ).id (  ) ).toBe( "1" );
        
    } );

    test( "setFromDatabaseData no argument", (  ) => {
        
        var answer = new Answer(  );

        try {
            
            answer.setFromDatabaseData(  );
            
        } catch (e) {
            
            expect( e.message ).toBe( "answerData is of type object" );
            
        }
        
    } );

    test( "setFromDatabaseData invalid id", (  ) => {
        
        var answer = new Answer(  );
        
        var data = databaseData(  );
        
        data.id = false;

        try {
            
            answer.setFromDatabaseData( data );
            
            expect( true ).toBe( false );
            
        } catch (e) {
            
            expect( e.message ).toBe( "answerData.id is of type string" );
            
        }
        
    } );

    test( "setFromDatabaseData invalid question id", (  ) => {
        
        var answer = new Answer(  );
        
        var data = databaseData(  );
        
        data.questionId = false;

        try {
            
            answer.setFromDatabaseData( data );
            
            expect( true ).toBe( false );
            
        } catch (e) {
            
            expect( e.message ).toBe( "answerData.questionId is of type string" );
            
        }
        
    } );

    test( "setFromDatabaseData invalid value", (  ) => {
        
        var answer = new Answer(  );
        
        var data = databaseData(  );
        
        data.value = false;

        try {
            
            answer.setFromDatabaseData( data );
            
            expect( true ).toBe( false );
            
        } catch (e) {
            
            expect( e.message ).toBe( "answerData.value is of type string" );
            
        }
        
    } );
    
    function makeAnswerer(  ) {
        
        var answerer = new User(  );
        
        answerer.setIp( "test-ip" );
        
        answerer.setAccountId( "test-account-id" );
        
        answerer.setCookie( "test-cookie" );
        
        answerer.setId( "1" );
        
        return answerer;
        
    }
    
    function databaseData(  ) {
        
        return {
            
            id: "test-id", 
            
            questionId: "test-question-id",
            
            value: "test-value",

            voterId: "1",
            
            voter: {
                
                id: "1"
                
            }

        };
        
    }
    
} );