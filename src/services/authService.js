const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Login function.

export const login = async (email, password) => {
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
      localStorage.setItem('user', JSON.stringify(data.data.user));
      localStorage.setItem('token', data.data.token);
      return { success: true, user: data.data.user };
    } else {
      return { success: false, error: data.message || 'Registration failed' };
    }

  } catch (error) {
    console.error('Register error:', error);
    return { success: false, error: 'Network error' };
  }
};

// Logout function
export const logout = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    // Logout on client regardless of backend response
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  } catch (error) {
    console.error('Logout error:', error);
  }
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
