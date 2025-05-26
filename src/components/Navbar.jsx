import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';

const Navbar = ({ user, setUser, showAlert }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      showAlert('success', 'Logged out successfully');
      navigate('/login');
    } catch (error) {
      showAlert('error', 'Error logging out');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navStyles = {
    nav: {
      background: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      padding: '0 20px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '70px',
      position: 'relative',
    },
    logo: {
      fontSize: '26px',
      fontWeight: '700',
      textDecoration: 'none',
      color: '#007BFF',
      letterSpacing: '-0.5px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    logoIcon: {
      width: '36px',
      height: '36px',
      backgroundColor: '#007BFF',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '16px',
      fontWeight: 'bold',
      boxShadow: '0 2px 8px rgba(0, 123, 255, 0.3)',
    },
    logoText: {
      color: '#007BFF',
      fontWeight: '700',
    },
    logoTextAccent: {
      color: '#6c757d',
      fontWeight: '500',
    },
    desktopMenu: {
      display: 'flex',
      gap: '30px',
      alignItems: 'center',
    },
    navLink: {
      textDecoration: 'none',
      color: '#555',
      fontWeight: '500',
      fontSize: '15px',
      padding: '8px 12px',
      borderRadius: '6px',
      transition: 'all 0.3s ease',
    },
    navLinkHover: {
      backgroundColor: '#f8f9fa',
      color: '#007BFF',
    },
    userSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginLeft: '20px',
      paddingLeft: '20px',
      borderLeft: '1px solid #e9ecef',
    },
    userName: {
      color: '#333',
      fontSize: '14px',
      fontWeight: '500',
    },
    logoutBtn: {
      padding: '6px 16px',
      fontSize: '14px',
      backgroundColor: '#6c757d',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'all 0.3s ease',
    },
    hamburger: {
      display: 'none',
      flexDirection: 'column',
      cursor: 'pointer',
      padding: '4px',
    },
    hamburgerLine: {
      width: '25px',
      height: '3px',
      backgroundColor: '#333',
      margin: '3px 0',
      transition: '0.3s',
      borderRadius: '2px',
    },
    mobileMenu: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      backgroundColor: '#fff',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      display: isMobileMenuOpen ? 'flex' : 'none',
      flexDirection: 'column',
      padding: '20px',
      gap: '15px',
    },
    mobileNavLink: {
      textDecoration: 'none',
      color: '#555',
      fontWeight: '500',
      fontSize: '16px',
      padding: '12px 0',
      borderBottom: '1px solid #f0f0f0',
    },
    mobileUserSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      paddingTop: '15px',
      borderTop: '1px solid #e9ecef',
    },
  };

  // Media queries using CSS-in-JS approach
  const mediaQueries = `
    @media (max-width: 768px) {
      .desktop-menu { display: none !important; }
      .hamburger { display: flex !important; }
    }
    @media (min-width: 769px) {
      .mobile-menu { display: none !important; }
    }
    .nav-link:hover {
      background-color: #f8f9fa;
      color: #007BFF;
    }
    .logout-btn:hover {
      background-color: #5a6268;
    }
  `;

  return (
    <>
      <style>{mediaQueries}</style>
      <nav style={navStyles.nav}>
        <div style={navStyles.container}>
          {/* Logo */}
          <div>
            <Link to="/dashboard" style={navStyles.logo}>
              <div style={navStyles.logoIcon}>CS</div>
              <span>
                <span style={navStyles.logoText}>C</span>
                <span style={navStyles.logoTextAccent}>scheduler</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div style={navStyles.desktopMenu} className="desktop-menu">
            <Link 
              to="/dashboard" 
              style={navStyles.navLink}
              className="nav-link"
            >
              Dashboard
            </Link>
            <Link 
              to="/analytics" 
              style={navStyles.navLink}
              className="nav-link"
            >
              Analytics
            </Link>
            <Link 
              to="/create-post" 
              style={navStyles.navLink}
              className="nav-link"
            >
              Create Post
            </Link>
            <Link 
              to="/settings" 
              style={navStyles.navLink}
              className="nav-link"
            >
              Settings
            </Link>
            <Link 
              to="/profile" 
              style={navStyles.navLink}
              className="nav-link"
            >
              Profile
            </Link>

            <div style={navStyles.userSection}>
              <span style={navStyles.userName}>Hello, {user.name}</span>
              <button
                onClick={handleLogout}
                style={navStyles.logoutBtn}
                className="logout-btn"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Hamburger */}
          <div 
            style={navStyles.hamburger} 
            className="hamburger"
            onClick={toggleMobileMenu}
          >
            <div style={navStyles.hamburgerLine}></div>
            <div style={navStyles.hamburgerLine}></div>
            <div style={navStyles.hamburgerLine}></div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div style={navStyles.mobileMenu} className="mobile-menu">
          <Link 
            to="/dashboard" 
            style={navStyles.mobileNavLink}
            onClick={closeMobileMenu}
          >
            Dashboard
          </Link>
          <Link 
            to="/create-post" 
            style={navStyles.mobileNavLink}
            onClick={closeMobileMenu}
          >
            Create Post
          </Link>
          <Link 
            to="/settings" 
            style={navStyles.mobileNavLink}
            onClick={closeMobileMenu}
          >
            Settings
          </Link>
          <Link 
            to="/profile" 
            style={navStyles.mobileNavLink}
            onClick={closeMobileMenu}
          >
            Profile
          </Link>

          <div style={navStyles.mobileUserSection}>
            <span style={navStyles.userName}>Hello, {user.name}</span>
            <button
              onClick={handleLogout}
              style={{...navStyles.logoutBtn, width: 'fit-content'}}
              className="logout-btn"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;