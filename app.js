var express = require('express');
var bluebird = require('bluebird')
var mongoose = require('mongoose')
var app = express();
var appsRoute = require('./routes/apps.route');
mongoose.Promise = bluebird

var listener = app.listen(8080, function(){
    console.log('Listening on port ' + listener.address().port); //Listening on port 8888
    mongoose.connect('mongodb://127.0.0.1:27017/trendingApps', { useMongoClient: true})
	.then(()=> { console.log(`Succesfully Connected to the
			Mongodb Database  at URL : mongodb://127.0.0.1:27017/trendingApps`)})
	.catch(()=> { console.log('Error Connecting to the Mongob Database at URL : mongodb://127.0.0.1:27017/trendingApps')})

	app.use(function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
	  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
	  next();
	});
	//console.log("Express server listening on port %d", app.address().port)
	app.use('/apps',appsRoute);

	app.use(function(req, res, next) {
	  var err = new Error('Not Found');
	  err.status = 404;
	  next(err);
	});

});

module.exports = app;