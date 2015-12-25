var BPromise = require('bluebird');
var config = require('config');

var usersDataAccess = require('./dataAccess');
var Validator = require('fresh-validation').Validator;
var CustomErrors = require('../util/custom-errors');

// initialze validator
var validator = new Validator();

function getUsers(configName) {
	return usersDataAccess.getUsers(configName);
}

function addUser(configName, userParams) {
	return BPromise.try(function() {
		var configuration = config.get(configName);
		if(new Date() > new Date(configuration.endTime)) {
			throw new CustomErrors.ForbiddenError('Jam has ended');
		}
		validator.is(userParams, 'userParams').required().object()
			.property('name').required().string()
				.property('length').greaterThan(0).back()
				.back();
		validator.throwErrors();
		var sanitizedParams = validator.transformationOutput();
		sanitizedParams.secretCode = configuration.secretCodePrefixes[Math.floor(Math.random() * configuration.secretCodePrefixes.length)] + '-' + Math.floor(Math.random() * 100);
		return usersDataAccess.addUser(configName, sanitizedParams);
	});
}

module.exports = {
	getUsers: getUsers,
	addUser: addUser
};
