import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BASE_URL } from '../utils/config';
import { Button } from '../components/Button';

const PageContainer = styled.div`
  padding: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 1.5rem;
`;

const PlaylistItem = styled.div`
  cursor: pointer;
  .image-container {
    position: relative;
    padding-top: 100%;
    margin-bottom: 0.75rem;
    
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 0.5rem;
      transition: opacity 0.2s;
    }
    
    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s;
      border-radius: 0.5rem;
      
      h3 {
        color: white;
        text-align: center;
        padding: 1rem;
        font-size: 1rem;
      }
    }
    
    &:hover {
      .overlay {
        opacity: 1;
      }
      img {
        opacity: 0.8;
      }
    }
  }
  
  p {
    margin: 0;
    font-size: 0.875rem;
  }
`;

export default function Home({ user }) {
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

  return (
    <PageContainer>
      <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem' }}>
        안녕하세요, {user ? user.nickname : '방문자'}님!
      </h1>
      <p style={{ color: '#94a3b8', marginBottom: '2.5rem' }}>
        좌측 공개 플레이리스트에서 다른 사용자들의 플레이리스트를 둘러보세요.
      </p>
      {loading ? (
        <p style={{ color: '#94a3b8' }}>랜덤 앨범을 불러오는 중...</p>
      ) : (
        <Grid>
          {albums.map(album => (
            <PlaylistItem key={album.id}>
              <div className="image-container">
                <img 
                  src={album.imageUrl || `https://placehold.co/300x300/10b981/ffffff?text=${encodeURI(album.name[0])}`} 
                  alt={album.name} 
                />
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
