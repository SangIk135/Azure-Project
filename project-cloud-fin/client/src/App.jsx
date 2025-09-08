import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import YouTube from 'react-youtube';

const BASE_URL = `https://testbe1jo.azurewebsites.net`;
// const BASE_URL = ""; // localhost

// --- 전역 스타일 ---
const GlobalStyle = createGlobalStyle`
  body {
    background-color: #0f172a;
    color: #ffffff;
    font-family: 'Inter', sans-serif;
    margin: 0;
  }
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: #1e293b; }
  ::-webkit-scrollbar-thumb { background: #6366f1; border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: #4f46e5; }
`;

const mockPopularArtists = [
  { id: 'artist-1', name: 'G-DRAGON', imageUrl: 'https://entertainimg.kbsmedia.co.kr/cms/uploads/PERSON_20241031091116_2e82077ae7a8a43736b41703763e8f0f.png' },
  { id: 'artist-2', name: 'aespa', imageUrl: 'https://i.namu.wiki/i/5Wzn3EtyCSm2SoKJoKJtIGCyiDXTRJVsyD1tPjT18Deutt9xTdSJ06vxCdyJKT24fSDL-DEO3hGi6Ze5fHvFGaoD2aTMVfHOpIW2cYUpzn-BYqaRJ5dQzYSZHQEsRZ3vrEXtGyfJD5ToK8B3yYR72Q.webp' },
  { id: 'artist-3', name: 'DAY6', imageUrl: 'https://i.namu.wiki/i/CYt-yDk2itJ19Yw7VYBbUA1196ugumckQ_4ZNdnI3DxOT5B19LSPklR1D9lCf-e4hBdNOAtA_MeW5kOXrfVA2663ySMsAgQjtbRC-uqpAhhEDSjLcf5L07vGgPtGnHnwAhTQao8NFG9zAEh6SeP6kQ.webp' },
  { id: 'artist-4', name: 'NewJeans', imageUrl: 'https://i.namu.wiki/i/VTGtQ4mnc5m6dTjDBj0nR2qbC_PnGx6_pon074XjMdtDQZ396q8t7YP3o4WGOhxfjEE9IaxTUc9s9chR4oWtZNR7xgvvpB8q1a5mRlDmP1ce-uFXqrPhvJb-Cd908gtfOZsHX5Jy-j4w1izJ99uKfQ.webp' },
  { id: 'artist-5', name: 'LE SSERAFIM', imageUrl: 'https://i.namu.wiki/i/l3qeMqu_QPK7qZyKPLVjM8xkrraPzhwbktOVrKDDZ0in0O0Osdbpio2gdwpkgQWHzT6NNV_Y-VFd7QizVIFkjNWq5EgztdVOqL_Q7hskM7tn_qIDYexYX_6P7vUSAIMNpFtlxmtNxzS-yXK-RK949A.webp' },
  { id: 'artist-6', name: 'fromis_9', imageUrl: 'https://i.namu.wiki/i/8g2tMZXWYJYRYTk9EPJeojrP0p64aNkgBnLmH6VnIlzeIDVqB3eWIs6l9RdrtulpXHQqXe8VzTcKwxJjat52Hi2hPw00C6MRiSRjjhAepnSUkwCAFb51fGdsrH1vtcTTKQt08zERx-nZ9J4U-puDWg.webp' },
  { id: 'artist-7', name: 'IVE', imageUrl: 'https://i.namu.wiki/i/dbYaykrNkUTz5RZOfjwQjU38vmA6zORYe_H60qH17Sl_PJ-oXcqvGPyuyJu6HKcDJuMqQdq--y6JPabC0QZzDA.webp' },
  { id: 'artist-8', name: 'IU', imageUrl: 'https://i.namu.wiki/i/4QgMOyARoHdSLoFDRgiDsyQ9Gg-j3b_mEj2rQ4zdwPoY4qp8hL7rWGFV2KO1AJcGrBAHeN82ajOn-XqlUXSY2Xvk8yGU7oKLs0QbvUWQenPDCUKjP8tMRg9y6SQVtSqsmY97gJ5NEbCqrXPosiQlFA.webp' },
];

// --- 아이콘 컴포넌트 ---
const MusicIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>);
const PlayIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>);
const EditIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>);
const HomeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>);
const PlaylistIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>);
const GlobeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>);
const SearchIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>);
const PlusIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>);
const ShareIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>);
const LogoutIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>);
const TrashIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>);


// --- 공용 스타일 컴포넌트 ---
const AuthPageContainer = styled.div` 
display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 1rem; background-color: #000; 
`;

const PageContainer = styled.div` 
padding: 2.5rem; @media (max-width: 768px) { padding: 1.5rem; } 
`;

const Button = styled.button` 
  display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  padding: 0.75rem 1rem;
  margin-top: ${props => props.noMarginTop ? '0' : '1rem'};
  border: none;
  border-radius: ${props => (props.type === 'primary' ? '9999px' : '0.5rem')};
  font-weight: 700; cursor: pointer; transition: transform 0.2s, background-color 0.2s;
  background-color: ${props => {
    if (props.type === 'primary') return '#1DB954';
    if (props.danger) return '#dc2626';
    if (props.secondary) return '#334155';
    return '#4f46e5';
  }};
  color: ${props => (props.type === 'primary' ? '#000000' : '#ffffff')};
  &:hover { 
      transform: ${props => (props.type === 'primary' ? 'scale(1.05)' : 'none')};
      background-color: ${props => {
    if (props.danger) return '#b91c1c';
    if (props.secondary) return '#475569';
    if (props.type !== 'primary') return '#4338ca';
  }};
  }
`;

const Input = styled.input`
  width: 100%; padding: 0.75rem; border-radius: 0.25rem;
  background-color: #121212; border: 1px solid #878787; color: #ffffff;
  box-sizing: border-box; font-size: 1rem;
  &::placeholder { color: #a0aec0; }
  &:focus { 
      outline: none; 
      border-color: ${props => props.auth ? '#ffffff' : '#4f46e5'};
      box-shadow: ${props => props.auth ? '0 0 0 1px #ffffff' : 'none'};
  }
`;
const FormContainer = styled.div`
  width: 100%; max-width: 480px; background-color: #121212;
  padding: 2rem; border-radius: 0.5rem; text-align: center;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
`;
const Form = styled.form` display: flex; flex-direction: column; gap: 1rem; `;
const FormGroup = styled.div`
  margin-bottom: 1rem; text-align: left;
  label {
    display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem;
  }
`;
const FormTitle = styled.h1`
  font-size: 1.5rem; font-weight: 700; margin-bottom: 2rem;
`;
const AuthDivider = styled.div` width: 100%; border-top: 1px solid #2a2a2a; margin: 2rem 0; `;
const AuthLink = styled.a`
  color: #ffffff; font-weight: 600; text-decoration: underline; cursor: pointer;
  transition: color 0.2s;
  &:hover { color: #1DB954; }
`;
const ErrorMessage = styled.p`
    color: #f87171; font-size: 0.875rem; height: 1.25rem;
    text-align: center; margin-bottom: 1rem; margin-top: 0;
`;
const Grid = styled.div` display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); `;
const PlaylistItem = styled.div`
  cursor: pointer;
  .image-container {
    aspect-ratio: 1 / 1; background-color: #1e293b; border-radius: 0.5rem; overflow: hidden;
    position: relative; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1); transition: transform 0.3s;
    &:hover { transform: scale(1.05); }
    img { width: 100%; height: 100%; object-fit: cover; }
    .overlay { position: absolute; inset: 0; background-color: rgba(0,0,0,0.4); display: flex; align-items: flex-end; padding: 1rem; }
    h3 { color: white; font-size: 1.125rem; font-weight: 700; margin: 0; }
  }
  p { color: #94a3b8; margin-top: 0.5rem; font-size: 0.875rem; font-weight: 500; }
`;
const SearchButton = styled.button`
  background: transparent; border: none; padding: 0; margin: 0; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
`;
const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: 2.5rem;
  margin-bottom: 1.5rem;
`;
const ArtistCard = styled.div`
  text-align: center;
  cursor: pointer;
  flex-shrink: 0;
  img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 1rem;
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.2);
    transition: transform 0.3s;
  }
  &:hover img {
    transform: scale(1.05);
  }
  p {
    font-weight: 600;
    margin: 0.5rem 0 0.25rem 0;
  }
  span {
    font-size: 0.875rem;
    color: #94a3b8;
  }
`;
const HorizontalScrollContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  padding-bottom: 1rem;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

// --- 상단 검색창을 위한 Header 컴포넌트 ---
const HeaderContainer = styled.header`
  padding: 1.5rem 2.5rem;
  border-bottom: 1px solid #1e293b;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const SearchFormContainer = styled.form`
  width: 100%;
  max-width: 600px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;
const SearchInput = styled.input`
  width: 100%;
  flex-grow: 1; 
  padding: 0.75rem 1rem;
  border-radius: 9999px;
  background-color: #1e293b;
  border: 1px solid #334155;
  color: #e2e8f0;
  font-size: 1rem;
  box-sizing: border-box;
  &:focus { outline: none; border-color: #4f46e5; }
`;
const StyledSearchIcon = styled(SearchIcon)`
  color: #94a3b8;
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
`;

function Header({ setPage, setContext }) {
  const [searchTerm, setSearchTerm] = useState('');
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setContext({ searchTerm });
    setPage('search');
    setSearchTerm('');
  };
  return (
    <HeaderContainer>
      <SearchFormContainer onSubmit={handleSearch}>
        <SearchButton type="submit">
          <StyledSearchIcon />
        </SearchButton>
        <SearchInput
          type="text" placeholder="노래, 앨범, 아티스트 검색"
          value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchFormContainer>
    </HeaderContainer>
  );
}

// --- 페이지 컴포넌트 ---
function LoginPage({ setPage, setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setUser({ ...data.user, token: data.token });
        setPage('home');
      } else {
        setError(data.message || '아이디 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch {
      setError('로그인 중 오류가 발생했습니다.');
    }
  };
  return (
    <AuthPageContainer>
      <FormContainer>
        <FormTitle>나의 Playlist에 로그인하기</FormTitle>
        <AuthDivider />
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <label htmlFor="email">이메일</label>
            <Input
              auth type="text" id="email" placeholder="이메일" required
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="password">비밀번호</label>
            <Input
              auth type="password" id="password" placeholder="비밀번호" required
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </FormGroup>
          <ErrorMessage>{error}</ErrorMessage>
          <Button type="primary" fullWidth>로그인하기</Button>
          <Button type="primary" fullWidth onClick={() => setPage('home')}>방문자로 이용하기</Button>
        </Form>
        <AuthDivider />
        <div>
          <span>계정이 없나요? </span>
          <AuthLink onClick={() => setPage('signup')}>나의 Playlist에 가입하기</AuthLink>
        </div>
      </FormContainer>
    </AuthPageContainer>
  );
}

function SignUpPage({ setPage }) {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, nickname })
      });
      const data = await res.json();
      if (res.ok) {
        alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
        setPage('login');
      } else {
        setError(data.message || '회원가입 실패');
      }
    } catch {
      setError('회원가입 중 오류가 발생했습니다.');
    }
  };
  return (
    <AuthPageContainer>
      <FormContainer>
        <FormTitle>회원가입</FormTitle>
        <p>몇 가지 정보만 입력하면 완료!</p>
        <Form onSubmit={handleSignUp}>
          <FormGroup>
            <label>이메일</label>
            <Input auth type="email" required placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
          </FormGroup>
          <FormGroup>
            <label>아이디(닉네임)</label>
            <Input auth type="text" required placeholder="사용할 닉네임" value={nickname} onChange={e => setNickname(e.target.value)} />
          </FormGroup>
          <FormGroup>
            <label>비밀번호</label>
            <Input auth type="password" required placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
          </FormGroup>
          <ErrorMessage>{error}</ErrorMessage>
          <Button secondary fullWidth type="submit">가입하기</Button>
        </Form>
        <p style={{ marginTop: '2rem' }}>이미 계정이 있으신가요?<AuthLink onClick={() => setPage('login')}> 로그인</AuthLink></p>
      </FormContainer>
    </AuthPageContainer>
  );
}

function HomePage({ user }) {
  // ▼▼▼ [최근 재생 목록을 저장할 상태 변수 추가] ▼▼▼
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);

  // ▼▼▼ [컴포넌트가 로드될 때 최근 재생 목록을 가져오는 useEffect 추가] ▼▼▼
  useEffect(() => {
    // 로그인한 사용자일 경우에만 API를 호출합니다.
    if (user?.token) {
      fetch(`${BASE_URL}/api/history/recent?limit=8`, { // 8개까지 가져오기
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
            // 서버에서 받은 데이터를 프론트엔드에서 사용하기 좋은 형태로 가공합니다.
            const formattedData = data.map(item => ({
                id: item.song_id,
                name: item.track_name,
                artist: item.artist,
                imageUrl: item.album_image_url
            }));
            setRecentlyPlayed(formattedData);
        }
      })
      .catch(err => console.error("최근 재생 목록 로딩 실패:", err));
    }
  }, [user]); // user 객체가 바뀔 때 (로그인 시) 다시 데이터를 가져옵니다.

  return (
    <PageContainer>
      <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem' }}>안녕하세요, {user ? user.nickname : '방문자'}님!</h1>
      <p style={{ color: '#94a3b8', marginBottom: '2.5rem' }}>좌측 공개 플레이리스트에서 다른 사용자들의 플레이리스트를 둘러보세요.</p>
      
      {/* ▼▼▼ ['다시 듣기' 섹션 UI 추가] ▼▼▼ */}
      {/* 최근 재생한 곡이 1개 이상 있을 때만 이 섹션을 보여줍니다. */}
      {user && recentlyPlayed.length > 0 && (
        <>
          <SectionTitle>다시 듣기</SectionTitle>
          <HorizontalScrollContainer>
            {recentlyPlayed.map(item => (
              // 기존 ArtistCard 스타일을 재활용하여 앨범 커버와 곡 정보를 보여줍니다.
              <ArtistCard key={item.id} style={{ width: '150px' }}>
                <img src={item.imageUrl || 'https://i.imgur.com/1vG0iJ8.png'} alt={item.name} style={{ borderRadius: '0.5rem', width: '150px', height: '150px' }} />
                <p style={{ fontWeight: 600, marginTop: '0.5rem' }}>{item.name}</p>
                <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{item.artist}</span>
              </ArtistCard>
            ))}
          </HorizontalScrollContainer>
        </>
      )}

      {/* ▼▼▼ 기존 '인기 아티스트' 섹션은 그대로 둡니다. ▼▼▼ */}
      <SectionTitle>인기 아티스트</SectionTitle>
      <HorizontalScrollContainer>
        {mockPopularArtists.map(artist => (
          <ArtistCard key={artist.id}>
            <img src={artist.imageUrl} alt={artist.name} />
            <p>{artist.name}</p>
            <span>아티스트</span>
          </ArtistCard>
        ))}
      </HorizontalScrollContainer>
    </PageContainer>
  );
}

function PublicPlaylistsPage({ setPage, setContext }) {
  const [publicPlaylists, setPublicPlaylists] = useState([]);
  useEffect(() => {
    fetch(`${BASE_URL}/api/playlists/public`)
      .then(res => res.json())
      .then(data => {
        // console.log("Public Playlists Data:", data);
        // 서버 필드명 변환
        setPublicPlaylists(Array.isArray(data)
          ? data.map(p => ({
            id: p.playlist_id,
            name: p.name,
            description: p.description,
            creatorNickname: p.creator_nickname,
            albumImageUrl: p.album_image_url,
          }))
          : []);
      })
      .catch(() => setPublicPlaylists([]));
  }, []);
  const handlePlaylistClick = (playlist) => { // 매개변수를 playlistId에서 playlist 객체 전체로 변경
  setContext({ 
    playlistId: playlist.id, 
    creatorNickname: playlist.creatorNickname // 생성자 닉네임 추가
  });
  setPage('playlistDetail');
  };

  return (
    <PageContainer>
      <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '2rem' }}>공개 플레이리스트</h1>
      {publicPlaylists.length > 0 ? (
        <Grid>
          {publicPlaylists.map(playlist => (
            <PlaylistItem key={playlist.id} onClick={() => handlePlaylistClick(playlist)}> 
              <div className="image-container">
                <img src={playlist.albumImageUrl ? playlist.albumImageUrl : `https://placehold.co/300x300/10b981/ffffff?text=${encodeURI(playlist.name[0])}`} alt={playlist.name} />
                <div className="overlay"><h3>{playlist.name}</h3></div>
              </div>
              <p>by {playlist.creatorNickname}</p>
            </PlaylistItem>
          ))}
        </Grid>
      ) : (
        <div style={{ textAlign: 'center', padding: '5rem 0', backgroundColor: '#1e293b', borderRadius: '0.5rem' }}>
          <PlaylistIcon style={{ margin: '0 auto', height: '4rem', width: '4rem', color: '#64748b' }} />
          <p style={{ marginTop: '1rem', color: '#94a3b8' }}>공개된 플레이리스트가 없습니다.</p>
        </div>
      )}
    </PageContainer>
  );
}

function MyPlaylistsPage({ user, setPage, setContext }) {
  const [myPlaylists, setMyPlaylists] = useState([]);
  useEffect(() => {
    if (!user?.token) return;
    fetch(`${BASE_URL}/api/playlists/mine`, {
      headers: { 'Authorization': `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(data => {
        // 서버 필드명 변환
        setMyPlaylists(Array.isArray(data)
          ? data.map(p => ({
            id: p.playlist_id,
            name: p.name,
            albumImageUrl: p.album_image_url,
            songs: Array(p.song_count).fill({}), // song_count만 있으므로 빈 배열로 대체
          }))
          : []);
      })
      .catch(() => setMyPlaylists([]));
  }, [user]);

  const handlePlaylistClick = (playlistId) => {
  setContext({ 
    playlistId: playlistId,
    creatorNickname: user.nickname // 현재 로그인한 사용자의 닉네임 추가
  });
  setPage('playlistDetail');
  };
  
  return (
    <PageContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: '700' }}>내 플레이리스트</h1>
        <Button onClick={() => setPage('createPlaylist')}><PlusIcon /><span>새 플레이리스트</span></Button>
      </div>
      {myPlaylists.length > 0 ? (
        <Grid>
          {myPlaylists.map(playlist => (
            <PlaylistItem key={playlist.id} onClick={() => handlePlaylistClick(playlist.id)}>
              <div className="image-container">
                <img src={playlist.albumImageUrl ? playlist.albumImageUrl : `https://placehold.co/300x300/10b981/ffffff?text=${encodeURI(playlist.name[0])}`} alt={playlist.name} />
                <div className="overlay"><h3>{playlist.name}</h3></div>
              </div>
              <p>{playlist.songs.length}곡</p>
            </PlaylistItem>
          ))}
        </Grid>
      ) : (
        <div style={{ textAlign: 'center', padding: '5rem 0', backgroundColor: '#1e293b', borderRadius: '0.5rem' }}>
          <PlaylistIcon style={{ margin: '0 auto', height: '4rem', width: '4rem', color: '#64748b' }} />
          <p style={{ marginTop: '1rem', color: '#94a3b8' }}>플레이리스트가 없습니다.</p>
          <Button onClick={() => setPage('createPlaylist')} style={{ marginTop: '1.5rem' }}><PlusIcon /><span>첫 플레이리스트 만들기</span></Button>
        </div>
      )}
    </PageContainer>
  );
}

function PlaylistDetailPage({ setPage, context, user, deletePlaylist }) {
  const [playlist, setPlaylist] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editPublic, setEditPublic] = useState(false);
  const [error, setError] = useState('');
  const [youtubePlayer, setYoutubePlayer] = useState({ isOpen: false, loading: false, currentIndex: 0, videoIds: [] });

  const playlistId = context?.playlistId;
  useEffect(() => {
    if (!playlistId) return;
    fetch(`${BASE_URL}/api/playlists/${playlistId}`)
      .then(res => res.json())
      .then(data => {
        if (!data || !data.playlist_id) {
          setPlaylist(null);
          return;
        }
        setPlaylist({
          id: data.playlist_id,
          name: data.name,
          description: data.description,
          isPublic: data.is_public,
          creatorNickname: data.creator_nickname,
          songs: Array.isArray(data.songs)
            ? data.songs.map(song => ({
              id: song.song_id,
              title: song.track_name,
              artist: song.artist,
              spotifyUrl: song.spotify_url,
              albumImageUrl: song.album_image_url,
            }))
            : [],
        });
        setEditName(data.name);
        setEditDesc(data.description);
        setEditPublic(data.is_public);
      })
      .catch(() => setPlaylist(null));
  }, [playlistId]);

   // 이 코드는 유튜브 플레이어에서 재생하는 곡의 순서(index)가 바뀔 때마다 실행됩니다.
  useEffect(() => {
    // 사용자가 로그인했고, 플레이어가 열려있고, 재생할 곡이 있을 때만 실행
    if (user?.token && youtubePlayer.isOpen && playlist?.songs.length > 0) {
      const currentSong = playlist.songs[youtubePlayer.currentIndex];
      if (currentSong) {
        // fetch를 이용해 서버에 "이 노래를 들었다"고 알려줍니다.
        fetch(`${BASE_URL}/api/history/play`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify({ songId: currentSong.id })
        });
      }
    }
  }, [youtubePlayer.currentIndex, user, youtubePlayer.isOpen, playlist]);

  const handleFacebookShare = async () => {
    if (!playlistId) return;

    try {
      // 1. 백엔드에 만들어둔 공유 정보 API를 호출합니다.
      const response = await fetch(`${BASE_URL}/api/share/playlist/${playlistId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '공유 정보를 가져올 수 없습니다.');
      }
      const shareData = await response.json();

      // 2. 받아온 URL로 페이스북 공유 링크를 생성합니다.
      const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`;

      // 3. 새 창을 띄워 페이스북 공유 화면을 엽니다.
      window.open(facebookShareUrl, '_blank', 'width=600,height=400');

    } catch (error) {
      console.error("페이스북 공유 실패:", error);
      alert(`공유에 실패했습니다: ${error.message}`);
    }
  };
  // ▲▲▲ [여기까지 함수 추가] ▲▲▲

  const handleDelete = async () => {
    if (window.confirm(`'${playlist.name}' 플레이리스트를 정말 삭제하시겠습니까?`)) {
      deletePlaylist(playlist.id);
      setPage('myPlaylists');
    }
  };

  const handleSongDelete = async (songId) => {
    if (!window.confirm('이 곡을 삭제하시겠습니까?')) return;
    try {
      const res = await fetch(`${BASE_URL}/api/playlists/${playlist.id}/songs/${songId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) {
        setPlaylist(prev => ({ ...prev, songs: prev.songs.filter(s => s.id !== songId) }));
      } else {
        alert('곡 삭제 실패');
      }
    } catch {
      alert('곡 삭제 중 오류 발생');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/api/playlists/${playlist.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ name: editName, description: editDesc, is_public: editPublic })
      });
      if (res.ok) {
        setPlaylist(p => ({ ...p, name: editName, description: editDesc, isPublic: editPublic }));
        setEditMode(false);
      } else {
        setError('수정 실패');
      }
    } catch {
      setError('수정 중 오류 발생');
    }
  };

  const handlePlayYoutube = async () => {
    if (!playlist || playlist.songs.length === 0) {
      alert('재생할 곡이 없습니다.');
      return;
    }
    setYoutubePlayer({ isOpen: true, loading: true, currentIndex: 0, videoIds: [] });
    try {
      const videoIds = [];
      for (const song of playlist.songs) {
        const res = await fetch(`${BASE_URL}/api/youtube/ytsearch?title=${encodeURIComponent(song.title)}&artist=${encodeURIComponent(song.artist)}`);
        const data = await res.json();
        console.log('YouTube Search Data:', data);
        if (data.success && data.link) {
          const match = data.link.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
          if (match && match[1]) {
            videoIds.push(match[1]);
          } else {
            videoIds.push(null);
          }
        } else {
          videoIds.push(null);
        }
      }
      if (videoIds.filter(Boolean).length === 0) {
        setYoutubePlayer({ isOpen: false, loading: false, currentIndex: 0, videoIds: [] });
        alert('유튜브 영상을 찾을 수 없습니다.');
        return;
      }
      setYoutubePlayer({ isOpen: true, loading: false, currentIndex: 0, videoIds });
    } catch {
      setYoutubePlayer({ isOpen: false, loading: false, currentIndex: 0, videoIds: [] });
      alert('유튜브 영상 검색 중 오류가 발생했습니다.');
    }
  };

  const YoutubePlayerWrapper = styled.div`
    position: fixed;
    right: 2rem;
    bottom: 2rem;
    z-index: 1000;
    background: #18181b;
    border-radius: 1rem;
    box-shadow: 0 4px 24px rgba(0,0,0,0.4);
    padding: 0.5rem 0.5rem 0.5rem 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  `;

  const SongItem = styled.div`
      display: flex; align-items: center; padding: 0.75rem; border-radius: 0.5rem;
      position: relative;
      &:hover { background-color: #1e293b; }
      .delete-btn { opacity: 0; position: absolute; right: 1rem; transition: opacity 0.2s; }
      &:hover .delete-btn { opacity: 1; }
    `;

  if (!playlist) { return <PageContainer><p>플레이리스트를 찾을 수 없습니다.</p></PageContainer>; }
  const isOwner = user?.nickname === playlist.creatorNickname;

  if (editMode) {
    // (editMode일 때의 JSX 코드는 동일하므로 생략)
    return (
      <PageContainer>
        <h1>플레이리스트 정보 수정</h1>
        <form onSubmit={handleEditSubmit} style={{ maxWidth: 400 }}>
          <div style={{ marginBottom: '1rem' }}>
            <label>이름</label>
            <Input value={editName} onChange={e => setEditName(e.target.value)} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>설명</label>
            <Input as="textarea" rows={3} value={editDesc} onChange={e => setEditDesc(e.target.value)} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>
              <input type="checkbox" checked={editPublic} onChange={e => setEditPublic(e.target.checked)} /> 공개
            </label>
          </div>
          <Button type="submit">저장</Button>
          <Button type="button" secondary onClick={() => setEditMode(false)} style={{ marginLeft: '1rem' }}>취소</Button>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </form>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', alignItems: 'flex-end' }}>
        <img 
          src={playlist.songs?.[0]?.albumImageUrl ? playlist.songs[0].albumImageUrl : `https://placehold.co/300x300/10b981/ffffff?text=${encodeURI(playlist.name[0])}`} 
          alt={playlist.name} 
          style={{ width: '12rem', height: '12rem', borderRadius: '0.5rem', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} 
        />
        <div>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>플레이리스트</p>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{playlist.name}</h1>
          <p style={{ color: '#94a3b8', marginTop: '1rem' }}>
            <span>{playlist.description}</span>
          </p>
          <p style={{ color: '#94a3b8', marginTop: '1rem' }}>
            <span>by {playlist.creatorNickname}</span><span style={{ margin: '0 0.5rem' }}>•</span>
            <span>{playlist.songs.length}곡</span>
            <span><input type="checkbox" checked={playlist.isPublic} readOnly style={{ marginLeft: '1rem', width: '1rem', height: '1rem' }} /> 공개 플레이리스트 설정여부</span>
          </p>
        </div>
      </div>
      {isOwner ? (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <Button onClick={handlePlayYoutube}><PlayIcon /> 재생하기</Button>
          <Button onClick={() => setPage('search')}><PlusIcon /> 곡 추가하기</Button>
          {/* ▼▼▼ [2. 여기에 onClick 이벤트가 연결됩니다] ▼▼▼ */}
          <Button onClick={handleFacebookShare}><ShareIcon /> 공유하기</Button>
          {/* ▲▲▲ [여기까지 이벤트 연결] ▲▲▲ */}
          <Button onClick={() => setEditMode(true)}><EditIcon/>정보 수정</Button>
          <Button danger onClick={handleDelete}><TrashIcon /> 삭제하기</Button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <Button onClick={handlePlayYoutube}><PlayIcon /> 재생하기</Button>
        </div>
      )}

      {/* (나머지 JSX 코드는 동일하므로 생략) */}
      {youtubePlayer.isOpen && (
        <YoutubePlayerWrapper>
          <div style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', alignSelf: 'flex-start' }}>
            {playlist.songs[youtubePlayer.currentIndex]?.title} - {playlist.songs[youtubePlayer.currentIndex]?.artist}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
            <Button type="button" secondary style={{ fontSize: '0.8rem', padding: '0.2rem 0.7rem' }}
              onClick={() => setYoutubePlayer(prev => ({ ...prev, currentIndex: Math.max(0, prev.currentIndex - 1) }))}
              disabled={youtubePlayer.currentIndex === 0}
            >이전곡</Button>
            <Button type="button" secondary style={{ fontSize: '0.8rem', padding: '0.2rem 0.7rem' }}
              onClick={() => setYoutubePlayer(prev => ({ ...prev, currentIndex: Math.min(playlist.songs.length - 1, prev.currentIndex + 1) }))}
              disabled={youtubePlayer.currentIndex >= playlist.songs.length - 1}
            >다음곡</Button>
            <Button type="button" secondary style={{ fontSize: '0.8rem', padding: '0.2rem 0.7rem' }}
              onClick={() => setYoutubePlayer({ ...youtubePlayer, isOpen: false })}
            >닫기</Button>
          </div>
          {youtubePlayer.loading ? (
            <div style={{ color: '#fff', padding: '1rem' }}>로딩 중...</div>
          ) : youtubePlayer.videoIds.length > 0 && youtubePlayer.videoIds[youtubePlayer.currentIndex] ? (
            <YouTube
              videoId={youtubePlayer.videoIds[youtubePlayer.currentIndex]}
              opts={{ width: 500, height: 500, playerVars: { autoplay: 1 } }}
              onEnd={() => {
                if (youtubePlayer.currentIndex < youtubePlayer.videoIds.length - 1) {
                  setYoutubePlayer(prev => ({ ...prev, currentIndex: prev.currentIndex + 1 }));
                } else {
                  setYoutubePlayer(prev => ({ ...prev, isOpen: false }));
                }
              }}
              onError={() => {
                // 에러 시 다음 곡으로 넘어감
                if (youtubePlayer.currentIndex < youtubePlayer.videoIds.length - 1) {
                  setYoutubePlayer(prev => ({ ...prev, currentIndex: prev.currentIndex + 1 }));
                } else {
                  setYoutubePlayer(prev => ({ ...prev, isOpen: false }));
                }
              }}
              style={{ borderRadius: '0.5rem', background: '#000' }}
            />
          ) : (
            <div style={{ color: '#fff', padding: '1rem' }}>재생할 영상이 없습니다.</div>
          )}
        </YoutubePlayerWrapper>
      )}


      <div>
        {playlist.songs.map((song, index) => (
          <SongItem key={song.id}>
            <div style={{ width: '2rem', color: '#94a3b8' }}>{index + 1}</div>
            <div style={{ flexGrow: 1 }}>
              <p style={{ fontWeight: 600, margin: 0 }}>{song.title} - {song.artist}</p>
            </div>
            {isOwner && (
              <Button type="button" danger className="delete-btn" onClick={() => handleSongDelete(song.id)}><TrashIcon /></Button>
            )}
          </SongItem>
        ))}
      </div>
    </PageContainer>
  );
}

function CreatePlaylistPage({ setPage, user }) {
  const [error, setError] = useState('');
  const [isChecked, setIsChecked] = useState(true); // 체크박스 기본값 true
  const handleOnChange = () => {
    setIsChecked(!isChecked);
  };
  const handleCreate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newPlaylistData = {
      name: formData.get('name'),
      description: formData.get('description'),
      is_public: formData.get('is_public') === 'on',
    };
    try {
      const res = await fetch(`${BASE_URL}/api/playlists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(newPlaylistData)
      });
      if (res.ok) {
        setPage('myPlaylists');
      } else {
        const data = await res.json();
        setError(data.message || '플레이리스트 생성 실패');
      }
    } catch {
      setError('플레이리스트 생성 중 오류가 발생했습니다.');
    }
  };
  return (
    <PageContainer>
      <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '2rem' }}>새 플레이리스트 만들기</h1>
      <Form onSubmit={handleCreate} style={{ maxWidth: '600px', gap: '1.5rem' }}>
        <FormGroup style={{ gap: '0.5rem' }}>
          <label htmlFor="name">이름</label>
          <Input type="text" id="name" name="name" required placeholder="플레이리스트 제목" />
        </FormGroup>
        <FormGroup style={{ gap: '0.5rem' }}>
          <label htmlFor="description">설명</label>
          <Input as="textarea" rows="4" id="description" name="description" placeholder="플레이리스트에 대한 간단한 설명" />
        </FormGroup>
        <FormGroup style={{ flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
          <div>
            <input type="checkbox" checked={isChecked} onChange={handleOnChange} id="is_public" name="is_public" style={{ width: '1rem', height: '1rem' }} />
            <label htmlFor="is_public">공개 플레이리스트로 설정</label>
          </div>
        </FormGroup>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Button type="submit" noMarginTop>만들기</Button>
          <Button type="button" secondary onClick={() => setPage('myPlaylists')} noMarginTop>취소</Button>
        </div>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Form>
    </PageContainer>
  );
}

// SearchPage 함수 바깥이나 별도 파일에 SongItem 컴포넌트를 정의합니다.
const SongItemLayout = styled.div`
  display: flex; align-items: center; padding: 0.75rem;
  border-radius: 0.5rem; &:hover { background-color: #1e293b; }
`;

function SongItem({ song, user, myPlaylists, BASE_URL }) {
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const [addStatus, setAddStatus] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToPlaylist = async (playlistId) => {
    if (!playlistId) {
      setAddStatus('플레이리스트를 선택하세요.');
      return;
    }
    setIsAdding(true);
    setAddStatus('추가 중...');

    try {
      const res = await fetch(`${BASE_URL}/api/songs/by-spotify-url?spotifyUrl=${encodeURIComponent(song.spotifyUrl)}`);
      const data = await res.json();
      if (!data.song_id) {
        setAddStatus('곡 정보를 찾을 수 없습니다.');
        setIsAdding(false);
        return;
      }

      const addRes = await fetch(`${BASE_URL}/api/playlists/${playlistId}/songs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ songId: data.song_id })
      });

      if (addRes.ok) {
        setAddStatus('플레이리스트에 추가되었습니다!');
      } else {
        const addData = await addRes.json();
        setAddStatus(addData.message || '추가 실패');
      }
    } catch {
      setAddStatus('추가 중 오류 발생');
    }
    setIsAdding(false);
    
    // 3초 후에 메시지 초기화
    setTimeout(() => setAddStatus(''), 3000);
  };
  
  return (
    <SongItemLayout>
        <img 
          src={song.albumImageUrl ? song.albumImageUrl : `https://placehold.co/300x300/10b981/ffffff?text=${encodeURI(song.title[0])}`} 
          style={{ width: '3.5rem', height: '3.5rem', borderRadius: '0.25rem', marginRight: '1rem' }} 
          alt={song.title}
        />
        <div style={{ flexGrow: 1 }}>
            <p style={{ fontWeight: 600, margin: 0 }}>{song.title}</p>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: 0 }}>{song.artist}</p>
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>{song.album} ({song.releaseDate})</p>
        </div>

        {user && myPlaylists.length > 0 && (
          <div style={{ marginRight: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <select value={selectedPlaylist} onChange={e => setSelectedPlaylist(e.target.value)} style={{ padding: '0.3rem', borderRadius: '0.25rem' }}>
                <option value="">플레이리스트 선택</option>
                {myPlaylists.map(pl => (
                    <option key={pl.id} value={pl.id}>{pl.name}</option>
                ))}
            </select>
            <Button
                type="button"
                style={{ fontSize: '0.875rem', padding: '0.4rem 0.8rem', marginTop: 0 }}
                onClick={() => handleAddToPlaylist(selectedPlaylist)}
                disabled={isAdding}
            >
                {isAdding ? '추가 중...' : 'Add to my Playlist'}
            </Button>
          </div>
        )}
        <a href={song.spotifyUrl} target="_blank" rel="noopener noreferrer">
            <Button style={{ fontSize: '0.875rem', padding: '0.4rem 0.8rem', marginTop: 0 }}>Redirect to Spotify</Button>
        </a>
        {addStatus && (
          <span style={{ marginLeft: '1rem', color: addStatus.includes('성공') || addStatus.includes('추가') ? '#22c55e' : '#ef4444', fontWeight: 600 }}>
            {addStatus}
          </span>
        )}
    </SongItemLayout>
  );
}


function SearchPage({ context, user }) {
  const { searchTerm } = context || {};
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [myPlaylists, setMyPlaylists] = useState([]);

  useEffect(() => {
    if (user?.token) {
      fetch(`${BASE_URL}/api/playlists/mine`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      })
        .then(res => res.json())
        .then(data => {
          setMyPlaylists(Array.isArray(data)
            ? data.map(p => ({ id: p.playlist_id, name: p.name }))
            : []);
        })
        .catch(() => setMyPlaylists([]));
    }
  }, [user]);

  useEffect(() => {
    if (searchTerm) {
      setLoading(true);
      setError('');
      fetch(`${BASE_URL}/api/songs/search?q=${encodeURIComponent(searchTerm)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.items)) {
            setResults(data.items.map((item, idx) => ({
              id: idx + 1,
              title: item.trackName,
              artist: item.artist,
              album: item.albumName,
              releaseDate: item.releaseDate,
              spotifyUrl: item.spotifyUrl,
              youtubeUrl: item.youtubeUrl,
              albumImageUrl: item.albumImageUrl, // <-- 이 부분 추가
            })));
            console.log("search results:", data.items);
          } else {
            setResults([]);
            setError(data.message || '검색 결과가 없습니다.');
          }
        })
        .catch(() => {
          setError('검색 중 오류가 발생했습니다.');
          setResults([]);
        })
        .finally(() => setLoading(false));
    } else {
      setResults([]);
      setError('');
    }
  }, [searchTerm]);

  return (
    <PageContainer>
      <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '1.5rem' }}>
        {searchTerm || ''} 검색 결과
      </h1>
      {loading ? (
        <p style={{ color: '#94a3b8' }}>검색 중...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {searchTerm ? (
          results.length > 0 ? (
            results.map((song) => (
              // 분리된 SongItem 컴포넌트를 사용하고 필요한 props를 전달합니다.
              <SongItem
                key={song.spotifyUrl}
                song={song}
                user={user}
                myPlaylists={myPlaylists}
                BASE_URL={BASE_URL} // BASE_URL도 props로 전달
              />
            ))
          ) : (
            <p style={{ color: '#94a3b8' }}>{error || '검색 결과가 없습니다.'}</p>
          )
        ) : (
          <p style={{ color: '#94a3b8' }}>검색어를 입력해 주세요.</p>
        )}
      </div>
      )}
    </PageContainer>
  );
}

// --- 페이지 상태를 history와 연동
function usePageWithHistory(initialPage) {
  const [page, setPageState] = useState(initialPage);

  useEffect(() => {
    const onPopState = (e) => {
      if (e.state && e.state.page) {
        setPageState(e.state.page);
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const setPage = (nextPage) => {
    window.history.pushState({ page: nextPage }, '', '');
    setPageState(nextPage);
  };

  return [page, setPage];
}

// --- 메인 App 컴포넌트 ---
export default function App() {
  const [page, setPage] = usePageWithHistory('home');
  const [user, setUser] = useState(null);
  const [context, setContext] = useState({});

  useEffect(() => {
  let title = 'MyMusic'; // 기본 타이틀
  switch (page) {
    case 'home':
      title = '홈 - MyMusic';
      break;
    case 'login':
      title = '로그인 - MyMusic';
      break;
    case 'signup':
      title = '회원가입 - MyMusic';
      break;
    case 'publicPlaylists':
      title = '공개 플레이리스트 - MyMusic';
      break;
    case 'myPlaylists':
      title = '내 플레이리스트 - MyMusic';
      break;
    case 'createPlaylist':
      title = '새 플레이리스트 만들기 - MyMusic';
      break;
    case 'playlistDetail':
      // 상세 페이지의 경우, 로딩 전/후를 고려하여 간단한 제목을 설정할 수 있습니다.
      // 더 나아가 context에 플레이리스트 이름을 담아와서 표시할 수도 있습니다.
      title = '플레이리스트 상세 - MyMusic';
      break;
    case 'search':
      // 검색 페이지의 경우, 검색어를 제목에 포함시켜줍니다.
      if (context.searchTerm) {
        title = `검색: ${context.searchTerm} - MyMusic`;
      } else {
        title = '검색 - MyMusic';
      }
      break;
    default:
      title = 'MyMusic';
  }
  document.title = title;}, [page, context]
  );

  // 로그인 상태 복원: localStorage에 토큰이 있으면 서버에서 사용자 정보 받아오기
  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (token && !user) {
      fetch(`${BASE_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setUser({ ...data.user, token });
            setPage('home');
          } else {
            localStorage.removeItem('jwt_token');
            setUser(null);
            setPage('login');
          }
        })
        .catch(() => {
          localStorage.removeItem('jwt_token');
          setUser(null);
          setPage('login');
        });
    }
  }, []);

    // 앱이 처음 로드될 때 URL 경로를 분석하여 올바른 페이지로 이동시키는 로직
  useEffect(() => {
    const path = window.location.pathname; // 현재 URL 경로를 가져옵니다. (예: /playlist/2)
  
    // 경로가 /playlist/:id 형식과 일치하는지 확인
    const playlistMatch = path.match(/^\/playlist\/(\d+)$/);
  
    if (playlistMatch && playlistMatch[1]) {
      const playlistId = playlistMatch[1]; // 숫자 ID 추출
      setPage('playlistDetail'); // 페이지를 상세 페이지로 설정
      setContext({ playlistId: playlistId }); // 컨텍스트에 ID 설정
    }
    // 여기에 다른 경로에 대한 규칙을 추가할 수도 있습니다.
    // 예: else if (path === '/my-page') { setPage('myPage'); }
  
  }, []); // []를 비워두어 앱이 처음 시작될 때 딱 한 번만 실행되도록 합니다.

  // 플레이리스트 삭제 함수 구현
  const deletePlaylist = async (playlistId) => {
    if (!user?.token) return;
    try {
      const res = await fetch(`${BASE_URL}/api/playlists/${playlistId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      if (res.ok) {
        setPage('myPlaylists');
      } else {
        const data = await res.json();
        alert(data.message || '플레이리스트 삭제 실패');
      }
    } catch {
      alert('플레이리스트 삭제 중 오류가 발생했습니다.');
    }
  };

  // 로그인 성공 시 토큰 저장
  const handleLoginSuccess = (userObj) => {
    localStorage.setItem('jwt_token', userObj.token);
    setUser(userObj);
    setPage('home');
  };

  // 로그아웃 시 토큰 삭제
  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    setUser(null);
    setPage('home');
  };

  useEffect(() => {
    const protectedPages = ['myPlaylists', 'createPlaylist'];
    if (protectedPages.includes(page) && !user && page !== 'login') {
      window.history.pushState({ page: 'login' }, '', '');
      setPage('login');
    }
  }, [page, user]);

  const AppContainer = styled.div` display: flex; min-height: 100vh; @media (max-width: 768px) { flex-direction: column; } `;
  const Sidebar = styled.nav`
    width: 16rem; background-color: #020617; padding: 1.5rem; flex-shrink: 0;
    display: flex; flex-direction: column; border-right: 1px solid #1e293b;
    @media (max-width: 768px) { width: 100%; flex-direction: row; align-items: center; justify-content: space-between; padding: 1rem; box-sizing: border-box; border-right: none; border-bottom: 1px solid #1e293b; }
  `;
  const NavList = styled.ul`
    list-style: none; padding: 0; margin: 2.5rem 0 0 0; display: flex; flex-direction: column; gap: 0.5rem;
    @media (max-width: 768px) { flex-direction: row; gap: 0.5rem; margin: 0; }
  `;
  const NavItem = styled.li`
    display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; border-radius: 0.5rem;
    cursor: pointer; transition: background-color 0.2s, color 0.2s;
    background-color: ${props => props.active ? '#1e293b' : 'transparent'};
    color: ${props => props.active ? '#e2e8f0' : '#94a3b8'};
    font-weight: 500;
    &:hover { background-color: #1e293b; color: #e2e8f0; }
    span { @media (max-width: 768px) { display: none; } }
  `;
  const MainContent = styled.main`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  `;
  const PageWrapper = styled.div`
    flex-grow: 1;
    overflow-y: auto;
  `;

  const renderPage = () => {
    switch (page) {
      case 'home': return <HomePage user={user} />;
      case 'login': return <LoginPage setPage={setPage} setUser={handleLoginSuccess} />;
      case 'signup': return <SignUpPage setPage={setPage} />;
      case 'publicPlaylists': return <PublicPlaylistsPage setPage={setPage} setContext={setContext} />;
      case 'myPlaylists': return <MyPlaylistsPage user={user} setPage={setPage} setContext={setContext} />;
      case 'playlistDetail': return <PlaylistDetailPage setPage={setPage} context={context} user={user} deletePlaylist={deletePlaylist} />;
      case 'createPlaylist': return <CreatePlaylistPage setPage={setPage} user={user} />;
      case 'search': return <SearchPage context={context} user={user} />;
      default: return <LoginPage setPage={setPage} setUser={handleLoginSuccess} />;
    }
  };

  return (
    <>
      <GlobalStyle />
      {!user && ['login', 'signup'].includes(page) ? (
        renderPage()
      ) : (
        <AppContainer>
          <Sidebar>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <MusicIcon style={{ color: '#818cf8', height: '2rem', width: '2rem' }} />
              <h1 style={{ fontSize: '1.5rem', fontWeight: '700', display: 'block' }}>MyMusic</h1>
            </div>
            <NavList>
              <NavItem active={page === 'home'} onClick={() => setPage('home')}><HomeIcon /><span>홈</span></NavItem>
              <NavItem active={page === 'publicPlaylists'} onClick={() => setPage('publicPlaylists')}><GlobeIcon /><span>공개 플레이리스트</span></NavItem>
              <NavItem active={page === 'myPlaylists' || page === 'createPlaylist' || (page === 'playlistDetail' && context.creatorNickname === user?.nickname)} onClick={() => setPage('myPlaylists')}><PlaylistIcon /><span>내 플레이리스트</span></NavItem>
            </NavList>
            <div style={{ marginTop: 'auto' }}>
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', background: '#1e293b', borderRadius: '0.5rem' }}>
                  <img src={`https://placehold.co/100x100/4f46e5/ffffff?text=${user.nickname[0]}`} alt="profile" style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%' }} />
                  <div style={{ flexGrow: 1 }}>
                    <p style={{ fontWeight: 600, margin: 0, fontSize: '0.875rem' }}>{user.nickname}</p>
                  </div>
                  <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.5rem' }} title="로그아웃"><LogoutIcon /></button>
                </div>
              ) : (
                <>
                  <Button onClick={() => setPage('login')} fullWidth style={{ marginBottom: '0.5rem' }}>로그인</Button>
                  <Button onClick={() => setPage('signup')} fullWidth>회원가입</Button>
                </>
              )}
            </div>
          </Sidebar>
          <MainContent>
            <Header setPage={setPage} setContext={setContext} />
            <PageWrapper>
              {renderPage()}
            </PageWrapper>
          </MainContent>
        </AppContainer>
      )}
    </>
  );
}
