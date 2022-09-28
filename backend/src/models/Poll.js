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
var Question_1 = __importDefault(require(".//Question"));
var Answer_1 = __importDefault(require(".//Answer"));
var MultiQuestionCollection_1 = __importDefault(require("./MultiQuestionCollection"));
var MultiQuestion_1 = __importDefault(require("./MultiQuestion"));
/**
 * A voting poll that can have questions and an owner.
 * Also has link ids to the poll's admin view
 * and public view. Linked to Prisma database.
 */
var Poll = /** @class */ (function () {
    function Poll(database) {
        this._id = "";
        this._name = "";
        this._type = "";
        this._publicId = "";
        this._privateId = "";
        this._questions = {};
        this._answers = {};
        this._loadedFromDatabase = false;
        this._createdInDatabase = false;
        (0, designByContract_1.pre)("database is of type object", typeof database === "object");
        this._database = database;
    }
    /** Whether new database entry has been made from this instance. */
    Poll.prototype.createdInDatabase = function () {
        return this._createdInDatabase;
    };
    /** Sets value of createdInDatabase. */
    Poll.prototype.setCreatedInDatabase = function (createdInDatabase) {
        (0, designByContract_1.pre)("argument createdInDatabase is of type boolean", typeof createdInDatabase === "boolean");
        this._createdInDatabase = createdInDatabase;
        (0, designByContract_1.post)("_createdInDatabase is createdInDatabase", this._createdInDatabase === createdInDatabase);
    };
    /**
     * Whether Poll instance has been populated
     * with data from database
     */
    Poll.prototype.loadedFromDatabase = function () {
        return this._loadedFromDatabase;
    };
    /** Sets value of loadedFromDatabase. */
    Poll.prototype.setLoadedFromDatabase = function (loadedFromDatabase) {
        (0, designByContract_1.pre)("argument loadedFromDatabase is of type boolean", typeof loadedFromDatabase === "boolean");
        this._loadedFromDatabase = loadedFromDatabase;
        (0, designByContract_1.post)("_loadedFromDatabase is loadedFromDatabase", this._loadedFromDatabase === loadedFromDatabase);
    };
    /** Prisma database the instance is connected to. */
    Poll.prototype.database = function () {
        return this._database;
    };
    /** Sets value of database. */
    Poll.prototype.setDatabase = function (database) {
        //pre("argument database is of type PrismaClient", database instanceof PrismaClient);
        this._database = database;
        (0, designByContract_1.post)("_database is database", this._database === database);
    };
    /** Answers given to poll. */
    Poll.prototype.answers = function () {
        return this._answers;
    };
    /** Sets value of answers. */
    Poll.prototype.setAnswers = function (answers) {
        (0, designByContract_1.pre)("argument answers is of type object", typeof answers === "object");
        this._answers = answers;
        (0, designByContract_1.post)("_answers is answers", this._answers === answers);
    };
    /** Questions that are part of poll. */
    Poll.prototype.questions = function () {
        return this._questions;
    };
    /** Sets value of questions. */
    Poll.prototype.setQuestions = function (questions) {
        (0, designByContract_1.pre)("argument questions is of type object", typeof questions === "object");
        this._questions = questions;
        (0, designByContract_1.post)("_questions is questions", this._questions === questions);
    };
    /**
     * Private id of the poll. Knowing the private id
     * is meant to give access to editing the poll.
     */
    Poll.prototype.privateId = function () {
        return this._privateId;
    };
    /** Sets value of privateId. */
    Poll.prototype.setPrivateId = function (privateId) {
        (0, designByContract_1.pre)("argument privateId is of type string", typeof privateId === "string");
        this._privateId = privateId;
        (0, designByContract_1.post)("_privateId is privateId", this._privateId === privateId);
    };
    /**
     * Public id of the poll. Knowing
     * the public id is meant to allow answering the poll.
     */
    Poll.prototype.publicId = function () {
        return this._publicId;
    };
    /** Sets value of publicId. */
    Poll.prototype.setPublicId = function (publicId) {
        (0, designByContract_1.pre)("argument publicId is of type string", typeof publicId === "string");
        this._publicId = publicId;
        (0, designByContract_1.post)("_publicId is publicId", this._publicId === publicId);
    };
    /**
     * Who owns the poll. Can be an unidentifiable owner
     * since the poll can be edited just by knowing
     * the private id.
     */
    Poll.prototype.owner = function () {
        return this._owner;
    };
    /** Sets value of owner. */
    Poll.prototype.setOwner = function (owner) {
        (0, designByContract_1.pre)("argument owner is of type User", owner instanceof User_1.default);
        this._owner = owner;
        (0, designByContract_1.post)("_owner is owner", this._owner === owner);
    };
    /**
     * A type the poll can have. Can be used to
     * differentiate polls into types as desired.
     */
    Poll.prototype.type = function () {
        return this._type;
    };
    /** Sets value of type. */
    Poll.prototype.setType = function (type) {
        (0, designByContract_1.pre)("argument type is of type string", typeof type === "string");
        this._type = type;
        (0, designByContract_1.post)("_type is type", this._type === type);
    };
    /** Name of the poll. */
    Poll.prototype.name = function () {
        return this._name;
    };
    /** Sets value of name. */
    Poll.prototype.setName = function (name) {
        (0, designByContract_1.pre)("argument name is of type string", typeof name === "string");
        this._name = name;
        (0, designByContract_1.post)("_name is name", this._name === name);
    };
    /** Unique database id of the poll. */
    Poll.prototype.id = function () {
        return this._id;
    };
    /** Sets value of id. */
    Poll.prototype.setId = function (id) {
        (0, designByContract_1.pre)("argument id is of type string", typeof id === "string");
        this._id = id;
        (0, designByContract_1.post)("_id is id", this._id === id);
    };
    /**
     *
     */
    Poll.prototype._createPollInDatabase = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._database.poll.create({
                            data: this.newDatabaseObject()
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     *
     */
    Poll.prototype._createQuestionsInDatabase = function (pollData) {
        return __awaiter(this, void 0, void 0, function () {
            var questions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        questions = new MultiQuestionCollection_1.default(this.database(), this.questions());
                        questions.setPollId(pollData.id);
                        return [4 /*yield*/, questions.createNewInDatabase()];
                    case 1:
                        _a.sent();
                        this.setQuestions(questions.questions());
                        return [2 /*return*/, questions.databaseData()];
                }
            });
        });
    };
    /**
     * Creates new database object in Prisma database
     * from the properties of this instance.
     */
    Poll.prototype.createNewInDatabase = function () {
        return __awaiter(this, void 0, void 0, function () {
            var pollData, questionsData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, designByContract_1.pre)("poll is new", this.id() === "");
                        return [4 /*yield*/, this._createPollInDatabase()];
                    case 1:
                        pollData = _a.sent();
                        return [4 /*yield*/, this._createQuestionsInDatabase(pollData)];
                    case 2:
                        questionsData = _a.sent();
                        pollData.questions = questionsData;
                        this.setFromDatabaseData(pollData, true);
                        this._createdInDatabase = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Object that can be given to Prisma database to add
     * the information of this instance into the database.
     */
    Poll.prototype.newDatabaseObject = function () {
        (0, designByContract_1.pre)("name is set", this.name().length > 0);
        (0, designByContract_1.pre)("privateId is set", this.privateId().length > 0);
        (0, designByContract_1.pre)("publicId is set", this.publicId().length > 0);
        (0, designByContract_1.pre)("owner is set", this.owner() instanceof User_1.default);
        (0, designByContract_1.pre)("owner has v4 uuid", this.owner().hasV4Uuid());
        var result = {
            name: this.name(),
            adminLink: this.privateId(),
            pollLink: this.publicId(),
            resultLink: "",
            creatorId: this.owner().id()
        };
        if (this.owner() instanceof User_1.default) {
            result.creatorId = this.owner().id();
        }
        return result;
    };
    /**
     * Query object inside where property to use
     * when trying to find this poll in database.
     */
    Poll.prototype.findSelfInDatabaseQuery = function () {
        var subQueries = [];
        var query = { OR: subQueries };
        if (this.id().length > 0) {
            subQueries.push({ id: this.id() });
        }
        if (this.publicId().length > 0) {
            subQueries.push({ pollLink: this.publicId() });
        }
        if (this.privateId().length > 0) {
            subQueries.push({ adminLink: this.privateId() });
        }
        return query;
    };
    /**
     * Whether poll can be found in the
     * Prisma database.
     */
    Poll.prototype.existsInDatabase = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, designByContract_1.pre)("either id, publicId or privateId is set", this.id().length > 0 ||
                            this.publicId().length > 0 ||
                            this.privateId().length > 0);
                        return [4 /*yield*/, this._database.poll.findFirst({
                                where: this.findSelfInDatabaseQuery()
                            })];
                    case 1:
                        result = (_a.sent()) !== null;
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Populates info of the poll with data retrieved
     * from database. If poll with not found in database,
     * does nothing. If poll was found, .loadedFromDatabase() becomes true.
     */
    Poll.prototype.loadFromDatabase = function () {
        return __awaiter(this, void 0, void 0, function () {
            var pollData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, designByContract_1.pre)("either id, publicId or privateId is set", this.id().length > 0 ||
                            this.publicId().length > 0 ||
                            this.privateId().length > 0);
                        return [4 /*yield*/, this._database.poll.findFirst({
                                where: this.findSelfInDatabaseQuery(),
                                include: { questions: { include: { options: true } } }
                            })];
                    case 1:
                        pollData = _a.sent();
                        if (pollData !== null) {
                            this.setFromDatabaseData(pollData);
                            this._loadedFromDatabase = true;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Manually populates info of the poll with data object
     * that's been retrieved from the database beforehand.
     */
    Poll.prototype.setFromDatabaseData = function (pollData, omitQuestions) {
        if (omitQuestions === void 0) { omitQuestions = false; }
        (0, designByContract_1.pre)("pollData.id is of type string", typeof pollData.id === "string");
        (0, designByContract_1.pre)("pollData.name is of type string", typeof pollData.name === "string");
        (0, designByContract_1.pre)("pollData.pollLink is of type string", typeof pollData.pollLink === "string");
        (0, designByContract_1.pre)("pollData.adminLink is of type string", typeof pollData.adminLink === "string");
        (0, designByContract_1.pre)("pollData.questions is of type Array", Array.isArray(pollData.questions));
        this.setId(pollData.id);
        this.setName(pollData.name);
        // Not actually ever a string. Just a quick fix so unit tests don't break.
        if (typeof pollData.type === "string") {
            this.setType(pollData.type);
        }
        if (typeof pollData.creator === "object") {
            var owner = new User_1.default();
            owner.setFromDatabaseData(pollData.creator);
            this.setOwner(owner);
        }
        this.setPublicId(pollData.pollLink);
        this.setPrivateId(pollData.adminLink);
        if (!omitQuestions) {
            this.setQuestionsFromDatabaseData(pollData.questions);
        }
        this.setAnswersFromDatabaseData(pollData.questions);
    };
    /**
     * Manually populates info of the poll's questions with data
     * that's been retrieved from the database beforehand.
     */
    Poll.prototype.setQuestionsFromDatabaseData = function (questionsData) {
        for (var i = 0; i < questionsData.length; i++) {
            var questionData = questionsData[i];
            var question = new MultiQuestion_1.default();
            question.setFromDatabaseData(questionData);
            this.questions()[question.id()] = question;
        }
    };
    /**
     * Manually populates info of the poll's answers with data
     * that's been retrieved from the database beforehand.
     */
    Poll.prototype.setAnswersFromDatabaseData = function (questionsData) {
        var answersData = [];
        for (var i = 0; i < questionsData.length; i++) {
            var question = questionsData[i];
            answersData = answersData.concat(question.votes);
        }
        for (var i = 0; i < answersData.length; i++) {
            var answerData = answersData[i];
            var answer = new Answer_1.default();
            answer.setFromDatabaseData(answerData);
            this.answers()[answer.id()] = answer;
        }
    };
    /**
     * Gives an answer to a question in the poll from given user.
     * Makes all needed modifications
     * to database and returns Answer object representing
     * the created answer.
     * If given answer data is not of acceptable format for the question,
     * does nothing and returns undefined.
     */
    Poll.prototype.answer = function (questionId, answerData, user) {
        return __awaiter(this, void 0, void 0, function () {
            var question, answer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, designByContract_1.pre)("poll has question", this.questions()[questionId] instanceof Question_1.default);
                        if (!this.userHasRightToAnswerPoll(user)) return [3 /*break*/, 2];
                        question = this.questions()[questionId];
                        question.setDatabase(this.database());
                        return [4 /*yield*/, question.answer(answerData, user)];
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
     * Whether given user has a right to answer the poll.
     * A user might not have a right to answer if they
     * have already answered the poll, for example.
     */
    Poll.prototype.userHasRightToAnswerPoll = function (user) {
        return true;
    };
    /**
     * Generates a new random string and sets
     * .publicId() with it.
     */
    Poll.prototype.generatePublicId = function () {
        var id = "";
        var letters = "abcdefghijklmnopqrstuvxyz";
        for (var i = 0; i < 10; i++) {
            id += letters[Math.floor(Math.random() * letters.length)];
        }
        this._publicId = id;
    };
    /**
     * Generates a new random string and sets
     * .privateId() with it.
     */
    Poll.prototype.generatePrivateId = function () {
        var id = "";
        var letters = "abcdefghijklmnopqrstuvxyz";
        for (var i = 0; i < 10; i++) {
            id += letters[Math.floor(Math.random() * letters.length)];
        }
        this._privateId = id;
    };
    /**
     * Data object of the Poll's information that
     * should be privately available only to someone
     * with editing access to the poll. For example,
     * the poll's owner.
     */
    Poll.prototype.privateDataObj = function () {
        var result = {
            id: this.id(),
            name: this.name(),
            publicId: this.publicId(),
            privateId: this.privateId(),
            type: this.type(),
            questions: this.questionsDataObjs(),
            answers: this.answersDataObjs()
        };
        if (this.owner() instanceof User_1.default) {
            result.owner = this.owner().publicDataObj();
        }
        return result;
    };
    /**
     * Data object of the Poll's information that
     * should be publically available to someone aware of
     * the poll's existence (i.e a voter).
     */
    Poll.prototype.publicDataObj = function () {
        var result = {
            id: this.id(),
            name: this.name(),
            publicId: this.publicId(),
            type: this.type(),
            questions: this.questionsDataObjs()
        };
        return result;
    };
    /**
     * Poll's questions as non-sensitive public data objects.
     */
    Poll.prototype.questionsDataObjs = function () {
        var result = {};
        for (var id in this.questions()) {
            var question = this.questions()[id];
            result[question.id()] = question.publicDataObj();
        }
        return result;
    };
    /**
     * Poll's answers as data objects. Contain sensitive information.
     * Contains the information of who the answerers are.
     */
    Poll.prototype.answersDataObjs = function () {
        var result = {};
        for (var id in this.answers()) {
            var answer = this.answers()[id];
            result[answer.id()] = answer.privateDataObj();
        }
        return result;
    };
    /**
     * Populates the Poll's questions with Questions made from
     * given data objects representing information for new questions.
     */
    Poll.prototype.setQuestionsFromRequests = function (requests) {
        (0, designByContract_1.pre)("requests is of type Array", Array.isArray(requests));
        (0, designByContract_1.pre)("poll has no questions set beforehand", Object.keys(this.questions()).length === 0);
        var id = 0;
        for (var i = 0; i < requests.length; i++) {
            var request = requests[i];
            var question = new MultiQuestion_1.default();
            question.setDatabase(this.database());
            question.setFromRequest(request);
            id++;
            this.questions()[id.toString()] = question;
        }
    };
    /**
     *
     */
    Poll.prototype.createInDatabaseFromRequest = function (request, owner) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.setFromRequest(request, owner);
                        this.generateIds();
                        return [4 /*yield*/, this.createNewInDatabase()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     */
    Poll.prototype.setFromRequest = function (request, owner) {
        this.setOwner(owner);
        this.setName(request.name);
        this.setQuestionsFromRequests(request.questions);
    };
    /**
     *
     */
    Poll.prototype.generateIds = function () {
        this.generatePrivateId();
        this.generatePublicId();
    };
    return Poll;
}());
exports.default = Poll;
