let mysql = require('mysql');
let config = require('./config.js');

let connnection = mysql.createConnection({
	host	: config.db.host,
	user	: config.db.user,
	port	: config.db.port,
	paddword: config.db.password,
	database: config.db.database
});

con.connect(function(err) {
	if (err) throw err;
	console.log("Connected to mysql");
});

module.exports = {connection};
