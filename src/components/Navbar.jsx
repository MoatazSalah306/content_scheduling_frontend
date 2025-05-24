
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';

const Navbar = ({ user, setUser, showAlert }) => {
  const navigate = useNavigate();

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

  return (
    <nav style={{ background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '0 20px' }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        height: '60px'
      }}>
        <div>
          <Link to="/dashboard" style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            textDecoration: 'none', 
            color: '#333' 
          }}>
            Content Scheduler
          </Link>
        </div>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link to="/dashboard" style={{ textDecoration: 'none', color: '#333' }}>
            Dashboard
          </Link>
          <Link to="/create-post" style={{ textDecoration: 'none', color: '#333' }}>
            Create Post
          </Link>
          <Link to="/settings" style={{ textDecoration: 'none', color: '#333' }}>
            Settings
          </Link>
          <Link to="/profile" style={{ textDecoration: 'none', color: '#333' }}>
            Profile
          </Link>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>Hello, {user.name}</span>
            <button 
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{ padding: '5px 15px', fontSize: '14px' }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
