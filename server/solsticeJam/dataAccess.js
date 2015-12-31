var config = require('config');
var BPromise = require('bluebird');
var MongoDb = require('mongodb');
var dbUtil = require('../util/db');
var MongoClient = MongoDb.MongoClient;
BPromise.promisifyAll(MongoDb);
BPromise.promisifyAll(MongoClient);

var CustomErrors = require('../util/custom-errors');

function getUsers(configName) {
	return dbUtil.getDb(configName)
		.then(function(db) {
			return db.collection('users')
				.find().sort([['_id', -1]]).toArrayAsync();
		})
		.then(function(users) {
			if(!users || users.error) {
				console.error('failed getUsers');
				console.error(users.error);
				throw new Error('Failed getUsers');
			}
			return users.map(function(u) {
				return {
					name: u.name,
					beginDate: u._id.getTimestamp()
				};
			});
		});
}

function getUser(configName, username) {
	return dbUtil.getDb(configName)
		.then(function(db) {
			return db.collection('users')
				.find({ name: username }).limit(1).nextAsync();
		})
		.then(function(user) {
			if(!user) {
				throw new CustomErrors.NotFoundError('solsticeJam: getUser: User \'' + username + '\' not found.');
			}
			return user;
		});
}

function addUser(configName, userParams) {
	return dbUtil.getDb(configName)
		.then(function(db) {
			return db.collection('users')
				.insertOneAsync(userParams);
		})
		.then(function(user) {
			if(!user || !user.result || !user.result.ok) {
				//throw CustomErrors.
				//TODO: proper handling
				console.error('failed addUser');
				console.error(user);
				throw new Error('Failed addUser');
			}
			return user.ops[0];
		});
}

function getNewestSubmission(configName, username) {
	return dbUtil.getDb(configName)
		.then(function(db) {
			return db.collection('submissions.files')
				.find({ 'metadata.user': username }).sort([['uploadDate', -1]]).limit(1).nextAsync()
			.then(function(file) {
				if(!file) {
					throw new CustomErrors.NotFoundError('Submission by user \'' + username + '\' not found.');
				}

				var bucket = new MongoDb.GridFSBucket(db, {
					chunkSizeBytes: 1024,
					bucketName: 'submissions'
				});
				return {
					filename: file.filename,
					contentType: file.contentType,
					contentLength: file.length,
					metadata: file.metadata,
					downloadStream: bucket.openDownloadStream(file._id)
				};
			});
		});
}

function addSubmission(configName, metadata, inStream) {
	return dbUtil.getDb(configName)
		.then(function(db) {
			return new BPromise(function(resolve, reject) {
				var filename = metadata.filename;
				delete metadata.filename;
				var contentType = metadata.contentType;
				delete metadata.contentType;
				var bucket = new MongoDb.GridFSBucket(db, {
					chunkSizeBytes: 1024,
					bucketName: 'submissions'
				});
				inStream.pipe(bucket.openUploadStream(filename, {
					metadata: metadata,
					contentType: contentType
				}))
				.on('finish', function() {
					resolve();
				})
				.on('error', function(error) {
					console.error('failed to add submission \'' + filename +
						'\' for user \'' + metadata.user + '\': ' + error.message);
					reject(error);
				});
			});
		});
}

module.exports = {
	getUsers: getUsers,
	getUser: getUser,
	addUser: addUser,
	getNewestSubmission: getNewestSubmission,
	addSubmission: addSubmission
};
