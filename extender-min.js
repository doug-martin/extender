/*! extender - v0.0.4 - 2013-01-13
* Copyright (c) 2013 Doug Martin (blog.dougamartin.com); Licensed MIT */
(function(){function e(e){function r(e,t){if(e&&e.length)for(var n=0,r=e.length;n<r;n++)if(e[n]===t)return n;return-1}function i(e){return Object.prototype.toString.call(e)==="[object Array]"}function o(r){function u(e,r,i){if("function"!=typeof i)throw new TypeError("when extending type you must provide a function");var s;r==="constructor"?s=function(){this._super(arguments),i.apply(this,arguments)}:s=function(){var r=t.call(arguments);r.unshift(this._value);var s=i.apply(this,r);return s!==n?l(s):this},e[r]=s}function a(e,n,r){if("function"!=typeof r)throw new TypeError("when extending type you must provide a function");var i;n==="constructor"?i=function(){this._super(arguments),r.apply(this,arguments)}:i=function(){var n=t.call(arguments);return n.unshift(this._value),r.apply(this,n)},e[n]=i}function f(e,t,n){for(var r in t)t.hasOwnProperty(r)&&(r!=="getters"&&r!=="setters"?r==="noWrap"?f(e,t[r],!0):n?a(e,r,t[r]):u(e,r,t[r]):e[r]=t[r])}function l(e){var t=e,n,r;if(!(e instanceof i)){var u={},a=u.instance={};for(n=0,r=o.length;n<r;n++){var f=o[n];f[0](e)&&s(a,f[1])}t=new(i.extend(u))(e)}return t}function c(){return!0}function h(e,t){if(arguments.length){typeof e=="object"&&(t=e,e=c),t=t||{};var n={};f(n,t),o.push([e,n])}return l}function p(e){return e&&e.hasOwnProperty("__defined__")&&(l.__defined__=o=o.concat(e.__defined__)),s(l,e,["define","extend","expose","__defined__"]),l}r=r||[];var i=e({instance:{constructor:function(e){this._value=e},value:function(){return this._value},eq:function(t){return l(this._value===t)},neq:function(t){return l(this._value!==t)},print:function(){return console.log(this._value),this}}}),o=[];return l.define=h,l.extend=p,l.expose=function(){var t;for(var n=0,r=arguments.length;n<r;n++)t=arguments[n],typeof t=="object"&&s(l,t,["define","extend","expose","__defined__"]);return l},l.__defined__=o,l}var t=Array.prototype.slice,n,s=function(){function t(e,t,n){var i,s;for(i in t)if(t.hasOwnProperty(i)&&r(n,i)===-1){s=t[i];if(!(i in e)||e[i]!==s)e[i]=s}return e}return function(n){n||(n={});var r=arguments.length,s=arguments[arguments.length-1];i(s)?r--:s=[];for(var o=1;o<r;o++)t(n,arguments[o],s);return n}}();return{define:function(){return o().define.apply(o,arguments)},extend:function(e){return o().define().extend(e)}}}"undefined"!=typeof exports?"undefined"!=typeof module&&module.exports&&(module.exports=e(require("declare.js"))):"function"==typeof define?define(["require"],function(t){return e(t("declare.js"))}):this.extender=e(this.declare)}).call(this);