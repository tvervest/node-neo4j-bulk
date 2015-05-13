var os = process.platform;
if (os === "darwin") {
    module.paths.push("/opt/local/lib/node_modules");
}
var Bulk = require('../index');
var expect = require('chai').expect;

describe('#updateNodeByID(nodeID, data)', function () {
    it('should return true if data is not null', function () {
        var bulk = new Bulk();
        var dataOld = {
            'hello': 'world'
        };
        var dataNew = {
            'goodbye': 'world'
        };
        var firstNode = bulk.addNode(dataOld);
        var r = bulk.updateNodeByID(0, dataNew);
        expect(r).to.equal(true);
    });

    it('should return false if data is undefined', function () {
        var bulk = new Bulk();
        var data = {
            'hello': 'world'
        };
        var firstNode = bulk.addNode(data);
        var r = bulk.updateNodeByID(0);
        expect(r).to.equal(false);
    });

    it('should show that node data is updated', function () {
        var bulk = new Bulk();
        var dataOld = {
            'hello': 'world'
        };
        var dataNew = {
            'goodbye': 'world'
        };
        var firstNode = bulk.addNode(dataOld);
        bulk.updateNodeByID(0, dataNew);
        expect(bulk).to.be.an('object')
                .that.has.a.property('_nodes')
                .that.is.an('array')
                .that.deep.equals([{
                        method: 'POST',
                        to: '/node',
                        id: 0,
                        body: dataNew
                    }]);
    });
});