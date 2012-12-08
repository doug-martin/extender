var extender = require("../../index"),
    is = require("./../is"),
    slice = Array.prototype.slice;

function AsyncAction(fn) {
    this.fn = fn;
    this.cbs = [];
    this.resolved = false;
}

AsyncAction.prototype.pushCb = function pushCb(cb, scope) {
    if (cb) {
        if (this.resolved) {
            cb.apply(scope, this._resolved);
        } else {
            this.cbs.push(cb.bind(scope || this));
        }
    }
    return this;
}

AsyncAction.prototype.execute = function execute(err, args) {
    if (!this.resolved) {
        var cbs = this.cbs, l = cbs.length;

        function done() {
            this._resolved = arguments;
            this.resolved = true;
            for (var i = 0; i < l; i++) {
                cbs[i].apply(this, arguments);
            }
        }

        if (!err) {
            args = slice.call(arguments, 1);
            args.push(done);
            this.fn.apply(this, args);
        } else {
            done(err);
        }
    } else {
        throw new Error("Action already resolved");
    }
    return this;
}

AsyncAction.isAction = function (obj) {
    return obj instanceof AsyncAction;
}

function tester(obj) {
    return AsyncAction.isAction(obj) || is.isArray(obj) || is.isFunction(obj);
}

function toArray(obj) {
    if (is.isArray(obj)) {
        return obj;
    } else {
        return [obj];
    }
}


var async = extender.define(is.isFunction, {

    whilst: function (fn) {
        var ret = async(new AsyncAction(fn));
        return ret.whilst.apply(ret, slice.call(arguments, 1));
    },

    until: function (fn) {
        var ret = async(new AsyncAction(fn));
        return ret.until.apply(ret, slice.call(arguments, 1));
    }

}).define(tester, {

        constructor: function (val) {
            this.val = toArray(val);
        },

        loop: function (val, iter, cb) {
            var ret = async(new AsyncAction(function (done) {
                var l = val.length, i = 0, results = [];
                (function next(err, res) {
                    if (err) {
                        done(err);
                    } else {
                        if (i < l) {
                            async(new AsyncAction(function (done) {
                                iter(val[i], i++, done);
                            })).done(next);
                        } else {
                            done();
                        }
                    }
                }());
            }));
            return cb ? ret.done(cb) : ret;
        },

        forEach: function (val, iter, cb) {
            return async(val).loop(function (item, i, done) {
                iter(item, done);
            }, cb);
        },

        map: function (val, iter, cb) {
            var results = [];
            return async(val).loop(function (item, i, done) {
                iter(item, function (err, res) {
                    if (err) {
                        done(err);
                    } else {
                        results[i] = res;
                        done();
                    }
                })
            }, cb).push(function (done) {
                    done(null, results);
                });
        },

        filter: function (val, iter, cb) {
            var results = [];
            return async(val).loop(function (item, index, done) {
                iter(item, function (err, res) {
                    if (err) {
                        done(err);
                    } else {
                        if (!!res) {
                            results.push(res);
                        }
                        done();
                    }
                })
            }).push(function (done) {
                    done(null, results);
                });
        },

        reject: function (val, iter, cb) {
            var results = [];
            return async(val).loop(function (item, index, done) {
                iter(item, function (err, res) {
                    if (err) {
                        done(err);
                    } else {
                        if (!(!!res)) {
                            results.push(res);
                        }
                        done();
                    }
                })
            }).push(function (done) {
                    done(null, results);
                });
        },

        series: function (val, cb) {
            var ret = async(new AsyncAction(function (done) {
                var l = val.length, i = 0, results = [];
                (function next(err, res) {
                    if (err) {
                        done(err);
                    } else {
                        if (i !== 0) {
                            results.push(res);
                        }
                        if (i < l) {
                            async(new AsyncAction(val[i++])).done(next);
                        } else {
                            done(err, results);
                        }
                    }
                }());
            }));
            return cb ? ret.done(cb) : ret;
        },

        parallel: function (val, cb) {
            var ret = async(new AsyncAction(function (done) {
                var l = val.length - 1, results = [], resolved, doneCount = 0;

                function collector(i, err, res) {
                    if (!resolved) {
                        if (err) {
                            resolved = true;
                            done(err);
                        } else {
                            results[i] = res;
                            if (doneCount++ == l) {
                                resolved = true;
                                done(err, results);
                            }
                        }
                    }
                }

                val.forEach(function (val, i) {
                    async(new AsyncAction(val)).done(collector.bind(null, i))
                });
            }));
            return cb ? ret.done(cb) : ret;
        },

        waterfall: function (val, cb) {
            var ret = async(new AsyncAction(function (done) {
                var l = val.length, i = 0, results = [];
                (function next(err, res) {
                    if (err) {
                        done(err);
                    } else {
                        if (i < l) {
                            var res = slice.call(arguments, 1);
                            async(new AsyncAction(function (done) {
                                res.push(done);
                                val[i++].apply(this, res);
                            })).done(next);
                        } else {
                            done.apply(this, arguments);
                        }
                    }
                }());
            }));
            return cb ? ret.done(cb) : ret;
        }


    }).define(AsyncAction.isAction, {

        whilst: function (val, fn, cb) {
            var ret = async(new AsyncAction(function (done) {
                function test(err) {
                    if (err) {
                        done(err);
                    } else {
                        if (fn()) {
                            async(new AsyncAction(val.fn)).done(test);
                        } else {
                            done();
                        }
                    }
                }

                test();
            }));
            return cb ? ret.done(cb) : ret;
        },

        pipe: function (from, to, cb) {
            var ret = async(new AsyncAction(function (done) {
                from.pushCb(function (err) {
                    if (err) {
                        done(err);
                    } else {
                        if (!AsyncAction.isAction(to)) {
                            to = new AsyncAction(to);
                        }
                        to.pushCb(done);
                        to.execute.apply(to, arguments);
                    }
                });
                from.execute();
            }));
            return cb ? ret.done(cb) : ret;
        },

        push: function (from, to, cb) {
            var ret = async(new AsyncAction(function (done) {
                from.pushCb(function (err) {
                    if (err) {
                        done(err);
                    } else {
                        if (!AsyncAction.isAction(to)) {
                            to = new AsyncAction(to);
                        }
                        to.pushCb(done);
                        to.execute();
                    }
                });
                return from.execute();
            }));
            return cb ? ret.done(cb) : ret;
        },

        until: function (val, fn, cb) {
            return async(val).whilst(function () {
                return !fn();
            }, cb);
        },

        done: function done(action, cb) {
            return action.pushCb(cb).execute();
        }

    });

module.exports = async;
