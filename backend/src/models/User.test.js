"use strict"


describe( "", (  ) => {
    
    var User = require( ".//User" ).default;

    test( "newDatabaseObject happy case", (  ) => {
        
        var user = new User(  );

        user.setIp( "test-ip" );
        
        user.setCookie( "test-cookie" );
        
        user.setAccountId( "test-account-id" );
        
        var obj = user.newDatabaseObject(  );
        
        /* expect( obj ).toEqual( {
            
            ip: "test-ip",
            
            cookie: "test-cookie",
            
            accountId: "test-account-id"
            
        } ); */
        
        /* expect( obj ).toEqual( {  } ); */
        
    } );
    
    test( "newDatabaseObject properties not set", (  ) => {
        
        var user = new User(  );

        var obj = user.newDatabaseObject(  );
        
        /* expect( obj ).toEqual( {
            
            ip: "",
            
            cookie: "",
            
            accountId: ""
            
        } ); */
        
        /* expect( obj ).toEqual( {  } ); */
        
    } );
    
    test( "setFromDatabaseData happy case", (  ) => {
        
        var user = new User(  );
        
        /* user.setFromDatabaseData( {
            
            ip: "test-ip",
            
            cookie: "test-cookie",
            
            accountId: "test-account-id"
            
        } );
        
        expect( user.ip(  ) ).toBe( "test-ip" );
        
        expect( user.cookie(  ) ).toBe( "test-cookie" );
        
        expect( user.accountId(  ) ).toBe( "test-account-id" ); */
        
        user.setFromDatabaseData( { id: "1" } );
        
        expect( user.id(  ) ).toBe( "1" );
        
    } );

    test( "setFromDatabaseData empty input", (  ) => {
        
        var user = new User(  );
        
        try {
            
            user.setFromDatabaseData(  );
            
            expect( true ).toBe( false );
            
        } catch (e) {
            
            expect( e.message ).toBe( "userData is of type object" );
            
        }
        
    } );
    
    test( "loadFromDatabase happy case data found", async (  ) => {
        
        var user = new User(  );

        user._database = {
            
            user: { 
            
                findFirst: function ( query ) {
                        
                    expect( query ).toEqual( {
                        
                        where: {
                            
                            OR: [
                                
                                { id: "1" }
                                
                            ]
                            
                        }
                        
                    } );
                    
                    return {
                        
                        id: "1"
                        
                    };
                    
                } 
            }
            
        }

        user.setAccountId( "1" );
        
        await user.loadFromDatabase(  );
        
        expect( user.loadedFromDatabase(  ) ).toBe( true );
        
        expect( user.accountId(  ) ).toBe( "1" );
        
    } );
    
    test( "loadFromDatabase data not found", async (  ) => {
        
        var user = new User(  );

        user._database = makeTestDb(  );
        
        user.setId( "1" );
        
        await user.loadFromDatabase(  );
        
        expect( user.loadedFromDatabase(  ) ).toBe( false );
        
    } );
    
    test( "loadFromDatabase properties not set", async (  ) => {
        
        var user = new User(  );
        
        try {
            
            await user.loadFromDatabase(  );
            
            expect( true ).toBe( false );
            
        } catch (e) {
            
            expect( e.message ).toBe( "either id, ip, cookie or accountId is set" );
            
        }
        
    } );

    function makeTestDb( responses = {  } ) {
        
        var db = { user: {  } };
        
        db.user.findFirst = function ( query ) {
            
            if ( responses.findFirst ) {
                
                return responses.findFirst( query );
                
            }
            
            return null;
            
        };
        
        return db;
        
    }
    
} );