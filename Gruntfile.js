'use strict';

module.exports = function(grunt) {
	grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.initConfig({
		swig_it: {
			development: {
				init: {
					allowErrors: false,
					autoescape: true
				},
				test: {
					var2: 'short path file'
				},
				dest: "test/dest",
				src: ['test/fixtures/**/*.html']
			}
		},
		jshint: {
			options: {
				'jshintrc': '.jshintrc',
				'reporter': 'jslint',
				'reporterOutput': 'jslint.xml',
				'force': true
			},
			all: [
				'Gruntfile.js',
				'tasks/*.js'
			]
		},
		mochaTest: {
			options: {
				reporter: 'xunit',
				captureFile: 'tests.xml'
			},
			files: ['test/*_test.js']
		},
		clean: {
			files: 'test/dest'
		}
	});

	grunt.registerTask('test', [
		'clean',
		'swig_it',
		'jshint',
		'mochaTest',
	]);

	grunt.registerTask('default', 'test');
};