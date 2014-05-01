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

### Constructor - Bulk()
Returns a new instance of the neo4j-bulk class.


### addNode(data)
Creates a new node and returns the node's reference ID.

#### Parameters
**data** *(object)*: An object containing the node's properties

#### Returns
The newly created node's reference ID


### addLabel(label[, nodeID])
Adds the label to the specified node, multiple labels can be added to a single node by calling this method multiple times.

#### Parameters
**label** *(string)*: The name of the label
**nodeID** *(number, optional)*: The reference ID of a previously generated node, by default the last created node reference ID is used

#### Returns
Has no return value. An error is thrown if the reference ID is not an existing node, or no nodes have been created.


### addRelation(startNode, endNode, relationName[, data])
Adds a named relationship between two nodes, starting at startNode and pointing to endNode. Optionally, the relation can be given properties using the data parameter.

#### Parameters
**startNode** *(number)*: The reference ID of a previously generated node, from which the relationship will point
**endNode** *(number)*: The reference ID of a previously generated node, to which the relationship will point
**relationName** *(string)*: The name of the relationship
**data** *(object, optional)*: The properties of the relationship

#### Returns
Has no return value. An error is thrown if the startNode or endNode reference ID is not an existing node, or no nodes have been created.


### branch()
Using this method a batch operation can be duplicated. This can be useful when a centralized dataset is used which is then extended per test case. Using  this method the core dataset will remain unaltered.

#### Returns
A copy of the Batch instance.


### generateBatch()
Generates a batch operation object, compatible with the [Neo4j batch API](http://docs.neo4j.org/chunked/stable/rest-api-batch-ops.html) when serialised to JSON.

#### Returns
An array containing the batch operations.
