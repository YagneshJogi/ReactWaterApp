import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  return (
    <div className="navbar bg-base-100 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex-1">
          <Link to="/" className="flex items-center gap-2 text-xl">
            <img src="/logo.svg" alt="Water Quality Monitor" className="h-10 w-auto" />
            <span className="font-semibold text-primary">Droplet</span>
          </Link>
        </div>
        
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link 
                to="/" 
                className={location.pathname === '/' ? 'active' : ''}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/history"
                className={location.pathname === '/history' ? 'active' : ''}
              >
                History
              </Link>
            </li>
            <li>
              <Link 
                to="/about"
                className={location.pathname === '/about' ? 'active' : ''}
              >
                About
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar; 