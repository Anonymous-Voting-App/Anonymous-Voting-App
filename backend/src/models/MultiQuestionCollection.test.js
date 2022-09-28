"use strict"


describe( "", (  ) => {
    
    var MultiQuestionCollection = require( ".//MultiQuestionCollection" ).default;
    var MultiQuestion = require( ".//MultiQuestion" ).default;
    var Question = require( ".//Question" ).default;
    var prisma = require( "../utils/prismaHandler" ).default;
    var Poll = require( ".//Poll" ).default;
    var User = require( ".//User" ).default;
    
    /* test( "loadFromDatabase happy case", async (  ) => {

        var [ collection, pollId, userId, questionId ] = await createCollection(  );
        
        var collection = new MultiQuestionCollection( prisma );
        
        collection.setPollId( pollId );
        
        await collection.loadFromDatabase(  );
        
        await removeFromDb( pollId, userId, questionId );

    } ); */

    test( "loadFromDatabase happy case", async (  ) => {
        
        var db = makeDb(  );

        var collection = new MultiQuestionCollection( db );

        collection.setPollId( "p1" );
        
        await collection.loadFromDatabase(  );
        
        expect( Object.keys( collection.questions(  ) ) ).toEqual( [ "q1", "q2" ] );

        var questions = Object.values( collection.questions(  ) );
        
        expect( questions[ 0 ].id(  ) ).toBe( "q1" );

        expect( questions[ 1 ].id(  ) ).toBe( "q2" );

    } );
    
    test( "loadFromDatabase no questions in database", async (  ) => {
        
        var db = makeDb(  );

        var collection = new MultiQuestionCollection( db );

        collection.setPollId( "find-nothing" );
        
        await collection.loadFromDatabase(  );
        
        expect( collection.questions(  ) ).toEqual( {  } );

    } );
    
    test( "createNewInDatabase happy case", async (  ) => {
        
        var db = makeDb(  );
        
        var callNum = 0;

        db.question.create = function ( query ) {
            
            callNum++;

            expect( query.data.pollId ).toBe( "p1" );

            if ( callNum === 1 ) {
                
                return {
                    
                    id: "q1",
                    
                    votes: [  ],
                    
                    options: [  ],
                    
                    pollId: "p1"
                    
                };
                
            }
            
        };
        
        db.option = {
            
            create: function ( query ) {
                
                expect( query.data.questionId ).toBe( "q1" );
                
                expect( query.data.option ).toBe( "sub-title" );
                
                return {
                    
                    id: "s1",
                    
                    questionId: "q1",
                    
                    option: "sub-title"
                    
                };
                
            }
            
        };

        var collection = new MultiQuestionCollection( db );
        
        var question = new MultiQuestion( db );
        
        question.setFromRequest( {
            
            title: "title",
            
            description: "description",
            
            subQuestions: [ {
                
                title: "sub-title",
            
                description: "sub-description",
                
            } ]
            
        } );
        
        collection.add( question );
        
        collection.setPollId( "p1" );
        
        await collection.createNewInDatabase(  );
        
        expect( Object.keys( collection.questions(  ) ) ).toEqual( [ "q1" ] );
        
        var question = collection.questions(  )[ "q1" ];
        
        expect( Object.keys( question.subQuestions(  ) ) ).toEqual( [ "s1" ] );
        
    } );

    /* test( "loadFromDatabase happy case", async (  ) => {
        
        var collection = new MultiQuestionCollection( makeDb(  ) );
        
        var question = new MultiQuestion(  );

        question.setFromRequest( {
            
            title: "title",
            
            description: "description",
            
            subQuestions: [ {
                
                title: "title",
            
                description: "description"
                
            } ]
            
        } );

        collection.add( question );



    } ); */
    
    function makeDb(  ) {
        
        var db = {  };
        
        db.question = {
            
            findMany: function ( query ) {
                
                var result = [
                    
                    {
                        
                        id: "q1",
                        
                        pollId: "p1",
                        
                        typeId: "t1"
                        
                    },
                    
                    {
                        
                        id: "q2",
                        
                        pollId: "p1",
                        
                        typeId: "t1"
                        
                    }
                    
                ];

                if ( typeof query.include === "object" && 
                     query.include.options === true) {
                    
                    result[ 0 ].options = [
                        
                        {
                            
                            id: "o1",
                            
                            questionId: "q1",
                            
                            option: "test-option"
                            
                        }
                        
                    ];
                    
                }

                if ( query.where.pollId !== "find-nothing" ) {
                    
                    return result;
                    
                }

                return [  ];
                
            }
            
        };
        
        return db;
        
    }

    /* async function removeFromDb( pollId, userId, questionId ) {
        
        await prisma.user.delete( {
            
            where: {
                
                id: userId
                
            }
            
        } );
        
        await prisma.question.delete( {
            
            where: {
                
                id: questionId
                
            }
            
        } );

        await prisma.poll.delete( {
            
            where: {
                
                id: questionId
                
            }
            
        } );
        
    }

    async function createCollection(  ) {
        
        var poll = await createPoll(  );

        var collection = new MultiQuestionCollection( prisma );

        var question = poll.questions(  )[ Object.keys( poll.questions(  ) )[ 0 ] ];
        
        collection.add( question );
        
        return [ collection, question.id(  ), poll.owner(  ).id(  ), question.id(  ) ];
        
    }

    async function createPoll(  ) {
        
        var user = await createUser(  );
        
        var poll = new Poll( prisma );
        
        poll.setOwner( user );

        poll.setName( "test-name" );
        
        poll.generateIds(  );

        var question = new MultiQuestion(  );
        
        question.setDatabase( prisma );

        poll.questions(  )[ 1 ] = question;
        
        await poll.createNewInDatabase(  );
        
        return poll;
        
    }

    async function createUser(  ) {
        
        var user = new User(  );
        
        user.setDatabase( prisma );
        
        await user.createNewInDatabase(  );
        
        return user;
        
    } */
    
} );