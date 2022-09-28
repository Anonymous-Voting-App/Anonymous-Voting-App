"use strict"


describe( "", (  ) => {
    
    var QuestionCollection = require( ".//QuestionCollection" ).default;
    var prisma = require( "../utils/prismaHandler" ).default;
    
    test( "loadFromDatabase happy case", async (  ) => {
        
        var questions = new QuestionCollection( makeDb(  ) );
        
        questions.setPollId( "p1" );
        
        await questions.loadFromDatabase(  );
        
        expect( Object.keys( questions.questions(  ) ) ).toEqual( [ "q1", "q2" ] );

        var question = questions.questions(  )[ "q1" ];
        
        expect( question.id(  ) ).toBe( "q1" );
        
        expect( question.pollId(  ) ).toBe( "p1" );

        question = questions.questions(  )[ "q2" ];
        
        expect( question.id(  ) ).toBe( "q2" );
        
        expect( question.pollId(  ) ).toBe( "p1" );

    } );
    
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

                return result;
                
            }
            
        };
        
        return db;
        
    }
    
} );