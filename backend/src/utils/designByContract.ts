import assert from 'assert';

const preOff = false;
const postOff = false;
const invariantOff = false;

export function pre(name: string, bool: boolean) {
    if (preOff) return;

    assert(typeof bool === 'boolean', 'bool is boolean');
    assert(bool, name);
}

export function post(name: string, bool: boolean) {
    if (postOff) return;

    assert(typeof bool === 'boolean', 'bool is boolean');
    assert(bool, name);
}

export function invariant(name: string, bool: boolean) {
    if (invariantOff) return;

    assert(typeof bool === 'boolean', 'bool is boolean');
    assert(bool, name);
}

export default {
    pre: pre,
    post: post,
    invariant: invariant
};
