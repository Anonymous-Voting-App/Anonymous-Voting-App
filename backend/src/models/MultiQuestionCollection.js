"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var designByContract_1 = require("../utils/designByContract");
var MultiQuestion_1 = __importDefault(require("./MultiQuestion"));
var QuestionCollection_1 = __importDefault(require("./QuestionCollection"));
/**
 * Collection of MultiQuestion instances.
 */
var MultiQuestionCollection = /** @class */ (function (_super) {
    __extends(MultiQuestionCollection, _super);
    function MultiQuestionCollection(database, questions) {
        return _super.call(this, database, questions) || this;
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
    MultiQuestionCollection.prototype.setFromDatabaseObj = function (questionsData) {
        _super.prototype.setFromDatabaseObj.call(this, questionsData);
        for (var i = 0; i < questionsData.length; i++) {
            var questionData = questionsData[i];
            questionData.votes = [];
            var question = new MultiQuestion_1.default();
            question.setFromDatabaseData(questionData);
            this.questions()[questionData.id] = question;
        }
    };
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
    MultiQuestionCollection.prototype.loadFromDatabase = function () {
        return __awaiter(this, void 0, void 0, function () {
            var questionsData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, designByContract_1.pre)("question collection is empty", Object.keys(this.questions()).length == 0);
                        return [4 /*yield*/, (this.database().question.findMany({
                                where: {
                                    pollId: this.pollId()
                                },
                                include: {
                                    options: true
                                }
                            }))];
                    case 1:
                        questionsData = (_a.sent());
                        this.setFromDatabaseObj(questionsData);
                        return [2 /*return*/, questionsData];
                }
            });
        });
    };
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
    MultiQuestionCollection.prototype.createNewInDatabase = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _i, id, question;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, designByContract_1.pre)("database is set", typeof this.database() === "object");
                        (0, designByContract_1.pre)("there is at least one question", Object.keys(this.questions()).length > 0);
                        _a = [];
                        for (_b in this.questions())
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        id = _a[_i];
                        question = this.questions()[id];
                        delete this.questions()[id];
                        return [4 /*yield*/, question.createNewInDatabase()];
                    case 2:
                        _c.sent();
                        this.databaseData().push(question.databaseData());
                        this.questions()[question.id()] = question;
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return MultiQuestionCollection;
}(QuestionCollection_1.default));
exports.default = MultiQuestionCollection;
