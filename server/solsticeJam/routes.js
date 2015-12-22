var express = require('express');
var ValidatorErrors = require('fresh-validation').Errors;
var CustomErrors = require('../util/custom-errors');

var solsticeJamService = require('./service');

module.exports = function(configName) {
	var router = express.Router();

	//router.get('/:pageId', function(req, res, next) {
		//pagesService.getPage(req.params.pageId)
			//.then(function(page) {
				//res.status(200).json(page);
			//})
			//.catch(ValidatorErrors.ValidationError, function(err) {
				//err.status = 400;
				//next(err);
			//})
			//.catch(CustomErrors.NotFoundError, function(err) {
				//err.status = 404;
				//next(err);
			//});
	//});

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
		return router;
};
