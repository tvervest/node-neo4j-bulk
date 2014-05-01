var Bulk = require('../index');
var expect = require('chai').expect;

describe('#addRelation(startNode, endNode, relationName[, data]) ', function() {
	it('should create a new relation between the given nodes', function () {
		var bulk = new Bulk();
		bulk.addNode({
			'hello': 'world',
		});
		bulk.addNode({
			'just so you know': 'this is a test',
		});

		bulk.addRelation(0, 1, 'test', {
			'hello': 'relation!',
		});

		expect(bulk).to.be.an('object')
			.that.has.a.property('_relations')
			.that.is.an('array')
			.that.deep.equals([{
				method: 'POST',
				to: '{0}/relationships',
				body: {
					to: '{1}',
					type: 'test',
					data: {
						'hello': 'relation!',
					},
				},
			}]);
	});

	it('should create a new data-less relation between the given nodes if no data was given', function () {
		var bulk = new Bulk();
		bulk.addNode({
			'hello': 'world',
		});
		bulk.addNode({
			'just so you know': 'this is a test',
		});

		bulk.addRelation(0, 1, 'relation 1');

		bulk.addRelation(1, 0, 'relation 2');

		expect(bulk).to.be.an('object')
			.that.has.a.property('_relations')
			.that.is.an('array')
			.that.deep.equals([{
				method: 'POST',
				to: '{0}/relationships',
				body: {
					to: '{1}',
					type: 'relation 1',
				},
			},{
				method: 'POST',
				to: '{1}/relationships',
				body: {
					to: '{0}',
					type: 'relation 2',
				},
			}]);
	});

	it('should throw an error if the specified start node does not exist', function () {
		var bulk = new Bulk();
		bulk.addNode({
			'hello': 'world',
		});
		bulk.addNode({
			'just so you know': 'this is a test',
		});

		expect(function() {
			bulk.addRelation(3, 1, 'test');
		}).to.throw('Creating a relation from a non-existent node is not allowed');
	});

	it('should throw an error if the specified start node ID is below 0', function () {
		var bulk = new Bulk();
		bulk.addNode({
			'hello': 'world',
		});

		expect(function() {
			bulk.addRelation(-1, 1, 'test');
		}).to.throw('Creating a relation from a non-existent node is not allowed');
	});

	it('should throw an error if the specified end node does not exist', function () {
		var bulk = new Bulk();
		bulk.addNode({
			'hello': 'world',
		});
		bulk.addNode({
			'just so you know': 'this is a test',
		});

		expect(function() {
			bulk.addRelation(1, 3, 'test');
		}).to.throw('Creating a relation to a non-existent node is not allowed');
	});

	it('should throw an error if the specified end node ID is below 0', function () {
		var bulk = new Bulk();
		bulk.addNode({
			'hello': 'world',
		});
		bulk.addNode({
			'just so you know': 'this is a test',
		});

		expect(function() {
			bulk.addRelation(1, -1, 'test');
		}).to.throw('Creating a relation to a non-existent node is not allowed');
	});
});