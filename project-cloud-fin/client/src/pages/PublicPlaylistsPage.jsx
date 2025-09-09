import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer, Grid, PlaylistItem } from '../styles/StyledComponents';
import { PlaylistIcon } from '../components/icons/Icons';
import { BASE_URL } from '../utils/config';

function PublicPlaylistsPage() {
  const navigate = useNavigate();
  const [publicPlaylists, setPublicPlaylists] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/api/playlists/public`)
      .then(res => res.json())
      .then(data => {
        console.log("Public PlayListData: ", data);
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
    navigate(`/playlist/${playlist.id}`, {
      state: { playlistId: playlist.id, creatorNickname: playlist.creatorNickname }
    });
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
                  src={playlist.albumImageUrl ? playlist.albumImageUrl : `https://placehold.co/300x300/10b981/ffffff?text=${encodeURI(playlist.name[0])}`}
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

export default PublicPlaylistsPage;
