import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer, Grid, PlaylistItem, Button } from '../styles/StyledComponents';
import { PlaylistIcon, PlusIcon } from '../components/icons/Icons';
import { BASE_URL } from '../utils/config';

function MyPlaylistsPage({ user }) {
  const navigate = useNavigate();
  const [myPlaylists, setMyPlaylists] = useState([]);
  
  useEffect(() => {
  document.title = '내 플레이리스트 | Music Playlist App';
  }, []);

  useEffect(() => {
    if (!user?.token) return;
    fetch(`${BASE_URL}/api/playlists/mine`, {
      headers: { 
        'Authorization': `Bearer ${user.token}`
      }
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
    navigate(`/playlist/${playlistId}`, {
      state: { creatorNickname: user.nickname }
    });
  };

  return (
    <PageContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: '700' }}>내 플레이리스트</h1>
        <Button onClick={() => navigate('/create-playlist')}>
          <PlusIcon /><span>새 플레이리스트</span>
        </Button>
      </div>
      {myPlaylists.length > 0 ? (
        <Grid>
          {myPlaylists.map(playlist => (
            <PlaylistItem key={playlist.id} onClick={() => handlePlaylistClick(playlist.id)}>
              <div className="image-container">
                <img
                  src={playlist.albumImageUrl ? playlist.albumImageUrl : `https://placehold.co/300x300/10b981/ffffff?text=${encodeURI(playlist.name[0])}`}
                  alt={playlist.name}
                />
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
          <Button onClick={() => navigate('/create-playlist')} style={{ marginTop: '1.5rem' }}>
            <PlusIcon /><span>첫 플레이리스트 만들기</span>
          </Button>
        </div>
      )}
    </PageContainer>
  );
}

export default MyPlaylistsPage;
