#!/usr/bin/env node

var Bulk = require('../index.js');
var path = require('path');
var fs = require('fs');

function updateDB(host, bulkObject) {
    Bulk.generateClearBatch(function(e) {
        if(e) console.log(e);
        
        console.log('Database cleared');

        Bulk.executeBatch(host, bulkObject, function(e) {
            if(e) console.log(e);

            console.log('Database has been updated');
        });
    });
}

/**
* CLI Interface
*/

function help() {
    console.log('Please specify path to the database script');
    console.log('Usage: node app <database file>');
}

if(!process.argv[2]) {
    help();
    return 0;
}

var filepath = path.resolve(process.cwd(), process.argv[2]);

if (fs.existsSync(filepath)) {
    var bulkObject = require(filepath);
    
    console.log(bulkObject);

    updateDB('http://127.0.0.1:7474', bulkObject);
} else {
    console.log('File not exist');
    help();
}
