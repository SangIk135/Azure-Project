/***
 * npm init -y
 * npm install express cors 
 * npm install nodemon --save-dev
 * npm install dotenv
 * npm install mysql2
 * npm start

 * 실제 DB 연동 시 mysql2, jsonwebtoken, bcrypt, dotenv 등 필요 
 */


// 필요한 모듈들을 가져옵니다.


const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Express 애플리케이션을 생성합니다.
const app = express();
const PORT = process.env.PORT || 3001; // 서버 포트 설정

// 미들웨어를 설정합니다.
app.use(cors()); // CORS 허용
app.use(express.json()); // JSON 요청 본문 파싱

// =================================================================
// 데이터베이스 연결 설정 (실제 구현 시 채워야 할 부분)
// =================================================================
// .env 파일과 같은 환경 변수에서 설정 정보를 가져오는 것을 권장합니다.
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

let pool;
// DB 연결 풀 생성
// (서버 시작 시 한 번만 실행되도록 처리 필요)
const connectToDatabase = async () => {
    try {
        pool = mysql.createPool(dbConfig);
        console.log('MySQL 데이터베이스에 성공적으로 연결되었습니다.');
    } catch (error) {
        console.error('MySQL 데이터베이스 연결 실패:', error);
        // 연결 실패 시 프로세스 종료
        process.exit(1);
    }
};

connectToDatabase(); // 서버 시작 시 DB 연결 함수 호출

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// --- 인증 미들웨어 ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401); // 토큰 없음
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // 토큰 유효하지 않음
        req.user = user;
        next();
    });
};


// --- search.js 연동 추가 ---
const path = require('path');
const searchModule = require(path.join(__dirname, 'search.js'));

// =================================================================
// API 라우트 정의
// =================================================================

// -----------------------------------------------------------------
// 1. 인증 관련 API (Auth)
// -----------------------------------------------------------------
const authRouter = express.Router();

// [POST] /api/auth/signup - 회원가입
authRouter.post('/signup', async (req, res) => {
    const { email, password, nickname } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            "INSERT INTO Users (email, password, nickname) VALUES (?, ?, ?)",
            [email, hashedPassword, nickname]
        );
        res.status(201).json({ message: '회원가입 성공' });
    } catch (err) {
        console.error('회원가입 실패:', err); // 에러 로그 출력 추가
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: '이메일 또는 닉네임이 이미 존재합니다.' });
        }
        res.status(500).json({ message: '회원가입 실패', error: err.message });
    }
});

// [POST] /api/auth/login - 로그인
authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await pool.query("SELECT * FROM Users WHERE email = ?", [email]);
        const user = rows[0];
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: '이메일 또는 비밀번호가 잘못되었습니다.' });
        }
        const token = jwt.sign({ userId: user.user_id, nickname: user.nickname }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: '로그인 성공', user: { userId: user.user_id, email: user.email, nickname: user.nickname }, token });
    } catch (err) {
        res.status(500).json({ message: '로그인 실패', error: err.message });
    }
});

app.use('/api/auth', authRouter);


// -----------------------------------------------------------------
// 2. 플레이리스트 관련 API (Playlists)
// -----------------------------------------------------------------
const playlistRouter = express.Router();

// [GET] /api/playlists/public - 공개 플레이리스트 목록 조회
playlistRouter.get('/public', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT p.playlist_id, p.name, p.description, u.nickname as creator_nickname
            FROM Playlists p
            JOIN Users u ON p.user_id = u.user_id
            WHERE p.is_public = TRUE
            ORDER BY RAND() LIMIT 10
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: '공개 플레이리스트 조회 실패', error: err.message });
    }
});

// [GET] /api/playlists/mine - 내 플레이리스트 목록 조회 (인증 필요)
playlistRouter.get('/mine', authenticateToken, async (req, res) => {
    const { userId } = req.user;
    try {
        const [rows] = await pool.query(`
            SELECT p.playlist_id, p.name, COUNT(ps.song_id) as song_count
            FROM Playlists p
            LEFT JOIN Playlist_Songs ps ON p.playlist_id = ps.playlist_id
            WHERE p.user_id = ?
            GROUP BY p.playlist_id
        `, [userId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: '내 플레이리스트 조회 실패', error: err.message });
    }
});

// [GET] /api/playlists/:id - 특정 플레이리스트 상세 조회
playlistRouter.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [playlistRows] = await pool.query(`
            SELECT p.playlist_id, p.name, p.description, p.is_public, u.nickname as creator_nickname
            FROM Playlists p
            JOIN Users u ON p.user_id = u.user_id
            WHERE p.playlist_id = ?
        `, [id]);
        if (playlistRows.length === 0) {
            return res.status(404).json({ message: '플레이리스트를 찾을 수 없습니다.' });
        }
        const playlist = playlistRows[0];
        const [songs] = await pool.query(`
            SELECT ps.sequence, s.song_id, s.track_name, s.artist, s.spotify_url, s.album_image_url
            FROM Playlist_Songs ps
            JOIN Songs s ON ps.song_id = s.song_id
            WHERE ps.playlist_id = ?
            ORDER BY ps.sequence ASC
        `, [id]);
        res.json({ ...playlist, songs });
    } catch (err) {
        res.status(500).json({ message: '플레이리스트 상세 조회 실패', error: err.message });
    }
});

// [POST] /api/playlists - 새 플레이리스트 생성 (인증 필요)
playlistRouter.post('/', authenticateToken, async (req, res) => {
    const { userId } = req.user;
    const { name, description, is_public } = req.body;
    try {
        await pool.query(
            "INSERT INTO Playlists (user_id, name, description, is_public) VALUES (?, ?, ?, ?)",
            [userId, name, description, is_public]
        );
        res.status(201).json({ message: '플레이리스트 생성 성공' });
    } catch (err) {
        res.status(500).json({ message: '플레이리스트 생성 실패', error: err.message });
    }
});

// [POST] /api/playlists/:id/songs - 플레이리스트에 곡 추가 (인증 필요)
playlistRouter.post('/:id/songs', authenticateToken, async (req, res) => {
    const { id: playlistId } = req.params;
    const { songId } = req.body;
    const { userId } = req.user;
    try {
        // 소유자 확인
        const [rows] = await pool.query("SELECT user_id FROM Playlists WHERE playlist_id = ?", [playlistId]);
        if (rows.length === 0) return res.status(404).json({ message: '플레이리스트를 찾을 수 없습니다.' });
        if (rows[0].user_id !== userId) return res.status(403).json({ message: '플레이리스트 소유자가 아닙니다.' });
        // 곡 순서 지정
        const [seqRows] = await pool.query("SELECT MAX(sequence) as maxSeq FROM Playlist_Songs WHERE playlist_id = ?", [playlistId]);
        const nextSeq = (seqRows[0].maxSeq || 0) + 1;
        await pool.query(
            "INSERT INTO Playlist_Songs (playlist_id, song_id, sequence) VALUES (?, ?, ?)",
            [playlistId, songId, nextSeq]
        );
        res.status(200).json({ message: '곡 추가 성공' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: '이미 추가된 곡입니다.' });
        }
        res.status(500).json({ message: '곡 추가 실패', error: err.message });
    }
});


app.use('/api/playlists', playlistRouter);

// -----------------------------------------------------------------
// 3. 곡 관련 API (Songs)
// -----------------------------------------------------------------
const songRouter = express.Router();

// [GET] /api/songs/search - 곡 검색 (Spotify API 연동)
songRouter.get('/search', async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.json({ success: false, message: '검색어(q)가 필요합니다.' });
    }
    try {
        // Spotify API 검색 (search.js 참고)
        const token = await searchModule.getAccessToken();
        if (!token) {
            console.error('Spotify 토큰 발급 실패'); // 에러 로그 추가
            return res.json({ success: false, message: 'Spotify 토큰 발급 실패' });
        }
        const results = await searchModule.spotifySearch({ query, token, type: 'track', limit: 10 });
        if (!results) {
            console.error('Spotify 검색 실패'); // 에러 로그 추가
            return res.json({ success: false, message: 'Spotify 검색 실패' });
        }
        // DB에 곡 캐시 저장 로직은 미구현 (여기서 Songs 테이블에 INSERT하면 됨)
        // TODO: 검색 결과를 Songs 테이블에 캐시로 저장하는 로직 필요
        return res.json({ success: true, items: results });
    } catch (err) {
        console.error('검색 중 서버 오류:', err); // 에러 로그 추가
        return res.json({ success: false, message: '검색 중 서버 오류', error: err.message });
    }
});

app.use('/api/songs', songRouter);


// =================================================================
// 서버 시작
// =================================================================
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
