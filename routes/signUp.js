const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const upload = multer({ dest: 'public/img/' });

router.post('/signup', upload.single('profile_pic'), (req, res) => {
  const { id, pw, nickname, birth, email } = req.body;
  let profilePic = '../public/img/blankProfile.png'; // Default image

  if (req.file) {
    profilePic = path.join('public', 'img', req.file.filename);
  }

  const sql = 'INSERT INTO users (id, password, nickname, birth, email, profile_pic) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [id, pw, nickname, birth, email, profilePic];

  req.app.locals.connection.query(sql, values, (err, result) => {
    if (err) throw err;
    res.send('User registered successfully');
  });
});

module.exports = router;