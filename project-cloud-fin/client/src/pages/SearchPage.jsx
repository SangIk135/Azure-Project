import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid, PageContainer } from '../styles/StyledComponents';
import SongItem from '../components/SongItem';
import { BASE_URL } from '../utils/config';

function SearchPage({ user }) {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [myPlaylists, setMyPlaylists] = useState([]);

  React.useEffect(() => {
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

  React.useEffect(() => {
    if (searchQuery) {
      setLoading(true);
      setError('');
      fetch(`${BASE_URL}/api/songs/search?q=${encodeURIComponent(searchQuery)}`)
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
              albumImageUrl: item.albumImageUrl,
            })));
            // console.log("search results:", data.items);
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
  }, [searchQuery]);

  return (
    <PageContainer>
      <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '1.5rem' }}>
        {searchQuery || ''} 검색 결과
      </h1>
      {loading ? (
        <p style={{ color: '#94a3b8' }}>검색 중...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {searchQuery ? (
            results.length > 0 ? (
              results.map((song) => (
                <SongItem
                  key={song.spotifyUrl}
                  song={song}
                  user={user}
                  myPlaylists={myPlaylists}
                  BASE_URL={BASE_URL}
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

export default SearchPage;
