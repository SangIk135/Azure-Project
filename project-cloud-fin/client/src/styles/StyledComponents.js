import styled from 'styled-components';

export const AuthPageContainer = styled.div` 
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem;
  background-color: #000; 
`;

export const PageContainer = styled.div` 
  padding: 2.5rem;
  @media (max-width: 768px) {
    padding: 1.5rem;
  } 
`;

export const Button = styled.button` 
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  padding: 0.75rem 1rem;
  margin-top: ${props => props.noMarginTop ? '0' : '1rem'};
  border: none;
  border-radius: ${props => (props.type === 'primary' ? '9999px' : '0.5rem')};
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
  background-color: ${props => {
    if (props.type === 'primary') return '#1DB954';
    if (props.danger) return '#dc2626';
    if (props.secondary) return '#334155';
    return '#4f46e5';
  }};
  color: ${props => (props.type === 'primary' ? '#000000' : '#ffffff')};
  &:hover { 
    transform: ${props => (props.type === 'primary' ? 'scale(1.05)' : 'none')};
    background-color: ${props => {
      if (props.danger) return '#b91c1c';
      if (props.secondary) return '#475569';
      if (props.type !== 'primary') return '#4338ca';
    }};
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.25rem;
  background-color: #121212;
  border: 1px solid #878787;
  color: #ffffff;
  box-sizing: border-box;
  font-size: 1rem;
  &::placeholder { color: #a0aec0; }
  &:focus { 
    outline: none; 
    border-color: ${props => props.auth ? '#ffffff' : '#4f46e5'};
    box-shadow: ${props => props.auth ? '0 0 0 1px #ffffff' : 'none'};
  }
`;

export const FormContainer = styled.div`
  width: 100%;
  max-width: 480px;
  background-color: #121212;
  padding: 2rem;
  border-radius: 0.5rem;
  text-align: center;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FormGroup = styled.div`
  margin-bottom: 1rem;
  text-align: left;
  label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
`;

export const FormTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
`;

export const ErrorMessage = styled.p`
  color: #f87171;
  font-size: 0.875rem;
  height: 1.25rem;
  text-align: center;
  margin-bottom: 1rem;
  margin-top: 0;
`;

export const Grid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: 2.5rem;
  margin-bottom: 1.5rem;
`;

export const HorizontalScrollContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  padding-bottom: 1rem;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const SearchButton = styled.button`
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const AuthDivider = styled.div`
  width: 100%;
  border-top: 1px solid #2a2a2a;
  margin: 2rem 0;
`;

export const AuthLink = styled.a`
  color: #ffffff;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.2s;
  &:hover { color: #1DB954; }
`;

export const PlaylistItem = styled.div`
  cursor: pointer;
  .image-container {
    aspect-ratio: 1 / 1;
    background-color: #1e293b;
    border-radius: 0.5rem;
    overflow: hidden;
    position: relative;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
    transition: transform 0.3s;
    &:hover { transform: scale(1.05); }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .overlay {
      position: absolute;
      inset: 0;
      background-color: rgba(0,0,0,0.4);
      display: flex;
      align-items: flex-end;
      padding: 1rem;
    }
    h3 {
      color: white;
      font-size: 1.125rem;
      font-weight: 700;
      margin: 0;
    }
  }
  p {
    color: #94a3b8;
    margin-top: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
  }
`;

export const ArtistCard = styled.div`
  text-align: center;
  cursor: pointer;
  flex-shrink: 0;
  img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 1rem;
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.2);
    transition: transform 0.3s;
  }
  &:hover img {
    transform: scale(1.05);
  }
  p {
    font-weight: 600;
    margin: 0.5rem 0 0.25rem 0;
  }
  span {
    font-size: 0.875rem;
    color: #94a3b8;
  }
`;

export const SongItemContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: 0.5rem;
  &:hover {
    background-color: #1e293b;
  }
`;

export const SongItemImage = styled.img`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 0.25rem;
  margin-right: 1rem;
`;

export const SongItemInfo = styled.div`
  flex-grow: 1;
  p {
    margin: 0;
    &:first-child {
      font-weight: 600;
    }
    &:nth-child(2) {
      font-size: 0.875rem;
      color: #94a3b8;
    }
    &:last-child {
      font-size: 0.75rem;
      color: #64748b;
    }
  }
`;

export const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const MainContent = styled.main`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

export const PageWrapper = styled.div`
  flex-grow: 1;
  overflow-y: auto;
`;

export const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
`;

export const NotFoundTitle = styled.h1`
  font-size: 7rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #818cf8;
`;

export const NotFoundSubtitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: #94a3b8;
`;

export const NotFoundDescription = styled.p`
  font-size: 1rem;
  color: #64748b;
  margin-bottom: 2rem;
  max-width: 24rem;
`;