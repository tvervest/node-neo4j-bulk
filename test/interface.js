var Bulk = require('../index');
var expect = require('chai').expect;

describe('The neo4j-bulk interface', function() {
	it('should be an instantiable class', function () {
		var bulk = new Bulk();
		expect(bulk).to.be.an('object');
	});

	describe('instances', function () {
		it('instances should have a method findNodeID', function () {
			var bulk = new Bulk();
			expect(bulk).to.be.an('object')
				.that.has.a.property('findNodeID')
				.that.is.a('function');
		});

		it('should have a method addNode', function () {
			var bulk = new Bulk();
			expect(bulk).to.be.an('object')
				.that.has.a.property('addNode')
				.that.is.a('function');
		});
		
		it('should have a method addLabel', function () {
			var bulk = new Bulk();
			expect(bulk).to.be.an('object')
				.that.has.a.property('addLabel')
				.that.is.a('function');
		});
		
		it('should have a method addRelation', function () {
			var bulk = new Bulk();
			expect(bulk).to.be.an('object')
				.that.has.a.property('addRelation')
				.that.is.a('function');
		});
		
		it('should have a method branch', function () {
			var bulk = new Bulk();
			expect(bulk).to.be.an('object')
				.that.has.a.property('branch')
				.that.is.a('function');
		});
		
		it('should have a method generateBatch', function () {
			var bulk = new Bulk();
			expect(bulk).to.be.an('object')
				.that.has.a.property('generateBatch')
				.that.is.a('function');
		});
	});
});