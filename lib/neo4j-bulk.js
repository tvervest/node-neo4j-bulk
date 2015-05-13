var os = process.platform;
if (os === "darwin") {
    module.paths.push("/opt/local/lib/node_modules");
}
var request = require('request');

var Bulk = module.exports = function () {
    this._nodes = [];
    this._labels = [];
    this._relations = [];
};

var noop = function () {
};

Bulk.generateClearBatch = function () {
    // two-pass deletion, as per issue #27 https://github.com/neo4j/neo4j/issues/27

    return [{
            method: 'POST',
            to: '/cypher',
            body: {
                query: 'MATCH ()-[r]-() DELETE r',
                params: {},
            },
        }, {
            method: 'POST',
            to: '/cypher',
            body: {
                query: 'MATCH (n) DELETE n',
                params: {},
            },
        }];
};

Bulk.executeBatch = function (host, batch, done) {
    var options = {
        url: host + '/db/data/batch',
        method: 'POST',
        json: batch,
    };

    request(options, function (error, response, body) {
        if (error) {
            return (done || noop)(error);
        }

        if (response.statusCode != 200) {
            var err = new Error([body.exception, body.message].join(': '));
            err.stacktrace = body.stacktrace;
            err.fullname = body.fullname;
            return (done || noop)(err);
        }

        return (done || noop)();
    });
};

Bulk.prototype.findNodeID = function (predicate) {
    for (var i = this._nodes.length - 1; i >= 0; i--) {
        if (predicate(this._nodes[i].body)) {
            return i;
        }
    }


    return false;
};

Bulk.prototype.findRelationIDByNodeIDs = function (startID, endID) {
    for (var i = this._relations.length - 1; i >= 0; i--) {
        if (this._relations[i].to.split("/")[0] === "{" + startID + "}" && this._relations[i].body.to === "{" + endID + "}") {
            return i;
        }
    }


    return false;
};

Bulk.prototype.addNode = function (data) {
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

Bulk.prototype.updateNodeByID = function (nodeID, data) {
    if (nodeID < 0 || nodeID >= this._nodes.length) {
        throw new Error('Updating a non-existent node is not allowed');
    }

    var node = {
        method: 'POST',
        to: '/node',
        id: nodeID,
    };
    if (data) {
        node.body = data;
        this._nodes[nodeID] = node;
        return true;
    }

    return false;
};

Bulk.prototype.addLabel = function (label, nodeID) {
    if (nodeID === undefined) {
        nodeID = this._nodes.length - 1;
    }

    if (nodeID < 0 || nodeID >= this._nodes.length) {
        throw new Error('Adding a label to a non-existent node is not allowed');
    }

    this._labels.push({
        method: 'POST',
        to: '{' + nodeID + '}/labels',
        body: label,
    });
};

Bulk.prototype.addRelation = function (startNode, endNode, relationName, data) {
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

Bulk.prototype.addRelationByID = function (startNodeID, endNodeID, relationName, data) {
    if (startNodeID < 0) {
        throw new Error('Creating a relation from a non-existent node is not allowed');
    }

    if (endNodeID < 0) {
        throw new Error('Creating a relation to a non-existent node is not allowed');
    }

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

Bulk.prototype.updateRelationByID = function (relationID, relationName, data) {
    if (relationID < 0) {
        throw new Error('Creating a relation from a non-existent node is not allowed');
    }
    var body = {
        to: this._relations[relationID].body.to,
        type: relationName,
    };

    if (data !== undefined) {
        body.data = data;
    }
    else {
        return false;
    }

    this._relations[relationID] = {
        method: 'POST',
        to: this._relations[relationID].to,
        body: body,
    };
    return true;
};

Bulk.prototype.branch = function () {
    var branch = new Bulk();
    branch._nodes = this._nodes.slice(0);
    branch._labels = this._labels.slice(0);
    branch._relations = this._relations.slice(0);
    return branch;
};

Bulk.prototype.generateBatch = function () {
    return [].concat(this._nodes, this._labels, this._relations);
};
