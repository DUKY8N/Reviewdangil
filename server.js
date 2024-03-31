const express = require('express');
const path = require('path');
const mysql = require('promise-mysql');

const app = express();
const PORT = process.env.PORT || 3000;

// Google Cloud MySQL 데이터베이스 연결 설정
const connection = mysql.createConnection({
    host: '34.64.239.169', // Google Cloud SQL의 IP 주소
    user: 'root', // 데이터베이스 사용자명
    password: 'iJ8=dI%)}_0`X*|e', // 데이터베이스 암호
    database: 'Review_dangil' // 연결할 데이터베이스명
});

// 데이터베이스 연결
connection.then((conn) => {
    console.log('Google Cloud MySQL 데이터베이스 연결 성공!');
    startServer(); // 서버 시작 함수 호출
}).catch((err) => {
    console.error('데이터베이스 연결 오류:', err);
});

function startServer() {
    // 정적 파일을 제공할 디렉토리 설정
    app.use(express.static(path.join(__dirname, 'public')));

    // 루트 URL에 대한 요청 처리
    app.get('/', (req, res) => {
        // login.html 파일을 응답으로 보냄
        res.sendFile(path.join(__dirname, 'views', 'login.html'));
    });

    // MySQL에서 사용자 인증
    app.post('/authenticate', (req, res) => {
        // 사용자 인증 로직을 작성
        // MySQL 데이터베이스에서 사용자 정보를 확인하여 인증
    });

    // Google Cloud에서 사용자 프로필 정보 가져오기
    app.get('/profile', (req, res) => {
        // Google Cloud MySQL 데이터베이스에서 사용자 프로필 정보 가져오기
    });

    // 서버 시작
    app.listen(PORT, () => {
        console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
    });
    
}
