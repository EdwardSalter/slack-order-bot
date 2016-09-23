const debug = require('debug')('OrderBot:data:database');
const config = require('../configuration');
const mongoUri = config.get('mongoUri', 'MONGODB_URI');
const MongoClient = require('mongodb').MongoClient;
const co = require('co');

var db = null;

function ensureConnected() {
    if (!db) {
        throw Error("Database is not connected");
    }
}

module.exports.connect = co.wrap(function*() {
    if (!mongoUri) throw Error("The mongoUri has not been set. Set it via the mongoUri property in user.config.json or via the MONGODB_URI environment variable.");
    debug("Connecting to database at " + mongoUri);
    db = yield MongoClient.connect(mongoUri);
    debug("Database connected");
    return db;
});

module.exports.close = co.wrap(function*() {
    if (!db) return; // No need to close the DB if it is not connected
    yield db.close();
    db = null;
});

Object.defineProperty(module.exports, "trips", {
    get: function() {
        ensureConnected();
        return db.collection("Trips");
    }
});
