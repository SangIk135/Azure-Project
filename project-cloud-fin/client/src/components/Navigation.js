import styled from 'styled-components';
import { MusicIcon } from './icons/Icons';

const NavContainer = styled.nav`
  width: 16rem;
  background-color: #020617;
  padding: 1.5rem;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #1e293b;
  height: auto;
  box-sizing: border-box;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    box-sizing: border-box;
    border-right: none;
    border-bottom: 1px solid #1e293b;
    height: auto;
  }
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 2.5rem 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-grow: 1;
  overflow-y: auto;

  @media (max-width: 768px) {
    flex-direction: row;
    gap: 0.5rem;
    margin: 0;
    flex-grow: 0;
    overflow-y: visible;
  }
`;

const NavItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  background-color: ${props => props.active ? '#1e293b' : 'transparent'};
  color: ${props => props.active ? '#e2e8f0' : '#94a3b8'};
  font-weight: 500;

  &:hover {
    background-color: #1e293b;
    color: #e2e8f0;
  }

  span {
    @media (max-width: 768px) {
      display: none;
    }
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    display: block;
  }
`;

export { NavContainer, NavList, NavItem, Logo, MusicIcon };
