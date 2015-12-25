var config = require('config');
var BPromise = require('bluebird');
var MongoDb = require('mongodb');
var db = require('../util/db');
var MongoClient = MongoDb.MongoClient;
BPromise.promisifyAll(MongoDb);
BPromise.promisifyAll(MongoClient);


function getUsers(configName) {
	return db.getDb(configName)
		.then(function(db) {
			return db.collection('users')
				.find().sort([['_id', -1]]).toArrayAsync();
		})
		.then(function(users) {
			if(!users || users.error) {
				console.error('failed get');
				console.error(users.error);
			}
			return users.map(function(u) {
				return {
					name: u.name,
					beginDate: u._id.getTimestamp()
				};
			});
		});
}

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
	getUsers: getUsers,
	addUser: addUser
};
