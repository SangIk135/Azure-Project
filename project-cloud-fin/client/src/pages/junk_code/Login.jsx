import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../components/Button';
import { ErrorMessage, Form, FormGroup, Input, AuthLink, AuthDivider } from '../components/Form';

const AuthPageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgb(15 23 42);
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 28rem;
  padding: 2rem;
  background: rgb(30 41 59);
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  text-align: center;
`;

const FormTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #fff;
`;

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await onLogin(email, password);
      if (success) {
        navigate('/');
      }
    } catch (error) {
      setError(error.message || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageContainer>
      <FormContainer>
        <FormTitle>나의 Playlist에 로그인하기</FormTitle>
        <AuthDivider />
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <label htmlFor="email">이메일</label>
            <Input
              auth
              type="email"
              id="email"
              placeholder="이메일"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="password">비밀번호</label>
            <Input
              auth
              type="password"
              id="password"
              placeholder="비밀번호"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </FormGroup>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? '로그인 중...' : '로그인하기'}
          </Button>
          <Button type="button" fullWidth onClick={() => navigate('/')} disabled={loading}>
            방문자로 이용하기
          </Button>
        </Form>
        <AuthDivider />
        <div>
          <span>계정이 없나요? </span>
          <AuthLink onClick={() => navigate('/signup')}>나의 Playlist에 가입하기</AuthLink>
        </div>
      </FormContainer>
    </AuthPageContainer>
  );
}
