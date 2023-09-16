const bcrypt = require('bcryptjs');
const db = require('../db/database');
require('dotenv').config();


const signup = (req, res) => {
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
          res.status(201).json({ message: 'User registered successfully' })
        }
      });
    }
  });
};

module.exports = {
  signup,
};
