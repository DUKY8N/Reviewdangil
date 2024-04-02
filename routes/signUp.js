const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

const upload = multer({ dest: 'public/img/' });

router.get('/signUp', function(req, res) {
  res.render('signUp');
});

router.post('/signUp', upload.single('profile_pic'), (req, res) => {
  const { id, pw, nickname, birth, email } = req.body;
  let profilePic = '/img/blankProfile.png'; // Default image


  // Hash the password
  bcrypt.hash(pw, saltRounds, function(err, hash) {
    if (err) throw err;

    const sql = 'INSERT INTO users (id, password, nickname, birth, email, profile_pic) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [id, hash, nickname, birth, email, profilePic]; // Use the hashed password

    req.app.locals.connection.query(sql, values, (err, result) => {
      if (err) throw err;
      res.send('User registered successfully');
    });
  });
});

module.exports = router;