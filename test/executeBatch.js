var Bulk = require('../index');
var expect = require('chai').expect;
var nock = require('nock');

describe('#executeBatch(host, batch[, done]) ', function() {
	it('should execute a POST request with the given batch to the specified neo4j database', function (done) {
		var testBody = [{
			hello: 'world!',
		}];

		nock('http://myDatabase:1234')
			.post('/db/data/batch', testBody)
			.reply(200, {});

		Bulk.executeBatch('http://myDatabase:1234', testBody, done);
	});

	it('should pass request errors to the callback', function (done) {
		Bulk.executeBatch('myDatabase:1234', {}, function (err) {
			expect(err).to.be.an('object')
				.that.has.a.property('message')
				.that.is.a('string')
				.that.equals('Invalid protocol: mydatabase:');
			done();
		});
	});

	it('should pass server-side errors to the callback', function (done) {
		var testBody = [{
			hello: 'world!',
		}];

		nock('http://myDatabase:1234')
			.post('/db/data/batch', testBody)
			.reply(500, {
				exception: 'A fake error occurred',
				message: 'because this is a test',
			});

		Bulk.executeBatch('http://myDatabase:1234', testBody, function (err) {
			expect(err).to.be.an('object')
				.that.has.a.property('message')
				.that.is.a('string')
				.that.equals('A fake error occurred: because this is a test');
			done();
		});
	});
});