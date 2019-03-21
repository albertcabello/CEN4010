'use strict';

var express = require('express');
var app = express();
var morgan = require('morgan');
var mysql = require("mysql");
var bodyParser = require('body-parser');

app.use(morgan('short'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var port = process.env.PORT || 3001;

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345678a',
  database: 'Bookstore'
});

app.post('/book/:isbn', function (req, res) {
  console.log("Fetching book with isbn: " + req.params.isbn);
  var ISBN = req.params.isbn;
  var queryString = "SELECT genre, publisher, avgRating, description, bio FROM Book JOIN Description ON ISBN = descriptionID JOIN Author ON authorID = ID WHERE ISBN = ?";

  connection.query(queryString, [ISBN], function (err, rows, fields) {
    if (err) {
      console.log("Failed to query for book: " + err);
      res.sendStatus(500);
      return;
      // throw err
    }

    var books = rows.map(function (row) {
      return { genre: row.genre,
        publisher: row.publisher,
        avgRating: row.avgRating,
        description: row.description,
        biography: row.bio
      };
    });
    //const appString = renderToString(<App title="Hello"/>);

    // res.send(Description({
    //   body: appString
    // }));

    res.send(books);
  });

  // res.end()
});

app.post('/author/:authorFirst/:authorLast', function (req, res) {
  console.log("Fetching author info: " + req.params.authorLast);
  var firstName = req.params.authorFirst;
  var lastName = req.params.authorLast;
  var queryString = "SELECT * FROM Book WHERE authorID IN (SELECT authorID FROM Author WHERE authorLast = ? )";
  connection.query(queryString, [lastName, firstName], function (err, rows, fields) {
    if (err) {
      console.log("Failed to query for book: " + err);
      res.sendStatus(500);
      return;
      // throw err
    }

    var booksByAuthor = rows.map(function (row) {
      return { title: row.title,
        cover: row.cover,
        price: row.price
      };
    });

    res.send(booksByAuthor);
  });
});

// localhost:3001
app.listen(port, function () {
  console.log('Server is up and listening on', port);
});