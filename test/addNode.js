var Bulk = require('../index');
var expect = require('chai').expect;

describe('#addNode(data)', function() {
	it('should create a new node with the given data', function () {
		var bulk = new Bulk();
		var firstData = {
			'hello': 'world',
		};
		var secondData = {
			'just so you know': 'this is a test',
		};

		bulk.addNode(firstData);
		bulk.addNode(secondData);

		expect(bulk).to.be.an('object')
			.that.has.a.property('_nodes')
			.that.is.an('array')
			.that.deep.equals([{
				method: 'POST',
				to: '/node',
				id: 0,
				body: firstData,
			},{
				method: 'POST',
				to: '/node',
				id: 1,
				body: secondData,
			}]);
	});

	it('should return the node ID of the newly generated node', function () {
		var bulk = new Bulk();
		var data = {
			'hello': 'world',
		};

		var firstNode = bulk.addNode(data);
		var secondNode = bulk.addNode(data);
		var thirdNode = bulk.addNode(data);

		expect(firstNode).to.be.a('number')
			.that.equals(0);

		expect(secondNode).to.be.a('number')
			.that.equals(1);

		expect(thirdNode).to.be.a('number')
			.that.equals(2);
	});

	it('should create a body-less node if no data is given', function () {
		var bulk = new Bulk();

		bulk.addNode();

		expect(bulk).to.be.an('object')
			.that.has.a.property('_nodes')
			.that.is.an('array')
			.that.deep.equals([{
				method: 'POST',
				to: '/node',
				id: 0,
			}]);
	});
});