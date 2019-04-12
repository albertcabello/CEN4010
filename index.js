let express = require('express');
let session = require('express-session');
let bcrypt = require('bcrypt');
let bodyParser = require('body-parser');
let cors = require('cors');
let connection = require('./sql.js').connection;
let config = require('./config.js');
const morgan = require('morgan');

let app = express();
app.use(morgan('short'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const port = process.env.PORT || 3001

/************************************
 *           Middlewares            *
 ************************************/
let corsOptions = {
	origin: 'http://localhost:3000',
	credentials: true
}
app.use(cors(corsOptions));
app.use(session({
	secret: config.session.secret,
	cookie: {
		maxAge: config.session.maxAge,
	},
	saveUninitialized: false,
	resave: false,
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
 *          Book Details            *
 ************************************/
app.get('/book/:isbn', (req, res) => {
	console.log("Fetching book with isbn: " + req.params.isbn);
	const ISBN = req.params.isbn;
	const queryString =  "SELECT * FROM Book JOIN Description ON ISBN = descriptionID JOIN Author ON authorID = ID WHERE ISBN = ?";

	connection.query(queryString, [ISBN], (err, rows, fields) => {
		if (err) {
		  console.log("Failed to query for book: " + err);
		  res.sendStatus(500);
		  return
		  // throw err
		}

		const books = rows.map((row) => {
			return {title: row.title,
				authorFirst: row.authorFirst,
				authorLast: row.authorLast,
				cover: row.cover,
				genre: row.genre,
				publisher: row.publisher,
				avgRating: row.avgRating,
				description: row.Description,
				biography: row.bio,
				price: row.price
			};
		});

		res.json(books);
		console.log(books);
	});
});
  
app.get('/author/:authorFirst/:authorLast', (req, res) => {
	const firstName = req.params.authorFirst;
	const lastName = req.params.authorLast;
	console.log("Fetching author info: " + firstName + " " + lastName);
	const queryString = "SELECT * FROM Book JOIN Author ON authorID = ID WHERE authorID IN (SELECT ID FROM Author WHERE authorLast = ? AND authorFirst = ?)";
	connection.query(queryString, [lastName, firstName], (err, rows, fields) => {
		if (err) {
			console.log("Failed to query for author: " + err);
			res.sendStatus(500);
			return;
			// throw err
		  }
  
		const booksByAuthor = rows.map((row) => {
			return {isbn:  row.ISBN,
					title: row.title,
					cover: row.cover,
					price: row.price,
					biography: row.bio
			};
		});
  
		res.json(booksByAuthor);
		console.log(booksByAuthor);
	});
});

app.get('/genre/:genre', (req, res) => {
	const genre = req.params.genre;
	console.log("Fetching genre info: " + genre);
	const queryString = "SELECT * FROM Book WHERE genre = ?";
	connection.query(queryString, [genre], (err, rows, fields) => {
		if (err) {
			console.log("Failed to query for author: " + err);
			res.sendStatus(500);
			return;
			// throw err
		  }
  
		const booksByGenre = rows.map((row) => {
			return {cover: row.cover,
					isbn: row.ISBN,					
			};
		});
  
		res.json(booksByGenre);
		console.log(booksByGenre);
	});
});

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

app.get('/isLoggedIn', (req, res) => {
	if (req.session.user) {
		res.send({user: req.session.user});
	}
	else {
		res.send({error: false});
	}
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
			console.log("NEW PASSWORD", changes[i]);
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
		if (err) {
			res.status(400).send({error: "Error updating the user object, please try again"});
			console.log(err);
		}
		else {
			query = `SELECT * FROM users WHERE id = ${req.session.user.id}`;
			connection.query(query, (err, results) => {
				if (err) res.status(400).send({error: "Error getting user object back"});
				req.session.user = results[0];
				delete req.session.user.password;
				res.status(200).send({success: "User updated", user: results[0]});
			});
		}
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


app.get('/setDefaultAddress/:id', (req, res) => {
	let query = `UPDATE users SET defaultShipping = ? where id = ?`;
	let params = [parseInt(req.params.id), req.session.user.id];
	console.log(query, params);
	connection.query(query, params, (err, results) => {
		if (err) {
			res.status(400).send({error: "Error updating the default password"});
		}
		else {
			req.session.user.defaultShipping = parseInt(req.params.id);
			res.status(200).send({success: "Default updated"});
		}
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
	let query = `INSERT INTO cards (userId, cardNumber, expireMonth, expireYear) VALUES (${req.session.user.id}, ?, ?, ?)`;
	console.log(query, req.body.expireMonth, req.body.expireYear);
	connection.query(query, [req.body.cardNumber, req.body.expireMonth, req.body.expireYear], (err, results) => {
		if (err) res.status(400).send({error: "Couldn't save the credit card " + err});
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

app.put('/card', isAuthenticated, (req, res) => {
	let query = `UPDATE cards SET cardNumber = ?, expireMonth = ?, expireYear = ? WHERE userId = ? and id = ?`;
	let params = [req.body.cardNumber, req.body.expireMonth, req.body.expireYear, req.session.user.id, req.body.cardId];
	if (!checkCard(req.body.cardNumber)) {
		res.status(400).send({error: "Credit card number is not valid"});
	}
	else {
		console.log(query, params);
		connection.query(query, params, (err, results) => {
			if (err) res.status(400).send({error: "Error updating card"});
			else res.status(200).send({success: "Card updated"});
		});
	}
});



/************************************
 *    User Add Review and Comments   *
 ************************************/

let flag_1 = false;

function dataInsert(req,res)
{
	
  const INSERT_USER_QUERY = "INSERT INTO Review(ReviewID, UserFirstName,UserLastName, StarCounter,Comments) VALUES(?,?,?,?,?)";
  connection.query(INSERT_USER_QUERY,[req.body["isbn"],req.body["first"],req.body["last"],req.body["starcount"],req.body["comments"]], (err, resultados) => {
		  if(err) {
			  return res.status(200).send(err)
		  } else {
				  
			  return res.status(200).send('Review register success!')
		  }
  
  });
  
}

function dataUpdate(req,res)
{

  connection.query("SELECT ReviewID,UserFirstName,UserLastName FROM Review",(err,rows)=>{

	  if(err) {
		  return res.status(200).send(err)
	  } 
	  else {

		  Object.keys(rows).forEach(function(key) {
				  var row = rows[key];
				  var first=row.UserFirstName.toLowerCase();
				  var first_req=req.body["first"].toLowerCase();

				  var last=row.UserLastName.toLowerCase();
				  var last_req=req.body["last"].toLowerCase();

				  if((row.ReviewID===req.body["isbn"]) && (first===first_req) && (last===last_req))
				  {
					  connection.query("UPDATE Review SET StarCounter=?,Comments=? WHERE ReviewID=? and UserFirstName=? and UserLastName=?",[req.body["starcount"],req.body["comments"],req.body["isbn"],req.body["first"],req.body["last"]]); 
					  flag_1=true;
					  return;
				  }	
				  if(flag_1===true)
					  return;			
			  });
			  if(flag_1===true)
			  {
				  flag_1=false;
				  return res.send('Review Update success!')
			  } 
			  dataInsert(req,res);
	  
	  }
  });

}

app.post("/review/put", (req, res) => {

  dataUpdate(req,res);	

});

app.post("/review/get", (req, res) => {

   connection.query("SELECT * FROM Review",(err,rows)=>{

	  if(err) {
		  return res.send(err)
	  } 
	  else {
		    
			const reviewData = rows.map((row) => {
				var first=row.UserFirstName.toLowerCase();
				var first_req=req.body["first"].toLowerCase();

				var last=row.UserLastName.toLowerCase();
				var last_req=req.body["last"].toLowerCase();

				if((row.ReviewID===req.body["isbn"]) && (first===first_req) && (last===last_req))
				{
					return {
							isbn:  row.ReviewID,
							first: row.UserFirstName,
							last: row.UserLastName,
							star: row.StarCounter,
							comment: row.Comments					
						};
				}
			});
	  
			res.json(reviewData);		  
			  
	  }
  });

});


/************************************
 *   		Wishlist 			    *
 ************************************/
app.delete('/wishlist', isAuthenticated, (req, res) => {
	let query = `DELETE FROM userWishlists WHERE userId = ${req.session.user.id} and wishlistId = ${req.session.user.id}`;
	connection.query(query, (err, results) => {
		if (err) res.status(400).send({error: "Error removing the address"});
	 else res.status(200).send({success: "Wishlist removed"});
	});
});

app.post('/wishlist', isAuthenticated, (req, res) => {
	let query = `INSERT IGNORE INTO userWishlists (userId, wishlistId) VALUES (${req.session.user.id}, ${req.session.user.id})`;


	connection.query(query, (err, results) => {
		 res.status(200).send({success: "Added wishlist"});
	});
});
app.post('/userwishlist', isAuthenticated, (req, res) => {
	let query = `INSERT INTO Wishlists (wishlistId, isbn) VALUES (${req.session.user.id}, ?)`;
	connection.query(query, req.body.isbn, (err, results) => {
		if (err) res.status(400).send({error: "Couldn't save the wishlist"});
		else res.status(200).send({success: "Added wishlist"});
	});
});

app.delete('/userwishlist', isAuthenticated, (req, res) => {
	let query = `DELETE FROM Wishlists WHERE wishlistId = ${req.session.user.id} and ISBN = ?`;
	connection.query(query, req.body.isbn,(err, results) => {
		if (err) res.status(400).send({error: "Error removing the Wishlist"});
	 else res.status(200).send({success: "Wishlist removed"});
	});
});

app.get('/userwishlist', isAuthenticated, (req,res) => {
	connection.query(`SELECT ISBN, title FROM Book WHERE ISBN IN (Select ISBN from wishlists where wishlistId = ${req.session.user.id})`, (err,rows, results) => {
		if (err) res.status(400).send({error: "Error fetching wishlist"});
	//	else res.status(200).send(results);
	const booksByAuthor = rows.map((row) => {
		return {isbn:  row.ISBN,
				title: row.title
	};
});

res.json(booksByAuthor);
console.log(booksByAuthor);
	});
});

app.listen(port, () => {
	console.log('Server is up and listening on' , port)
  }) //This is the port express will listen on
