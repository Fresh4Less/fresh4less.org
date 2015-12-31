var express = require('express');
var fs = require('fs');
var multer = require('multer');
var config = require('config');
var ValidatorErrors = require('fresh-validation').Errors;
var CustomErrors = require('../util/custom-errors');

var solsticeJamService = require('./service');

module.exports = function(configName) {
	var router = express.Router();
	var configuration = config.get(configName);
	var upload = multer({ dest: configuration.tempDir });

	router.get('/users', function(req, res, next) {
		solsticeJamService.getUsers(configName)
			.then(function(users) {
				res.status(200).json(users);
			})
			.catch(function(err) {
				next(err);
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
			})
			.catch(CustomErrors.DuplicateError, function(err) {
				err.status = 409;
				next(err);
			})
			.catch(function(err) {
				next(err);
			});
	});

	router.get('/users/:username/submission', function(req, res, next) {
		solsticeJamService.getNewestSubmission(configName, req.params.username)
			.then(function(submission) {
				res.setHeader('Content-Type', submission.contentType);
				res.setHeader('Content-Length', submission.contentLength);
				res.setHeader('Content-Disposition', 'attachment; filename=' + submission.filename);
				submission.downloadStream.pipe(res);
			})
			.catch(ValidatorErrors.ValidationError, function(err) {
				err.status = 400;
				next(err);
			})
			.catch(CustomErrors.NotFoundError, function(err) {
				err.status = 404;
				next(err);
			})
			.catch(function(err) {
				next(err);
			});
	});
	router.post('/users/:username/submission', upload.single('file'), function(req, res, next) {
		solsticeJamService.addSubmission(configName, {
			secretCode: req.body.secretCode,
			metadata: {
				filename: req.file.originalname,
				contentType: req.file.mimetype,
				user: req.params.username
			}
		},
		fs.createReadStream(req.file.path)
		)
			.then(function() {
				res.status(201).end();
			})
			.catch(ValidatorErrors.ValidationError, function(err) {
				err.status = 400;
				next(err);
			})
			.catch(CustomErrors.ForbiddenError, function(err) {
				err.status = 403;
				next(err);
			})
			.catch(CustomErrors.NotFoundError, function(err) {
				err.status = 404;
				next(err);
			})
			.catch(function(err) {
				next(err);
			});
	});
		return router;
};
