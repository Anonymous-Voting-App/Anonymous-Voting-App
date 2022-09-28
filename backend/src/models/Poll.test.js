"use strict"


describe( "", (  ) => {
    
    var Poll = require( ".//Poll" ).default;
    var Question = require( ".//Question" ).default;
    var User = require( ".//User" ).default;
    var testDb = require( "../utils/testDb" );
    
    test( "answer happy case", async (  ) => {
        
        var db = testDb.makeTestDb(  );

        db.vote = {
            
            create: function ( query ) {
                
                return {
                
                    id: "a1",
                    
                    questionId: "question-id",
                    
                    value: "answer",
                    
                    voter: { id: "1" }
                    
                };
                
            }
            
        };

        var poll = new Poll( db );

        poll.setId( "pollId" );
        
        var question = new Question(  );

        question.setDatabase( db );
        
        question.setId( "question-id" );
        
        question.setType( "type" );
        
        question.setDescription( "description" );
        
        question.setTitle( "title" );
        
        question.setPollId( "pollId" );
        
        poll.questions(  )[ question.id(  ) ] = question;
        
        var user = makeAnswerer(  );

        var answer = await poll.answer( "question-id", {
            
            answer: "answer"
            
        }, user );
        
        expect( answer.createdInDatabase(  ) ).toBe( true );
        
        expect( answer.questionId(  ) ).toBe( "question-id" );
        
        expect( answer.answerer(  ).id(  ) ).toBe( "1" );
        
    } );

    test( "setAnswersFromDatabaseData happy case", (  ) => {
        
        var poll = new Poll( {  } );
        
        poll.setAnswersFromDatabaseData( [ {
                
            id: "1",

            pollId: "1",
            
            type: "type",
            
            title: "title",
            
            description: "description",
            
            votes: [ {
                
                id: "1",
    
                questionId: "1",
                
                value: "value",
    
                voterId: "1",
    
                voter: {
                    
                    ip: "",
                    
                    cookie: "",
                    
                    accountId: "",
                    
                    id: "1"
                    
                }
                
            } ]
            
        } ] );
        
        expect( Object.keys( poll.answers(  ) ).length ).toBe( 1 );
        
        var answer = poll.answers(  )[ "1" ];

        expect( answer.id(  ) ).toBe( "1" );
        
        expect( answer.questionId(  ) ).toBe( "1" );
        
        expect( answer.value(  ) ).toBe( "value" );
        
        expect( answer.answerer(  ).id(  ) ).toBe( "1" );
        
    } );
    
    test( "setQuestionsFromDatabaseData happy case", (  ) => {
        
        var poll = new Poll( {  } );
        
        poll.setId( "1" );
        
        poll.setQuestionsFromDatabaseData( [ {
                
            id: "1",

            pollId: "1",
            
            type: "type",
            
            title: "title",
            
            description: "description",
            
            votes: [  ]
            
        } ] );
        
        expect( Object.keys( poll.questions(  ) ).length ).toBe( 1 );
        
        var question = poll.questions(  )[ "1" ];

        expect( question.id(  ) ).toBe( "1" );
        
        expect( question.pollId(  ) ).toBe( "1" );
        
        expect( question.type(  ) ).toBe( "type" );

        /* expect( question.title(  ) ).toBe( "title" );

        expect( question.description(  ) ).toBe( "description" ); */
        
    } );
    
    test( "setFromDatabaseData happy case", (  ) => {

        setFromDatabaseDataHappyCase(  );

    } );
    
    test( "loadFromDatabase happy case", async (  ) => {
        
        var poll = new Poll( {  } );
        
        poll.setId( "1" );

        var db = testDb.makeTestDb(  );
        
        db.poll = {
            
            findFirst: function ( query ) {
                
                return databaseData(  );
                
            }
            
        };

        poll.setDatabase( db );
        
        await poll.loadFromDatabase(  );
        
        expect( poll.loadedFromDatabase(  ) ).toBe( true );

        checkSetFromDatabaseData( poll );
        
    } );
    
    test( "loadFromDatabase poll not found", (  ) => {
        
        var poll = new Poll( {  } );
        
        poll.setId( "1" );

        var db = testDb.makeTestDb(  );
        
        db.polls = {
            
            findFirst: function ( query ) {
                
                return null;
                
            }
            
        };
        
        poll.setDatabase( db );
        
        expect( poll.loadedFromDatabase(  ) ).toBe( false );
        
    } );
    
    test( "existsInDatabase happy case", async (  ) => {
        
        var poll = new Poll( {  } );
        
        poll.setId( "1" );

        var db = testDb.makeTestDb(  );
        
        db.poll = {
            
            findFirst: function ( query ) {
                
                return databaseData(  );
                
            }
            
        };
        
        poll.setDatabase( db );
        
        expect( await poll.existsInDatabase(  ) ).toBe( true );
        
    } );

    test( "existsInDatabase poll not found", async (  ) => {
        
        var poll = new Poll( {  } );
        
        poll.setId( "1" );

        var db = testDb.makeTestDb(  );
        
        db.poll = {
            
            findFirst: function ( query ) {
                
                return null;
                
            }
            
        };
        
        poll.setDatabase( db );
        
        expect( await poll.existsInDatabase(  ) ).toBe( false );
        
    } );
    
    test( "newDatabaseObject happy case", (  ) => {
        
        var poll = setFromDatabaseDataHappyCase(  );

        poll.owner(  ).setId( "d1b44abe-b336-497d-8148-11166b7c2489" );

        var data = poll.newDatabaseObject(  );

        expect( data ).toEqual( {
            
            name: "name",
            
            creatorId: "d1b44abe-b336-497d-8148-11166b7c2489",
            
            adminLink: "privateId",
            
            pollLink: "publicId",
            
            resultLink: ""
            
        } );
        
    } );
    
    function setFromDatabaseDataHappyCase(  ) {

        var poll = new Poll( {  } );
        
        poll.setFromDatabaseData( databaseData(  ) );
        
        checkSetFromDatabaseData( poll );
        
        return poll;
        
    }

    function checkSetFromDatabaseData( poll ) {
        
        expect( poll.id(  ) ).toBe( "1" );
        
        expect( poll.name(  ) ).toBe( "name" );

        expect( poll.type(  ) ).toBe( "type" );

        expect( poll.publicId(  ) ).toBe( "publicId" );

        expect( poll.privateId(  ) ).toBe( "privateId" );
        
        var owner = poll.owner(  );
        
        /* expect( owner.ip(  ) ).toBe( "ip" );
        
        expect( owner.cookie(  ) ).toBe( "cookie" );
        
        expect( owner.accountId(  ) ).toBe( "accountId" ); */
        
        expect( owner.id(  ) ).toBe( "1" );

        expect( Object.keys( poll.questions(  ) ) ).toEqual( [ "1" ] );

        expect( Object.keys( poll.answers(  ) ) ).toEqual( [ "1" ] );
        
    }
    
    function databaseData(  ) {

        var questions = [ {
                
            id: "1",

            pollId: "1",
            
            type: "type",
            
            title: "title",
            
            description: "description",
            
            votes: [ {
                
                id: "1",
    
                questionId: "1",
                
                value: "value",
    
                voter: {
                    
                    ip: "",
                    
                    cookie: "",
                    
                    accountId: "",
                    
                    id: "1"
                    
                }
                
            } ]
            
        } ];

        return {
            
            id: "1",
        
            name: "name",
            
            type: "type",
    
            pollLink: "publicId",
            
            adminLink: "privateId",
            
            creator: {
                
                ip: "ip",
                
                cookie: "cookie",
                
                accountId: "accountId",
                
                id: "1"
                
            },
    
            questions: questions
            
        };
        
    }
    
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