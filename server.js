const express = require('express');
const app = express();
const morgan = require('morgan');
const mysql = require("mysql");
const bodyParser = require('body-parser');

app.use(morgan('short'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const port = process.env.PORT || 3001

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678a',
    database: 'Bookstore'
  })

app.post('/book/:isbn', (req, res) => {
  console.log("Fetching book with isbn: " + req.params.isbn)
    const ISBN = req.params.isbn
    const queryString =  "SELECT * FROM Book JOIN Description ON ISBN = descriptionID JOIN Author ON authorID = ID WHERE ISBN = ?"

    connection.query(queryString, [ISBN], (err, rows, fields) => {
      if (err) {
        console.log("Failed to query for book: " + err)
        res.sendStatus(500)
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
                description: row.description,
                biography: row.bio
                }
      })
      res.json(books);
      console.log(books);
    })

    // res.end()
  })

  app.post('/author/:authorFirst/:authorLast', (req, res) => {
    console.log("Fetching author info: " + req.params.authorLast)
    const firstName = req.params.authorFirst
    const lastName = req.params.authorLast
    const queryString = "SELECT * FROM Book WHERE authorID IN (SELECT authorID FROM Author WHERE authorLast = ? )"
    connection.query(queryString, [lastName, firstName], (err, rows, fields) => {
        if (err) {
          console.log("Failed to query for book: " + err)
          res.sendStatus(500)
          return
          // throw err
        }
    
        const booksByAuthor = rows.map((row) => {
          return {title: row.title,
                  cover: row.cover,
                  price: row.price
                  }
        })
    
        res.send(booksByAuthor)
      })
})

// localhost:3001
app.listen(port, () => {
  console.log('Server is up and listening on' , port)
})