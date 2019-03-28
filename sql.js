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
		 
	Book: "CREATE TABLE IF NOT EXISTS `Book` (`ISBN` INT(11) PRIMARY KEY , `authorID` INT(11), `title` VARCHAR(45), `genre` VARCHAR(45), `publisher` VARCHAR(45), `cover` VARCHAR(150), `price` DOUBLE, `avgRating` DOUBLE)",
	
	Author: "CREATE TABLE IF NOT EXISTS `Author` (`authorID` INT(11) AUTO_INCREMENT PRIMARY KEY, `authorLast` VARCHAR(45), `authorFirst` VARCHAR(45), `bio` TEXT)", 
	 
	Description: "CREATE TABLE IF NOT EXISTS `Description` (`descriptionID` INT(11) PRIMARY KEY, `Description` TEXT)",

	continueForeignKey : "SET FOREIGN_KEY_CHECKS = 1",
}

let inserts = {
	Book: "INSERT INTO `Book`" + 
			"VALUES (`9780553278224` , 2, `The Martian Chronicles`, `Sci-fi`, `Bantam/Spectra`, `https://images.gr-assets.com/books/1374049948l/76778.jpg`, 5.99, 4.13)," + 
					"(`9780439554930` , 3, `Harry Potter and the Sorcerer's Stone`, `Fantasy`, `Scholastic Inc `, `https://images.gr-assets.com/books/1474154022l/3.jpg`, 8.99, 4.46)," + 
					"(`9780439064866` , 3, `Harry Potter and the Chamber of Secrets`, `Fantasy`, `Scholastic Inc `, `https://images.gr-assets.com/books/1474169725l/15881.jpg`, 8.99, 4.41)" +
					"('9780143130239', 1, 'As You Like It', 'Comedy', 'Penguin Publishing', 'https://prodimage.images-bn.com/pimages/9780143130239_p0_v1_s550x406.jpg', 9.99, 3.5))," +
					 "('9780143128540', 1, 'Hamlet', 'Tragedy', 'Penguin Publishing', 'https://images.penguinrandomhouse.com/cover/9780143128540', 9.99, 4.6)," + 
					 "('9780380729401', 2, 'Something Wicked This Way Comes', 'Horror','Bantam/Spectra', 'https://images.gr-assets.com/books/1409596011l/248596.jpg', 5.99, 3.6)",
	Author:"INSERT INTO `Author`" + 
			"VALUES (3, `Rowling`, `J.K`, `Joanne Rowling (born July 31, 1965), who goes by the pen name J.K. Rowling, is a British author and screenwriter best known for her seven-book Harry Potter children's book series." +
											"J.K. Rowling was living in Edinburgh, Scotland, and struggling to get by as a single mom before her first book, Harry Potter and the Sorcerer's Stone, was published. The children's " +
											"fantasy novel became an international hit and Rowling became an international literary sensation in 1999 when the first three installments of Harry Potter took over the top three slots of The New York Times best-seller list after achieving similar success in her native United Kingdom.`)," +
			"(1, 'Shakespeare', 'William', 'William Shakespeare (1564–1616) was a poet, playwright, and actor who is widely regarded as one of the most influential writers in the history of the English language. Often referred to as the Bard of Avon, Shakespeare’s vast body of work includes comedic, tragic, and historical plays; poems; and 154 sonnets. His dramatic works have been translated into every major language and are performed more often than those of any other playwright.' ), " +
			"(2, 'Bradbury', 'Ray', 'Ray Bradbury (1920–2012) was America’s foremost writer of science fiction and fantasy. Among his most popular adult books were Fahrenheit 451, The Martian Chronicles, The Illustrated Man, Dandelion Wine, and Death Is a Lonely Business. In addition, he wrote several books for children, including Switch on the Night. In recognition of his stature in the world of literature, Bradbury was awarded the National Book Foundation’s 2000 Medal for Distinguished Contribution to American Letters and the National Medal of Arts in 2004.')" , 

	Description: "INSERT INTO `Description`" + 
				   "VALUES (`9780553278224`, `The strange and wonderful tale of man’s experiences on Mars, filled with intense images and astonishing visions. Now part of the Voyager Classics collection.`)," + 
				  			"(`9780439554930`, `Harry Potter's life is miserable. His parents are dead and he's stuck with his heartless relatives, who force him to live in a tiny closet under the stairs. But his fortune changes when he receives a letter that tells him the truth about himself: he's a wizard. A mysterious visitor rescues him from his relatives and takes him to his new home, Hogwarts School of Witchcraft and Wizardry.`)," + 
							"(`9780439064866`, `The Dursleys were so mean and hideous that summer that all Harry Potter wanted was to get back to the Hogwarts School for Witchcraft and Wizardry. But just as he's packing his bags, Harry receives a warning from a strange, impish creature named Dobby who says that if Harry Potter returns to Hogwarts, disaster will strike`)," +
							"('9781451673319','Guy Montag is a fireman who burns books in a futuristic American city. In Montag’s world, firemen start fires rather than putting them out. The people in this society do not read books, enjoy nature, spend time by themselves, think independently, or have meaningful conversations. Instead, they drive very fast, watch excessive amounts of television on wall-size sets, and listen to the radio on “Seashell Radio” sets attached to their ears.')," + 
							"('9780143130239', 'Duke Senior, banished and usurped by his brother, Duke Frederick, now lives in the Forest of Arden, with his noblemen. Senior’s daughter Rosalind has been allowed to remain at court with Frederick’s daughter Celia, but she suddenly incurs Frederick’s displeasure, and is banished. Celia decides to run away with her, and they leave for Arden with Rosalind disguised as a man, and accompanied by Touchstone, a clown. Rosalind changes her name to Ganymede, and Celia to Aliena.'), " +
							"('9780143128540', 'Hamlet, Prince of Denmark, is home from school to mourn the death of his father, King Hamlet, who has died two months earlier. Hamlet is disgusted by the marriage of his newly widowed mother, Queen Gertrude, to his Uncle, King Hamlet’s brother, Claudius, who now has the throne.')," +
							"('9780380729401', 'A carnival rolls in sometime after the midnight hour on a chill Midwestern October eve, ushering in Halloween a week before its time. A calliope's shrill siren song beckons to all with a seductive promise of dreams and youth regained. In this season of dying, Cooger & Dark's Pandemonium Shadow Show has come to Green Town, Illinois, to destroy every life touched by its strange and sinister mystery. And two inquisitive boys standing precariously on the brink of adulthood will soon discover the secret of the satanic raree-show's smoke, mazes, and mirrors, as they learn all too well the heavy cost of wishes - and the stuff of nightmare.')"
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
				if(table == 'Book'){
					for (let book in data) {
						connection.query(data[book], function(err){if(err) throw err;});
				}
			}
			});
		}
	});
});

module.exports = {connection};
