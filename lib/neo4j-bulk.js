
var Bulk = module.exports = function () {
	this._nodes = [];
	this._labels = [];
	this._relations = [];
};

Bulk.prototype.findNodeID = function(predicate) {
	for (var i = this._nodes.length - 1; i >= 0; i--) {
		if (predicate(this._nodes[i].body)) {
			return i;
		}
	};

	return false;
};

Bulk.prototype.addNode = function(data) {
	var nodeID = this._nodes.length;
	
	var node = {
		method: 'POST',
		to: '/node',
		id: nodeID,
	};
	if (data) {
		node.body = data;
	}

	this._nodes.push(node);
	return nodeID;
};

Bulk.prototype.addLabel = function(label, nodeID) {
	if (nodeID === undefined) {
		nodeID = this._nodes.length - 1;
	}

	if (nodeID < 0 || nodeID >= this._nodes.length) {
		throw new Error('Adding a label to a non-existent node is not allowed');
	}

	this._labels.push({
		method : 'POST',
		to: '{' + nodeID + '}/labels',
		body: label,
	});
};

Bulk.prototype.addRelation = function(startNode, endNode, relationName, data) {
	if (startNode < 0 || startNode >= this._nodes.length) {
		throw new Error('Creating a relation from a non-existent node is not allowed');
	}

	if (endNode < 0 || endNode >= this._nodes.length) {
		throw new Error('Creating a relation to a non-existent node is not allowed');
	}

	var body = {
		to: '{' + endNode + '}',
		type: relationName,
	};

	if (data !== undefined) {
		body.data = data;
	}

	this._relations.push({
		method: 'POST',
		to: '{' + startNode + '}/relationships',
		body: body,
	});
};

Bulk.prototype.addRelationByID = function(startNodeID, endNodeID, relationName, data) {
	var body = {
		to: '/node/' + endNodeID,
		type: relationName,
	};

	if (data !== undefined) {
		body.data = data;
	}

	this._relations.push({
		method: 'POST',
		to: '/node/' + startNodeID + '/relationships',
		body: body,
	});
};

Bulk.prototype.branch = function() {
	var branch = new Bulk();
	branch._nodes = this._nodes.slice(0);
	branch._labels = this._labels.slice(0);
	branch._relations = this._relations.slice(0);
	return branch;
};

Bulk.prototype.generateBatch = function() {
	return [].concat(this._nodes, this._labels, this._relations);
};
