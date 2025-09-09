import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AuthPageContainer,
  FormContainer,
  FormTitle,
  AuthDivider,
  Form,
  FormGroup,
  Input,
  ErrorMessage,
  Button,
  AuthLink
} from '../styles/StyledComponents';
import { BASE_URL } from '../utils/config';

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = '로그인 | Music Playlist App';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await onLogin(email, password);
      if (success) {
        navigate('/');
      }
    } catch (error) {
      setError(error.message || '아이디 또는 비밀번호가 올바르지 않습니다.');
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
              type="text"
              id="email"
              placeholder="이메일"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            />
          </FormGroup>
          <ErrorMessage>{error}</ErrorMessage>
          <Button type="primary" fullWidth>로그인하기</Button>
          <Button type="primary" fullWidth onClick={() => navigate('/')}>방문자로 이용하기</Button>
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

export default LoginPage;
