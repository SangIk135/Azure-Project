import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer, Form, FormGroup, Input, Button, ErrorMessage } from '../styles/StyledComponents';
import { BASE_URL } from '../utils/config';

function CreatePlaylistPage({ user }) {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isChecked, setIsChecked] = useState(true);

  useEffect(() => {
  document.title = '새 플레이리스트 만들기 | Music Playlist App';
  }, []);

  const handleOnChange = () => {
    setIsChecked(!isChecked);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    
    const formData = new FormData(e.target);
    const newPlaylistData = {
      name: formData.get('name'),
      description: formData.get('description'),
      is_public: formData.get('is_public') === 'on',
    };

    try {
      const res = await fetch(`${BASE_URL}/api/playlists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(newPlaylistData)
      });
      
      const data = await res.json();
      
      if (data.success) {
        navigate('/my-playlists', { replace: true });
        return;
      } else {
        throw new Error(data.message || '플레이리스트 생성 실패');
      }
    } catch (error) {
      setError('플레이리스트 생성 중 오류가 발생했습니다.');
      console.error('Error creating playlist:', error);
    }
  };

  return (
    <PageContainer>
      <link rel="icon" type="image/png" href="/favicon.png" />
      <title>새 플레이리스트 만들기 | Music Playlist App</title>
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
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleOnChange}
              id="is_public"
              name="is_public"
              style={{ width: '1rem', height: '1rem' }}
            />
            <label htmlFor="is_public">공개 플레이리스트로 설정</label>
          </div>
        </FormGroup>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Button type="submit" noMarginTop>만들기</Button>
          <Button type="button" secondary onClick={() => navigate('/my-playlists')} noMarginTop>취소</Button>
        </div>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Form>
    </PageContainer>
  );
}

export default CreatePlaylistPage;
