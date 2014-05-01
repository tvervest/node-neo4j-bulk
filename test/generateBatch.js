var Bulk = require('../index');
var expect = require('chai').expect;

describe('#generateBatch() ', function() {
	describe('called on a batch object that only contains nodes', function () {
		it('should create the merged batch object', function () {
			var bulk = new Bulk();
			bulk.addNode({
				'hello': 'world',
			});
			bulk.addNode({
				'just so you know': 'this is a test',
			});

			var batchData = bulk.generateBatch();

			expect(batchData).to.be.an('array')
				.that.deep.equals([{
					method: 'POST',
					to: '/node',
					id: 0,
					body: {
						'hello': 'world',
					},
				},{
					method: 'POST',
					to: '/node',
					id: 1,
					body: {
						'just so you know': 'this is a test',
					},
				}]);
		});
	});
	
	describe('called on a batch object that only contains nodes and labels', function () {
		it('should create the merged batch object', function () {
			var bulk = new Bulk();
			bulk.addNode({
				'hello': 'world',
			});
			bulk.addNode({
				'just so you know': 'this is a test',
			});

			bulk.addLabel('test', 0);

			var batchData = bulk.generateBatch();

			expect(batchData).to.be.an('array')
				.that.deep.equals([{
					method: 'POST',
					to: '/node',
					id: 0,
					body: {
						'hello': 'world',
					},
				},{
					method: 'POST',
					to: '/node',
					id: 1,
					body: {
						'just so you know': 'this is a test',
					},
				},{
					method : 'POST',
					to: '{0}/labels',
					body: 'test',
				}]);
		});
	});
	
	describe('called on a batch object that only contains nodes and relations', function () {
		it('should create the merged batch object', function () {
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

			var batchData = bulk.generateBatch();

			expect(batchData).to.be.an('array')
				.that.deep.equals([{
					method: 'POST',
					to: '/node',
					id: 0,
					body: {
						'hello': 'world',
					},
				},{
					method: 'POST',
					to: '/node',
					id: 1,
					body: {
						'just so you know': 'this is a test',
					},
				},{
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
	});
	
	describe('called on a batch object that contains nodes, labels, and relations', function () {
		it('should create the merged batch object', function () {
			var bulk = new Bulk();
			bulk.addNode({
				'hello': 'world',
			});
			bulk.addNode({
				'just so you know': 'this is a test',
			});

			bulk.addLabel('test', 0);

			bulk.addRelation(0, 1, 'test', {
				'hello': 'relation!',
			});

			var batchData = bulk.generateBatch();

			expect(batchData).to.be.an('array')
				.that.deep.equals([{
					method: 'POST',
					to: '/node',
					id: 0,
					body: {
						'hello': 'world',
					},
				},{
					method: 'POST',
					to: '/node',
					id: 1,
					body: {
						'just so you know': 'this is a test',
					},
				},{
					method : 'POST',
					to: '{0}/labels',
					body: 'test',
				},{
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
	});
});