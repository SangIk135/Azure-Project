// search.js

require('dotenv').config();
const axios = require('axios');
const fs = require('fs/promises');
const path = require('path');

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("오류: .env 파일에 SPOTIFY_CLIENT_ID와 SPOTIFY_CLIENT_SECRET을 설정해야 합니다.");
  process.exit(1);
}

const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SEARCH_URL = 'https://api.spotify.com/v1/search';
const CACHE_PATH = path.join(__dirname, 'spotify_cache.json');

/**
 * Spotify API 액세스 토큰을 발급받거나 캐시에서 가져오는 함수
 * @returns {Promise<string|null>} 액세스 토큰 또는 실패 시 null
 */
async function getAccessToken() {
  // 1. 캐시 파일 읽기 시도
  try {
    const cachedData = await fs.readFile(CACHE_PATH, 'utf-8');
    const tokenInfo = JSON.parse(cachedData);

    // 2. 토큰 만료 시간 확인 (안전을 위해 60초 여유)
    if (tokenInfo.expiryTime > Date.now() + 60000) {
      // JSON 출력을 위해 console.log 주석 처리
      // console.log("✅ 유효한 캐시 토큰을 사용합니다.");
      return tokenInfo.accessToken;
    }
  } catch (error) {
    // 파일이 없거나 읽기 오류 시, 무시하고 새로 발급 진행
  }

  // 3. 캐시가 없거나 만료되었다면 새로 발급
  // JSON 출력을 위해 console.log 주석 처리
  // console.log("🔄 새로운 액세스 토큰을 발급받습니다...");
  try {
    const response = await axios({
      method: 'post',
      url: TOKEN_URL,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
      },
      data: 'grant_type=client_credentials'
    });

    const accessToken = response.data.access_token;
    const expiresIn = response.data.expires_in; // 초 단위 유효 기간 (보통 3600)
    const expiryTime = Date.now() + expiresIn * 1000;

    // 4. 발급받은 토큰 정보를 파일에 저장
    const tokenInfo = { accessToken, expiryTime };
    await fs.writeFile(CACHE_PATH, JSON.stringify(tokenInfo));
    // JSON 출력을 위해 console.log 주석 처리
    // console.log("💾 새 토큰을 spotify_cache.json 파일에 저장했습니다.");

    return accessToken;

  } catch (error) {
    console.error('❌ Spotify 액세스 토큰 발급 중 에러 발생:');
    if (error.response) {
      console.error(JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
    return null;
  }
}

/**
 * Spotify API로 검색하는 함수
 * @param {object} options - 검색 옵션 { query, token, type, limit }
 * @returns {Promise<Array|null>} 검색 결과 배열 또는 실패 시 null
 */
async function spotifySearch({ query, token, type = 'track', limit = 10 }) {
  if (!query || !token) {
    console.error("검색어와 액세스 토큰이 필요합니다.");
    return null;
  }

  try {
    const response = await axios.get(SEARCH_URL, {
      headers: { 'Authorization': `Bearer ${token}` },
      params: { q: query, type, limit }
    });

    if (type === 'track' && response.data.tracks) {
      // ❗️ 여기서 반환되는 객체 구조가 최종 JSON의 데이터가 됩니다.
      return response.data.tracks.items.map(track => ({
        trackName: track.name,
        artist: track.artists.map(artist => artist.name).join(', '),
        albumName: track.album.name,
        releaseDate: track.album.release_date,
        spotifyUrl: track.external_urls.spotify,
      }));
    }
    return [];

  } catch (error) {
    // 에러 발생 시 JSON 형태로 출력하도록 수정
    const errorOutput = {
      success: false,
      message: 'Spotify 음악 검색 중 에러 발생:',
      errorDetails: error.response ? error.response.data : error.message
    };
    console.log(JSON.stringify(errorOutput, null, 2));
    return null;
  }
}

// --- 메인 실행 로직 (JSON 출력을 위해 수정) ---
(async () => {
  const args = process.argv.slice(2);
  const query = args.find(arg => !arg.startsWith('--'));

  if (!query) {
    const usageInfo = {
      success: false,
      message: "검색어가 필요합니다.",
      usage: "node search.js [검색어] --type=[track|artist|album] --limit=[숫자]"
    }
    console.log(JSON.stringify(usageInfo, null, 2));
    return;
  }

  const type = args.find(arg => arg.startsWith('--type='))?.split('=')[1] || 'track';
  const limit = args.find(arg => arg.startsWith('--limit='))?.split('=')[1] || 10;

  const token = await getAccessToken();

  if (!token) {
    const tokenError = {
      success: false,
      message: "토큰 발급에 실패하여 프로그램을 종료합니다."
    };
    console.log(JSON.stringify(tokenError, null, 2));
    return;
  }

  const results = await spotifySearch({ query, token, type, limit });

  // 검색 결과를 최종 JSON 객체로 감싸서 출력
  if (results) {
    const finalOutput = {
      success: true,
      searchQuery: {
        query: query,
        type: type,
        limit: limit
      },
      count: results.length,
      items: results
    };
    // JSON.stringify의 세 번째 인자 '2'는 가독성을 위해 들여쓰기를 2칸으로 설정합니다.
    console.log(JSON.stringify(finalOutput, null, 2));
  }
  // spotifySearch 함수 내에서 에러가 발생하면 이미 JSON으로 출력했으므로 별도 처리가 필요 없습니다.
})();