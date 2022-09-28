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
var User_1 = __importDefault(require("./User"));
/**
 * An answer to a Question. Has the id of the question it
 * is an answer to. Has the User that gave the answer.
 * The actual answer data is stored in string property .value().
 * Can be connected to Prisma database.
 */
var Answer = /** @class */ (function () {
    function Answer() {
        this._questionId = "";
        this._value = "";
        this._loadedFromDatabase = false;
        this._createdInDatabase = false;
        this._id = "";
    }
    /** Prisma database the instance is connected to. */
    Answer.prototype.database = function () {
        return this._database;
    };
    /** Sets value of database. */
    Answer.prototype.setDatabase = function (database) {
        //pre("argument database is of type PrismaClient", database instanceof PrismaClient);
        this._database = database;
        (0, designByContract_1.post)("_database is database", this._database === database);
    };
    /** Unique id of the answer. Same as in database. */
    Answer.prototype.id = function () {
        return this._id;
    };
    /** Sets value of id. */
    Answer.prototype.setId = function (id) {
        (0, designByContract_1.pre)("argument id is of type string", typeof id === "string");
        this._id = id;
        (0, designByContract_1.post)("_id is id", this._id === id);
    };
    /** Whether an answer object has been created in the database from this instance. */
    Answer.prototype.createdInDatabase = function () {
        return this._createdInDatabase;
    };
    /** Whether the instance has had its data populates from the database. */
    Answer.prototype.loadedFromDatabase = function () {
        return this._loadedFromDatabase;
    };
    /** The User that gave the answer. */
    Answer.prototype.answerer = function () {
        return this._answerer;
    };
    /** Sets value of answerer. */
    Answer.prototype.setAnswerer = function (answerer) {
        (0, designByContract_1.pre)("argument answerer is of type User", answerer instanceof User_1.default);
        this._answerer = answerer;
        (0, designByContract_1.post)("_answerer is answerer", this._answerer === answerer);
    };
    /** The actual answer data. Format of the answer string depends on
     * the question type. Answer does not take into
     * consideration whether the answer value itself is in a correct format
     * or not.
     */
    Answer.prototype.value = function () {
        return this._value;
    };
    /** Sets value of value. */
    Answer.prototype.setValue = function (value) {
        this._value = value;
        (0, designByContract_1.post)("_value is value", this._value === value);
    };
    /** Database id of the Question that was answered. */
    Answer.prototype.questionId = function () {
        return this._questionId;
    };
    /** Sets value of questionId. */
    Answer.prototype.setQuestionId = function (questionId) {
        (0, designByContract_1.pre)("argument questionId is of type string", typeof questionId === "string");
        this._questionId = questionId;
        (0, designByContract_1.post)("_questionId is questionId", this._questionId === questionId);
    };
    /**
     * Sets the instance properties from an object
     * received from the Prisma database.
     */
    Answer.prototype.setFromDatabaseData = function (answerData) {
        (0, designByContract_1.pre)("answerData is of type object", typeof answerData === "object");
        (0, designByContract_1.pre)("answerData.id is of type string", typeof answerData.id === "string");
        (0, designByContract_1.pre)("answerData.questionId is of type string", typeof answerData.questionId === "string");
        (0, designByContract_1.pre)("answerData.value is of type string", typeof answerData.value === "string");
        // pre("answerData.voterId is of type string", typeof answerData.voterId === "string");
        /* pre("answerData.voter is of type object", typeof answerData.voter === "object"); */
        this.setId(answerData.id);
        this.setQuestionId(answerData.questionId);
        this.setValue(answerData.value);
        if (typeof answerData.voter === "object") {
            var answerer = new User_1.default();
            answerer.setFromDatabaseData(answerData.voter);
        }
        else if (typeof answerData.voterId == "string") {
            var answerer = new User_1.default();
            answerer.setFromDatabaseData({ id: answerData.voterId });
        }
        this.setAnswerer(answerer);
    };
    /**
     * Makes new object in Prisma database from the values
     * of the properties of this instance.
     */
    Answer.prototype.createNewInDatabase = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._database.vote.create({ data: this.newDatabaseObject() })];
                    case 1:
                        data = _a.sent();
                        this.setFromDatabaseData(data);
                        this._createdInDatabase = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * New object that can be added to Prisma database. Constructed from the values
     * of the properties of this instance.
     */
    Answer.prototype.newDatabaseObject = function () {
        (0, designByContract_1.pre)("questionId is set", this.questionId().length > 0);
        (0, designByContract_1.pre)("answerer is set", this.answerer() instanceof User_1.default);
        (0, designByContract_1.pre)("answerer is identifiable", this.answerer().isIdentifiable());
        (0, designByContract_1.pre)("answerer id is set", this.answerer().id().length > 0);
        return {
            questionId: this.questionId(),
            value: this.value().toString(),
            voterId: this.answerer().id()
        };
    };
    /**
     * A data object of the answer containing sensitive information.
     * Contains information of who the answerer is.
     */
    Answer.prototype.privateDataObj = function () {
        return {
            id: this.id(),
            questionId: this.questionId(),
            value: this.value(),
            answerer: this.answerer().publicDataObj()
        };
    };
    return Answer;
}());
exports.default = Answer;
