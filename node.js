const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'manish',
  database: 'Quizdatabase',
});

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Endpoint for user registration
app.post('/register', (req, res) => {
  const { username, email, password, repeatPassword } = req.body;


  // Insert the user into the database
  const query = 'INSERT INTO users (username, email, password, repeatPassword) VALUES (?, ?)';
  connection.query(query, [username, email, password, repeatPassword], (err, results) => {
    if (err) {
      console.error('Error registering user:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json({ message: 'User registered successfully' });
  });
});

// Endpoint for user login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists in the database
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  connection.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Error logging in:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.length === 0) {
      res.status(401).json({ error: 'Invalid username or password' });
    } else {
      res.json({ message: 'Login successful' });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
