"use strict";
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
var User_1 = __importDefault(require(".//User"));
var Answer_1 = __importDefault(require("./Answer"));
/**
 * A question that a Poll can have. Connected to Prisma database.
 * Different question types so far are: multichoice.
 * A user can .answer() the question to give their answer to it,
 * modifying the database.
 */
var Question = /** @class */ (function () {
    function Question(database) {
        this._title = "";
        this._description = "";
        this._type = "";
        this._id = "";
        this._pollId = "";
        this._answers = {};
        this._databaseData = {};
        if (typeof database === "object") {
            this._database = database;
        }
    }
    /**  */
    Question.prototype.databaseData = function () {
        return this._databaseData;
    };
    /** Sets value of databaseData. */
    Question.prototype.setDatabaseData = function (databaseData) {
        (0, designByContract_1.pre)("argument databaseData is of type object", typeof databaseData === "object");
        this._databaseData = databaseData;
        (0, designByContract_1.post)("_databaseData is databaseData", this._databaseData === databaseData);
    };
    /** Answers that have been given to the question. */
    Question.prototype.answers = function () {
        return this._answers;
    };
    /** Sets value of answers. */
    Question.prototype.setAnswers = function (answers) {
        (0, designByContract_1.pre)("argument answers is of type object", typeof answers === "object");
        this._answers = answers;
        (0, designByContract_1.post)("_answers is answers", this._answers === answers);
    };
    /** Prisma database the instance is connected to. */
    Question.prototype.database = function () {
        return this._database;
    };
    /** Sets value of database. */
    Question.prototype.setDatabase = function (database) {
        //pre("argument database is of type PrismaClient", database instanceof PrismaClient);
        this._database = database;
        (0, designByContract_1.post)("_database is database", this._database === database);
    };
    /** Unique database id of the poll the question is for. */
    Question.prototype.pollId = function () {
        return this._pollId;
    };
    /** Sets value of pollId. */
    Question.prototype.setPollId = function (pollId) {
        (0, designByContract_1.pre)("argument pollId is of type string", typeof pollId === "string");
        this._pollId = pollId;
        (0, designByContract_1.post)("_pollId is pollId", this._pollId === pollId);
    };
    /** Unique database id of the question. */
    Question.prototype.id = function () {
        return this._id;
    };
    /** Sets value of id. */
    Question.prototype.setId = function (id) {
        (0, designByContract_1.pre)("argument id is of type string", typeof id === "string");
        this._id = id;
        (0, designByContract_1.post)("_id is id", this._id === id);
    };
    /** Type of the question. The Question class is a generic
     * question that can take any freeform answer string.
     */
    Question.prototype.type = function () {
        return this._type;
    };
    /** Sets value of type. */
    Question.prototype.setType = function (type) {
        (0, designByContract_1.pre)("argument type is of type string", typeof type === "string");
        this._type = type;
        (0, designByContract_1.post)("_type is type", this._type === type);
    };
    /** Description of the question describing the question
     * to a user.
     */
    Question.prototype.description = function () {
        return this._description;
    };
    /** Sets value of description. */
    Question.prototype.setDescription = function (description) {
        (0, designByContract_1.pre)("argument description is of type string", typeof description === "string");
        this._description = description;
        (0, designByContract_1.post)("_description is description", this._description === description);
    };
    /** Title or name of the question. */
    Question.prototype.title = function () {
        return this._title;
    };
    /** Sets value of title. */
    Question.prototype.setTitle = function (title) {
        (0, designByContract_1.pre)("argument title is of type string", typeof title === "string");
        this._title = title;
        (0, designByContract_1.post)("_title is title", this._title === title);
    };
    /**
     *
     */
    Question.prototype.createNewInDatabase = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, designByContract_1.pre)("pollId is set", this.pollId().length > 0);
                        return [4 /*yield*/, this._database.question.create({
                                data: this.newDatabaseObject()
                            })];
                    case 1:
                        data = _a.sent();
                        this.setFromDatabaseData(data);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     */
    Question.prototype.createNewInDatabaseAsOption = function (parentId) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, designByContract_1.pre)("parentId is of type string", typeof parentId === "string");
                        (0, designByContract_1.pre)("question is new", this.id().length == 0);
                        return [4 /*yield*/, this._database.option.create({
                                data: this.newDatabaseObjectAsOption(parentId)
                            })];
                    case 1:
                        data = _a.sent();
                        this.setFromOptionDatabaseData(data);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Makes new object from the instance's info that can
     * be added to Prisma database.
     */
    Question.prototype.newDatabaseObject = function () {
        return {
            // A test type that is in the database already. 
            // The schema demands some kind of typeId 
            // even though question type are not currently used for anything.
            typeId: "7b76d1c6-8f40-4509-8317-ce444892b1ee",
            pollId: this.pollId()
        };
    };
    /**
     * Sets instance's properties from given question object
     * received from the database.
     */
    Question.prototype.setFromDatabaseData = function (questionData) {
        (0, designByContract_1.pre)("questionData is of type object", typeof questionData === "object");
        (0, designByContract_1.pre)("questionData.id is of type string", typeof questionData.id === "string");
        (0, designByContract_1.pre)("questionData.pollId is of type string", typeof questionData.pollId === "string");
        this.setId(questionData.id);
        if (typeof questionData.title === "string") {
            this.setTitle(questionData.title);
        }
        if (typeof questionData.description === "string") {
            this.setDescription(questionData.description);
        }
        this.setPollId(questionData.pollId);
        // Not actually ever a string. Just a quick fix so unit tests don't break.
        if (typeof questionData.type === "string") {
            this.setType(questionData.type);
        }
        if (Array.isArray(questionData.votes)) {
            for (var i = 0; i < questionData.votes.length; i++) {
                var answerData = questionData.votes[i];
                var answer = new Answer_1.default();
                answer.setFromDatabaseData(answerData);
                this.answers()[answer.id()] = answer;
            }
        }
        else {
            questionData.votes = [];
        }
        this.setDatabaseData(questionData);
    };
    /**
     *
     */
    Question.prototype.setFromOptionDatabaseData = function (optionData) {
        (0, designByContract_1.pre)("optionData is of type object", typeof optionData === "object");
        (0, designByContract_1.pre)("optionData.id is of type string", typeof optionData.id === "string");
        (0, designByContract_1.pre)("optionData.questionId is of type string", typeof optionData.questionId === "string");
        this.setId(optionData.id);
    };
    /**
     * Gives an answer to the question from given user.
     * Makes all needed modifications
     * to database and returns Answer object representing
     * the created answer.
     * If given answer data is not of acceptable format for the question,
     * does nothing and returns undefined.
     */
    Question.prototype.answer = function (answerData, answerer) {
        return __awaiter(this, void 0, void 0, function () {
            var answer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, designByContract_1.pre)("answerData is of type object", typeof answerData === "object");
                        (0, designByContract_1.pre)("answerer is of type User", answerer instanceof User_1.default);
                        if (!this.answerDataIsAcceptable(answerData)) return [3 /*break*/, 2];
                        answer = new Answer_1.default();
                        answer.setDatabase(this._database);
                        answer.setQuestionId(this.id());
                        answer.setValue(answerData.answer);
                        answer.setAnswerer(answerer);
                        return [4 /*yield*/, answer.createNewInDatabase()];
                    case 1:
                        _a.sent();
                        this.answers()[answer.id()] = answer;
                        return [2 /*return*/, answer];
                    case 2: throw new Error("Error: Answer data is not acceptable.");
                }
            });
        });
    };
    /**
     * Gives an answer to the question but
     * treating the answer instance in the database
     * through the 'option' table.
     */
    Question.prototype.answerAsOption = function (answerData, answerer, parentId) {
        return __awaiter(this, void 0, void 0, function () {
            var answer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, designByContract_1.pre)("answerData is of type object", typeof answerData === "object");
                        (0, designByContract_1.pre)("answerer is of type User", answerer instanceof User_1.default);
                        if (!this.answerDataIsAcceptable(answerData)) return [3 /*break*/, 2];
                        answer = new Answer_1.default();
                        answer.setDatabase(this._database);
                        answer.setQuestionId(parentId);
                        answer.setValue(answerData.answer);
                        answer.setAnswerer(answerer);
                        return [4 /*yield*/, answer.createNewInDatabase()];
                    case 1:
                        _a.sent();
                        this.answers()[answer.id()] = answer;
                        return [2 /*return*/, answer];
                    case 2: throw new Error("Error: Answer data is not acceptable.");
                }
            });
        });
    };
    /**
     * Whether given answer data is of acceptable format.
     * In other words, whether the given answer is really an
     * answer to the question. In the Question base class, any kind
     * of answer (except undefined) is accepted but inheriting sub-classes are
     * allowed to set their own criteria. The variable type of
     * answerData.answer is also left up to inheriting sub-classes to restrict
     * if they so wish.
     */
    Question.prototype.answerDataIsAcceptable = function (answerData) {
        (0, designByContract_1.pre)("answerData is of type object", typeof answerData === "object");
        return answerData.answer !== undefined;
    };
    /**
     * A data object of the question's non-sensitive public information.
     */
    Question.prototype.publicDataObj = function () {
        return {
            id: this.id(),
            title: this.title(),
            description: this.description(),
            type: this.type(),
            pollId: this.pollId()
        };
    };
    /**
     * Populates the Question's fields data from
     * given data object representing information for a new question.
     */
    Question.prototype.setFromRequest = function (request) {
        this.setTitle(request.title);
        this.setDescription(request.description);
    };
    /**
     *
     */
    Question.prototype.newDatabaseObjectAsOption = function (parentId) {
        return {
            option: this.title(),
            questionId: parentId
        };
    };
    /**
     *
     */
    Question.prototype.setFromOptionData = function (optionData) {
        (0, designByContract_1.pre)("optionData is of type object", typeof optionData === "object");
        (0, designByContract_1.pre)("optionData.option is of type string", typeof optionData.option === "string");
        (0, designByContract_1.pre)("optionData.id is of type string", typeof optionData.id === "string");
        this.setTitle(optionData.option);
        this.setId(optionData.id);
    };
    return Question;
}());
exports.default = Question;
