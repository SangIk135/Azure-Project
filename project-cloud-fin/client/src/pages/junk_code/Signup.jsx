import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../components/Button';
import { ErrorMessage, Form, FormGroup, Input, AuthLink } from '../components/Form';

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
  margin-bottom: 0.5rem;
  color: #fff;
`;

export default function Signup({ onSignup }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await onSignup({ email, password, nickname });
      if (success) {
        alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
        navigate('/login');
      }
    } catch (error) {
      setError(error.message || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageContainer>
      <FormContainer>
        <FormTitle>회원가입</FormTitle>
        <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>몇 가지 정보만 입력하면 완료!</p>
        <Form onSubmit={handleSignUp}>
          <FormGroup>
            <label>이메일</label>
            <Input 
              auth
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
            />
          </FormGroup>
          <FormGroup>
            <label>아이디(닉네임)</label>
            <Input
              auth
              type="text"
              required
              placeholder="사용할 닉네임"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              disabled={loading}
            />
          </FormGroup>
          <FormGroup>
            <label>비밀번호</label>
            <Input
              auth
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
            />
          </FormGroup>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button type="submit" secondary fullWidth disabled={loading}>
            {loading ? '가입 중...' : '가입하기'}
          </Button>
        </Form>
        <p style={{ marginTop: '2rem' }}>
          이미 계정이 있으신가요?
          <AuthLink onClick={() => navigate('/login')}> 로그인</AuthLink>
        </p>
      </FormContainer>
    </AuthPageContainer>
  );
}
