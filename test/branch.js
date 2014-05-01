var Bulk = require('../index');
var expect = require('chai').expect;

describe('#branch() ', function() {
	it('should create deep copy of the Bulk object', function () {
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

		var copy = bulk.branch();

		expect(copy).to.be.an('object')
			.that.has.a.property('_nodes')
			.that.is.an('array')
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

		expect(copy).to.be.an('object')
			.that.has.a.property('_labels')
			.that.is.an('array')
			.that.deep.equals([{
				method : 'POST',
				to: '{0}/labels',
				body: 'test',
			}]);

		expect(copy).to.be.an('object')
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

	describe('the copy', function () {
		it('should not update the source object when modified', function () {
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

			var copy = bulk.branch();

			copy.addNode({
				'description': 'a new node, only added to the copy',
			});

			expect(bulk).to.be.an('object')
				.that.has.a.property('_nodes')
				.that.is.an('array')
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

			expect(bulk).to.be.an('object')
				.that.has.a.property('_labels')
				.that.is.an('array')
				.that.deep.equals([{
					method : 'POST',
					to: '{0}/labels',
					body: 'test',
				}]);

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

			expect(copy).to.be.an('object')
				.that.has.a.property('_nodes')
				.that.is.an('array')
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
					to: '/node',
					id: 2,
					body: {
						'description': 'a new node, only added to the copy',
					},
				}]);

			expect(copy).to.be.an('object')
				.that.has.a.property('_labels')
				.that.is.an('array')
				.that.deep.equals([{
					method : 'POST',
					to: '{0}/labels',
					body: 'test',
				}]);

			expect(copy).to.be.an('object')
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

		it('should not be updated when the source object is modified', function () {
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

			var copy = bulk.branch();

			bulk.addNode({
				'description': 'a new node, only added to the copy',
			});

			expect(bulk).to.be.an('object')
				.that.has.a.property('_nodes')
				.that.is.an('array')
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
					to: '/node',
					id: 2,
					body: {
						'description': 'a new node, only added to the copy',
					},
				}]);

			expect(bulk).to.be.an('object')
				.that.has.a.property('_labels')
				.that.is.an('array')
				.that.deep.equals([{
					method : 'POST',
					to: '{0}/labels',
					body: 'test',
				}]);

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

			expect(copy).to.be.an('object')
				.that.has.a.property('_nodes')
				.that.is.an('array')
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

			expect(copy).to.be.an('object')
				.that.has.a.property('_labels')
				.that.is.an('array')
				.that.deep.equals([{
					method : 'POST',
					to: '{0}/labels',
					body: 'test',
				}]);

			expect(copy).to.be.an('object')
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
	});
});