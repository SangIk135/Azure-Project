import styled from 'styled-components';

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

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.25rem;
  background-color: #121212;
  border: 1px solid #878787;
  color: #ffffff;
  box-sizing: border-box;
  font-size: 1rem;

  &::placeholder {
    color: #a0aec0;
  }

  &:focus {
    outline: none;
    border-color: ${props => props.auth ? '#ffffff' : '#4f46e5'};
    box-shadow: ${props => props.auth ? '0 0 0 1px #ffffff' : 'none'};
  }
`;

export const ErrorMessage = styled.p`
  color: #f87171;
  font-size: 0.875rem;
  height: 1.25rem;
  text-align: center;
  margin-bottom: 1rem;
  margin-top: 0;
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
  
  &:hover {
    color: #1DB954;
  }
`;
