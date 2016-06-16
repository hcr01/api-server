var port = process.env.PORT || 3000;
var db_dir = "db"; // database directory
// get time
var starttime = Date.now();
// including needed libarys
var express = require('express');
var db = require("./modules/db.js")
var v01 = require("./modules/apis/v0.1.js");
// init server
var app = express();

function startServer() {
	app.get('/', function (req, res) {
		res.json({message:'welcome to the hcr01 API server', latest:'v0.1'});
	});
	app.use(function (req, res) {
		res.json({error: 404, errortext: "not found"});
	});
	app.listen(port, function () {
		console.log("[info]  \x1b[36mlistening on port %d after %d ms...\x1b[0m", port, Date.now() - starttime);
	});
}

// init database
db.init(db_dir, function () {
	// init api
	v01.init(db, express, function () {
		app.use('/v0.1', v01.routes);
		startServer();
	});
});
