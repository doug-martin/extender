var simple = require("./simple.js");

var undef;
simple("hello").isUndefined().print(); //false
simple(undef).isUndefined().print(); //true


simple("hello").multiply(2).print(); //hellohello
simple([
    {a: "a"},
    {a: "b"},
    {a: "c"}
]).pluck("a").print(); //["a", "b", "c"]

simple("I love javascript!").toArray(/\s+/).pluck("0").print();

