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

app.post('/update/', isAuthenticated, (req, res) => {
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
		vals.push(req.body[changes[i]]);
	}
	query = query + ` WHERE id = ${req.session.user.id}`;
	connection.query(query, vals, (err, results) => {
		query = `SELECT * FROM users WHERE id = ${req.session.user.id}`;
		connection.query(query, (err, results) => {
			req.session.user = results[0];
			delete req.session.user.password;
			res.status(200).send({success: "User updated", user: results[0]});
		});
	});
});

app.listen(8000); //This is the port express will listen on
