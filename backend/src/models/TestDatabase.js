"use strict";
/**
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
var TestDatabase = /** @class */ (function () {
    function TestDatabase() {
        this._data = {
            poll: {},
            user: {}
        };
        this._that = this;
        this.poll = {
            db: this._that,
            create: function (query) {
            }
        };
        this.user = {
            db: this._that,
            create: function (query) {
            }
        };
    }
    return TestDatabase;
}());
exports.default = TestDatabase;
