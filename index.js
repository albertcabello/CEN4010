let express = require('express');
let session = require('express-session');
let bcrypt = require('bcrypt');
let bodyParser = require('body-parser');
let cors = require('cors');
let connection = require('./sql.js').connection;
let config = require('./config.js');

let app = express();

/************************************
 *           Middlewares            *
 ************************************/
app.use(cors());
app.use(session({
	secret: config.session.secret,
	cookie: {
		maxAge: config.session.maxAge,
	},
	saveUninitialized: false,
	resave: false
}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
	let err = req.session.error;
	let msg = req.session.success;
	delete req.session.error;
	delete req.session.success;
	res.locals.message = '';
	if (err) res.locals.message = err;
	if (msg) res.locals.message = msg;
	next();
});

function isAuthenticated(req, res, next) {
	if (req.session.user) {
		next();
	}
	else {
		res.redirect('/login');
	}
}


/************************************
 *       Profile Management         *
 ************************************/
//Given a username and password, runs the callback with err or user
function authenticate(username, password, callback) {
	let query = `SELECT * FROM users WHERE username = ?`;
	connection.query(query, [username], (err, results, fields) => {
		if (err) {
			console.log("Error with login", err);
			callback(new Error('problem with login'));
		}
		if (results.length == 0) {
			callback(new Error('Username and password don\'t match'));
		}
		else {
			bcrypt.compare(password, results[0].password, (err, result) => {
				if (result) {
					callback(null, results[0]);
				}
				else {
					callback(new Error('Username and password don\'t match'));
				}
			});
		}
	});
}
		
app.get('/ping', (req, res) => {
	res.status(200).send('pong');
});

app.get('/login', (req, res) => {
	res.send("This will eventually be a login page");
});

//Starts a session 
app.post('/login', (req, res) => {
	authenticate(req.body.username, req.body.password, (err, user) => {
		if (err) {
			res.status(400).send({error: err.toString()});
		}
		else {
			req.session.regenerate(() => {
				req.session.user = user;
				delete req.session.user.password;
				req.session.success = 'Authenticated as ' + user.username;
				res.status(200).send({success: 'Authenticated as ' + user.username});
			});
		}
	});
});

//Clears your session
app.get('/logout', (req, res) => {
	if (!req.session.user) {
		res.status(400).send({error: 'Not logged in to begin with'});
	}
	else {
		req.session.destroy(() => {
			res.status(200).send({success: 'No longer logged in'});
		});
	}
});

//Registers a user and starts a session with the new user
app.post('/register', (req, res) => {
	bcrypt.hash(req.body.password, 10, (err, hash) => {
		let vals = [req.body.username, hash, req.body.email, req.body.firstName, req.body.lastName, req.body.nickname];
		let query = `INSERT INTO users (username, password, email, firstName, lastName, nickname) VALUES (?, ?, ?, ?, ?, ?)`;
		connection.query(query, vals, (error, results, fields) => {
			if (error) {
				console.log("Error with registration", error);
				req.session.error = "Error with registration, not your fault so try again";
				res.status(400).send({error: "error occurred"});
			}
			else {
				connection.query(`SELECT * FROM users WHERE id = LAST_INSERT_ID()`, (err, results) => {
					req.session.user = results[0];
					delete req.session.user.password;
					req.session.success = "Successfully registered user";
					res.status(200).send({success: "Registered user with id " + results[0].id});
				});
			}
		});
	});
});

//Updates the users information, only updates what's provided
app.put('/update/', isAuthenticated, async (req, res) => {
	//<query building stage>
	let query = `UPDATE users SET`
	let vals = [];
	let changes = Object.keys(req.body); 
	for (let i = 0; i < changes.length; i++) {
		if (i === 0) {
			query = query + ` ${changes[i]} = ?`;
		}
		else {
			query = query + `, ${changes[i]} = ?`; //Notice that this is different with a comma
		}
		if (changes[i] === 'password') {
			//This wraps the hashing function into a promise so that we can await it before continuing the loop
			let hashedPassword = await new Promise((resolve, reject) => {
				bcrypt.hash(req.body[changes[i]], 10, (err, hash) => {
					if (err) reject(err);
					resolve(hash);
				});
			});
			vals.push(hashedPassword);
		}
		else {
			vals.push(req.body[changes[i]]);
		}
	}
	query = query + ` WHERE id = ${req.session.user.id}`;
	console.log(query, vals);
	//</query building stage>
	connection.query(query, vals, (err, results) => {
		if (err) res.status(400).send({error: "Error updating the user object, please try again"});
		query = `SELECT * FROM users WHERE id = ${req.session.user.id}`;
		connection.query(query, (err, results) => {
			if (err) res.status(400).send({error: "Error getting user object back"});
			req.session.user = results[0];
			delete req.session.user.password;
			res.status(200).send({success: "User updated", user: results[0]});
		});
	});
});

/************************************
 *       User Address Management    *
 ************************************/
app.post('/address', isAuthenticated, (req, res) => {
	//<query building stage>
	let makeDefault = req.body.makeDefault === 'true';
	let query = `INSERT INTO addresses (`
	let vals = [];
	let changes = Object.keys(req.body);
	let allowedFields = ['fullName', 'firstLine', 'secondLine', 'city', 'state', 'zip', 'instr', 'code', 'makeDefault'];
	for (let i = 0; i < changes.length; i++) {
		if (!allowedFields.includes(changes[i])) {
			res.status(400).send({error: "Malformed request, unknown field provided: " + changes[i]});
			return;
		}
		if (changes[i] === 'makeDefault') {
			continue;
		}
		if (i === 0) {
			query = query + `${changes[i]}`;
		}
		else {
			query = query + `, ${changes[i]}`;
		}
		vals.push(req.body[changes[i]]);
	}
	query = query + `) VALUES (`;
	for (let i = 0; i < vals.length; i++) {
		if (i === 0) {
			query = query + `?`;
		}
		else {
			query = query + `, ?`;
		}
	}
	query = query + `)`;
	//</query building stage>
	//<transaction to add address to address table and junction table>
	connection.beginTransaction((err) => {
		if (err) res.status(400).send({error: err.toString()}); 
		connection.query(query, vals, (errAddr) => { //This query is to insert the address
			if (errAddr) {
				return connection.rollback(() => {
					res.status(400).send({error: errAddr.toString()});
				});
			}
			connection.query(`SELECT LAST_INSERT_ID()`, (errId, fields) => { //This query is to save the addressId
				if (errId) {
					return connection.rollback(() => {
						res.status(400).send({errorId: errId.toString()});
					});
				}
				let addressId = fields[0]['LAST_INSERT_ID()'];
				query = `INSERT INTO userAddresses (userId, addressId) VALUES (?, ${addressId})`;
				connection.query(query, req.session.user.id, (errJunc) => { //This query is to insert into the userAddresses junction table
					if (errJunc) {
						return connection.rollback(() => {
							res.status(400).send({errorJunc: errJunc.toString()});
						});
					}
					if (makeDefault) {
						//This query makes the defaultAddress be the id we saved
						connection.query(`UPDATE users SET defaultShipping = ${addressId} WHERE id = ?`, req.session.user.id, (errDefault) => { 
							if (errDefault) {
								res.status(400).send({errorDefault: "Was able to add address but couldn't make it default " + err.toString()});
								return;
							}
							else {
								console.log("make def");
							}
							//This commits all the changes we did
							connection.commit((errCommit) => {
								if (errCommit) {
									return connection.rollback(() => {
										res.status(400).send({errorCommit: errCommit.toString()});
									});
								}
								res.status(200).send({success: "Everything done"});
							});
						});
					}
					else {
						connection.commit((errCommit) => {
							if (errCommit) {
								return connection.rollback(() => {
									res.status(400).send({errorCommit: errCommit.toString()});
								});
							}
						});
						res.status(200).send({success: "Everything done"});
					}
				});
			});
		});
	});
	//</transaction to add address to address table and junction table>
});

//Lists addresses
app.get('/address', isAuthenticated, (req, res) => {
	let query = `SELECT * FROM addresses JOIN userAddresses ON userAddresses.addressId = addresses.id WHERE userId = ${req.session.user.id}`;
	connection.query(query, (err, results) => {
		if (err) res.status(400).send({error: "Error with retrieving addresses"});
		else res.status(200).send(results);
	});
});

app.delete('/address', isAuthenticated, (req, res) => {
	let query = `DELETE FROM userAddresses WHERE userId = ? and addressId = ?`;
	connection.query(query, [req.session.user.id, req.query.id], (err, results) => {
		if (err) res.status(400).send({error: "Error removing the address"});
		else res.status(200).send({success: "Address removed"});
	});
});

/************************************
 *    User Credit Card Management   *
 ************************************/
function checkCard(cardNumber) {
	if (!cardNumber) {
		return false;
	}
	let sum = 0;
	let alternate = false; 
	for (let i = cardNumber.length - 1; i >= 0; i--) {
		let n = parseInt(cardNumber[i], 10);
		if (alternate) {
			n *= 2;
			if (n > 9) {
				n = (n % 10) + 1;
			}
		}
		sum += n;
		alternate = !alternate;
	}
	return (sum % 10 === 0);
}

app.post('/card', isAuthenticated, (req, res) => {
	if (!checkCard(req.body.cardNumber)) {
		res.status(400).send({error: "Credit card number is not valid"});
		return;
	}
	let query = `INSERT INTO cards (userId, cardNumber) VALUES (${req.session.user.id}, ?)`;
	connection.query(query, req.body.cardNumber, (err, results) => {
		if (err) res.status(400).send({error: "Couldn't save the credit card"});
		else res.status(200).send({success: "Added credit card"});
	});
});

app.get('/card', isAuthenticated, (req, res) => {
	connection.query(`SELECT * FROM cards WHERE userId = ${req.session.user.id}`, (err, results) => {
		if (err) res.status(400).send({error: "Error fetching cards"});
		else res.status(200).send(results);
	});
});

app.delete('/card', isAuthenticated, (req, res) => {
	connection.query(`DELETE FROM cards WHERE userId = ${req.session.user.id} and id = ?`, req.query.id, (err, results) => {
		if (err) res.status(400).send({error: "Error deleting card"});
		else res.status(200).send({success: "Card removed"});
	});
});

app.listen(8000); //This is the port express will listen on
