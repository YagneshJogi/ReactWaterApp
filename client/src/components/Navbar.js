import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  background-color: ${props => props.theme.colors.surface};
  padding: ${props => props.theme.spacing.md};
  box-shadow: ${props => props.theme.shadows.md};
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const NavContainer = styled.div`
  max-width: ${props => props.theme.breakpoints.wide};
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LogoContainer = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  gap: ${props => props.theme.spacing.sm};
`;

const LogoImage = styled.img`
  height: 40px;
  width: auto;
`;

const LogoText = styled.div`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.typography.h3.fontSize};
  font-weight: 600;
`;

const NavList = styled.ul`
  list-style: none;
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  margin: 0;
  padding: 0;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: ${props => props.theme.colors.surface};
    padding: ${props => props.theme.spacing.md};
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const NavItem = styled.li`
  a {
    color: ${props => props.theme.colors.text.primary};
    text-decoration: none;
    font-weight: 500;
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
    border-radius: ${props => props.theme.borderRadius.sm};
    transition: all 0.2s;
    display: block;

    &:hover {
      background-color: ${props => props.theme.colors.background};
      color: ${props => props.theme.colors.primary};
    }

    &.active {
      background-color: ${props => props.theme.colors.primary};
      color: ${props => props.theme.colors.text.light};
    }
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  font-size: 1.5rem;
  cursor: pointer;
  padding: ${props => props.theme.spacing.sm};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: block;
  }
`;

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Nav>
      <NavContainer>
        <LogoContainer to="/">
          <LogoImage src="/logo.svg" alt="Water Quality Monitor" />
          <LogoText>Droplet</LogoText>
        </LogoContainer>
        <MenuButton onClick={toggleMenu}>
          {isOpen ? '✕' : '☰'}
        </MenuButton>
        <NavList isOpen={isOpen}>
          <NavItem>
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''}
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
          </NavItem>
          <NavItem>
            <Link 
              to="/history"
              className={location.pathname === '/history' ? 'active' : ''}
              onClick={() => setIsOpen(false)}
            >
              History
            </Link>
          </NavItem>
          <NavItem>
            <Link 
              to="/about"
              className={location.pathname === '/about' ? 'active' : ''}
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
          </NavItem>
        </NavList>
      </NavContainer>
    </Nav>
  );
}

export default Navbar; 