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
	stopForeignKey : "SET FOREIGN_KEY_CHECKS = 0", 

	users : "CREATE TABLE IF NOT EXISTS `users` (" + 
		  "`id` int(11) NOT NULL AUTO_INCREMENT," +
		  "`username` varchar(255) DEFAULT NULL," + 
		  "`firstName` varchar(100) NOT NULL," + 
		  "`lastName` varchar(100) NOT NULL," +
		  "`email` varchar(100) NOT NULL," +
		  "`password` varchar(255) DEFAULT NULL," +
		  "`nickname` varchar(50) DEFAULT NULL," + 
		  "`defaultShipping` int(11)," + 
		  "PRIMARY KEY (`id`)," +
		  "CONSTRAINT `defaultShipping` FOREIGN KEY (`defaultShipping`) REFERENCES `addresses`(`id`) ON DELETE SET NULL," + 
		  "UNIQUE KEY `username` (`username`))",

	addresses: "CREATE TABLE IF NOT EXISTS `addresses` (" + 
		     "`id` int(11) NOT NULL AUTO_INCREMENT," +
		     "`fullName` varchar(200) DEFAULT NULL," + 
		     "`firstLine` varchar(200) NOT NULL," + 
		     "`secondLine` varchar(200)," + 
		     "`city` varchar(200) NOT NULL," + 
		     "`state` varchar(2) NOT NULL," + 
		     "`zip` varchar(5) NOT NULL," +
		     "`instr` varchar(1000)," +
		     "`code` varchar(20)," +
		     "PRIMARY KEY (`id`))",

	userAddresses: "CREATE TABLE IF NOT EXISTS `userAddresses` (" +
			 "`userId` int(11) NOT NULL, addressId int(11) NOT NULL," +
			 "FOREIGN KEY (userId) REFERENCES `users`(`id`)," + 
			 "FOREIGN KEY (addressId) REFERENCES `addresses`(`id`))",
	
	cards: "CREATE TABLE IF NOT EXISTS `cards` (" + 
		 "`id` int(11) NOT NULL AUTO_INCREMENT, `userId` int(11) NOT NULL, cardNumber varchar(19) NOT NULL," +
		 "PRIMARY KEY (id), FOREIGN KEY (`userId`) REFERENCES `users`(`id`))",

	Book: "CREATE TABLE IF NOT EXISTS `Book` (`ISBN` INT PRIMARY KEY , `authorID` INT, `title` VARCHAR(45), `genre` VARCHAR(45), `publisher` VARCHAR(45), `cover` VARCHAR(150), `price` DOUBLE, `avgRating` DOUBLE)",
	
	Author: "CREATE TABLE IF NOT EXISTS `Author` (`authorID` INT AUTO_INCREMENT PRIMARY KEY, `authorLast` VARCHAR(45), `authorFirst` VARCHAR(45), `bio` TEXT)", 

	Description: "CREATE TABLE IF NOT EXISTS `Description` (`descriptionID` INT PRIMARY KEY, `Description` TEXT)",

	continueForeignKey : "SET FOREIGN_KEY_CHECKS = 1",
}

//Initializes your mysql connection
connection.connect(function(err) {
	if (err) throw err;
	console.log("Connected to mysql");

});

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

module.exports = {connection};
