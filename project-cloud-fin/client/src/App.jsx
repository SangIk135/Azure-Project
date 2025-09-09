import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { GlobalStyle } from './styles/GlobalStyles';
import { AppContainer, MainContent, PageWrapper, Button } from './styles/StyledComponents';
import { NavContainer, NavList, NavItem, Logo, MusicIcon } from './components/Navigation';
import { HomeIcon, GlobeIcon, PlaylistIcon, LogoutIcon } from './components/icons/Icons';
import { BASE_URL } from './utils/config';

// Page components with separated styles
import HomePage from './pages/HomePage';
import PublicPlaylistsPage from './pages/PublicPlaylistsPage';
import MyPlaylistsPage from './pages/MyPlaylistsPage';
import CreatePlaylistPage from './pages/CreatePlaylistPage';
import PlaylistDetailPage from './pages/PlaylistDetailPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import SearchPage from './pages/SearchPage';
import NotFoundPage from './pages/NotFoundPage';
import Header from './components/Header';

// 인증이 필요한 라우트를 위한 컴포넌트
const ProtectedRoute = ({ user, children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user && location.pathname !== '/login') {
      navigate('/login', { 
        replace: true,
        state: { from: location }
      });
    }
  }, [user, location, navigate]);

  return user ? children : null;
};

// 메인 레이아웃 컴포넌트
function Layout({ user, handleLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  if (isAuthPage) {
    return <Outlet />;
  }

  return (
    <AppContainer>
      <NavContainer>
        <Logo>
          <MusicIcon style={{ color: '#818cf8', height: '2rem', width: '2rem' }} />
          <h1>MyMusic</h1>
        </Logo>
        <NavList>
          <NavItem active={location.pathname === '/'} onClick={() => navigate('/')}>
            <HomeIcon /><span>홈</span>
          </NavItem>
          <NavItem active={location.pathname === '/public-playlists'} onClick={() => navigate('/public-playlists')}>
            <GlobeIcon /><span>공개 플레이리스트</span>
          </NavItem>
          <NavItem 
            active={['/my-playlists', '/create-playlist'].includes(location.pathname)}
            onClick={() => navigate('/my-playlists')}
          >
            <PlaylistIcon /><span>내 플레이리스트</span>
          </NavItem>
        </NavList>
        <div style={{ marginTop: 'auto' }}>
          {user ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.5rem',
              background: '#1e293b',
              borderRadius: '0.5rem'
            }}>
              <img
                src={`https://placehold.co/100x100/4f46e5/ffffff?text=${user.nickname[0]}`}
                alt="profile"
                style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%' }}
              />
              <div style={{ flexGrow: 1 }}>
                <p style={{ fontWeight: 600, margin: 0, fontSize: '0.875rem' }}>{user.nickname}</p>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '0.5rem'
                }}
                title="로그아웃"
              >
                <LogoutIcon />
              </button>
            </div>
          ) : (
            <>
              <Button onClick={() => navigate('/login')} fullWidth style={{ marginBottom: '0.5rem' }}>로그인</Button>
              <Button onClick={() => navigate('/signup')} fullWidth>회원가입</Button>
            </>
          )}
        </div>
      </NavContainer>
      <MainContent>
        <Header />
        <PageWrapper>
          <Outlet />
        </PageWrapper>
      </MainContent>
    </AppContainer>
  );
}

// 메인 App 컴포넌트
export default function App() {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // URL에서 검색어 파라미터 처리
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get('search');
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, []);

  // 로그인 상태 복원
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse user data:', e);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // 토큰 유효성 검증
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
          
        } else {
          localStorage.removeItem('jwt_token');
          setUser(null);
        }
      }).catch(() => {
        localStorage.removeItem('jwt_token');
        setUser(null);

      });
    }
  }, []);
    // if (user?.token) {
    //   fetch(`${BASE_URL}/api/auth/mine`, {
    //     headers: {
    //       'Authorization': `Bearer ${user.token}`
    //     }
    //   })
    //   .then(res => {
    //     if (!res.ok) {
    //       localStorage.removeItem('user');
    //       setUser(null);
    //     }
    //   })
    //   .catch(() => {
    //     console.error('Token validation failed');
    //   });
    // }
    // }, [user?.token]);

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const userData = {
          ...data.user,
          token: data.token,
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return true;
      } else {
        throw new Error(data.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const handleSignup = async (userData) => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        return true;
      } else {
        throw new Error(data.message || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <BrowserRouter>
      <GlobalStyle />
      <Routes>
        {/* 로그인 & 회원가입 라우트 */}
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignUpPage onSignup={handleSignup} />} />

        {/* 레이아웃을 포함한 메인 라우트들 */}
        <Route element={<Layout user={user} handleLogout={handleLogout} />}>
          {/* 공개 페이지 */}
          <Route index element={<HomePage user={user} setSearchTerm={setSearchTerm} />} />
          <Route path="/search" element={<SearchPage user={user} searchTerm={searchTerm} />} />
          <Route path="/public-playlists" element={<PublicPlaylistsPage user={user} />} />
          <Route
            path="/playlist/:id"
            element={
              // <ProtectedRoute user={user}>
                <PlaylistDetailPage user={user} />
              // </ProtectedRoute>
            }
          />
          
          {/* 보호된 페이지 */}
          <Route
            path="/my-playlists"
            element={
              <ProtectedRoute user={user}>
                <MyPlaylistsPage user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-playlist"
            element={
              <ProtectedRoute user={user}>
                <CreatePlaylistPage user={user} />
              </ProtectedRoute>
            }
          />

          {/* 404 페이지 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
