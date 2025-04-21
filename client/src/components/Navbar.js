import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 2.5rem;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'San Francisco', 'Helvetica Neue', sans-serif;
  font-weight: bold;
  color: #2563eb;
  text-decoration: none;
  margin-left: -1rem;
  letter-spacing: -0.02em;
  transition: color 0.2s ease;
  
  &:hover {
    color: #1d4ed8;
  }
`;

const NavList = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(8px);
    padding: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    gap: 1rem;
    transform: ${({ isOpen }) => (isOpen ? 'translateY(0)' : 'translateY(-10px)')};
    opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
  }
`;

const NavItem = styled(Link)`
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  color: ${({ active }) => (active ? '#2563eb' : '#4b5563')};
  font-weight: ${({ active }) => (active ? '600' : '500')};
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  background: ${({ active }) => (active ? 'rgba(239, 246, 255, 0.8)' : 'transparent')};
  backdrop-filter: ${({ active }) => (active ? 'blur(4px)' : 'none')};
  
  &:hover {
    background: rgba(243, 244, 246, 0.8);
    backdrop-filter: blur(4px);
    color: #2563eb;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: ${({ active }) => (active ? '100%' : '0')};
    height: 2px;
    background-color: #2563eb;
    transform: translateX(-50%);
    transition: width 0.2s ease;
  }

  &:hover::after {
    width: 100%;
  }

  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
    
    &::after {
      bottom: -4px;
    }
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('nav')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Nav>
      <NavContainer>
        <Logo to="/" onClick={() => setIsOpen(false)}>Droplet</Logo>
        <MenuButton 
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          aria-label="Toggle menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6H20M4 12H20M4 18H20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </MenuButton>
        <NavList isOpen={isOpen}>
          <NavItem 
            to="/" 
            active={isActive('/')}
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </NavItem>
          <NavItem 
            to="/history" 
            active={isActive('/history')}
            onClick={() => setIsOpen(false)}
          >
            History
          </NavItem>
          <NavItem 
            to="/about" 
            active={isActive('/about')}
            onClick={() => setIsOpen(false)}
          >
            About
          </NavItem>
        </NavList>
      </NavContainer>
    </Nav>
  );
};

export default Navbar; 