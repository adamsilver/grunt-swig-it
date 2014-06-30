'use strict';

module.exports = function(grunt) {

	var fs = require('fs');
	var swig = require('swig');
	var path = require('path');

	grunt.registerMultiTask('swig_it', 'swig templater', function(tpl_context) {
		var options = this.options();
		var config = this;
		var context = tpl_context || '';
		var globalVars = {};

		if (options.swigDefaults) {
			swig.setDefaults(options.swigDefaults);
		}

		try {
			globalVars = grunt.util._.extend(options.data, grunt.file.readJSON(process.cwd() + '/global.json'));
		} catch (err) {
			globalVars = grunt.util._.clone(options.data);
		}

		this.filesSrc.forEach(function(file) {

			if (!grunt.file.exists(file)) {

				grunt.log.warn('Source file "' + file.src + '" not found.');

				return false;
			} else {
				var dirName = path.dirname(file).split('/'),
					destPath = dirName.splice(1, dirName.length).join('/'),
					outputFile = path.basename(file, '.html'),
					htmlFile = config.data.dest + '/' + destPath + '/' + outputFile + '.html',
					tplVars = {};

				try {
					tplVars = grunt.file.readJSON(path.dirname(file) + '/' + outputFile + ".json");
				} catch (err) {
					tplVars = {};
				}

				tplVars.context = context;
				tplVars.tplFile = {
					path: destPath,
					basename: outputFile
				};

				grunt.log.writeln('Writing HTML to ' + htmlFile);

				grunt.file.write(htmlFile, swig.renderFile(file, grunt.util._.extend({}, globalVars, tplVars)));

			}
		});
	});
};