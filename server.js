const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "best"
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to the database');
  }
});

app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error('Error hashing password:', err);
      res.status(500).json({ message: 'Server error' });
    } else {
      const newUser = {
        username,
        password: hash,
      };
      db.query('INSERT INTO users SET ?', newUser, (error, results) => {
        if (error) {
          console.error('Error creating user:', error);
          res.status(500).json({ message: 'Server error' });
        } else {
          res.status(201).json({ message: 'User registered successfully' });
        }
      });
    }
  });
});



app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', username, (error, results) => {
    if (error) {
      console.error('Error fetching user:', error);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Authentication failed. User not found.' });
    }


    bcrypt.compare(password, results[0].password, (err, isValid) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      console.log('Provided password:', password);
      console.log('Stored hashed password:', results[0].password);
      console.log('isValid:', isValid);

      if (!isValid) {
        return res.status(401).json({ message: 'Authentication failed. Incorrect password.' });
        
      }

      const token = jwt.sign({ username: results[0].username }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      return res.status(200).json({ message: 'Authentication successful', token });
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});