/*! extender - v0.0.10 - 2014-04-01
* Copyright (c) 2014 Doug Martin (blog.dougamartin.com); Licensed MIT */
(function(){function n(n){function e(n,e){if(n&&n.length)for(var t=0,r=n.length;r>t;t++)if(n[t]===e)return t;return-1}function t(n){return"[object Array]"===Object.prototype.toString.call(n)}function r(e){function t(n,e,t){if("function"!=typeof t)throw new TypeError("when extending type you must provide a function");var r;r="constructor"===e?function(){this._super(arguments),t.apply(this,arguments)}:function r(){var n=o.call(arguments);n.unshift(this._value);var e=t.apply(this,n);return e!==u?this.__extender__(e):this},n[e]=r}function r(n,e,t){if("function"!=typeof t)throw new TypeError("when extending type you must provide a function");var r;r="constructor"===e?function(){this._super(arguments),t.apply(this,arguments)}:function r(){var n=o.call(arguments);return n.unshift(this._value),t.apply(this,n)},n[e]=r}function f(n,e,u){for(var o in e)e.hasOwnProperty(o)&&("getters"!==o&&"setters"!==o?"noWrap"===o?f(n,e[o],!0):u?r(n,o,e[o]):t(n,o,e[o]):n[o]=e[o])}function s(n){var e,t,r=n;if(!(n instanceof d)){var u=d;for(e=0,t=p.length;t>e;e++){var o=p[e];o[0](n)&&(u=u.extend({instance:o[1]}))}r=new u(n),r.__extender__=s}return r}function c(){return!0}function a(n,e){if(arguments.length){"object"==typeof n&&(e=n,n=c),e=e||{};var r={};f(r,e),r.hasOwnProperty("constructor")||(e.hasOwnProperty("constructor")?t(r,"constructor",e.constructor):r.constructor=function(){this._super(arguments)}),p.push([n,r])}return s}function _(n){return n&&n.hasOwnProperty("__defined__")&&(s.__defined__=p=p.concat(n.__defined__)),i(s,n,["define","extend","expose","__defined__"]),s}e=e||[];var d=n({instance:{constructor:function(n){this._value=n},value:function(){return this._value},eq:function(n){return this.__extender__(this._value===n)},neq:function(n){return this.__extender__(this._value!==n)},print:function(){return console.log(this._value),this}}}),p=[];return s.define=a,s.extend=_,s.expose=function(){for(var n,e=0,t=arguments.length;t>e;e++)n=arguments[e],"object"==typeof n&&i(s,n,["define","extend","expose","__defined__"]);return s},s.__defined__=p,s}var u,o=Array.prototype.slice,i=function(){function n(n,t,r){var u,o;for(u in t)t.hasOwnProperty(u)&&-1===e(r,u)&&(o=t[u],u in n&&n[u]===o||(n[u]=o));return n}return function(e){e||(e={});var r=arguments.length,u=arguments[arguments.length-1];t(u)?r--:u=[];for(var o=1;r>o;o++)n(e,arguments[o],u);return e}}();return{define:function(){return r().define.apply(r,arguments)},extend:function(n){return r().define().extend(n)}}}"undefined"!=typeof exports?"undefined"!=typeof module&&module.exports&&(module.exports=n(require("declare.js"))):"function"==typeof define&&define.amd?define(["declare"],function(e){return n(e)}):this.extender=n(this.declare)}).call(this);