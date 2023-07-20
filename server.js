const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const cors = require('cors');

app.use(cors());

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

app.use(express.static('public'))

// Set up a basic route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dummysite'
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to the database');
});

app.post('/api/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const greeting = {greeting: "Login Success!"};
  const alert = {greeting: "Invalid pass!"};


  // Query the database to check if the provided username and password match a record
  const query = 'SELECT * FROM user WHERE username = ? AND password = ?';
  connection.query(query, [username, password], (error, results) => {
    console.log(username, password);
    if (error) {
      console.error('Error executing the database query: ' + error.stack);
      return;
    }

    if (results.length > 0) {
      res.send({
        status: "OK", 
        name: results[0].name
      });
    } else {
      console.log('Invalid username or password');
      res.send(alert);
    }
  });

});

app.post('/login', (req, res ) => {
  const username = req.body.username;
  const password = req.body.password;

  const query = 'SELECT * FROM user WHERE username =  ?  AND password = ? ';
  connection.query(query, [username, password], (err, result) => { 
    if (err) {
      console.error('Error executing the database query: ' + err.stack);
      return;
    }

    if (result.length > 0) {
      res.send("Login Successfully!");
    } else {
      res.send("Invalid username or password");
    }
  });
});
