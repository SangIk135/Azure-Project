const axios = require('axios');
const fs = require('fs/promises');
const path = require('path');
const youtubesearchapi = require("youtube-search-api");

require('dotenv').config();

// --- 환경 변수 및 캐시 경로 설정 ---
const { YOUTUBE_API_KEY, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;
const TOKEN_CACHE_PATH = path.join(__dirname, 'spotify_cache.json');
const RESULT_CACHE_PATH = path.join(__dirname, 'results_cache.json');

// --- 내부 헬퍼 함수들 (비공개) ---
async function getAccessToken() { /* 이전 코드와 동일 */ }
async function youtubeSpotifySearch(query, token) { /* 이전 코드와 동일 */ }
async function spotifySearch(query, token) { /* 이전 코드와 동일 */ }
async function findYoutubeMusicVideo(query) { /* 이전 코드와 동일 (필터링 로직 포함) */ }
async function getYoutubeVideoDetails(videoId) { /* 이전 코드와 동일 */ }

/**
 * (공개) 음악 영상 정보를 찾는 메인 함수
 * @param {string} query - 검색어 또는 YouTube URL
 * @returns {Promise<object|null>} - { title, link } 객체 또는 null 반환
 */
async function findMusicVideo(query) {
    if (!query || typeof query !== 'string' || query.trim() === '') {
        throw new Error("검색어가 비어있습니다.");
    }
    
    // 1. URL 형식 확인
    const youtubeURLRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/;
    const match = query.match(youtubeURLRegex);
    const cacheKey = match ? query : query.toLowerCase().replace(/\s+/g, ' ');

    // 2. 캐시 확인
    // try {
    //     const cachedResults = JSON.parse(await fs.readFile(RESULT_CACHE_PATH, 'utf-8'));
    //     const cachedItem = cachedResults[cacheKey];
    //     if (cachedItem && cachedItem.expiryTime > Date.now()) {
    //         return cachedItem.videoInfo; // 찾으면 바로 결과 반환
    //     }
    // } catch (error) {}
    
    let videoInfo = null;

    // 3. API 호출 로직
    if (match && match[1]) { // URL 처리
        videoInfo = await getYoutubeVideoDetails(match[1]);
    } else { // 키워드 검색 처리
        const token = await getAccessToken();
        if (!token) throw new Error("Spotify 토큰을 발급받지 못했습니다.");
        
        const songInfo = await youtubeSpotifySearch(query, token);
        const youtubeQuery = songInfo ? `${songInfo.artist} ${songInfo.trackName} Audio` : query;
        videoInfo = await findYoutubeMusicVideo(youtubeQuery);

        // 신뢰도 높은 결과(Spotify 성공)만 캐시에 저장
        // if (songInfo && videoInfo) {
        //      try {
        //         let existingCache = {};
        //         try { existingCache = JSON.parse(await fs.readFile(RESULT_CACHE_PATH, 'utf-8')); } catch (e) {}
        //         existingCache[cacheKey] = { videoInfo, expiryTime: Date.now() + 24 * 60 * 60 * 1000 };
        //         await fs.writeFile(RESULT_CACHE_PATH, JSON.stringify(existingCache, null, 2));
        //     } catch (e) { console.error("캐시 저장 실패:", e); }
        // }
    }

    return videoInfo; // 최종 결과 반환
}

// --- 내부 헬퍼 함수들 상세 구현 ---
// (이전 코드의 getAccessToken, spotifySearch, findYoutubeMusicVideo, getYoutubeVideoDetails 함수를 여기에 붙여넣으세요.)
async function getAccessToken() {
    try {
        const cachedData = await fs.readFile(TOKEN_CACHE_PATH, 'utf-8');
        const tokenInfo = JSON.parse(cachedData);
        if (tokenInfo.expiryTime > Date.now() + 60000) return tokenInfo.accessToken;
    } catch (error) {}
    try {
        const response = await axios({
            method: 'post', url: 'https://accounts.spotify.com/api/token',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Basic ' + (Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')) },
            data: 'grant_type=client_credentials'
        });
        const { access_token, expires_in } = response.data;
        const expiryTime = Date.now() + expires_in * 1000;
        await fs.writeFile(TOKEN_CACHE_PATH, JSON.stringify({ accessToken: access_token, expiryTime }));
        return access_token;
    } catch (error) { console.error('❌ Spotify 토큰 발급 에러'); return null; }
}

async function youtubeSpotifySearch(query, token) {
    try {
        const response = await axios.get('https://api.spotify.com/v1/search', {
            headers: { 'Authorization': `Bearer ${token}` },
            params: { q: query, type: 'track', limit: 1 }
        });
        if (response.data.tracks && response.data.tracks.items.length > 0) {
            const track = response.data.tracks.items[0];
            return { trackName: track.name, artist: track.artists.map(a => a.name).join(', ') };
        }
        return null;
    } catch (error) { console.error('❌ Spotify 검색 에러'); return null; }
}

async function spotifySearch({ query, token, type = 'track', limit = 10 }) {
    // Spotify 검색 API 호출
    console.log("Spotify Search Request 발생");
    const res = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    
    if (!data.tracks || !Array.isArray(data.tracks.items)) return [];
    // YouTube URL을 각 곡에 대해 병렬로 검색
    const results = await Promise.all(
        data.tracks.items.map(async item => {
            const youtubeQuery = `${item.artists.map(a => a.name).join(' ')} ${item.name} Audio`;
            let youtubeUrl = null;
            try {
                const youtubeResult = await youtubesearchapi.GetListByKeyword(youtubeQuery, false, 1, []);
                // 구조 확인용 로그
                // console.log('YouTube API result:', JSON.stringify(youtubeResult));
                // 구조별로 id 추출
                if (youtubeResult && Array.isArray(youtubeResult.items) && youtubeResult.items.length > 0) {
                    youtubeUrl = `https://www.youtube.com/watch?v=${youtubeResult.items[0].id}`;
                } else if (
                    youtubeResult &&
                    youtubeResult.items &&
                    Array.isArray(youtubeResult.items.items) &&
                    youtubeResult.items.items.length > 0
                ) {
                    youtubeUrl = `https://www.youtube.com/watch?v=${youtubeResult.items.items[0].id}`;
                }
            } catch (err) {
                console.error('YouTube API error:', err);
            }
            return {
                trackName: item.name,
                artist: item.artists.map(a => a.name).join(', '),
                albumName: item.album.name,
                releaseDate: item.album.release_date,
                spotifyUrl: item.external_urls.spotify,
                youtubeUrl,
                albumImageUrl: item.album.images[0]?.url || '',
            };
        })
    );
    return results;
}

async function findYoutubeMusicVideo(query) {
    try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: { key: YOUTUBE_API_KEY, part: 'snippet', q: query, type: 'video', maxResults: 5 }
        });
        if (!response.data.items || response.data.items.length === 0) return null;
        
        const videos = response.data.items;
        const PREFERRED_KEYWORDS = ['official audio', 'official mv', 'official music video', '오디오', 'Lyrics', 'Music Video', 'audio'];
        const EXCLUDE_KEYWORDS = ['live', 'fancam', '직캠', 'performance', 'concert', 'showcase', '라이브', '쇼케이스'];

        for (const video of videos) {
            const title = video.snippet.title.toLowerCase();
            if (PREFERRED_KEYWORDS.some(keyword => title.includes(keyword))) {
                return { title: video.snippet.title, link: `https://www.youtube.com/watch?v=${video.id.videoId}` };
            }
        }
        for (const video of videos) {
            const title = video.snippet.title.toLowerCase();
            if (!EXCLUDE_KEYWORDS.some(keyword => title.includes(keyword))) {
                return { title: video.snippet.title, link: `https://www.youtube.com/watch?v=${video.id.videoId}` };
            }
        }
        const firstVideo = videos[0];
        return { title: firstVideo.snippet.title, link: `https://www.youtube.com/watch?v=${firstVideo.id.videoId}` };
    } catch (error) {
        console.error('❌ YouTube 검색 에러:', error.response?.data?.error?.message || error.message);
        return null;
    }
}

async function getYoutubeVideoDetails(videoId) {
    try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
            params: { key: YOUTUBE_API_KEY, part: 'snippet', id: videoId }
        });
        if (response.data.items && response.data.items.length > 0) {
            const item = response.data.items[0];
            return { title: item.snippet.title, link: `https://www.youtube.com/watch?v=${videoId}` };
        }
        return null;
    } catch (error) {
        console.error('❌ YouTube 영상 정보 조회 에러:', error.response?.data?.error?.message || error.message);
        return null;
    }
}

// 외부에서 사용할 수 있도록 함수를 export 합니다.
module.exports = { 
    findMusicVideo, 
    getAccessToken,
    spotifySearch
};