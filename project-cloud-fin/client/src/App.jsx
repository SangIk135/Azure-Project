import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

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

// --- Mock Data ---
const mockUsers = [
  { id: 1, username: 'musiclover', password: 'password123', email: 'music@lover.com', nickname: 'MusicLover' },
  { id: 2, username: 'dj_master', password: 'password123', email: 'dj@master.com', nickname: 'DJMaster' },
];

const mockInitialPlaylists = [
  { id: 1, name: '퇴근길 힙스터', creatorId: 2, creatorNickname: 'DJMaster', isPublic: true, songs: [{ id: 1, title: '봄날' }, { id: 2, title: '밤편지' }] },
  { id: 2, name: '나만 아는 인디밴드', creatorId: 1, creatorNickname: 'MusicLover', isPublic: false, songs: [{ id: 3, title: '그대와 나, 설레임' }] },
  { id: 3, name: '주말엔 K-POP', creatorId: 2, creatorNickname: 'DJMaster', isPublic: true, songs: [] },
];

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
const HomeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>);
const PlaylistIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>);
const GlobeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>);
const SearchIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>);
const PlusIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>);
const LogoutIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>);
const TrashIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>);


// --- 공용 스타일 컴포넌트 ---
const AuthPageContainer = styled.div` display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 1rem; background-color: #000; `;
const PageContainer = styled.div` padding: 2.5rem; @media (max-width: 768px) { padding: 1.5rem; } `;
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
      const res = await fetch('testbe1jo.azurewebsites.net/api/auth/login', {
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
      const res = await fetch('testbe1jo.azurewebsites.net/api/auth/signup', {
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
  return (
    <PageContainer>
      <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem' }}>안녕하세요, {user ? user.nickname : '방문자'}님!</h1>
      <p style={{ color: '#94a3b8', marginBottom: '2.5rem' }}>좌측 공개 플레이리스트에서 다른 사용자들의 플레이리스트를 둘러보세요.</p>
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

function PublicPlaylistsPage({ playlists, setPage, setContext }) {
  const [publicPlaylists, setPublicPlaylists] = useState([]);
  useEffect(() => {
    fetch('testbe1jo.azurewebsites.net/api/playlists/public')
      .then(res => res.json())
      .then(data => {
        // 서버 필드명 변환
        setPublicPlaylists(Array.isArray(data)
          ? data.map(p => ({
            id: p.playlist_id,
            name: p.name,
            description: p.description,
            creatorNickname: p.creator_nickname,
          }))
          : []);
      })
      .catch(() => setPublicPlaylists([]));
  }, []);
  const handlePlaylistClick = (playlistId) => {
    setContext({ playlistId });
    setPage('playlistDetail');
  };

  return (
    <PageContainer>
      <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '2rem' }}>공개 플레이리스트</h1>
      {publicPlaylists.length > 0 ? (
        <Grid>
          {publicPlaylists.map(playlist => (
            <PlaylistItem key={playlist.id} onClick={() => handlePlaylistClick(playlist.id)}>
              <div className="image-container">
                <img src={`https://placehold.co/300x300/10b981/ffffff?text=${encodeURI(playlist.name[0])}`} alt={playlist.name} />
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

function MyPlaylistsPage({ playlists, user, setPage, setContext }) {
  const [myPlaylists, setMyPlaylists] = useState([]);
  useEffect(() => {
    if (!user?.token) return;
    fetch('testbe1jo.azurewebsites.net/api/playlists/mine', {
      headers: { 'Authorization': `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(data => {
        // 서버 필드명 변환
        setMyPlaylists(Array.isArray(data)
          ? data.map(p => ({
            id: p.playlist_id,
            name: p.name,
            songs: Array(p.song_count).fill({}), // song_count만 있으므로 빈 배열로 대체
          }))
          : []);
      })
      .catch(() => setMyPlaylists([]));
  }, [user]);
  const handlePlaylistClick = (playlistId) => {
    setContext({ playlistId });
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
                <img src={`https://placehold.co/300x300/8b5cf6/ffffff?text=${encodeURI(playlist.name[0])}`} alt={playlist.name} />
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

function PlaylistDetailPage({ setPage, context, user, playlists, deletePlaylist }) {
  const [playlist, setPlaylist] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editPublic, setEditPublic] = useState(false);
  const [error, setError] = useState('');

  const playlistId = context?.playlistId;
  useEffect(() => {
    if (!playlistId) return;
    fetch(`testbe1jo.azurewebsites.net/api/playlists/${playlistId}`)
      .then(res => res.json())
      .then(data => {
        // 서버 필드명 변환
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

  const handleDelete = async () => {
    if (window.confirm(`'${playlist.name}' 플레이리스트를 정말 삭제하시겠습니까?`)) {
      deletePlaylist(playlist.id);
      setPage('myPlaylists');
    }
  };

  // 곡 삭제
  const handleSongDelete = async (songId) => {
    if (!window.confirm('이 곡을 삭제하시겠습니까?')) return;
    try {
      const res = await fetch(`testbe1jo.azurewebsites.net/api/playlists/${playlist.id}/songs/${songId}`, {
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

  // 정보 수정
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`testbe1jo.azurewebsites.net/api/playlists/${playlist.id}`, {
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
        <img src={`https://placehold.co/300x300/f97316/ffffff?text=${encodeURI(playlist.name[0])}`} alt={playlist.name} style={{ width: '12rem', height: '12rem', borderRadius: '0.5rem', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
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
          <Button onClick={() => setEditMode(true)}>정보 수정</Button>
          <Button onClick=""><PlayIcon /> 재생하기</Button>
          {/* <iframe src="https://www.youtube.com/embed/{videoId}" ... /> */}
          {/* https://joypinkgom.tistory.com/229?category=874360 유튜브 API 사용해야함.. 할당량.. */}
          <Button onClick={() => setPage('search')}><PlusIcon /> 곡 추가하기</Button>
          <Button danger onClick={handleDelete}><TrashIcon /> 삭제하기</Button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <Button onClick=""><PlusIcon /> 재생하기</Button>
        </div>
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
      const res = await fetch('testbe1jo.azurewebsites.net/api/playlists', {
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

function SearchPage({ context, user }) {
  const { searchTerm } = context || {};
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [myPlaylists, setMyPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const [addStatus, setAddStatus] = useState('');
  const [addingSongId, setAddingSongId] = useState(null);

  useEffect(() => {
    if (user?.token) {
      fetch('testbe1jo.azurewebsites.net/api/playlists/mine', {
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
      fetch(`testbe1jo.azurewebsites.net/api/songs/search?q=${encodeURIComponent(searchTerm)}`)
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
            })));
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

  const handleAddToPlaylist = async (song, playlistId) => {
    setAddingSongId(song.spotifyUrl);
    setAddStatus('');
    try {
      // song_id 조회: spotifyUrl로 서버에 요청
      const res = await fetch(`testbe1jo.azurewebsites.net/api/songs/by-spotify-url?spotifyUrl=${encodeURIComponent(song.spotifyUrl)}`);
      const data = await res.json();
      if (!data.song_id) {
        setAddStatus('곡 정보를 찾을 수 없습니다.');
        setAddingSongId(null);
        return;
      }
      // 곡 추가 API 호출
      const addRes = await fetch(`testbe1jo.azurewebsites.net/api/playlists/${playlistId}/songs`, {
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
    setAddingSongId(null);
  };

  const SongItem = styled.div`
        display: flex; align-items: center; padding: 0.75rem;
        border-radius: 0.5rem; &:hover { background-color: #1e293b; }
    `;
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
                <SongItem key={song.spotifyUrl}>
                  <img src={`https://placehold.co/80x80/4f46e5/ffffff?text=${encodeURI(song.title[0])}`} alt={song.title} style={{ width: '3.5rem', height: '3.5rem', borderRadius: '0.25rem', marginRight: '1rem' }} />
                  <div style={{ flexGrow: 1 }}>
                    <p style={{ fontWeight: 600, margin: 0 }}>{song.title}</p>
                    <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: 0 }}>{song.artist}</p>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>{song.album} ({song.releaseDate})</p>
                  </div>
                  {/* Add to my Playlist 버튼 및 드롭다운 */}
                  {user && myPlaylists.length > 0 && (
                    <div style={{ marginRight: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <select value={selectedPlaylist} onChange={e => setSelectedPlaylist(e.target.value)} style={{ padding: '0.3rem', borderRadius: '0.25rem' }}>
                        <option value="">플레이리스트 선택</option>
                        {myPlaylists.map(pl => (
                          <option key={pl.id} value={pl.id}>{pl.name}</option>
                        ))}
                      </select>
                      <Button type="button" style={{ fontSize: '0.875rem', padding: '0.4rem 0.8rem', marginTop: 0 }}
                        onClick={() => selectedPlaylist && handleAddToPlaylist(song, selectedPlaylist)} disabled={addingSongId === song.spotifyUrl}>
                        {addingSongId === song.spotifyUrl ? '추가 중...' : 'Add to my Playlist'}
                      </Button>
                    </div>
                  )}
                  <a href={song.spotifyUrl} target="_blank" rel="noopener noreferrer">
                    <Button style={{ fontSize: '0.875rem', padding: '0.4rem 0.8rem', marginTop: 0 }}>Redirect to Spotify</Button>
                  </a>
                  {/* 곡 추가 결과 메시지 */}
                  {addStatus && addingSongId === song.spotifyUrl && (
                    <span style={{ marginLeft: '1rem', color: '#22c55e', fontWeight: 600 }}>{addStatus}</span>
                  )}
                </SongItem>
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

// --- Spotify Web Playback Player 컴포넌트 ---
/*
const PlayerContainer = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100vw;
  background: #18181b;
  color: #fff;
  box-shadow: 0 -2px 16px rgba(0,0,0,0.15);
  z-index: 100;
  display: flex;
  align-items: center;
  padding: 0.5rem 2rem;
  min-height: 72px;
`;

function Player({ accessToken }) {
  const [player, setPlayer] = useState(null);
  const [isPaused, setIsPaused] = useState(true);
  const [track, setTrack] = useState(null);
  const [volume, setVolume] = useState(0.5);
  const [deviceId, setDeviceId] = useState(null);

  // SDK 스크립트 로드
  useEffect(() => {
    function setupPlayer() {
      if (!accessToken) return;
      const spotifyPlayer = new window.Spotify.Player({
        name: 'MyMusic Web Player',
        getOAuthToken: cb => { cb(accessToken); },
        volume: 0.5,
      });
      setPlayer(spotifyPlayer);
      spotifyPlayer.addListener('ready', ({ device_id }) => {
        setDeviceId(device_id);
      });
      spotifyPlayer.addListener('not_ready', () => {
        setDeviceId(null);
      });
      spotifyPlayer.addListener('player_state_changed', state => {
        setIsPaused(state.paused);
        if (state.track_window && state.track_window.current_track) {
          setTrack(state.track_window.current_track);
        }
      });
      spotifyPlayer.connect();
    }
    if (window.Spotify) {
      setupPlayer();
    } else {
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      document.body.appendChild(script);
      window.onSpotifyWebPlaybackSDKReady = setupPlayer;
    }
  }, [accessToken]);

  // 볼륨 조절
  useEffect(() => {
    if (player) player.setVolume(volume);
  }, [volume, player]);

  // 재생/일시정지 토글
  const handlePlayPause = () => {
    if (player) {
      isPaused ? player.resume() : player.pause();
    }
  };

  if (!accessToken || !player) {
    console.log('No access token or player not initialized');
    return null;
  }

  return (
    <PlayerContainer>
      {track ? (
        <>
          <img src={track.album.images[0]?.url} alt={track.name} style={{width: 56, height: 56, borderRadius: 8, marginRight: 16}} />
          <div style={{flexGrow: 1}}>
            <div style={{fontWeight: 700}}>{track.name}</div>
            <div style={{fontSize: '0.9rem', color: '#a3a3a3'}}>{track.artists.map(a => a.name).join(', ')}</div>
          </div>
        </>
      ) : (
        <div style={{flexGrow: 1, color: '#a3a3a3'}}>재생 중인 곡 없음</div>
      )}
      <button onClick={handlePlayPause} style={{background: 'none', border: 'none', color: '#fff', fontSize: 24, marginRight: 24}}>
        {isPaused ? '▶️' : '⏸️'}
      </button>
      <input type="range" min={0} max={1} step={0.01} value={volume} onChange={e => setVolume(Number(e.target.value))} style={{width: 120}} />
    </PlayerContainer>
  );
}
*/
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
  const [playlists, setPlaylists] = useState([]);
  const [spotifyToken, setSpotifyToken] = useState(null);

  // 로그인 상태 복원: localStorage에 토큰이 있으면 서버에서 사용자 정보 받아오기
  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (token && !user) {
      fetch('testbe1jo.azurewebsites.net/api/auth/me', {
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

  // Spotify access token 백엔드에서 받아오기
  /*
  useEffect(() => {
    if (user) {
      fetch('/api/spotify/token')
        .then(res => res.json())
        .then(data => {
          if (data.accessToken) setSpotifyToken(data.accessToken);
        });
    }
  }, [user]);
*/
  // 플레이리스트 삭제 함수 구현
  const deletePlaylist = async (playlistId) => {
    if (!user?.token) return;
    try {
      const res = await fetch(`testbe1jo.azurewebsites.net/api/playlists/${playlistId}`, {
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
      case 'publicPlaylists': return <PublicPlaylistsPage playlists={playlists} setPage={setPage} setContext={setContext} />;
      case 'myPlaylists': return <MyPlaylistsPage playlists={playlists} user={user} setPage={setPage} setContext={setContext} />;
      case 'playlistDetail': return <PlaylistDetailPage setPage={setPage} context={context} user={user} playlists={playlists} deletePlaylist={deletePlaylist} />;
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
              <NavItem active={['myPlaylists', 'createPlaylist', 'playlistDetail'].includes(page) && page !== 'publicPlaylists'} onClick={() => setPage('myPlaylists')}><PlaylistIcon /><span>내 플레이리스트</span></NavItem>
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
          {user && spotifyToken && <Player accessToken={spotifyToken} />}
        </AppContainer>
      )}
    </>
  );
}