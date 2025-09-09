import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/config';
import { PlaylistIcon } from '../components/icons/Icons';

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

export default function PublicPlaylists() {
  const navigate = useNavigate();
  const [publicPlaylists, setPublicPlaylists] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/api/playlists/public`)
      .then(res => res.json())
      .then(data => {
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

  const handlePlaylistClick = (playlist) => {
    navigate(`/playlist/${playlist.id}`);
  };

  return (
    <PageContainer>
      <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '2rem' }}>공개 플레이리스트</h1>
      {publicPlaylists.length > 0 ? (
        <Grid>
          {publicPlaylists.map(playlist => (
            <PlaylistItem key={playlist.id} onClick={() => handlePlaylistClick(playlist)}> 
              <div className="image-container">
                <img 
                  src={playlist.albumImageUrl || `https://placehold.co/300x300/10b981/ffffff?text=${encodeURI(playlist.name[0])}`} 
                  alt={playlist.name} 
                />
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
