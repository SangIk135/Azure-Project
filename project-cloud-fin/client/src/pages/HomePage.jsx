import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PageContainer, Grid, PlaylistItem, SectionTitle } from '../styles/StyledComponents';
import { BASE_URL } from '../utils/config';
import { MusicIcon } from '../components/Navigation';

function HomePage({ user }) {
  const navigate = useNavigate();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${BASE_URL}/api/playlists/new-releases`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.albums)) {
          setAlbums(data.albums);
        } else {
          setAlbums([]);
        }
      })
      .catch(() => setAlbums([]))
      .finally(() => setLoading(false));
  }, []);

  const handleAlbumClick = (album) => {
    const searchQuery = `${album.name} ${album.artist}`;
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <PageContainer>
      <Helmet>
        <title>홈 | Music Playlist App</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Helmet>
      <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem' }}>
        안녕하세요, {user ? user.nickname : '방문자'}님!
      </h1>
      <p style={{ color: '#94a3b8', marginBottom: '2.5rem' }}>
        좌측 공개 플레이리스트에서 다른 사용자들의 플레이리스트를 둘러보세요.
      </p>
      <SectionTitle>랜덤 앨범</SectionTitle>
      {loading ? (
        <p style={{ color: '#94a3b8' }}>랜덤 앨범을 불러오는 중...</p>
      ) : (
        <Grid>
          {albums.map(album => (
            <PlaylistItem key={album.id} onClick={() => handleAlbumClick(album)}>
              <div className="image-container">
                <img src={album.imageUrl || `https://placehold.co/300x300/10b981/ffffff?text=${encodeURI(album.name[0])}`} alt={album.name} />
                <div className="overlay"><h3>{album.name}</h3></div>
              </div>
              <p>{album.artist} <span style={{ color: '#64748b', fontSize: '0.85em' }}>({album.releaseDate})</span></p>
            </PlaylistItem>
          ))}
        </Grid>
      )}
    </PageContainer>
  );
}

export default HomePage;
