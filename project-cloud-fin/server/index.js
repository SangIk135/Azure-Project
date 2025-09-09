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
console.log("--- 애플리케이션 시작 ---");

const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const spotifyWebApi = require('spotify-web-api-node');
require('dotenv').config();

// Express 애플리케이션을 생성합니다.
const app = express();
const PORT = process.env.PORT || 3001; // 서버 포트 설정
console.log("--- Express 앱 생성 완료 ---");

// 미들웨어를 설정합니다.
const corsOptions = {
  origin: 'https://polite-dune-035d4c800.2.azurestaticapps.net', // 허용할 프론트엔드 주소
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions)) // CORS 허용
app.use(express.json()); // JSON 요청 본문 파싱
console.log("--- 미들웨어 설정 완료 ---"); // 완료 로그

// =================================================================
// 데이터베이스 연결 설정 (실제 구현 시 채워야 할 부분)
// =================================================================
// .env 파일과 같은 환경 변수에서 설정 정보를 가져오는 것을 권장합니다.
const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, 
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // ssl: {ca: fs.readFileSync(path.join(__dirname, 'certs/DigiCertGlobalRootG2.crt.pem'), 'utf-8'),
    //     rejectUnauthorized: true 
    // }
};


// if (process.env.DB_SSL === 'true') {
//     dbConfig.ssl = { 
//         ca: fs.readFileSync(path.join(__dirname, '../DigiCertGlobalRootG2.pem')),
//     }
// }




// console.log('DB 연결 설정:', dbConfig);
console.log("--- DB 설정값 ---", {
    host: dbConfig.host,
    user: dbConfig.user,
    database: dbConfig.database,
    password_exists: !!dbConfig.password 
});

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
const spotifyApi = new spotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});
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
const searchModule = require(path.join(__dirname, 'musicFinder.js'));

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
        console.error('로그인 실패:', err); // 에러 로그 출력 추가
        res.status(500).json({ message: '로그인 실패', error: err.message });
    }
});

app.use('/api/auth', authRouter);

// [GET] /api/auth/me - JWT 토큰으로 사용자 정보 반환 (로그인 상태 확인)
authRouter.get('/me', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const [rows] = await pool.query('SELECT user_id, email, nickname FROM Users WHERE user_id = ?', [userId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }
        const user = rows[0];
        res.json({ user });
    } catch (err) {
        res.status(500).json({ message: '사용자 정보 조회 실패', error: err.message });
    }
});


// -----------------------------------------------------------------
// 2. 플레이리스트 관련 API (Playlists)
// -----------------------------------------------------------------
const playlistRouter = express.Router();

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // 값 교환
    }
    return array;
};

playlistRouter.get('/new-releases', async (req, res) => {
    try {
        const tokenData = await spotifyApi.clientCredentialsGrant();
        spotifyApi.setAccessToken(tokenData.body['access_token']);
        const newReleases = await spotifyApi.getNewReleases({ limit: 50, offset: 0, country: 'KR' });
        const randomAlbums = shuffleArray(newReleases.body.albums?.items || []).slice(0, 5);
        // 필요한 정보만 추려서 반환
        const albums = randomAlbums.map(album => ({
            id: album.id,
            name: album.name,
            imageUrl: album.images?.[0]?.url || '',
            releaseDate: album.release_date,
            artist: album.artists?.[0]?.name || '',
            artistId: album.artists?.[0]?.id || '',
            spotifyUrl: album.external_urls?.spotify || '',
        }));
        res.json({ success: true, albums });
    } catch (error) {
        res.status(500).json({ message: '서버 오류', error: error.message });
    }
});

// [GET] /api/playlists/public - 공개 플레이리스트 목록 조회 (수정된 코드)
playlistRouter.get('/public', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                p.playlist_id, 
                p.name, 
                p.description, 
                u.nickname as creator_nickname,
                s.album_image_url
            FROM Playlists p
            JOIN Users u ON p.user_id = u.user_id
            LEFT JOIN (
                SELECT ps.playlist_id, s.album_image_url
                FROM Playlist_Songs ps
                JOIN Songs s ON ps.song_id = s.song_id
                WHERE ps.sequence = 1
            ) s ON s.playlist_id = p.playlist_id
            WHERE p.is_public = TRUE
            ORDER BY p.playlist_id DESC
            LIMIT 10
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
            SELECT 
                p.playlist_id, 
                p.name, 
                COUNT(ps.song_id) as song_count,
                s.album_image_url
            FROM 
                Playlists p
            LEFT JOIN 
                Playlist_Songs ps ON p.playlist_id = ps.playlist_id
            LEFT JOIN (
                SELECT 
                ps2.playlist_id, 
                s2.album_image_url
                FROM 
                Playlist_Songs ps2
                JOIN 
                Songs s2 ON ps2.song_id = s2.song_id
                WHERE 
                ps2.sequence = 1
            ) s ON p.playlist_id = s.playlist_id
            WHERE 
                p.user_id = ?
            GROUP BY 
                p.playlist_id, s.album_image_url
            ORDER BY 
                p.playlist_id DESC;
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

    const connection = await pool.getConnection(); // 풀에서 커넥션을 가져옵니다.

    try {
        await connection.beginTransaction(); // 트랜잭션 시작

        // 소유자 확인
        const [rows] = await connection.query("SELECT user_id FROM Playlists WHERE playlist_id = ?", [playlistId]);
        if (rows.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: '플레이리스트를 찾을 수 없습니다.' });
        }
        if (rows[0].user_id !== userId) {
            await connection.rollback();
            return res.status(403).json({ message: '플레이리스트 소유자가 아닙니다.' });
        }

        // 곡 순서 지정
        const [seqRows] = await connection.query("SELECT MAX(sequence) as maxSeq FROM Playlist_Songs WHERE playlist_id = ?", [playlistId]);
        const nextSeq = (seqRows[0].maxSeq || 0) + 1;

        // Playlist_Songs에 곡 추가
        await connection.query(
            "INSERT INTO Playlist_Songs (playlist_id, song_id, sequence) VALUES (?, ?, ?)",
            [playlistId, songId, nextSeq]
        );

        // Playlists 테이블의 updated_at 업데이트
        await connection.query(
            "UPDATE Playlists SET updated_at = CURRENT_TIMESTAMP WHERE playlist_id = ?",
            [playlistId]
        );

        await connection.commit(); // 모든 쿼리 성공 시 커밋
        res.status(200).json({ message: '곡 추가 성공' });

    } catch (err) {
        await connection.rollback(); // 에러 발생 시 롤백

        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: '이미 추가된 곡입니다.' });
        }
        res.status(500).json({ message: '곡 추가 실패', error: err.message });
    } finally {
        connection.release(); // 사용한 커넥션을 풀에 반환
    }
});

// [PUT] /api/playlists/:id - 플레이리스트 정보 수정 (이름, 설명, 공개여부)
playlistRouter.put('/:id', authenticateToken, async (req, res) => {
    const { id: playlistId } = req.params;
    const { name, description, is_public } = req.body;
    const { userId } = req.user;
    try {
        // 소유자 확인
        const [rows] = await pool.query('SELECT user_id FROM Playlists WHERE playlist_id = ?', [playlistId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: '플레이리스트를 찾을 수 없습니다.' });
        }
        if (rows[0].user_id !== userId) {
            return res.status(403).json({ message: '플레이리스트 소유자가 아닙니다.' });
        }
        await pool.query(
            'UPDATE Playlists SET name = ?, description = ?, is_public = ? WHERE playlist_id = ?',
            [name, description, is_public, playlistId]
        );
        res.status(200).json({ message: '플레이리스트 정보 수정 성공' });
    } catch (err) {
        res.status(500).json({ message: '플레이리스트 정보 수정 실패', error: err.message });
    }
});

// [DELETE] /api/playlists/:id - 플레이리스트 삭제 (인증 필요)
playlistRouter.delete('/:id', authenticateToken, async (req, res) => {
    const { id: playlistId } = req.params;
    const { userId } = req.user;
    try {
        // 소유자 확인
        const [rows] = await pool.query('SELECT user_id FROM Playlists WHERE playlist_id = ?', [playlistId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: '플레이리스트를 찾을 수 없습니다.' });
        }
        if (rows[0].user_id !== userId) {
            return res.status(403).json({ message: '플레이리스트 소유자가 아닙니다.' });
        }
        // 삭제
        await pool.query('DELETE FROM Playlists WHERE playlist_id = ?', [playlistId]);
        res.status(200).json({ message: '플레이리스트 삭제 성공' });
    } catch (err) {
        res.status(500).json({ message: '플레이리스트 삭제 실패', error: err.message });
    }
});

// [DELETE] /api/playlists/:playlistId/songs/:songId - 플레이리스트에서 곡 삭제
playlistRouter.delete('/:playlistId/songs/:songId', authenticateToken, async (req, res) => {
    const { playlistId, songId } = req.params;
    const { userId } = req.user;
    try {
        // 소유자 확인
        const [rows] = await pool.query('SELECT user_id FROM Playlists WHERE playlist_id = ?', [playlistId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: '플레이리스트를 찾을 수 없습니다.' });
        }
        if (rows[0].user_id !== userId) {
            return res.status(403).json({ message: '플레이리스트 소유자가 아닙니다.' });
        }
        await pool.query('DELETE FROM Playlist_Songs WHERE playlist_id = ? AND song_id = ?', [playlistId, songId]);
        res.status(200).json({ message: '곡 삭제 성공' });
    } catch (err) {
        res.status(500).json({ message: '곡 삭제 실패', error: err.message });
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
        // DB에 곡 캐시 저장 로직 구현
        for (const item of results) {
            try {
                await pool.query(
                    `INSERT IGNORE INTO Songs (track_name, artist, spotify_url, youtube_url, album_image_url) VALUES (?, ?, ?, ?, ?)`,
                    [item.trackName, item.artist, item.spotifyUrl, item.youtubeUrl, item.albumImageUrl]
                );
            } catch (err) {
                // 곡 저장 실패 시 에러 로그만 남기고 계속 진행
                console.error('곡 캐시 저장 실패:', err);
            }
        }
        return res.json({ success: true, items: results });
    } catch (err) {
        console.error('검색 중 서버 오류:', err); // 에러 로그 추가
        return res.json({ success: false, message: '검색 중 서버 오류', error: err.message });
    }
});

// [GET] /api/songs/by-spotify-url - spotify_url로 song_id 반환
songRouter.get('/by-spotify-url', async (req, res) => {
    const spotifyUrl = req.query.spotifyUrl;
    if (!spotifyUrl) {
        return res.status(400).json({ message: 'spotifyUrl 파라미터가 필요합니다.' });
    }
    try {
        const [rows] = await pool.query('SELECT song_id FROM Songs WHERE spotify_url = ?', [spotifyUrl]);
        if (rows.length === 0) {
            return res.json({ song_id: null });
        }
        return res.json({ song_id: rows[0].song_id });
    } catch (err) {
        return res.status(500).json({ message: '곡 정보 조회 실패', error: err.message });
    }
});

const youtubeRouter = express.Router();

// [GET] /api/youtube/ytsearch?q=검색어
youtubeRouter.get('/ytsearch', async (req, res) => {
    // 곡명과 아티스트명을 각각 받음
    const title = req.query.title;
    const artist = req.query.artist;
    let rows;
    try {
        if (title && artist) {
            [rows] = await pool.query(
                "SELECT youtube_url, track_name FROM Songs WHERE track_name = ? AND artist = ? LIMIT 1",
                [title, artist]
            );
        }

        if (!rows.length || !rows[0].youtube_url) {
            return res.status(404).json({ message: '검색 결과가 없습니다.' });
        }
        return res.json({ success: true, title: rows[0].track_name, link: rows[0].youtube_url });
    }
    catch (error) {
        console.error('YouTube 검색 중 오류:', error);
        return res.status(500).json({ message: 'YouTube 검색 중 오류', error: error.message });
    }
})

app.use('/api/songs', songRouter);
app.use('/api/youtube', youtubeRouter);

// -----------------------------------------------------------------
// 4. 공유 관련 API (Share) - 새로 추가하는 부분
// -----------------------------------------------------------------
const shareRouter = express.Router();

// [GET] /api/share/playlist/:id - 공유용 플레이리스트 메타정보 조회
shareRouter.get('/playlist/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // 플레이리스트 정보와 첫 번째 곡의 앨범 이미지를 함께 조회하는 쿼리
        const [rows] = await pool.query(`
            SELECT 
                p.name, 
                p.description,
                p.is_public,
                u.nickname as creator_nickname,
                (SELECT s.album_image_url 
                 FROM Playlist_Songs ps 
                 JOIN Songs s ON ps.song_id = s.song_id 
                 WHERE ps.playlist_id = p.playlist_id 
                 ORDER BY ps.sequence ASC 
                 LIMIT 1) as imageUrl
            FROM Playlists p
            JOIN Users u ON p.user_id = u.user_id
            WHERE p.playlist_id = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: '플레이리스트를 찾을 수 없습니다.' });
        }

        const playlist = rows[0];

        // 비공개 플레이리스트는 공유할 수 없도록 처리
        if (!playlist.is_public) {
            return res.status(403).json({ message: '비공개 플레이리스트는 공유할 수 없습니다.' });
        }
        
        // 프론트엔드 주소(CORS 설정에 있는 주소)를 기반으로 공유될 전체 URL 생성
        // const frontendBaseUrl = 'https://polite-dune-035d4c800.2.azurestaticapps.net';
        const frontendBaseUrl = 'http://localhost:5173';
        const shareUrl = `${frontendBaseUrl}/playlist/${id}`;

        // 페이스북 공유에 필요한 메타데이터를 JSON 형식으로 응답
        res.json({
            title: `🎵 ${playlist.name}`,
            description: playlist.description ? `${playlist.description} (by ${playlist.creator_nickname})` : `(by ${playlist.creator_nickname})`,
            imageUrl: playlist.imageUrl || 'https://i.imgur.com/1vG0iJ8.png', // 첫 곡 이미지가 없을 경우 사용할 기본 이미지
            url: shareUrl
        });

    } catch (err) {
        console.error('공유 정보 조회 실패:', err);
        res.status(500).json({ message: '공유 정보를 가져오는 중 오류가 발생했습니다.', error: err.message });
    }
});

app.use('/api/share', shareRouter);

// =================================================================
// 5. 재생 기록 관련 API (History) - 새로 추가하는 부분
// =================================================================
const historyRouter = express.Router();

// [POST] /api/history/play - 재생 기록 저장 (인증 필요)
historyRouter.post('/play', authenticateToken, async (req, res) => {
    const { userId } = req.user;
    const { songId } = req.body;

    if (!songId) {
        return res.status(400).json({ message: 'songId가 필요합니다.' });
    }

    try {
        // ON DUPLICATE KEY UPDATE 문법으로 INSERT와 UPDATE를 한 번에 처리
        // uk_user_song 제약 조건 때문에 user_id와 song_id가 중복되면 played_at만 현재 시간으로 업데이트됩니다.
        await pool.query(
            `INSERT INTO PlaybackHistory (user_id, song_id) VALUES (?, ?)
             ON DUPLICATE KEY UPDATE played_at = CURRENT_TIMESTAMP`,
            [userId, songId]
        );
        res.status(201).json({ message: '재생 기록 저장 성공' });
    } catch (err) {
        console.error('재생 기록 저장 실패:', err);
        res.status(500).json({ message: '재생 기록 저장 실패', error: err.message });
    }
});

// [GET] /api/history/recent - 최근 재생 목록 조회 (인증 필요)
historyRouter.get('/recent', authenticateToken, async (req, res) => {
    const { userId } = req.user;
    const limit = parseInt(req.query.limit) || 6; // 기본 6개 항목

    try {
        const [rows] = await pool.query(`
            SELECT 
                s.song_id,
                s.track_name,
                s.artist,
                s.album_image_url
            FROM PlaybackHistory ph
            JOIN Songs s ON ph.song_id = s.song_id
            WHERE ph.user_id = ?
            ORDER BY ph.played_at DESC
            LIMIT ?
        `, [userId, limit]);
        res.json(rows);
    } catch (err) {
        console.error('최근 재생 목록 조회 실패:', err);
        res.status(500).json({ message: '최근 재생 목록 조회 실패', error: err.message });
    }
});

app.use('/api/history', historyRouter);


// =================================================================
// 서버 시작
// =================================================================
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});