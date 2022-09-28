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
var Answer_1 = __importDefault(require("./Answer"));
var Question_1 = __importDefault(require("./Question"));
var User_1 = __importDefault(require("./User"));
/**
 *
 */
var MultiQuestion = /** @class */ (function (_super) {
    __extends(MultiQuestion, _super);
    function MultiQuestion(database) {
        var _this = _super.call(this, database) || this;
        _this._type = "multi";
        _this._subQuestions = {};
        return _this;
    }
    /**  */
    MultiQuestion.prototype.subQuestions = function () {
        return this._subQuestions;
    };
    /** Sets value of subQuestions. */
    MultiQuestion.prototype.setSubQuestions = function (subQuestions) {
        (0, designByContract_1.pre)("argument subQuestions is of type object", typeof subQuestions === "object");
        this._subQuestions = subQuestions;
        (0, designByContract_1.post)("_subQuestions is subQuestions", this._subQuestions === subQuestions);
    };
    /**
     *
     */
    MultiQuestion.prototype.hasSubQuestions = function () {
        return Object.keys(this.subQuestions()).length > 0;
    };
    /**
     *
     */
    MultiQuestion.prototype.createSubQuestionsInDatabase = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _i, id, subQuestion;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = [];
                        for (_b in this.subQuestions())
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        id = _a[_i];
                        subQuestion = this.subQuestions()[id];
                        delete this.subQuestions()[id];
                        return [4 /*yield*/, subQuestion.createNewInDatabaseAsOption(this.id())];
                    case 2:
                        _c.sent();
                        this.subQuestions()[subQuestion.id()] = subQuestion;
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     */
    MultiQuestion.prototype.createNewInDatabase = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype.createNewInDatabase.call(this)];
                    case 1:
                        _a.sent();
                        if (!this.hasSubQuestions()) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.createSubQuestionsInDatabase()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Makes new object from the instance's info that can
     * be added to Prisma database.
     */
    MultiQuestion.prototype.newDatabaseObject = function () {
        var obj = _super.prototype.newDatabaseObject.call(this);
        return obj;
    };
    /**
     * Sets instance's properties from given question object
     * received from the database.
     */
    MultiQuestion.prototype.setFromDatabaseData = function (questionData) {
        _super.prototype.setFromDatabaseData.call(this, questionData);
        if (Array.isArray(questionData.options)) {
            for (var i = 0; i < questionData.options.length; i++) {
                var optionData = questionData.options[i];
                var subQuestion = new Question_1.default();
                subQuestion.setFromOptionData(optionData);
                this.subQuestions()[subQuestion.id()] = subQuestion;
            }
        }
    };
    /**
     * Gives an answer to the question from given user.
     * Makes all needed modifications
     * to database and returns Answer object representing
     * the created answer.
     * If given answer data is not of acceptable format for the question,
     * does nothing and returns undefined.
     * Answers sub-question with id of answerData.subQuestionId.
     */
    MultiQuestion.prototype.answer = function (answerData, answerer) {
        return __awaiter(this, void 0, void 0, function () {
            var subQuestion, answer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, designByContract_1.pre)("answerData is of type object", typeof answerData === "object");
                        (0, designByContract_1.pre)("answerer is of type User", answerer instanceof User_1.default);
                        if (!this.answerDataIsAcceptable(answerData)) return [3 /*break*/, 2];
                        subQuestion = this.subQuestions()[answerData.subQuestionId];
                        subQuestion.setDatabase(this.database());
                        return [4 /*yield*/, subQuestion.answerAsOption(answerData.answer, answerer, this.id())];
                    case 1:
                        answer = _a.sent();
                        if (answer instanceof Answer_1.default) {
                            this.answers()[answer.id()] = answer;
                        }
                        return [2 /*return*/, answer];
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
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
    MultiQuestion.prototype.answerDataIsAcceptable = function (answerData) {
        (0, designByContract_1.pre)("answerData is of type object", typeof answerData === "object");
        (0, designByContract_1.pre)("answerData.answer is of type object", typeof answerData.answer === "object");
        var result = false;
        if (typeof answerData.subQuestionId === "string") {
            var subQuestion = this.subQuestions()[answerData.subQuestionId];
            if (subQuestion instanceof Question_1.default) {
                result = subQuestion.answerDataIsAcceptable(answerData.answer);
            }
        }
        return result;
    };
    /**
     * A data object of the question's non-sensitive public information.
     */
    MultiQuestion.prototype.publicDataObj = function () {
        var result = _super.prototype.publicDataObj.call(this);
        result.subQuestions = {};
        for (var id in this.subQuestions()) {
            var question = this.subQuestions()[id];
            result.subQuestions[question.id()] = question.publicDataObj();
        }
        return result;
    };
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
    MultiQuestion.prototype.countSubQuestions = function () {
        return Object.keys(this.subQuestions()).length;
    };
    /**
     * Populates the Question's fields data from
     * given data object representing information for a new question.
     */
    MultiQuestion.prototype.setFromRequest = function (request) {
        _super.prototype.setFromRequest.call(this, request);
        if (Array.isArray(request.subQuestions)) {
            this.setSubQuestionsFromRequest(request.subQuestions);
        }
    };
    /**
     *
     */
    MultiQuestion.prototype.setSubQuestionsFromRequest = function (subQuestions) {
        (0, designByContract_1.pre)("subQuestions is of type Array", Array.isArray(subQuestions));
        for (var i = 0; i < subQuestions.length; i++) {
            var subQuestionData = subQuestions[i];
            var subQuestion = new Question_1.default();
            subQuestion.setDatabase(this.database());
            subQuestion.setFromRequest(subQuestionData);
            this.subQuestions()[subQuestion.id()] = subQuestion;
        }
    };
    return MultiQuestion;
}(Question_1.default));
exports.default = MultiQuestion;
