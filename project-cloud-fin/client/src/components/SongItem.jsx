import React, { useState } from 'react';
import { Button } from '../styles/StyledComponents';
import styled from 'styled-components';

const SongItemLayout = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: 0.5rem;
  &:hover { background-color: #1e293b; }
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
          <select
            value={selectedPlaylist}
            onChange={e => setSelectedPlaylist(e.target.value)}
            style={{ padding: '0.3rem', borderRadius: '0.25rem' }}
          >
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
        <Button style={{ fontSize: '0.875rem', padding: '0.4rem 0.8rem', marginTop: 0 }}>
          Redirect to Spotify
        </Button>
      </a>
      {addStatus && (
        <span style={{
          marginLeft: '1rem',
          color: addStatus.includes('성공') || addStatus.includes('추가') ? '#22c55e' : '#ef4444',
          fontWeight: 600
        }}>
          {addStatus}
        </span>
      )}
    </SongItemLayout>
  );
}

export default SongItem;
