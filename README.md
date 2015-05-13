# node-neo4j-bulk [![Build Status](https://travis-ci.org/tvervest/node-neo4j-bulk.png?branch=master)](https://travis-ci.org/tvervest/node-neo4j-bulk) [![Dependencies](https://david-dm.org/tvervest/node-neo4j-bulk.png)](https://david-dm.org/) [![Code Climate](https://codeclimate.com/github/tvervest/node-neo4j-bulk.png)](https://codeclimate.com/github/tvervest/node-neo4j-bulk)

> A helper library to set up bulk data inserts for Neo4j databases

 The main goal of the neo4j-bulk library is to create an easy and intuitive way of setting up the data model for the neo4j bulk API so to set up an initial database state for test suites.

## Usage

First, install `neo4j-bulk` as a development dependency:

```shell
npm install --save-dev neo4j-bulk
```

Then, in your pre-test setup script create a Bulk instance and add data. In this example I'll set up a graph representing the relational status between two purely fictional \*cough\* \*cough\* people:

```javascript
var Bulk = require('neo4j-bulk');

var bulk = new Bulk();

var thomas = bulk.addNode({
	name: 'Thomas Vervest'
});

var annemarie = bulk.addNode({
	name: 'Annemarie Jellema'
});

bulk.addLabel('Male', thomas);
bulk.addLabel('Male', annemarie);

bulk.addRelation(thomas, annemarie, 'ENGAGED_TO');
bulk.addRelation(annemarie, thomas, 'ENGAGED_TO');

var batchObject = bulk.generateBatch();
```

The `batchObject` variable now contains an array which, when represented as JSON, can be posted to the [Neo4j batch API](http://docs.neo4j.org/chunked/stable/rest-api-batch-ops.html) resulting in the following psuedo-cypher dataset:

```
(t:Male { name: "Thomas Vervest" }),
(a:Female { name: "Annemarie Jellema" }),
(t)-[:ENGAGED_TO]->(a),
(a)-[:ENGAGED_TO]->(t)
```

## Interface

- - -

### Constructor - Bulk()
Returns a new instance of the neo4j-bulk class.

- - -

### addNode(data)
Creates a new node and returns the node's reference ID.

#### Parameters
**data** *(object)*: An object containing the node's properties

#### Returns
The newly created node's reference ID

- - -

### updateNodeByID(nodeID, data)
Updates a previously generated node and returns the node's reference ID.

#### Parameters
**nodeID** *(number)*: The reference ID of a previously generated node
**data** *(object)*: An object containing the node's properties

#### Returns
true if node was updated or false if the node was not updated (because data was undefined)

- - -

### addLabel(label[, nodeID])
Adds the label to the specified node, multiple labels can be added to a single node by calling this method multiple times.

#### Parameters
**label** *(string)*: The name of the label
**nodeID** *(number, optional)*: The reference ID of a previously generated node, by default the last created node reference ID is used

#### Returns
Has no return value. An error is thrown if the reference ID is not an existing node, or no nodes have been created.

- - -

### addRelation(startNode, endNode, relationName[, data])
Adds a named relationship between two nodes, starting at startNode and pointing to endNode. Optionally, the relation can be given properties using the data parameter.

#### Parameters
**startNode** *(number)*: The reference ID of a previously generated node, from which the relationship will point
**endNode** *(number)*: The reference ID of a previously generated node, to which the relationship will point
**relationName** *(string)*: The name of the relationship
**data** *(object, optional)*: The properties of the relationship

#### Returns
Has no return value. An error is thrown if the startNode or endNode reference ID is not an existing node, or no nodes have been created.

- - -

### addRelationByID(startNodeID, endNodeID, relationName[, data])
Adds a named relationship between two nodes, starting at the node with id `startNodeID` and pointing to the node with id `endNode`. Optionally, the relation can be given properties using the data parameter.

#### Parameters
**startNodeID** *(number)*: The ID of a previously inserted node, from which the relationship will point
**endNodeID** *(number)*: The ID of a previously inserted node, to which the relationship will point
**relationName** *(string)*: The name of the relationship
**data** *(object, optional)*: The properties of the relationship

#### Returns
Has no return value. An error is thrown if the startNode or endNode reference ID is an invalid node ID.

- - -

### updateRelationByID(relationID, relationName, data)
Updates a relationship between two nodes.

#### Parameters
**relationID** *(number)*: The ID of a previously created relation
**relationName** *(string)*: The name of the relationship
**data** *(object)*: The properties of the relationship

#### Returns
true if relation was updated or false if the relation was not updated (because data was undefined)

- - -

### branch()
Using this method a batch operation can be duplicated. This can be useful when a centralized dataset is used which is then extended per test case. Using  this method the core dataset will remain unaltered.

#### Returns
A copy of the Batch instance.

- - -

### generateBatch()
Generates a batch operation object, compatible with the [Neo4j batch API](http://docs.neo4j.org/chunked/stable/rest-api-batch-ops.html) when serialised to JSON.

#### Returns
An array containing the batch operations.

- - -

### executeBatch(host, batch[, done])
Executes a POST request with the given batch to the specified neo4j host.

#### Parameters
**host** *(string)*: The neo4j hostname.
**batch** *(string)*: The batch request JSON.
**done** *(function, optional)*: Callback error handler which takes a single argument, the error which may have been thrown

#### Returns
Has no return value. Use the optional callback parameter for any error handling.

- - -

### findNodeID(predicate)
Searches the collection of nodes for a node matching the predicate, and then returns the matching node's reference ID.

#### Parameters
**predicate** *(function)*: The predicate function used to test a match. The function will take a single argument, which is the iterated node, and should return true if the predicate matches, or false otherwise.

#### Returns
The reference ID of the first node that matches the predicate, false otherwise.

- - -

### findRelationIDByNodeIDs(startNodeID, endNodeID)
Searches the collection of relations for a relation with the matching start and end node IDs, and then returns the matching node's reference ID.

#### Parameters
**startNodeID** *(number)*: The ID of a previously inserted node, from which the relationship will point
**endNodeID** *(number)*: The ID of a previously inserted node, to which the relationship will point

#### Returns
The reference ID of the first relation that matches the start and end node IDs, false otherwise.
