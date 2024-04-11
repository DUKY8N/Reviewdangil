const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

const upload = multer({ dest: 'public/img/' });


router.post('/', upload.single('profile_pic'), (req, res) => {
  const { id, pw, nickname, birth, email } = req.body;
  let profilePic = '/img/blankProfile.png'; // Default image

  // Hash the password
  bcrypt.hash(pw, saltRounds, function(err, hash) {
    if (err) throw err;

    const sql = 'INSERT INTO user (id, password, nickname, birth, email, profile_pic) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [id, hash, nickname, birth, email, profilePic]; // Use the hashed password

    req.app.locals.connection.query(sql, values, (err, result) => {
      if (err) throw err;
      res.render('login', { message: '회원가입이 완료되었습니다.' }); // Render the login page with the message
    });
  });
});
module.exports = router;