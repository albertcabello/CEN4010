let express = require('express');
let bcrypt = require('bcrypt');
let bodyParser = require('body-parser');
let cors = require('cors');
let connection = require('./sql.js').connection;

let app = express();

/************************************
 *           Middlewares            *
 ************************************/
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/************************************
 *       Profile Management         *
 ************************************/
app.get('/ping', (req, res) => {
	res.status(200).send('pong');
});

app.post('/login', (req, res) => {
	let query = `SELECT * FROM users WHERE username = ?`
	connection.query(query, [req.body.username] , (err, results, fields) => {
		if (err) {
			console.log("Error with login", err);
			res.status(400).send({error: "Error with login"});
		}
		if (results.length == 0) {
			res.status(400).send({error: "Username and password do not match"});
		}
		else {
			bcrypt.compare(req.body.password, results[0].password, (err, result) => {
				if (result) {
					res.status(200).send({successful: "Login succeeded"});
				}
				else {
					res.status(400).send({error: "Username and password do not match"});
				}
			});
		}
	})
});

app.post('/register', (req, res) => {
	bcrypt.hash(req.body.password, 10, (err, hash) => {
		let vals = [req.body.username, hash, req.body.email, req.body.firstName, req.body.lastName, req.body.nickname];
		let query = `INSERT INTO users (username, password, email, firstName, lastName, nickname) VALUES (?, ?, ?, ?, ?, ?)`;
		connection.query(query, vals, (error, results, fields) => {
			if (error) {
				console.log("Error with registration", error);
				res.status(400).send({error: "error occurred"});
			}
			else {
				res.status(200).send({success: "user registered"});
			}
		});
	});
});

app.listen(8000); //This is the port express will listen on
