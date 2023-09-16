const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');
require('dotenv').config();



const login = (req, res) => {
  const { username, password } = req.body

  db.query('SELECT * FROM users WHERE username = ?', username, (error, results) => {
    if (error) {
      console.error('Error fetching user:', error);
      return res.status(500).json({ message: 'Server error' })
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Authentication failed. User not found.' });
    }

    bcrypt.compare(password, results[0].password, (err, isValid) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(500).json({ message: 'Server error' })
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

      return res.status(200).json({ message: 'Authentication successful', token })
    });
  });
};

module.exports = {
  login,
};
