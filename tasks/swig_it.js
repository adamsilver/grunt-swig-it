'use strict';

module.exports = function(grunt) {

	var fs = require('fs');
	var swig = require('swig');
	var path = require('path');

	grunt.registerMultiTask('swig', 'swig templater', function(tpl_context) {
		var config = this;
		var context = tpl_context || '';
		var globalVars = {};

		if (config.data.init !== undefined) {
			swig.setDefaults(config.data.init);
		}

		try {
			globalVars = grunt.util._.extend(config.data, grunt.file.readJSON(process.cwd() + '/global.json'));
		} catch (err) {
			globalVars = grunt.util._.clone(config.data);
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
					tplVars = {},
					contextVars = {};

				try {
					tplVars = grunt.file.readJSON(path.dirname(file) + '/' + outputFile + ".json");
				} catch (err) {
					tplVars = {};
				}

				try {
					contextVars = grunt.file.readJSON(path.dirname(file) + '/' + outputFile + "." + context + ".json");
				} catch (err) {
					contextVars = {};
				}

				tplVars.context = context;
				tplVars.tplFile = {
					path: destPath,
					basename: outputFile
				};

				grunt.log.writeln('Writing HTML to ' + htmlFile);

				grunt.file.write(htmlFile, swig.renderFile(file, grunt.util._.extend(globalVars, tplVars, contextVars)));

			}
		});
	});
};