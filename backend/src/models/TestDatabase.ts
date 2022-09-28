
/**
 * 
 */

export default class TestDatabase {
    
    _data: object = {
            
        poll: {  },
        
        user: {  }
        
    };

    _that: TestDatabase = this;

    constructor() {
    
        
    
    }
    
    poll: object = {
        
        db: this._that,

        create: function ( query: { [ prop: string ]: any } ) {
            
            
            
        }
        
    }

    user: object = {
        
        db: this._that,

        create: function ( query: { [ prop: string ]: any } ) {
            
            
            
        }
        
    }
    
}