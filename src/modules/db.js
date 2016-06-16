var fs = require('fs');
var app = {
	// init the database
	init: function (dir, callback) {
		console.log("[info]  init db...")
		app.dir = dir;
		if (!fs.existsSync(app.dir)) {
			fs.mkdirSync(app.dir,0755);
		}
		callback();
	},
	getHcrInfo: function (properties, callback) {
		if (properties.id !== undefined) {
			var filepath = app.dir + "/hcrs/" + properties.id + "/manifest.json";
			fs.exists(filepath, function (exists) {
				if (exists) {
					fs.readFile(filepath, 'utf8', function (error, data) {
						if (error) {
							callback({error: 500, errorObj: new Error("error while reading file")});
						} else {
							try {
								var obj = JSON.parse(data);
								callback(obj);
							} catch (e) {
							callback({error: 500, errorObj: e});
							}
						}
					});
				} else {
					callback({error: 404, errorObj: new Error("not found")});
				}
			});
		} else {
			callback({error: 501, errorObj: new Error("not implemented")});
		}
	},
	getHcrList: function (properties, callback) {
		var basic_path = app.dir + '/hcrs/';
		try {
			fs.readdir(basic_path, function(error, items) {
				if (!error) {
					callback({items: items});
				} else {
					callback({error: 500, errorObj: new Error("server error")});
				}
			});
		} catch (e) {
			callback({error: 500, errorObj: e});
		}
	},
	hcrListAddNames: function (items, callback) {
		var i = 0, list = [];
		items.forEach(function (item) {
			app.getHcrInfo({id: item}, function (data) {
				if (data.error === undefined) {
					list.push({id: item, name: data.name});
				}
				if (i == items.length - 1) {
					callback(list);
				}
				i++;
			});
		})
	}
};

module.exports = app;
