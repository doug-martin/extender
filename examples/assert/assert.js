var assert = require("assert"),
    extender = require("../../index"),
    is = require("../is"),
    util = require("util"),
    format = util.format;

var methods = Object.keys(assert);

var extension = {};

methods.forEach(function (k) {
    extension[k] = function (val) {
        assert[k].apply(assert, arguments);
    }
});

extension.lengthOf = function (arr, length, message) {
    if (arr.length !== length) {
        assert.fail(arr.length, length, message || format("expected %s to have length of %d", arr, length), extension.lengthOf);
    }
};


extension.instanceOf = function (val, cls, message) {
    if (!val instanceof cls) {
        assert.fail(val, cls, message || format("expected %j to be instanceof %s", [val, cls]), "===", extension.isNotNull);
    }
};

[
    ["isFalse", "to be false"],
    ["isTrue", "to be true"],
    ["isFalsy", "to be falsy"],
    ["isTruthy", "to be truthy"],
    ["isNull", "null"],
    ["isNotNull", "not null"],
    ["isRegExp", "a RegExp"],
    ["isArray", "an array"],
    ["isNumber", "a number"],
    ["isHash", "a hash"],
    ["isObject", "an object"],
    ["isDate", "a date"],
    ["isBoolean", "a boolean"],
    ["isString", "a string"],
    ["isUndefined", "undefined"],
    ["isUndefinedOrNull", "undefined or null"],
    ["isPromiseLike", "a promise"],
    ["isFunction", "a function"],
    ["isEmpty", "empty"]
].forEach(function (i) {
        var k = i[0], extra = i[1];
        extension[k] = function (val, message) {
            if (!is[k](val)) {
                assert.fail(val, 0, message || format("expected %s, to be " + extra, val), extension[k]);
            }
        };
    });

extension.and = function (val, newVal) {
    return newVal;
}

module.exports = extender.define(extension);
