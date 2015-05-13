var Bulk = require('../index');
var os = process.platform;
if (os === "darwin") {
    module.paths.push("/opt/local/lib/node_modules");
}
var expect = require('chai').expect;

describe('#addLabel(label[, nodeID])', function () {
    it('should create a new label for the given node', function () {
        var bulk = new Bulk();
        bulk.addNode({
            'hello': 'world',
        });
        bulk.addNode({
            'just so you know': 'this is a test',
        });

        bulk.addLabel('test', 0);

        expect(bulk).to.be.an('object')
                .that.has.a.property('_labels')
                .that.is.an('array')
                .that.deep.equals([{
                        method: 'POST',
                        to: '{0}/labels',
                        body: 'test',
                    }]);
    });

    it('should create a new label for the last created node by default', function () {
        var bulk = new Bulk();
        bulk.addNode({
            'hello': 'world',
        });
        bulk.addNode({
            'just so you know': 'this is a test',
        });

        bulk.addLabel('test');

        expect(bulk).to.be.an('object')
                .that.has.a.property('_labels')
                .that.is.an('array')
                .that.deep.equals([{
                        method: 'POST',
                        to: '{1}/labels',
                        body: 'test',
                    }]);
    });

    it('should throw an error if no nodes have been created', function () {
        var bulk = new Bulk();

        expect(function () {
            bulk.addLabel('test');
        }).to.throw('Adding a label to a non-existent node is not allowed');
    });

    it('should throw an error if the specified node does not exist', function () {
        var bulk = new Bulk();
        bulk.addNode({
            'hello': 'world',
        });

        expect(function () {
            bulk.addLabel('test', 1);
        }).to.throw('Adding a label to a non-existent node is not allowed');
    });

    it('should throw an error if the specified node ID is below 0', function () {
        var bulk = new Bulk();
        bulk.addNode({
            'hello': 'world',
        });

        expect(function () {
            bulk.addLabel('test', -1);
        }).to.throw('Adding a label to a non-existent node is not allowed');
    });
});