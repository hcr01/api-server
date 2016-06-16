var app = {
	init: function (db, express, callback) {
		console.log("[info]  loading api (/v0.1)...");
		// adding vars to this...
		this.db = db;
		this.express = express;
		// defining the router of this API version
		this.routes = express.Router();
		// adding handlers
		initRouter();
		// callback
		callback();
	},
};
function initRouter() {
	// just returns the api version
	app.routes.get('/', function(req, res) {
		res.status(403);
		res.json({version:'0.1', firstrelease: {date:'1 June 2016', timestamp:1464739200}});
	});
	// @/hcrs/<your hcr id> returns a few information about this hcr
	app.routes.get('/hcrs/:hcr_id', function (req, res) {
		app.db.getHcrInfo({id: req.params.hcr_id}, function(data) {
			var response = {};
			switch (data.error) {
				case undefined:
					response = {
						name: data.name,
						id: data.id
					};
					break;
				case 404:
					response = {error: 404, errortext: "not found"};
					res.status(404);
					break;
				case 500:
					response = {error: 500, errortext: "server error"};
					res.status(500);
					break;
				default:
					response = {error: 500, errortext: "server error"};
					res.status(500);
					break;
				}
				res.json(response);
			});
		});
		// @/hcrs, returns a list of all hcrs with id and name
		app.routes.get('/hcrs', function (req, res) {
			app.db.getHcrList({}, function (items) {
				if (items.error !== undefined) {
					res.status(500);
				res.json({error: 500, errortext: "server error"});
				return;
			}
			try {
				app.db.hcrListAddNames(items.items, function (data) {
					res.json(data);
				});
			} catch (e) {
				res.status(500);
				res.json({error: 500, errortext: "server error"});
			}
		});
	});
}

module.exports = app;
