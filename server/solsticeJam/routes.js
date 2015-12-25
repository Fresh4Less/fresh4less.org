var express = require('express');
var multer = require('multer');
var upload = multer({ storage: multer.memoryStorage() });
var ValidatorErrors = require('fresh-validation').Errors;
var CustomErrors = require('../util/custom-errors');

var solsticeJamService = require('./service');

module.exports = function(configName) {
	var router = express.Router();

	router.get('/users', function(req, res, next) {
		solsticeJamService.getUsers(configName)
			.then(function(users) {
				res.status(200).json(users);
			});
	});

	router.post('/users', function(req, res, next) {
		solsticeJamService.addUser(configName, req.body)
			.then(function(user) {
				res.status(201).json(user);
			})
			.catch(ValidatorErrors.ValidationError, function(err) {
				err.status = 400;
				next(err);
			})
			.catch(CustomErrors.ForbiddenError, function(err) {
				err.status = 403;
				next(err);
			});
	});
	router.post('/users/:username/submission', /*upload.single('submission'),*/ function(req, res, next) {
		//console.log(req);
		res.status(400).end();
	});
		return router;
};
