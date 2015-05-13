var Bulk = require('../index');
var expect = require('chai').expect;

describe('#findRelationIDByNodeIDs(startID, endID)', function () {
    it('should return the correct relation ID when a match is found', function () {
        var bulk = new Bulk();
        var firstNode = bulk.addNode({
            'hello': 'world',
        });
        bulk.addNode({
            'just so you know': 'this is a test',
        });
        bulk.addNode({
            'what do you know': 'this is also test',
        });
        bulk.addRelation(0, 1, 'test', {
            'hello': 'relation!',
        });
        bulk.addRelation(2, 1, 'test', {
            'hello': 'relation!',
        });
        var relationID = bulk.findRelationIDByNodeIDs(2, 1);

        expect(relationID).to.equal(1);
    });

    it('should return false if no relation matches', function () {
        var bulk = new Bulk();
        var firstNode = bulk.addNode({
            'hello': 'world',
        });
        bulk.addNode({
            'just so you know': 'this is a test',
        });
        bulk.addRelation(0, 1, 'test', {
            'hello': 'relation!',
        });
        var relationID = bulk.findRelationIDByNodeIDs(2, 1);
        expect(relationID).to.equal(false);
    });
});