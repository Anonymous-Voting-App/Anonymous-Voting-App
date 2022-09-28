"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invariant = exports.old = exports.post = exports.pre = void 0;
var assert = require("assert");
var preOff = false;
var postOff = false;
var invariantOff = false;
function pre(name, bool) {
    if (preOff)
        return;
    assert(typeof bool === "boolean", "bool is boolean");
    assert(bool, name);
}
exports.pre = pre;
function post(name, bool) {
    if (postOff)
        return;
    assert(typeof bool === "boolean", "bool is boolean");
    assert(bool, name);
}
exports.post = post;
exports.old = (function () {
    var values = {};
    return function (name, value) {
        assert(typeof name === "string", "name is string");
        if (!value)
            assert(values[name] !== undefined, "if retrieving value, value has been stored before");
        var result;
        if (value) {
            if (Array.isArray(value)) {
                values[name] = value.concat();
            }
            else if (typeof value === "object") {
                values[name] = Object.assign({}, value);
            }
            else {
                values[name] = value;
            }
        }
        else {
            result = values[name];
        }
        return result;
    };
})();
function invariant(name, bool) {
    if (invariantOff)
        return;
    assert(typeof bool === "boolean", "bool is boolean");
    assert(bool, name);
}
exports.invariant = invariant;
exports.default = {
    pre: pre,
    post: post,
    invariant: invariant,
    old: exports.old
};
