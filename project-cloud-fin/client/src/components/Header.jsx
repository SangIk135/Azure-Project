import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { SearchIcon } from './icons/Icons';

const HeaderContainer = styled.header`
  padding: 1rem 2rem;
  border-bottom: 1px solid #1e293b;
`;

const SearchFormContainer = styled.form`
  max-width: 600px;
  margin: 0 auto;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  background-color: #1e293b;
  border: 1px solid transparent;
  border-radius: 0.5rem;
  color: #fff;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #818cf8;
    box-shadow: 0 0 0 1px #818cf8;
  }

  &::placeholder {
    color: #64748b;
  }
`;

const SearchButton = styled.button`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 0;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
`;

export default function Header() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const searchValue = inputValue.trim();
    navigate(`/search?q=${encodeURIComponent(searchValue)}`);
    setInputValue('');
  };

  return (
    <HeaderContainer>
      <SearchFormContainer onSubmit={handleSearch}>
        <SearchButton type="submit">
          <SearchIcon style={{ width: '1.25rem', height: '1.25rem' }} />
        </SearchButton>
        <SearchInput
          type="text"
          placeholder="노래, 앨범, 아티스트 검색"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </SearchFormContainer>
    </HeaderContainer>
  );
}
