var extender = require("../../index"),
    is = require("../is");


module.exports = extender
    //add these methods to anything passed in
    .define({
        isUndefined: is.isUndefined
    })
    //add these methods to only strings
    .define(is.isString, {
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
        }
    })
    //add these methods to only arrays
    .define(is.isArray, {
        pluck: function (arr, m) {
            var ret = [];
            for (var i = 0, l = arr.length; i < l; i++) {
                ret.push(arr[i][m]);
            }
            return ret;
        }
    })
    //add these methods to only booleans
    .define(is.isBoolean, {
        invert: function (val) {
            return !val;
        }
    });

