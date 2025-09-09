import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { ErrorMessage, Form, FormGroup, Input } from '../components/Form';
import { BASE_URL } from '../utils/config';

const PageContainer = styled.div`
  padding: 2rem;
`;

export default function CreatePlaylist({ user }) {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const handleCreate = async (e) => {
    e.preventDefault();
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

      if (res.ok) {
        navigate('/my-playlists');
      } else {
        const data = await res.json();
        setError(data.message || '플레이리스트 생성 실패');
      }
    } catch {
      setError('플레이리스트 생성 중 오류가 발생했습니다.');
    }
  };

  return (
    <PageContainer>
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
              checked={isPublic} 
              onChange={(e) => setIsPublic(e.target.checked)} 
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
