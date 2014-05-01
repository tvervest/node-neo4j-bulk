var Bulk = require('../index');
var expect = require('chai').expect;

describe('#findNodeID(predicate)', function() {
	it('should iterate the predicate over the collection of nodes if no node matches', function () {
		var bulk = new Bulk();
		bulk.addNode({
			'hello': 'world',
		});
		bulk.addNode({
			'just so you know': 'this is a test',
		});

		var count = 0;

		var nodeID = bulk.findNodeID(function (node) {
			count++;
			return false;
		});

		expect(count).to.equal(2);
	});

	it('should stop iterating the predicate over the collection of nodes when a match is found', function () {
		var bulk = new Bulk();
		bulk.addNode({
			'hello': 'world',
		});
		bulk.addNode({
			'just so you know': 'this is a test',
		});

		var count = 0;

		var nodeID = bulk.findNodeID(function (node) {
			count++;
			return true;
		});

		expect(count).to.equal(1);
	});

	it('should return the correct node ID when a match is found', function () {
		var bulk = new Bulk();
		var firstNode = bulk.addNode({
			'hello': 'world',
		});
		bulk.addNode({
			'just so you know': 'this is a test',
		});

		var nodeID = bulk.findNodeID(function (node) {
			return node.hello === 'world';
		});

		expect(nodeID).to.equal(firstNode);
	});

	it('should return false if no node matches', function () {
		var bulk = new Bulk();
		var firstNode = bulk.addNode({
			'hello': 'world',
		});
		bulk.addNode({
			'just so you know': 'this is a test',
		});

		var nodeID = bulk.findNodeID(function (node) {
			return false;
		});

		expect(nodeID).to.equal(false);
	});
});