var express = require('express');
var router = express.Router();

var solsticeJamRoutes = require('./solsticeJam/routes');

router.use('/winter-jam-2015', solsticeJamRoutes('winter-jam-2015'));
router.use(function(err, req, res, next) {
	if(!err.status || err.status >= 500) {
		console.error(err.stack);
	}
	res.status(err.status || 500).send(err.message || 'Internal Server Error');
});
module.exports = router;
