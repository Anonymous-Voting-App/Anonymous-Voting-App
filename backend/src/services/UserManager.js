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
var User_1 = __importDefault(require("../models/User"));
var designByContract_1 = require("../utils/designByContract");
/**
 * A service for accessing and editing the anonymous
 * voting app's users in the database.
 */
var UserManager = /** @class */ (function () {
    function UserManager(database) {
        this._users = {};
        (0, designByContract_1.pre)("database is of type object", typeof database === "object");
        this._database = database;
    }
    /** Users that are being managed. */
    UserManager.prototype.users = function () {
        return this._users;
    };
    /** Sets value of users. */
    UserManager.prototype.setUsers = function (users) {
        (0, designByContract_1.pre)("argument users is of type object", typeof users === "object");
        this._users = users;
        (0, designByContract_1.post)("_users is users", this._users === users);
    };
    /** Database the user info is stored in. */
    UserManager.prototype.database = function () {
        return this._database;
    };
    /** Sets value of database. */
    UserManager.prototype.setDatabase = function (database) {
        /* pre("argument database is of type PrismaClient", database instanceof PrismaClient); */
        this._database = database;
        (0, designByContract_1.post)("_database is database", this._database === database);
    };
    /**
     * Creates new user with given options
     * in database. Returns new user
     * if it was created.
     */
    UserManager.prototype.createUser = function (userOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, designByContract_1.pre)("userOptions is of type object", typeof userOptions === "object");
                        user = new User_1.default();
                        user.setDatabase(this.database());
                        if (typeof userOptions.ip === "string") {
                            user.setIp(userOptions.ip);
                        }
                        if (typeof userOptions.cookie === "string") {
                            user.setCookie(userOptions.cookie);
                        }
                        return [4 /*yield*/, user.createNewInDatabase()];
                    case 1:
                        _a.sent();
                        if (user.createdInDatabase()) {
                            return [2 /*return*/, user];
                        }
                        return [2 /*return*/, null];
                }
            });
        });
    };
    /**
     * Whether user with any of the given information
     * exists in database.
     */
    UserManager.prototype.userExists = function (userOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, designByContract_1.pre)("userOptions is of type object", typeof userOptions === "object");
                        (0, designByContract_1.pre)("userOptions.ip is of type string", typeof userOptions.ip === "string");
                        (0, designByContract_1.pre)("userOptions.cookie is of type string", typeof userOptions.cookie === "string");
                        (0, designByContract_1.pre)("userOptions.accountId is of type string", typeof userOptions.accountId === "string");
                        user = new User_1.default();
                        user.setDatabase(this.database());
                        user.setIp(userOptions.ip);
                        user.setCookie(userOptions.cookie);
                        user.setAccountId(userOptions.accountId);
                        return [4 /*yield*/, user.existsInDatabase()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * User with either given ip, cookie or accountId.
     * If such user does not exist in database,
     * returns undefined.
     */
    UserManager.prototype.getUser = function (userOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = new User_1.default();
                        user.setDatabase(this.database());
                        user.setId("1eb1cfae-09e7-4456-85cd-e2edfff80544");
                        user.setIp("");
                        user.setCookie("");
                        // Hard coded account id of a dummy user
                        // as a temporary solution so that 
                        // voting without having a user account possible.
                        user.setAccountId("1eb1cfae-09e7-4456-85cd-e2edfff80544");
                        return [4 /*yield*/, user.loadFromDatabase()];
                    case 1:
                        _a.sent();
                        if (user.loadedFromDatabase()) {
                            return [2 /*return*/, user];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return UserManager;
}());
exports.default = UserManager;
