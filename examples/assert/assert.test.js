var assert = require("./assert");

assert("hello").isString().lengthOf(5).and("world").isString().lengthOf(5);

assert(undefined).isUndefined();

assert(function () {
    throw Error();
}).throws().and("hello").isString().lengthOf(5).and("world").isString().lengthOf(5);





