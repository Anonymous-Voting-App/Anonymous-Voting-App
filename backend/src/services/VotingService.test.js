"use strict"

describe( "", (  ) => {

    var VotingService = require( ".//VotingService" ).default;

    test( "createPoll happy case", async (  ) => {

        var db = makeDb(  );

        db.user.findFirst = function (  ) {
            
            return { 

                id: "d1b44abe-b336-497d-8148-11166b7c2489"

            };
            
        };

        db.question = {
            
            createMany: function (  ) {
            
                return [
                    
                    {
                    
                        id: "q1",

                        pollId: "1",
    
                        title: "",
                        
                        description: "",
                        
                        type: "question-type",
                        
                        votes: [  ],
                        
                        options: [  ]
                        
                    }
                    
                ];
                
            },

            create: function (  ) {
                
                return {
                    
                    id: "q1",

                    pollId: "1",

                    title: "",
                    
                    description: "",
                    
                    type: "question-type",
                    
                    votes: [  ],
                    
                    options: [  ]
                    
                };
                
            },
            
            findMany: function (  ) {
                
                return [
                    
                    {
                    
                        id: "q1",

                        pollId: "1",
    
                        title: "",
                        
                        description: "",
                        
                        type: "question-type",
                        
                        votes: [  ],
                        
                        options: [  ]
                        
                    }
                    
                ];
                
            }
            
        };
        
        db.option = {
            
            createMany: function (  ) {
                
                return { count: 2 };
                
            }
            
        };

        var service = new VotingService( db );

        var poll = await service.createPoll( {
            
            name: "name",
            
            type: "type",
            
            questions: [ {
                
                title: "question-title",
                
                description: "question-description",
                
                type: "question-type"
                
            } ],
            
            owner: {
                
                id: "d1b44abe-b336-497d-8148-11166b7c2489",
                
                ip: "",
                
                cookie: "",
                
                accountId: ""
                
            }

        } );
        
        checkPoll( poll, true );
        
    } );
    
    test( "getPollWithPublicId happy case", async (  ) => {
        
        var service = new VotingService( makeDb(  ) );

        var poll = await service.getPollWithPublicId( "publicId" );
        
        checkPoll( poll, false );
        
    } );
    
    test( "getPollWithPublicId poll does not exist", async (  ) => {
        
        var db = makeDb(  );
        
        db.poll.findFirst = function (  ) {
            
            return null;
            
        };

        var service = new VotingService( db );

        var poll = await service.getPollWithPublicId( "does-not-exist" );
        
        expect( poll ).toBe( null );
        
    } );
    
    test( "answerPoll happy case", async (  ) => {
        
        var db = makeDb(  );
        
        var service = new VotingService( db );
        
        var answer = await service.answerPoll( {
            
            publicId: "1",
            
            questionId: "q1",
            
            answer: {
                
                subQuestionId: "o1",

                answer: {
                    
                    answer: true
                    
                }
                
            },
            
            answerer: {
                
                ip: "1",
                
                cookie: "2",
                
                accountId: "3"
                
            }
            
        } );
        
        expect( typeof answer ).toBe( "object" );
        
        expect( answer.id ).toBe( "a1" );
        
        expect( answer.questionId ).toBe( "q1" );
        
        expect( answer.answerer ).toEqual( {
            
            id: "1"
            
        } );

    } );

    test( "answerPoll poll does not exist", async (  ) => {
        
        var db = makeDb(  );

        db.poll.findFirst = function ( query ) {
            
            return null;
            
        };
        
        var service = new VotingService( db );
        
        try {
            
            await service.answerPoll( {
            
                publicId: "1",
                
                questionId: "q1",
                
                answer: {
                    
                    answer: true
                    
                },
                
                answerer: {
                    
                    ip: "1",
                    
                    cookie: "2",
                    
                    accountId: "3"
                    
                }
                
            } );
            
        } catch (e) {
            
            expect( e.message ).toBe( "Error: poll with given public id not found." );
            
        }

    } );

    /* test( "answerPoll happy case user does not exist", async (  ) => {
        
        var db = makeDb(  );
        
        var created = false;

        var findUserCalls = 0;

        db.user.findFirst = function ( query ) {
            
            findUserCalls++;
            
            if ( findUserCalls === 1 ) {
                
                return null;
                
            }

            return { 

                id: "1"

            };
            
        };

        db.user.create = function ( query ) {
            
            created = true;

            expect( query ).toEqual( {
                
                data: {  }
                
            } );

            return { 

                id: "1"

            };
            
        };

        var service = new VotingService( db );
        
        var answer = await service.answerPoll( {
            
            publicId: "1",
            
            questionId: "q1",
            
            answer: {
                
                answer: true
                
            },
            
            answerer: {
                
                ip: "1",
                
                cookie: "2",
                
                accountId: "3"
                
            }
            
        } );
        
        expect( typeof answer ).toBe( "object" );
        
        expect( answer.id ).toBe( "a1" );
        
        expect( answer.questionId ).toBe( "q1" );
        
        expect( answer.answerer ).toEqual( {
            
            id: "1"
            
        } );
        
        expect( created ).toBe( true );

    } ); */
    
    function checkPoll( poll, isPrivate ) {
        
        expect( typeof poll === "object" ).toBe( true );

        expect( poll.id ).toBe( "1" );
        
        expect( poll.name ).toBe( "name" );
        
        expect( poll.publicId ).toBe( "publicId" );
        
        if ( isPrivate ) {
            
            expect( poll.privateId ).toBe( "privateId" );
            
        }

        expect( poll.type ).toBe( "type" );
        
        delete poll.questions.q1.subQuestions;

        expect( poll.questions ).toEqual( {
            
            q1: {
            
                title: "",
                
                description: "",
                
                type: "question-type",
                
                id: "q1",
                
                pollId: "1"
                
            }
            
        } );
        
        if ( isPrivate ) {
            
            expect( poll.answers ).toEqual( {  } );
            
        }
        
    }
    
    function makeDb(  ) {
        
        var db = {
            
            poll: {  },
            
            user: {  }
            
        }
        
        var poll = { 

            id: "1",
    
            name: "name",
            
            type: "type",

            pollLink: "publicId",
            
            adminLink: "privateId",
            
            creatorId: "",
            
            creator: undefined,

            questions: [ {
                
                id: "q1",
                
                type: "question-type",
                
                pollId: "1",
                
                votes: [  ],
                
                options: [ {
                    
                    id: "o1",

                    option: "option"
                    
                } ]
                
            } ]

        };

        db.poll.create = function ( query ) {
            
            return poll;
            
        };
        
        db.poll.findFirst = function ( query ) {
            
            var pollCopy = Object.assign( {}, poll );

            delete pollCopy.privateId;
            
            delete pollCopy.answers;

            return pollCopy;
            
        };
        
        db.user.create = function (  ) {
            
            return { 

                id: "1"

            };
            
        };

        db.user.findFirst = function (  ) {
            
            return { 

                id: "1"

            };
            
        };

        db.vote = {
            
            create: function ( query ) {
                
                return {

                    id: "a1",
            
                    questionId: "q1",
                    
                    value: "true",
                    
                    voterId: "1",
                    
                    voter: {
                        
                        id: "1"
                        
                    }
                    
                };
                
            }
            
        };
        
        return db;
        
    }
    
} );