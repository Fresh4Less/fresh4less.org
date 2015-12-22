var config = require('config');
var BPromise = require('bluebird');
var MongoDb = require('mongodb');
var db = require('../util/db');
var MongoClient = MongoDb.MongoClient;
BPromise.promisifyAll(MongoDb);
BPromise.promisifyAll(MongoClient);


function addUser(configName, userParams) {
	return db.getDb(configName)
		.then(function(db) {
			return db.collection('users')
				.insertOneAsync(userParams);
		})
		.then(function(user) {
			if(!user || !user.result || !user.result.ok) {
				//throw CustomErrors.
				//TODO: proper handling
				console.error('failed insert');
				console.error(user);
			}
			return user.ops[0];
		});
}

module.exports = {
	addUser: addUser
};
