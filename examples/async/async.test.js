var async = require("./async");

function forEach() {
    var results = [];
    return async(["a", "b", "c"]).forEach(function (item, done) {
        results.push(item);
        process.nextTick(done);
    }).pipe(function (done) {
            done(null, results);
        });
}

function map() {
    return async(["a", "b", "c"]).map(function (item, done) {
        done(null, item + item);
    });
}

function series() {

    return async([
        function (done) {
            setTimeout(function () {
                done(null, 1);
            }, 300);
        },
        function (done) {
            setTimeout(function () {
                done(null, 2);
            }, 200)
        },
        function (done) {
            setTimeout(function () {
                done(null, 3);
            }, 100)
        }
    ]).series();
}

function parallel() {

    return async([
        function (done) {
            setTimeout(function () {
                done(null, 1);
            }, 300);
        },
        function (done) {
            setTimeout(function () {
                done(null, 2);
            }, 200)
        },
        function (done) {
            setTimeout(function () {
                done(null, 3);
            }, 100)
        }
    ]).parallel();
}

function waterfall() {
    return async([
        function (done) {
            process.nextTick(function () {
                done(null, "a");
            });
        },
        function (arg1, done) {
            process.nextTick(function () {
                done(null, arg1 + "b", "b");
            });
        },
        function (arg1, arg2, done) {
            process.nextTick(function () {
                done(null, arg1 + arg2 + "c");
            });
        }
    ]).waterfall();
}


function whilst() {
    var count = 0;

    return async(function (callback) {
        count++;
        setTimeout(callback, 1000);
    }).whilst(function () {
            return count < 5;
        });
}

function until() {
    var count = 0;

    return async(function (callback) {
        count++;
        setTimeout(callback, 1000);
    }).until(function () {
            return count === 5;
        });
}

series()
    .pipe(function (res, done) {
        console.log(res);
        parallel().done(done);
    }).pipe(function (res, done) {
        console.log(res);
        waterfall().done(done);
    }).pipe(function (res, done) {
        console.log(res);
        whilst().done(done)
    }).pipe(function (done) {
        console.log("5 seconds have passed");
        until().done(done);
    }).pipe(function (done) {
        console.log("5 seconds have passed");
        forEach().done(done);
    }).pipe(function (res, done) {
        console.log("ForEach results = %j", res);
        map().done(done);
    }).pipe(function (res, done) {
        console.log("map results = %j", res);
        done();
    }).done();
