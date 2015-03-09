/**
* Test file when using neo4j-bulk as a cli tool
*/
var Bulk = require('neo4j-bulk');
module.exports = batch = new Bulk();

var user1 = batch.addNode({
	"uuid": "12f48306-2efa-4e50-b470-77711d54b57a",
	"name": "User 1"
});
batch.addLabel('User');

var user2 = batch.addNode({
	"uuid": "12f48306-2efa-4e50-b470-77711d54b572",
	"name": "User 2"
});
batch.addLabel('User');

batch.addRelation(user1, user2, 'KNOWS')
