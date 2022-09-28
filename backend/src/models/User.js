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
Object.defineProperty(exports, "__esModule", { value: true });
var designByContract_1 = require("../utils/designByContract");
/**
 * A user of the anonymous voting app.
 * Can be connected to the database.
 * The user can be identified either with ip
 * or cookie or accountId.
 * Only registered users have account ids.
 * The same User class is used for registered users
 * and anonymous users.
 */
var User = /** @class */ (function () {
    function User() {
        this._ip = "";
        this._cookie = "";
        this._accountId = "";
        this._loadedFromDatabase = false;
        this._id = "";
        this._createdInDatabase = false;
    }
    /** Whether new user entry in database has been created from this instance. */
    User.prototype.createdInDatabase = function () {
        return this._createdInDatabase;
    };
    /** Sets value of createdInDatabase. */
    User.prototype.setCreatedInDatabase = function (createdInDatabase) {
        (0, designByContract_1.pre)("argument createdInDatabase is of type boolean", typeof createdInDatabase === "boolean");
        this._createdInDatabase = createdInDatabase;
        (0, designByContract_1.post)("_createdInDatabase is createdInDatabase", this._createdInDatabase === createdInDatabase);
    };
    /** Database id of user. */
    User.prototype.id = function () {
        return this._id;
    };
    /** Sets value of id. */
    User.prototype.setId = function (id) {
        (0, designByContract_1.pre)("argument id is of type string", typeof id === "string");
        this._id = id;
        (0, designByContract_1.post)("_id is id", this._id === id);
    };
    /** Prisma database the instance is connected to. */
    User.prototype.database = function () {
        return this._database;
    };
    /** Sets value of database. */
    User.prototype.setDatabase = function (database) {
        //pre("argument database is of type PrismaClient", database instanceof PrismaClient);
        this._database = database;
        (0, designByContract_1.post)("_database is database", this._database === database);
    };
    /** Whether the user has been loaded from the database. */
    User.prototype.loadedFromDatabase = function () {
        return this._loadedFromDatabase;
    };
    /** Account id of user if user is registered. */
    User.prototype.accountId = function () {
        return this._accountId;
    };
    /** Sets value of accountId. */
    User.prototype.setAccountId = function (accountId) {
        (0, designByContract_1.pre)("argument accountId is of type string", typeof accountId === "string");
        this._accountId = accountId;
        (0, designByContract_1.post)("_accountId is accountId", this._accountId === accountId);
    };
    /** Possible cookie (active or inactive) the account has. */
    User.prototype.cookie = function () {
        return this._cookie;
    };
    /** Sets value of cookie. */
    User.prototype.setCookie = function (cookie) {
        (0, designByContract_1.pre)("argument cookie is of type string", typeof cookie === "string");
        this._cookie = cookie;
        (0, designByContract_1.post)("_cookie is cookie", this._cookie === cookie);
    };
    /** IP address of the user. Mostly needed for identifying anonymous users. */
    User.prototype.ip = function () {
        return this._ip;
    };
    /** Sets value of ip. */
    User.prototype.setIp = function (ip) {
        (0, designByContract_1.pre)("argument ip is of type string", typeof ip === "string");
        this._ip = ip;
        (0, designByContract_1.post)("_ip is ip", this._ip === ip);
    };
    /**
     * New Prisma query object for finding the user in the database.
     */
    User.prototype.findSelfInDatabaseQuery = function () {
        var orArr = [];
        /* if ( this.ip(  ).length > 0 ) {
            
            orArr.push( { ip: this.ip(  ) } );
            
        }
        
        if ( this.cookie(  ).length > 0 ) {
            
            orArr.push( { cookie: this.cookie(  ) } );
            
        }
        
        if ( this.accountId(  ).length > 0 ) {
            
            orArr.push( { accountId: this.accountId(  ) } );
            
        } */
        if (this.accountId().length > 0) {
            orArr.push({ id: this.accountId() });
        }
        return {
            where: {
                OR: orArr
            }
        };
    };
    /**
     * Sets the user object's values from given data returned by the database.
     */
    User.prototype.setFromDatabaseData = function (userData) {
        (0, designByContract_1.pre)("userData is of type object", typeof userData === "object");
        (0, designByContract_1.pre)("userData.id is of type string", typeof userData.id === "string");
        this.setId(userData.id);
    };
    /**
     * Whether poll with the same id can be found in the
     * Prisma database.
     */
    User.prototype.existsInDatabase = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = false;
                        if (!(this.id().length > 0 ||
                            this.ip().length > 0 ||
                            this.cookie().length > 0 ||
                            this.accountId().length > 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._database.user.findFirst(this.findSelfInDatabaseQuery())];
                    case 1:
                        result = (_a.sent()) !== null;
                        _a.label = 2;
                    case 2: return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Makes new object in Prisma database from the values
     * of the properties of this instance.
     */
    User.prototype.createNewInDatabase = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._database.user.create({ data: this.newDatabaseObject() })];
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
     * A new Prisma-compatible object used for when creating a
     * database entry for the user.
     */
    User.prototype.newDatabaseObject = function () {
        return {
            name: "dummy-name",
            email: "dummy-email",
            password: "dummy-password"
        };
    };
    /**
     * Loads the user's info from the database.
     * If user is not in database, then does nothing.
     * If the user was found in the database, then
     * .loadedFromDatabase() becomes true.
     */
    User.prototype.loadFromDatabase = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, designByContract_1.pre)("either id, ip, cookie or accountId is set", this.id().length > 0 ||
                            this.ip().length > 0 ||
                            this.cookie().length > 0 ||
                            this.accountId().length > 0);
                        return [4 /*yield*/, this._database.user.findFirst(this.findSelfInDatabaseQuery())];
                    case 1:
                        data = _a.sent();
                        if (data !== null) {
                            this.setFromDatabaseData(data);
                            this._loadedFromDatabase = true;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Whether the user can be identified at least somehow.
     * The user can be identified if they have either a
     * cookie, ip or account id set.
     */
    User.prototype.isIdentifiable = function () {
        return true;
        var result = false;
        if (this.ip().length > 0) {
            result = true;
        }
        else if (this.accountId().length > 0) {
            result = true;
        }
        else if (this.cookie().length > 0) {
            result = true;
        }
        return result;
    };
    /**
     * A data object of the user's non-sensitive public information.
     */
    User.prototype.publicDataObj = function () {
        return {
            id: this.id()
        };
    };
    /**
     * Whether user has an id that is according
     * to the v4 uuid standard.
     */
    User.prototype.hasV4Uuid = function () {
        return this.id().length === 32 || this.id().length === 36;
    };
    return User;
}());
exports.default = User;
