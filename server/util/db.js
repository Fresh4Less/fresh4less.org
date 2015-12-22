var config = require('config');
var BPromise = require('bluebird');
var MongoDb = require('mongodb');
var MongoClient = MongoDb.MongoClient;
BPromise.promisifyAll(MongoDb);
BPromise.promisifyAll(MongoClient);

var dbs = {};

function connect(name) {
	if(dbs[name]) {
		console.warn('Already connected to db \'' + name + '\'');
		dbs[name].close();
	}
	return MongoClient.connectAsync('mongodb://' + config.get(name).dbConfig.host + ':' + config.get(name).dbConfig.port + '/' + config.get(name).dbConfig.dbName)
		.then(function(db) {
			dbs[name] = db;
			return db;
		});
}
function getDb(name) {
	if(!dbs[name]) {
		return connect(name);
	}
	else {
		return BPromise.resolve(dbs[name]);
	}
}

module.exports = {
	connect: connect,
	getDb: getDb
};
