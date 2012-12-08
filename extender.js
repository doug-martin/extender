(function () {


    /**
     *
     * @projectName extender
     * @github http://github.com/doug-martin/extender
     * @header
     * [![build status](https://secure.travis-ci.org/doug-martin/extender.png)](http://travis-ci.org/doug-martin/extender)
     * #Extender
     *
     * `extender` is a library that helps in making chainable APIs, by creating a function that accepts different values and returns an object decorated with functions based on the type.
     *
     *
     * ##Installation
     *
     * ```
     * npm install extender
     * ```
     *
     * Or [download the source](https://raw.github.com/doug-martin/extender/master/extender.js) ([minified](https://raw.github.com/doug-martin/extender/master/extender-min.js))
     *
     * **Note** `extender` depends on [`declare.js`](http://doug-martin.github.com/declare.js/).
     *
     * ###Requirejs
     *
     * To use with requirejs place the `extend` source in the root scripts directory
     *
     * ```javascript
     *
     * define(["extender"], function(extender){
     * });
     *
     * ```
     *
     *
     * ##Usage
     *
     * **`extender.define(tester, decorations)`**
     *
     * To create your own extender call the `extender.define` function.
     *
     * This function accepts an optional tester which is used to determine a value should be decorated with the specified `decorations`
     *
     * ```javascript
     * function isString(obj) {
     *     return !isUndefinedOrNull(obj) && (typeof obj === "string" || obj instanceof String);
     * }
     *
     *
     * var myExtender =
     *     .define(isString, {
     * 		multiply: function (str, times) {
     * 			var ret = str;
     * 			for (var i = 1; i < times; i++) {
     * 				ret += str;
     * 			}
     * 			return ret;
     * 		},
     * 		toArray: function (str, delim) {
     * 			delim = delim || "";
     * 			return str.split(delim);
     * 		}
     * 	});
     *
     * myExtender("hello").multiply(2).value(); //hellohello
     *
     * ```
     *
     * If do not specify a tester function and just pass in an object of `functions` then all values passed in will be decorated with methods.
     *
     * ```javascript
     *
     * function isUndefined(obj) {
     *     var undef;
     *     return obj === undef;
     * }
     *
     * function isUndefinedOrNull(obj) {
     * 	var undef;
     *     return obj === undef || obj === null;
     * }
     *
     * function isArray(obj) {
     *     return Object.prototype.toString.call(obj) === "[object Array]";
     * }
     *
     * function isBoolean(obj) {
     *     var undef, type = typeof obj;
     *     return !isUndefinedOrNull(obj) && type === "boolean" || type === "Boolean";
     * }
     *
     * function isString(obj) {
     *     return !isUndefinedOrNull(obj) && (typeof obj === "string" || obj instanceof String);
     * }
     *
     * var myExtender = extender.define({
     * 	isUndefined : isUndefined,
     * 	isUndefinedOrNull : isUndefinedOrNull,
     * 	isArray : isArray,
     * 	isBoolean : isBoolean,
     * 	isString : isString
     * });
     *
     * ```
     *
     * To use
     *
     * ```
     * var undef;
     * myExtender("hello").isUndefined().value(); //false
     * myExtender(undef).isUndefined().value(); //true
     * ```
     *
     * You can also chain extenders so that they accept multiple types and decorates accordingly.
     *
     * ```javascript
     * myExtender
     *     .define(isArray, {
     * 		pluck: function (arr, m) {
     * 			var ret = [];
     * 			for (var i = 0, l = arr.length; i < l; i++) {
     * 				ret.push(arr[i][m]);
     * 			}
     * 			return ret;
     * 		}
     * 	})
     *     .define(isBoolean, {
     * 		invert: function (val) {
     * 			return !val;
     * 		}
     * 	});
     *
     * myExtender([{a: "a"},{a: "b"},{a: "c"}]).pluck("a").value(); //["a", "b", "c"]
     * myExtender("I love javascript!").toArray(/\s+/).pluck("0"); //["I", "l", "j"]
     *
     * ```
     *
     * Notice that we reuse the same extender as defined above.
     *
     * **Return Values**
     *
     * When creating an extender if you return a value from one of the decoration functions then that value will also be decorated. If you do not return any values then the extender will be returned.
     *
     * **Default decoration methods**
     *
     * By default every value passed into an extender is decorated with the following methods.
     *
     * * `value` : The value this extender represents.
     * * `eq(otherValue)` : Tests strict equality of the currently represented value to the `otherValue`
     * * `neq(oterValue)` : Tests strict inequality of the currently represented value.
     * * `print` : logs the current value to the console.
     *
     * **Extender initialization**
     *
     * When creating an extender you can also specify a constructor which will be invoked with the current value.
     *
     * ```javascript
     * myExtender.define(isString, {
     * 	constructor : function(val){
     * 	    //set our value to the string trimmed
     * 		this._value = val.trimRight().trimLeft();
     * 	}
     * });
     * ```
     *
     * **Using `instanceof`**
     *
     * When using extenders you can test if a value is an `instanceof` of an extender by using the instanceof operator.
     *
     * ```javascript
     * var str = myExtender("hello");
     *
     * str instanceof myExtender; //true
     * ```
     *
     * ##Examples
     *
     * To see more examples click [here](https://github.com/doug-martin/extender/tree/master/examples)
     */
    function defineExtender(declare) {


        var slice = Array.prototype.slice, undef;
        var merge = (function merger() {
            function _merge(target, source) {
                var name, s;
                for (name in source) {
                    if (source.hasOwnProperty(name)) {
                        s = source[name];
                        if (!(name in target) || (target[name] !== s)) {
                            target[name] = s;
                        }
                    }
                }
                return target;
            }

            return function merge(obj, props) {
                if (!obj) {
                    obj = {};
                }
                for (var i = 1, l = arguments.length; i < l; i++) {
                    _merge(obj, arguments[i]);
                }
                return obj; // Object
            }
        }());

        function extender() {
            var Base = declare({
                instance: {
                    constructor: function (value) {
                        this._value = value;
                    },

                    value: function () {
                        return this._value;
                    },

                    eq: function eq(val) {
                        return _extender(this._value === val);
                    },

                    neq: function neq(other) {
                        return _extender(this._value !== other);
                    },
                    print: function () {
                        console.log(this._value);
                        return this;
                    }
                }
            }), defined = [];

            function addMethod(proto, name, func) {
                if ("function" !== typeof func) {
                    throw new TypeError("when extending type you must provide a function");
                }
                var extendedMethod;
                if (name === "constructor") {
                    extendedMethod = function () {
                        var args = slice.call(arguments);
                        this._super(arguments);
                        func.apply(this, arguments);
                    }
                } else {
                    extendedMethod = function extendedMethod() {
                        var args = slice.call(arguments);
                        args.unshift(this._value)
                        var ret = func.apply(this, args);
                        return ret !== undef ? _extender(ret) : this;
                    }
                }
                proto[name] = extendedMethod
            }

            function _extender(obj) {
                var ret = obj;
                if (!(obj instanceof Base)) {
                    var base = {}, instance = (base.instance = {});
                    for (var i = 0, l = defined.length; i < l; i++) {
                        var definer = defined[i];
                        if (definer[0](obj)) {
                            merge(instance, definer[1]);
                        }
                    }
                    ret = new (Base.extend(base))(obj);
                }
                return ret;
            }

            function always() {
                return true;
            }

            function define(tester, decorate, chain) {
                if (!decorate) {
                    decorate = tester;
                    tester = always;
                }
                var proto = {};
                for (var i in decorate) {
                    if (decorate.hasOwnProperty(i)) {
                        addMethod(proto, i, decorate[i]);
                    }
                }
                defined.push([tester, proto]);
                return _extender;
            }

            _extender.define = define;

            return _extender;
        }

        return {
            define: function () {
                return extender().define.apply(extender, arguments);
            }
        }

    }

    if ("undefined" !== typeof exports) {
        if ("undefined" !== typeof module && module.exports) {
            module.exports = defineExtender(require("declare.js"));

        }
    } else if ("function" === typeof define) {
        define(["require"], function (require) {
            return defineExtender((require("declare.js")));
        });
    } else {
        this.extender = defineExtender(declare);
    }

}).call(this);