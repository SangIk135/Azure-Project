import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // useLocation
import YouTube from 'react-youtube';
import styled from 'styled-components';
import {
  PageContainer,
  Button,
  Input,
  ErrorMessage
} from '../styles/StyledComponents';
import {
  PlayIcon,
  PlusIcon,
  ShareIcon,
  EditIcon,
  TrashIcon
} from '../components/icons/Icons';
import { BASE_URL } from '../utils/config';

export default function PlaylistDetailPage({ user }) {
    //   const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editPublic, setEditPublic] = useState(false);
  const [error, setError] = useState('');
  const [youtubePlayer, setYoutubePlayer] = useState({
    isOpen: false,
    loading: false,
    currentIndex: 0,
    videoIds: []
  });

  useEffect(() => {
    if (!id) return;
    fetch(`${BASE_URL}/api/playlists/${id}`)
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
  }, [id]);

  const handleFacebookShare = async () => {
    if (!id) return;

    try {
      const response = await fetch(`${BASE_URL}/api/share/playlist/${id}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '공유 정보를 가져올 수 없습니다.');
      }
      const shareData = await response.json();
      //   console.log("공유 데이터:", shareData);
      const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`;
      window.open(facebookShareUrl, '_blank', 'width=600,height=400');
    } catch (error) {
      console.error("페이스북 공유 실패:", error);
      alert(`공유에 실패했습니다: ${error.message}`);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`'${playlist.name}' 플레이리스트를 정말 삭제하시겠습니까?`)) return;

    try {
      const res = await fetch(`${BASE_URL}/api/playlists/${playlist.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      if (res.ok) {
        navigate('/my-playlists');
      } else {
        const data = await res.json();
        alert(data.message || '플레이리스트 삭제 실패');
      }
    } catch {
      alert('플레이리스트 삭제 중 오류가 발생했습니다.');
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
        setPlaylist(prev => ({
          ...prev,
          songs: prev.songs.filter(s => s.id !== songId)
        }));
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
    display: flex;
    align-items: center;
    padding: 0.75rem;
    border-radius: 0.5rem;
    position: relative;
    &:hover { background-color: #1e293b; }
    .delete-btn {
      opacity: 0;
      position: absolute;
      right: 1rem;
      transition: opacity 0.2s;
    }
    &:hover .delete-btn { opacity: 1; }
  `;

  if (!playlist) {
    return <PageContainer><p>플레이리스트를 찾을 수 없습니다.</p></PageContainer>;
  }

  const isOwner = user?.nickname === playlist.creatorNickname;

  if (editMode) {
    return (
      <PageContainer>
        <Helmet>
          <title>플레이리스트 수정 | Music Playlist App</title>
          <link rel="icon" type="image/png" href="/favicon.png" />
        </Helmet>
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
              <input
                type="checkbox"
                checked={editPublic}
                onChange={e => setEditPublic(e.target.checked)}
              /> 공개
            </label>
          </div>
          <Button type="submit">저장</Button>
          <Button type="button" secondary onClick={() => setEditMode(false)} style={{ marginLeft: '1rem' }}>
            취소
          </Button>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </form>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Helmet>
        <title>{playlist.name ? `${playlist.name} 플레이리스트 상세 | Music Playlist App` : `플레이리스트 상세 | Music Playlist App`}</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Helmet>
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', alignItems: 'flex-end' }}>
        <img
          src={playlist.songs?.[0]?.albumImageUrl ? playlist.songs[0].albumImageUrl : `https://placehold.co/300x300/10b981/ffffff?text=${encodeURI(playlist.name[0])}`}
          alt={playlist.name}
          style={{
            width: '12rem',
            height: '12rem',
            borderRadius: '0.5rem',
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
          }}
        />
        <div>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>플레이리스트</p>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{playlist.name}</h1>
          <p style={{ color: '#94a3b8', marginTop: '1rem' }}>
            <span>{playlist.description}</span>
          </p>
          <p style={{ color: '#94a3b8', marginTop: '1rem' }}>
            <span>by {playlist.creatorNickname}</span>
            <span style={{ margin: '0 0.5rem' }}>•</span>
            <span>{playlist.songs.length}곡</span>
            <span>
              <input
                type="checkbox"
                checked={playlist.isPublic}
                readOnly
                style={{ marginLeft: '1rem', width: '1rem', height: '1rem' }}
              />
              공개 플레이리스트 설정여부
            </span>
          </p>
        </div>
      </div>
      {isOwner ? (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <Button onClick={handlePlayYoutube}><PlayIcon /> 재생하기</Button>
          <Button onClick={() => navigate('/search')}><PlusIcon /> 곡 추가하기</Button>
          <Button onClick={handleFacebookShare}><ShareIcon /> 공유하기</Button>
          <Button onClick={() => setEditMode(true)}><EditIcon />정보 수정</Button>
          <Button danger onClick={handleDelete}><TrashIcon /> 삭제하기</Button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <Button onClick={handlePlayYoutube}><PlayIcon /> 재생하기</Button>
        </div>
      )}

      {youtubePlayer.isOpen && (
        <YoutubePlayerWrapper>
          <div style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', alignSelf: 'flex-start' }}>
            {playlist.songs[youtubePlayer.currentIndex]?.title} - {playlist.songs[youtubePlayer.currentIndex]?.artist}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
            <Button
              type="button"
              secondary
              style={{ fontSize: '0.8rem', padding: '0.2rem 0.7rem' }}
              onClick={() => setYoutubePlayer(prev => ({
                ...prev,
                currentIndex: Math.max(0, prev.currentIndex - 1)
              }))}
              disabled={youtubePlayer.currentIndex === 0}
            >
              이전곡
            </Button>
            <Button
              type="button"
              secondary
              style={{ fontSize: '0.8rem', padding: '0.2rem 0.7rem' }}
              onClick={() => setYoutubePlayer(prev => ({
                ...prev,
                currentIndex: Math.min(playlist.songs.length - 1, prev.currentIndex + 1)
              }))}
              disabled={youtubePlayer.currentIndex >= playlist.songs.length - 1}
            >
              다음곡
            </Button>
            <Button
              type="button"
              secondary
              style={{ fontSize: '0.8rem', padding: '0.2rem 0.7rem' }}
              onClick={() => setYoutubePlayer({ ...youtubePlayer, isOpen: false })}
            >
              닫기
            </Button>
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
              <Button
                type="button"
                danger
                className="delete-btn"
                onClick={() => handleSongDelete(song.id)}
              >
                <TrashIcon />
              </Button>
            )}
          </SongItem>
        ))}
      </div>
    </PageContainer>
  );
}
