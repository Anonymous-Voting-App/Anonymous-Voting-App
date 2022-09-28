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
var User_1 = __importDefault(require("../models/User"));
var Poll_1 = __importDefault(require("../models/Poll"));
var Answer_1 = __importDefault(require("../models/Answer"));
var UserManager_1 = __importDefault(require(".//UserManager"));
/**
 * Service of the anonymous voting app
 * offering all voting / polling functionalities.
 */
var VotingService = /** @class */ (function () {
    function VotingService(database) {
        (0, designByContract_1.pre)("database is of type object", typeof database === "object");
        this._database = database;
        this._userManager = new UserManager_1.default(database);
    }
    /** Database the VotingService uses. */
    VotingService.prototype.database = function () {
        return this._database;
    };
    /** Sets value of database. */
    VotingService.prototype.setDatabase = function (database) {
        /* pre("argument database is of type PrismaClient", database instanceof PrismaClient); */
        this._database = database;
        (0, designByContract_1.post)("_database is database", this._database === database);
    };
    /** UserManager the voting service uses for accessing / editing the app's users. */
    VotingService.prototype.userManager = function () {
        return this._userManager;
    };
    /** Sets value of userManager. */
    VotingService.prototype.setUserManager = function (userManager) {
        (0, designByContract_1.pre)("argument userManager is of type UserManager", userManager instanceof UserManager_1.default);
        this._userManager = userManager;
        (0, designByContract_1.post)("_userManager is userManager", this._userManager === userManager);
    };
    /**
     * Creates a new poll with given information.
     * If poll was created, returns created poll info.
     * If not, returns null.
     */
    VotingService.prototype.createPoll = function (pollOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var poll, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, designByContract_1.pre)("pollOptions is of type object", typeof pollOptions === "object");
                        (0, designByContract_1.pre)("pollOptions.name is of type string", typeof pollOptions.name === "string");
                        (0, designByContract_1.pre)("pollOptions.type is of type string", typeof pollOptions.type === "string");
                        (0, designByContract_1.pre)("pollOptions.questions is of type Array", Array.isArray(pollOptions.questions));
                        (0, designByContract_1.pre)("pollOptions.owner is of type object", typeof pollOptions.owner === "object");
                        (0, designByContract_1.pre)("pollOptions.owner.ip is of type string", typeof pollOptions.owner.ip === "string");
                        (0, designByContract_1.pre)("pollOptions.owner.cookie is of type string", typeof pollOptions.owner.cookie === "string");
                        (0, designByContract_1.pre)("pollOptions.owner.accountId is of type string", typeof pollOptions.owner.accountId === "string");
                        (0, designByContract_1.pre)("there is at least one question in the poll", pollOptions.questions.length > 0);
                        poll = new Poll_1.default(this.database());
                        return [4 /*yield*/, this.userManager().getUser(pollOptions.owner)];
                    case 1:
                        user = _a.sent();
                        if (!(user instanceof User_1.default)) {
                            throw new Error("Error: invalid user id");
                        }
                        return [4 /*yield*/, poll.createInDatabaseFromRequest(pollOptions, user)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, poll.privateDataObj()];
                }
            });
        });
    };
    /**
     * Returns a poll having given public id.
     * If no such poll exists, return null.
     */
    VotingService.prototype.getPollWithPublicId = function (publicId) {
        return __awaiter(this, void 0, void 0, function () {
            var poll;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, designByContract_1.pre)("publicId is of type string", typeof publicId === "string");
                        poll = new Poll_1.default(this.database());
                        poll.setPublicId(publicId);
                        return [4 /*yield*/, poll.existsInDatabase()];
                    case 1:
                        if (!_a.sent()) return [3 /*break*/, 3];
                        return [4 /*yield*/, poll.loadFromDatabase()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, poll.publicDataObj()];
                    case 3: return [2 /*return*/, null];
                }
            });
        });
    };
    /**
     * Answers a poll that has given publicId.
     * If poll was answered successfully, returns created answer
     * info. If not, returns null.
     */
    VotingService.prototype.answerPoll = function (answerData) {
        return __awaiter(this, void 0, void 0, function () {
            var user, poll, answer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, designByContract_1.pre)("answerData is of type object", typeof answerData === "object");
                        (0, designByContract_1.pre)("answerData.publicId is of type string", typeof answerData.publicId === "string");
                        (0, designByContract_1.pre)("answerData.answer is of type object", typeof answerData.answer === "object");
                        return [4 /*yield*/, this.userManager().getUser(answerData.answerer)];
                    case 1:
                        /* if ( !( await this.userManager(  ).userExists( answerData.answerer ) ) ) {
                            
                            user = await this.userManager(  ).createUser( answerData.answerer );
                            
                        } */
                        // Currently returns just the same dummy user for any answer request.
                        user = _a.sent();
                        if (!(user instanceof User_1.default)) {
                            throw new Error("Error: user not found.");
                        }
                        poll = new Poll_1.default(this.database());
                        poll.setPublicId(answerData.publicId);
                        return [4 /*yield*/, poll.loadFromDatabase()];
                    case 2:
                        _a.sent();
                        if (!poll.loadedFromDatabase()) return [3 /*break*/, 4];
                        return [4 /*yield*/, poll.answer(answerData.questionId, answerData.answer, user)];
                    case 3:
                        answer = _a.sent();
                        if (answer instanceof Answer_1.default) {
                            return [2 /*return*/, answer.privateDataObj()];
                        }
                        return [3 /*break*/, 5];
                    case 4: throw new Error("Error: poll with given public id not found.");
                    case 5: return [2 /*return*/, null];
                }
            });
        });
    };
    return VotingService;
}());
exports.default = VotingService;
