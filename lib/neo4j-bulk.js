var Stringify = require("streaming-json-stringify");
var request = require('request');
var Stream = require("stream");

var Bulk = module.exports = function () {
    this._nodes = [];
    this._labels = [];
    this._relations = [];
};

var BUCKET_SIZE = 25000;

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
    var stream = new Stream();
    stream.pipe = function (destination) {
        while (batch.length) {
            destination.write(batch.splice(0, BUCKET_SIZE));
        }
        destination.end();
        return destination;
    }
    var r = {url: host + "/db/data/batch",
        headers:
                {"X-Stream": "true"}
    };
    stream.pipe(Stringify()).pipe(request.post(r)).on("error", function (error) {
        if (error) {
            return (done || noop)(error);
        }
    }).on("response", function (response) {
        if (response.statusCode != 200) {
            var err = new Error([response.statusCode, response.headers["content-type"]].join(': '));
            return (done || noop)(err);
        }
    });
    return (done || noop)();
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
    var relationsID = this._relations.length;
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
    return relationsID;
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
    var push = Array.prototype.push;
    var r = [];
    push.apply(r, this._nodes);
    push.apply(r, this._labels);
    /* The need to slice() the relations array is explained at this link:
     * http://stackoverflow.com/questions/18308700/chrome-how-to-solve-maximum-call-stack-size-exceeded-errors-on-math-max-apply
     * Basicaly, the second argument to apply must be under a certain size and we
     * have so any relations we hit the limit.
     */
    if (this._relations.length < BUCKET_SIZE) {
        push.apply(r, this._relations);
    }
    else {
        while (this._relations.length) {
            var a = this._relations.splice(0, BUCKET_SIZE);
            push.apply(r, a);
        }
    }
    return r;
};