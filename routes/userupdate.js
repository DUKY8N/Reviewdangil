var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var saltRounds = 10;

router.post("/", function (req, res, next) {
  var userId = req.session.passport.user;
  var { nickname, birth, email, password } = req.body;
  var connection = req.app.locals.connection;

  // 비밀번호 해싱
  bcrypt.hash(password, saltRounds, function(err, hashedPassword) {
    if (err) return next(err);

    connection.query('UPDATE user SET nickname = ?, birth = ?, email = ?, password = ? WHERE id = ?', [nickname, birth, email, hashedPassword, userId], function(err, results) {
      if (err) return next(err);

      req.flash('message', '수정이 완료되었습니다.');
      res.redirect("/mypage");
    });
  });
});
router.post("/delete", function (req, res, next) {
  var userId = req.session.passport.user;
  var connection = req.app.locals.connection;
  console.log('User ID:', userId); // 로그 출력

  // 외래 키 검사를 비활성화합니다.
  connection.query('SET FOREIGN_KEY_CHECKS=0;', function(err, results) {
    if (err) {
      console.log('SET FOREIGN_KEY_CHECKS=0; error:', err); // 로그 출력
      return next(err);
    }

    // 사용자를 삭제합니다.
    connection.query('DELETE FROM user WHERE id = ?', [userId], function(err, results) {
      if (err) {
        console.log('DELETE FROM user WHERE id = ? error:', err); // 로그 출력

        // 오류가 발생하면 외래 키 검사를 다시 활성화하고 오류를 반환합니다.
        connection.query('SET FOREIGN_KEY_CHECKS=1;', function(err2, results) {
          if (err2) {
            console.log('SET FOREIGN_KEY_CHECKS=1; error:', err2); // 로그 출력
          }
          return next(err);
        });
      } else {
        // 외래 키 검사를 다시 활성화합니다.
        connection.query('SET FOREIGN_KEY_CHECKS=1;', function(err2, results) {
          if (err2) {
            console.log('SET FOREIGN_KEY_CHECKS=1; error:', err2); // 로그 출력
            return next(err2);
          }
          req.session.destroy(); // 세션 삭제
          res.json({ success: true, message: '계정이 삭제되었습니다.' });
        });
      }
    });
  });
});
module.exports = router;