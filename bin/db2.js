var Bulk = require('neo4j-bulk');
module.exports = batch = new Bulk();

var device1 = batch.addNode({
	"uuid": "12f48306-2efa-4e50-b470-77711d54b571",
	"name": "Android"
});
batch.addLabel('Device');

var device2 = batch.addNode({
	"uuid": "12f48306-2efa-4e50-b470-77711d54b572",
	"name": "iOS"
});
batch.addLabel('Device');

var device3 = batch.addNode({
	"uuid": "12f48306-2efa-4e50-b470-77711d54b573",
	"name": "Windows Phone"
});
batch.addLabel('Device');

var device4 = batch.addNode({
	"uuid": "12f48306-2efa-4e50-b470-77711d54b573",
	"name": "Blackberry"
});
batch.addLabel('Device');

batch.addRelation(device1, device2, 'CONNECTED');
batch.addRelation(device2, device4, 'CONNECTED');
batch.addRelation(device3, device4, 'CONNECTED');
batch.addRelation(device1, device4, 'CONNECTED');
batch.addRelation(device2, device4, 'CONNECTED');

Bulk.executeBatch('http://127.0.0.1:7474', batch.generateBatch());
