import styled from 'styled-components';

const Button = styled.button`
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
      return '#1DB954';
    }};
  }
`;

export { Button };
