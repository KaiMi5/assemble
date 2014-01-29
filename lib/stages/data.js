/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

// node_modules
var async = require('async');

// Local libs
var notifier = require('./notifier');
var config = require('../config');

var events = config.plugins.events;

module.exports = function (assemble) {

	var fileInfo = assemble.utils.file;
	var models = assemble.models;

	return function(next) {
		assemble.log.debug('Running data steps');

		var params = {};
		var notify = notifier(assemble, params);


		params.data = assemble.options.data;

		async.series([
				notify(events.assembleBeforeData),
				function (done) {
					assemble.log.debug('Doing some data work here.');

					assemble.data = assemble.data || [];

					async.each(
						params.data,
						function (src, next) {
							assemble.log.debug('Loading Data File', src);

							var options = {
								type: models.FileTypes.DATA,
								newer: true
							};

							fileInfo.load(assemble, src, options, function (err, dataFile) {
								assemble.data.push(dataFile);
								next();
							});

						},
						done
					);
				},
				notify(events.assembleAfterData)
			],
			next
		);
	};
};