let mysql = require('mysql');
let config = require('./config.js');

let connection = mysql.createConnection({
	host	: config.db.host,
	user	: config.db.user,
	port	: config.db.port,
	password: config.db.password
});

//Add the commands that you use to create your tables here in another key, always use CREATE TABLE IF NOT EXISTS
//This file shouldn't have to change except for this object as well as any for loops you need to create dummy data
let tables = {
	users : "CREATE TABLE IF NOT EXISTS `users` (`id` INT AUTO_INCREMENT PRIMARY KEY)",
}

//Initializes your mysql connection
connection.connect(function(err) {
	if (err) throw err;
	console.log("Connected to mysql");
	connection.query("CREATE DATABASE IF NOT EXISTS " + config.db.database, function(err) { //Creates your database if it doesn't exist
		if (err) throw err;
		connection.changeUser({database: config.db.database}, function(err) {
			if (err) throw err;

			for (let table in tables) {//Performs the table creations
				connection.query(tables[table], function(err) {
					if(err) throw err;
				});
			}
		});
	});

});

connection.changeUser({database: config.db.database});

module.exports = {connection};
