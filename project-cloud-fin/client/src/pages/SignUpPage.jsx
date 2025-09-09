import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AuthPageContainer,
  FormContainer,
  FormTitle,
  Form,
  FormGroup,
  Input,
  ErrorMessage,
  Button,
  AuthLink
} from '../styles/StyledComponents';
import { BASE_URL } from '../utils/config';

function SignUpPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
  document.title = '회원가입 | Music Playlist App';
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, nickname })
      });
      const data = await res.json();
      if (res.ok) {
        alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
        navigate('/login');
      } else {
        setError(data.message || '회원가입 실패');
      }
    } catch {
      setError('회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <AuthPageContainer>
      <FormContainer>
        <FormTitle>회원가입</FormTitle>
        <p>몇 가지 정보만 입력하면 완료!</p>
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
            />
          </FormGroup>
          <ErrorMessage>{error}</ErrorMessage>
          <Button secondary fullWidth type="submit">가입하기</Button>
        </Form>
        <p style={{ marginTop: '2rem' }}>
          이미 계정이 있으신가요?
          <AuthLink onClick={() => navigate('/login')}> 로그인</AuthLink>
        </p>
      </FormContainer>
    </AuthPageContainer>
  );
}

export default SignUpPage;
