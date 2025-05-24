
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { login } from '../services/authService';

const Login = ({ setUser, showAlert }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        setUser(result.user);
        showAlert('success', 'Login successful!');
      } else {
        showAlert('error', result.error || 'Login failed');
      }
    } catch (error) {
      showAlert('error', 'An error occurred during login');
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="form-container">
      <h2 className="text-center mb-20">Login</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          style={{ width: '100%' }}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="text-center mt-20">
        <p>Don't have an account? <Link to="/register">Register here</Link></p>
        <p style={{ fontSize: '14px', color: '#666', marginTop: '20px' }}>
          Demo credentials: john@example.com / password
        </p>
      </div>
    </div>
  );
};

export default Login;
