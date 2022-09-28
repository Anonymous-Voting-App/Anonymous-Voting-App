
var assert = require("assert");

var preOff = false;
var postOff = false;
var invariantOff = false;

export function pre(name: string, bool: boolean) {

    if (preOff) return;

    assert(typeof bool === "boolean", "bool is boolean");

    assert(bool, name);

}

export function post(name: string, bool: boolean) {

    if (postOff) return;

    assert(typeof bool === "boolean", "bool is boolean");

    assert(bool, name);

}

export var old = (function() {

    var values: { [ prop: string ]: any } = {};

    return function(name: string, value?: any) {

        assert(typeof name === "string", "name is string");
        if (!value) assert(values[name] !== undefined, "if retrieving value, value has been stored before");
    
        var result;

        if (value) {

            if (Array.isArray(value)) {
                values[name] = value.concat();
            } else if (typeof value === "object") {
                values[name] = Object.assign({}, value);
            } else {
                values[name] = value;
            }
            
        } else {
            result = values[name];
        }

        return result;

    }


})();

export function invariant(name: string, bool: boolean) {

    if (invariantOff) return;

    assert(typeof bool === "boolean", "bool is boolean");

    assert(bool, name);

}

export default {
    pre: pre,
    post: post,
    invariant: invariant,
    old: old
}
