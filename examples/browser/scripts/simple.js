(function () {
    "use strict";
    function isUndefinedOrNull(obj) {
        var undef;
        return obj === undef || obj === null;
    }

    function isUndefined(obj) {
        var undef;
        return obj === undef;
    }

    function isArray(obj) {
        return Object.prototype.toString.call(obj) === "[object Array]";
    }

    function isBoolean(obj) {
        var undef, type = typeof obj;
        return !isUndefinedOrNull(obj) && type === "boolean" || type === "Boolean";
    }

    function isString(obj) {
        return !isUndefinedOrNull(obj) && (typeof obj === "string" || obj instanceof String);
    }


    this.simple = extender
        //add these methods to anything passed in
        .define({
            isUndefined: isUndefined
        })
        //add these methods to only strings
        .define(isString, {
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
        .define(isArray, {
            pluck: function (arr, m) {
                var ret = [];
                for (var i = 0, l = arr.length; i < l; i++) {
                    ret.push(arr[i][m]);
                }
                return ret;
            }
        })
        //add these methods to only booleans
        .define(isBoolean, {
            invert: function (val) {
                return !val;
            }
        });


}).call(this);

