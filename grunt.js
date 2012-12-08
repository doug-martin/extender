module.exports = function (grunt) {
    grunt.initConfig({
        pkg: '<json:package.json>',
        meta: {
            banner:'// <%= pkg.title || pkg.name %> - v<%= pkg.version %> \n\n' +
                '// Built <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                '// Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' +
                '// Licensed <%= pkg.license %>'
        },
        min: {
            dist: {
                src: ['<banner>','extender.js'],
                dest: 'extender-min.js'
            }
        },
        uglify: {
            mangle: {toplevel: true},
            squeeze: {dead_code: false},
            codegen: {quote_keys: true}
        }
    });
};
