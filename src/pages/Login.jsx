import React, { useState } from 'react';
import { login } from '../services/authService';
import { AuthForm } from '../components/AuthForm';

const Login = ({ setUser, showAlert }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="col-md-6 col-lg-4">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <Link to="/" style={{ 
            fontSize: '26px', 
            fontWeight: '700', 
            textDecoration: 'none', 
            color: '#007BFF', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px' 
          }}>
            <div style={{
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
              boxShadow: '0 2px 8px rgba(0, 123, 255, 0.3)'
            }}>
              CS
            </div>
            <span>
              <span style={{ color: '#007BFF', fontWeight: '700' }}>C</span>
              <span style={{ color: '#6c757d', fontWeight: '500' }}>scheduler</span>
            </span>
          </Link>
        </div>
        <div className="card shadow-sm rounded-4 p-4">


 

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                <i className="bi bi-envelope me-2"></i>Email
              </label>
              <input
                type="email"
                className="form-control rounded-3"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                <i className="bi bi-lock me-2"></i>Password
              </label>
              <input
                type="password"
                className="form-control rounded-3"
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
              className="btn btn-primary w-100 rounded-3"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="mb-0">
              Don't have an account?{' '}
              <Link to="/register" className="text-decoration-none">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
