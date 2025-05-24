
// Authentication Service
// This file contains mock functions for authentication
// Replace the mock data and logic with actual API calls to your Laravel backend

// Mock user data - replace with actual user from API
const mockUser = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com'
};

// Login function
export const login = async (email, password) => {
  // TODO: Replace with actual API call to your Laravel backend
  // Example: POST /api/login with { email, password }
  
  console.log('Login attempt:', { email, password });
  
  // Mock delay to simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock validation
  if (email === 'john@example.com' && password === 'password') {
    // TODO: Store the actual token from Laravel Sanctum
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('token', 'mock-token-123'); // Replace with actual token
    return { success: true, user: mockUser };
  } else {
    return { success: false, error: 'Invalid credentials' };
  }
  
  /*
  // Example of actual API integration:
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      return { success: true, user: data.user };
    } else {
      return { success: false, error: data.message };
    }
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
  */
};

// Register function
export const register = async (name, email, password, passwordConfirmation) => {
  // TODO: Replace with actual API call to your Laravel backend
  // Example: POST /api/register with { name, email, password, password_confirmation }
  
  console.log('Register attempt:', { name, email, password, passwordConfirmation });
  
  // Mock delay to simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock validation
  if (password === passwordConfirmation && email && name) {
    const newUser = { id: 2, name, email };
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('token', 'mock-token-456'); // Replace with actual token
    return { success: true, user: newUser };
  } else {
    return { success: false, error: 'Registration failed' };
  }
  
  /*
  // Example of actual API integration:
  try {
    const response = await fetch('/api/register', {
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
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      return { success: true, user: data.user };
    } else {
      return { success: false, error: data.message };
    }
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
  */
};

// Logout function
export const logout = async () => {
  // TODO: Add API call to invalidate token on backend
  // Example: POST /api/logout with Authorization header
  
  /*
  // Example of actual API integration:
  try {
    const token = localStorage.getItem('token');
    await fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    });
  } catch (error) {
    console.error('Logout error:', error);
  }
  */
  
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

// Get current user
export const getCurrentUser = () => {
  // TODO: Optionally verify token with backend
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Get auth token
export const getToken = () => {
  return localStorage.getItem('token');
};
