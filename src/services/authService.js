
// Authentication Service
// Integrated with Laravel Sanctum backend

// Base API URL - Update this to match your Laravel backend URL
const API_BASE_URL = 'http://localhost:8000/api'; // Change to your Laravel backend URL

// Login function
export const login = async (email, password) => {
  console.log('Login attempt:', { email, password });
  
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Store user and token from Laravel response
      localStorage.setItem('user', JSON.stringify(data.data.user));
      localStorage.setItem('token', data.data.token);
      return { success: true, user: data.data.user };
    } else {
      return { success: false, error: data.message || 'Login failed' };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Network error' };
  }
};

// Register function
export const register = async (name, email, password, passwordConfirmation) => {
  console.log('Register attempt:', { name, email, password, passwordConfirmation });
  
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ 
        name, 
        email, 
        password, 
        password_confirmation: passwordConfirmation 
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Store user and token from Laravel response
      localStorage.setItem('user', JSON.stringify(data.data.user));
      localStorage.setItem('token', data.data.token);
      return { success: true, user: data.data.user };
    } else {
      return { success: false, error: data.message || 'Registration failed' };
    }
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Network error' };
  }
};

// Logout function
export const logout = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (token) {
      await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
  
  // Always clear local storage regardless of API response
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

// Get current user
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Get auth token
export const getToken = () => {
  return localStorage.getItem('token');
};
