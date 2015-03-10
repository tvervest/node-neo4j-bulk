#!/usr/bin/env node

var Bulk = require('../index.js');
var path = require('path');
var fs = require('fs');
var cli = require('cli');
var pkg = require('../package.json');

cli.setApp(pkg.name, pkg.version);

cli.enable('version');

cli.parse({
	database: [false, 'Database protocol, hostname, and port for the target Neo4j instance (defaults to http://127.0.0.1:7474)'],
	batch: [false, 'Source batch file', 'path'],
	clear: ['c', 'Clears the database before executing the batch file'],
	force: ['f', 'Disables security questions for destructive operations'],
});

cli.main(function (args, options) {
	if (!options.batch) this.fatal('no batch file specified (see --help)');

	var host = options.database || 'http://127.0.0.1:7474';

	function executeBatch() {
		var batchData;
		try {
			batchData = require(path.resolve(process.cwd(), options.batch));
			if (batchData instanceof Bulk) {
				batchData = batchData.generateBatch();
			}
		} catch (e) {
			cli.fatal('Could not load batch file: ' + e.message);
		}

		Bulk.executeBatch(host, batchData, function(e) {
			if(e) cli.fatal('Could not apply batch file: ' + e.message);

			cli.ok('Database has been updated');
		});
	}

	if (options.clear) {
		function executeCleanBatch() {
			Bulk.executeBatch(host, Bulk.generateClearBatch(), function (e) {
				if (e) cli.fatal('Clearing the database failed: ' + e.message);

				cli.ok('Database cleared');

				executeBatch();
			});
		}

		if (options.force) {
			executeCleanBatch();
		} else {
			(function confirmAction() {
				cli.info('WARNING: this operation will clear all data in the database.');
				cli.info('Are you sure you want to continue? [y/N]');
				process.stdin.on('data', function (text) {
					text = text.toString();
					if (text.toLowerCase() === 'y\n') {
						executeCleanBatch();
					} else if (text.toLowerCase() === 'n\n') {
						cli.fatal('Cancelling operation');
					} else {
						confirmAction();
					}
				});
			})();
		}
	} else {
		executeBatch();
	}
});