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
var Question_1 = __importDefault(require("./Question"));
/**
 * Collection of Question instances.
 */
var QuestionCollection = /** @class */ (function () {
    function QuestionCollection(database, questions) {
        if (questions === void 0) { questions = {}; }
        this._questions = {};
        this._pollId = "";
        this._databaseData = [];
        (0, designByContract_1.pre)("database is of type object", typeof database === "object");
        this._database = database;
        this._questions = questions;
    }
    /**
     * Latest data received from database corresponding to the
     * instances in this collection. Updates each time
     * .setFromDatabaseData() is called.
     */
    QuestionCollection.prototype.databaseData = function () {
        return this._databaseData;
    };
    /** Sets value of databaseData. */
    QuestionCollection.prototype.setDatabaseData = function (databaseData) {
        (0, designByContract_1.pre)("argument databaseData is of type Array<object>", Array.isArray(databaseData));
        this._databaseData = databaseData;
        (0, designByContract_1.post)("_databaseData is databaseData", this._databaseData === databaseData);
    };
    /** Questions in the collection. */
    QuestionCollection.prototype.questions = function () {
        return this._questions;
    };
    /** Sets value of questions. */
    QuestionCollection.prototype.setQuestions = function (questions) {
        (0, designByContract_1.pre)("argument questions is of type object", typeof questions === "object");
        this._questions = questions;
        (0, designByContract_1.post)("_questions is questions", this._questions === questions);
    };
    /** Database the question collection is connected to. */
    QuestionCollection.prototype.database = function () {
        return this._database;
    };
    /** Sets value of database. */
    QuestionCollection.prototype.setDatabase = function (database) {
        // pre("argument database is of type PrismaClient", database instanceof PrismaClient);
        this._database = database;
        (0, designByContract_1.post)("_database is database", this._database === database);
    };
    /**
     * Adds new question instance to collection.
     * Id of question is used as key for when adding to
     * .questions().
     */
    QuestionCollection.prototype.add = function (question) {
        (0, designByContract_1.pre)("question is of type Question", question instanceof Question_1.default);
        this.questions()[question.id()] = question;
    };
    /**
     * Creates instances into collection according
     * to data given in array of database objects for
     * questions.
     */
    QuestionCollection.prototype.setFromDatabaseObj = function (questionsData) {
        for (var i = 0; i < questionsData.length; i++) {
            var questionData = questionsData[i];
            questionData.votes = [];
            var question = new Question_1.default();
            question.setFromDatabaseData(questionData);
            this.questions()[questionData.id] = question;
        }
    };
    /**
     * Loads questions into collection from
     * database by querying with pollId.
     */
    QuestionCollection.prototype.loadFromDatabase = function () {
        return __awaiter(this, void 0, void 0, function () {
            var questionsData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (this.database().question.findMany({
                            where: {
                                pollId: this.pollId()
                            }
                        }))];
                    case 1:
                        questionsData = (_a.sent());
                        this.setQuestions({});
                        this.setFromDatabaseObj(questionsData);
                        return [2 /*return*/, questionsData];
                }
            });
        });
    };
    /**
     * Creates database entries from instances
     * in this collection.
     */
    QuestionCollection.prototype.createNewInDatabase = function () {
        return __awaiter(this, void 0, void 0, function () {
            var questionsData, i, questionData, question;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, designByContract_1.pre)("database is set", typeof this.database() === "object");
                        (0, designByContract_1.pre)("there is at least one question", Object.keys(this.questions()).length > 0);
                        return [4 /*yield*/, this.database().question.createMany({ data: this.newDatabaseObject() })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (this.database().question.findMany({
                                where: {
                                    pollId: this.pollId()
                                }
                            }))];
                    case 2:
                        questionsData = (_a.sent());
                        this.setQuestions({});
                        for (i = 0; i < questionsData.length; i++) {
                            questionData = questionsData[i];
                            questionData.votes = [];
                            question = new Question_1.default();
                            question.setFromDatabaseData(questionData);
                            this.questions()[questionData.id] = question;
                        }
                        return [2 /*return*/, questionsData];
                }
            });
        });
    };
    /**
     * Array of collection's question objects that can
     * be added to database.
     */
    QuestionCollection.prototype.newDatabaseObject = function () {
        var result = [];
        for (var id in this.questions()) {
            var question = this.questions()[id];
            result.push(question.newDatabaseObject());
        }
        return result;
    };
    /**
     * Sets pollId for collection as well
     * as all Questions in collection.
     */
    QuestionCollection.prototype.setPollId = function (pollId) {
        (0, designByContract_1.pre)("pollId is of type string", typeof pollId === "string");
        this._pollId = pollId;
        for (var id in this.questions()) {
            var question = this.questions()[id];
            question.setPollId(pollId);
        }
    };
    /**
     * The pollId of the collection. If collection has questions,
     * returns the pollId of the first question found.
     * If not, returns the static pollId property of the collection.
     */
    QuestionCollection.prototype.pollId = function () {
        if (Object.keys(this.questions()).length > 0) {
            return this.questions()[Object.keys(this.questions())[0]].pollId();
        }
        return this._pollId;
    };
    return QuestionCollection;
}());
exports.default = QuestionCollection;
