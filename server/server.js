var express = require('express');
var http = require('http');

var bodyParser = require('body-parser');
var compress = require('compression');

var app;
var server;
function start(appPort) {
	app = express();
	server = http.Server(app);

	server.listen(appPort);
	console.log('Listening on port ' + appPort);
	//
	//app.use(session({
	//	secret: 'change this',
	//	resave: false,
	//	saveUninitialized: true
	//}));

	app.use(compress());
	app.use(bodyParser.json());
	//app.use(routes);
	//app.use(express.static(__dirname + "/../client"));
	app.use(express.static(__dirname + "/../dist"));
	app.use('/bower_components',express.static(__dirname + "/../bower_components"));
}

function close() {
	if(server) {
		server.close();
		app = null;
		server = null;
	}
}

module.exports = {
	start: start,
	close: close
};
