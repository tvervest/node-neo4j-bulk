var Bulk = require('../index');
var expect = require('chai').expect;

describe('#updateRelationByID(relationID, relationName, data)', function () {
    it('should return false if data is undefined', function () {
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
        bulk.addRelation(0, 1, 'test', {
            'goodbye': 'relation!',
        });
        var r = bulk.updateRelationByID(1, "test");
        expect(r).to.equal(false);
    });

    it('should return true if data is not undefined', function () {
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
        bulk.addRelation(0, 1, 'test', {
            'goodbye': 'relation!',
        });
        var r = bulk.updateRelationByID(1, "test", {'boa noite': "relation"});

        expect(r).to.equal(true);
    });

    it('should show that relation is updated', function () {
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
        bulk.addRelation(0, 1, 'testOld', {
            'hello': 'relation!',
        });
        var typeNew = "testNew";
        var dataNew = {'boa noite': "relation"};
        var r = bulk.updateRelationByID(0, typeNew, dataNew);

        expect(bulk).to.be.an('object')
                .that.has.a.property('_relations')
                .that.is.an('array')
                .that.deep.equals([{
                        body: {data: dataNew,
                            "to": "{1}",
                            "type": typeNew},
                        "method": "POST",
                        "to": "{0}/relationships"
                    }]);
    });
});