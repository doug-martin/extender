"use strict";

var it = require("it"),
    assert = require("assert"),
    extender = require("../index"),
    is = require("./is");

it.describe("extender",function (it) {

    var myExtender = extender
        .define({
            isFunction: is.function,
            isNumber: is.number,
            isString: is.string,
            isDate: is.date,
            isArray: is.array,
            isBoolean: is.boolean,
            isUndefined: is.undefined,
            isDefined: is.defined,
            isUndefinedOrNull: is.undefinedOrNull,
            isNull: is.null,
            isArguments: is.arguments,
            isInstanceOf: is.instanceOf,
            isRegExp: is.regExp
        })
        .define(is.string, {
            multiply: function (str, times) {
                var ret = str;
                for (var i = 1; i < times; i++) {
                    ret += str;
                }
                return ret;
            },

            toArray: function (str, delim) {
                delim = delim || "";
                return str.split(delim);
            },

            noWrap: {
                multiplyPlain: function (str, times) {
                    var ret = str;
                    for (var i = 1; i < times; i++) {
                        ret += str;
                    }
                    return ret;
                },

                toArrayPlain: function (str, delim) {
                    delim = delim || "";
                    return str.split(delim);
                }
            }
        })
        .define(is.array, {
            pluck: function (arr, m) {
                var ret = [];
                for (var i = 0, l = arr.length; i < l; i++) {
                    ret.push(arr[i][m]);
                }
                return ret;
            },

            noWrap: {
                pluckPlain: function (arr, m) {
                    var ret = [];
                    for (var i = 0, l = arr.length; i < l; i++) {
                        ret.push(arr[i][m]);
                    }
                    return ret;
                }
            }
        })
        .define(is.boolean, {

            invert: function (val) {
                return !val;
            },

            noWrap: {
                invertPlain: function (val) {
                    return !val;
                }
            }

        });

    it.should("add eq, neq", function () {
        var str = myExtender("hello");
        assert.isTrue(str.eq("hello").value());
        assert.isFalse(str.eq("helloo").value());
        assert.isFalse(str.neq("hello").value());
        assert.isTrue(str.neq("helloo").value());
    });

    it.should("extend strings", function () {
        var str = myExtender("hello");
        assert.isTrue(str.isString().value());
        assert.equal(str.multiply(5).value(), "hellohellohellohellohello");
    });

    it.should("extend booleans", function () {
        var extended = myExtender(true);
        assert.isTrue(extended.isBoolean().value());
        assert.isFalse(extended.invert().value());
    });

    it.should("extend arrays", function () {
        var extended = myExtender([
            {a: "a"},
            {a: "b"},
            {a: "c"}
        ]);
        assert.isTrue(extended.isArray().value());
        assert.deepEqual(extended.pluck("a").value(), ["a", "b", "c"]);
    });

    it.should("not wrap methods in noWrap", function () {
        assert.equal(myExtender("hello").multiplyPlain(5), "hellohellohellohellohello");
        assert.isFalse(myExtender(true).invertPlain());
        assert.deepEqual(myExtender([
            {a: "a"},
            {a: "b"},
            {a: "c"}
        ]).pluckPlain("a"), ["a", "b", "c"]);
    });

    it.should("keep extenders in their own scope", function () {
        var myExtender = extender
            .define({
                isFunction: is.function,
                isNumber: is.number,
                isString: is.string,
                isDate: is.date,
                isArray: is.array,
                isBoolean: is.boolean,
                isUndefined: is.undefined,
                isDefined: is.defined,
                isUndefinedOrNull: is.undefinedOrNull,
                isNull: is.null,
                isArguments: is.arguments,
                isInstanceOf: is.instanceOf,
                isRegExp: is.regExp
            });

        var extended = myExtender([
            {a: "a"},
            {a: "b"},
            {a: "c"}
        ]);
        assert.isTrue(extended.isArray().value());
        assert.isFalse(myExtender(extended.pluck).isFunction().value());
    });

    it.should("allow extending extenders", function () {
        var myExtender = extender
            .define({
                isFunction: is.function,
                isNumber: is.number,
                isString: is.string,
                isDate: is.date,
                isArray: is.array,
                isBoolean: is.boolean,
                isUndefined: is.undefined,
                isDefined: is.defined,
                isUndefinedOrNull: is.undefinedOrNull,
                isNull: is.null,
                isArguments: is.arguments,
                isInstanceOf: is.instanceOf,
                isRegExp: is.regExp
            });
        var myExtender2 = extender.define(is.array, {
            pluck: function (arr, m) {
                var ret = [];
                for (var i = 0, l = arr.length; i < l; i++) {
                    ret.push(arr[i][m]);
                }
                return ret;
            },

            noWrap: {
                pluckPlain: function (arr, m) {
                    var ret = [];
                    for (var i = 0, l = arr.length; i < l; i++) {
                        ret.push(arr[i][m]);
                    }
                    return ret;
                }
            }
        });
        var composed = extender.extend(myExtender).extend(myExtender2);

        var extended = composed([
            {a: "a"},
            {a: "b"},
            {a: "c"}
        ]);
        assert.isTrue(extended.isArray().value());
        assert.deepEqual(extended.pluck("a").value(), ["a", "b", "c"]);

        //it should not alter the compsing extenders
        assert.throws(function () {
            myExtender("hello").pluck();
        });
        assert.throws(function () {
            myExtender2("hello").isString();
        });

    });


}).run();