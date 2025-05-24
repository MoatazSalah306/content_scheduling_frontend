const API_BASE = 'http://127.0.0.1:8000/api';


// Update user profile
export const updateProfile = async (profileData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(profileData)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('user', JSON.stringify(data.user));
      return { success: true, user: data.user };
    } else {
      // Return both the message and any validation errors
      return { 
        success: false, 
        error: data.message || 'Update failed',
        errors: data.errors // This will contain Laravel validation errors
      };
    }
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
};
// Get user profile (if you need to fetch fresh data)
export const getProfile = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return { 
        success: true, 
        post: {
          id: data.data.id,
          name: data.data.name,
          email: data.data.email,
        }
      };
    } else {
      return { success: false, error: data.message };
    }
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
};