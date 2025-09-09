import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { 
    NotFoundContainer,
    NotFoundTitle,
    NotFoundSubtitle,
    NotFoundDescription
} from '../styles/StyledComponents';


export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <NotFoundContainer>
      <NotFoundTitle>404</NotFoundTitle>
      <NotFoundSubtitle>페이지를 찾을 수 없습니다</NotFoundSubtitle>
      <NotFoundDescription>
        요청하신 페이지가 삭제되었거나 잘못된 URL을 입력하셨을 수 있습니다.
      </NotFoundDescription>
      <Button onClick={() => navigate('/')}>홈으로 돌아가기</Button>
    </NotFoundContainer>
  );
}
