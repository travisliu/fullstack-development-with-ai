import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = (event) => {
    event.preventDefault();
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      {/* Left navbar links */}
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars"></i></a>
        </li>
      </ul>

      {/* Right navbar links */}
      <ul className="navbar-nav ml-auto">
        {/* User Account Dropdown Menu */}
        <li className="nav-item dropdown">
          <a href="#" className="nav-link" onClick={toggleDropdown}>
            <i className="far fa-user"></i> { user?.username }
          </a>
          <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''} dropdown-menu-right`}>
            <span className="dropdown-item dropdown-header">{user?.role}</span>
            <div className="dropdown-divider"></div>
            <a href="#" className="dropdown-item" onClick={logout}>
              <i className="fas fa-sign-out-alt mr-2"></i> Logout
            </a >
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
