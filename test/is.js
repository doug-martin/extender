
function isFunction(obj){
    return typeof obj === "function";
}

function isBoolean(obj) {
    var undef, type = typeof obj;
    return obj !== undef && type === "boolean" || type === "Boolean";
}

function isUndefined(obj) {
    var undef;
    return obj !== null && obj === undef;
}

function isDefined(obj) {
    return !isUndefined(obj);
}

function isUndefinedOrNull(obj) {
    return isUndefined(obj) || isNull(obj);
}

function isNull(obj) {
    var undef;
    return obj !== undef && obj === null;
}

function isArguments(object) {
    return !isUndefinedOrNull(object) && Object.prototype.toString.call(object) === '[object Arguments]';
}


function isInstance(obj, clazz) {
    if (typeof clazz === "function") {
        return obj instanceof clazz;
    } else {
        return false;
    }
}

function isInstanceOf(obj, clazz) {
    return comb.array.some(argsToArray(arguments, 1), function (c) {
        return isInstance(obj, c);
    });
}

function isRegExp(obj) {
    return !isUndefinedOrNull(obj) && (obj instanceof RegExp);
}

function isArray(obj) {
    return Object.prototype.toString.call(obj) === "[object Array]";
}

function isDate(obj) {
    return (!isUndefinedOrNull(obj) && typeof obj === "object" && obj instanceof Date);
}

function isString(obj) {
    return !isUndefinedOrNull(obj) && (typeof obj === "string" || obj instanceof String);
}

function isNumber(obj) {
    return !isUndefinedOrNull(obj) && (typeof obj === "number" || obj instanceof Number);
}

exports.function = isFunction;
exports.number = isNumber;
exports.string = isString;
exports.date = isDate;
exports.array = isArray;
exports.boolean = isBoolean;
exports.undefined = isUndefined;
exports.defined = isDefined;
exports.undefinedOrNull = isUndefinedOrNull;
exports.null = isNull;
exports.arguments = isArguments;
exports.instanceOf = isInstanceOf;
exports.regExp = isRegExp;