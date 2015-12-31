var BPromise = require('bluebird');
var config = require('config');

var solsticeJamDataAccess = require('./dataAccess');
var Validator = require('fresh-validation').Validator;
var CustomErrors = require('../util/custom-errors');

// initialze validator
var validator = new Validator();

function getUsers(configName) {
	return solsticeJamDataAccess.getUsers(configName);
}

function addUser(configName, userParams) {
	return BPromise.try(function() {
		validateJamDate(configName);
		var configuration = config.get(configName);
		validator.is(userParams, 'userParams').required().object()
			.property('name').required().string()
				.property('length').greaterThan(0).back()
				.back();
		validator.throwErrors();
		validator.whitelist();
		var sanitizedParams = validator.transformationOutput();
		return solsticeJamDataAccess.getUser(configName, sanitizedParams.name)
			.then(function(user) {
				throw new CustomErrors.DuplicateError('User \'' + sanitizedParams.name + '\' already exists.');
			})
			.catch(CustomErrors.NotFoundError, function(error) {
				sanitizedParams.secretCode = configuration.secretCodePrefixes[Math.floor(Math.random() * configuration.secretCodePrefixes.length)] + '-' + Math.floor(Math.random() * 100);
				return solsticeJamDataAccess.addUser(configName, sanitizedParams);
			});
	});
}

function getNewestSubmission(configName, username) {
	return BPromise.try(function() {
		validator.is(username, 'username').required().string()
			.property('length').greaterThan(0).back();
		validator.throwErrors();
		return solsticeJamDataAccess.getNewestSubmission(configName, validator.transformationOutput());
	});
}

function addSubmission(configName, submissionParams, inStream) {
	return BPromise.try(function() {
		validator.is(submissionParams, 'submission').required().object()
			.property('secretCode').required().string().back()
			.property('metadata').required().object()
				.property('filename').required().string()
					.property('length').greaterThan(0).back()
					.back()
				.property('user').required().string()
					.property('length').greaterThan(0).back()
					.back()
				.property('contentType').required().string();
		validator.throwErrors();

		var sanitizedParams = validator.transformationOutput();
		return solsticeJamDataAccess.getUser(configName, sanitizedParams.metadata.user)
			.then(function(user) {
				if(sanitizedParams.secretCode !== user.secretCode) {
					throw new CustomErrors.ForbiddenError('Secret Code did not match.');
				}
				return solsticeJamDataAccess.addSubmission(configName, sanitizedParams.metadata, inStream);
			});
	});
}

function validateJamDate(configName) {
	var configuration = config.get(configName);
	if(new Date() > new Date(configuration.endTime)) {
		throw new CustomErrors.ForbiddenError('Jam has ended');
	}
}

module.exports = {
	getUsers: getUsers,
	addUser: addUser,
	getNewestSubmission: getNewestSubmission,
	addSubmission: addSubmission
};
