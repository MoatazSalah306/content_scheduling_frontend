const API_BASE = 'http://127.0.0.1:8000/api';
// Platform Service
// This file contains mock functions for platform management
// Replace the mock data and logic with actual API calls to your Laravel backend

// Mock platforms data
let mockPlatforms = [
  { id: 1, name: 'Facebook', key: 'facebook', enabled: true },
  { id: 2, name: 'Twitter', key: 'twitter', enabled: true },
  { id: 3, name: 'Instagram', key: 'instagram', enabled: false },
  { id: 4, name: 'LinkedIn', key: 'linkedin', enabled: true },
  { id: 5, name: 'TikTok', key: 'tiktok', enabled: false }
];

// Get all platforms
export const getPlatforms = async () => {
  try {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE}/platforms`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    });

    const data = await response.json();

    if (response.ok) {
      console.log(data);
      
      return { success: true, platforms: data.data }; // `data` from $this->success()
    } else {
      return { success: false, error: data.message };
    }
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
};

// Update platform settings
export const updatePlatformSettings = async (platformId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/platforms/toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        platform_id: platformId
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return { 
        success: true, 
        message: data.message || 'Platform status updated successfully' 
      };
    } else {
      return { 
        success: false, 
        error: data.message || 'Failed to update platform status' 
      };
    }
  } catch (error) {
    return { 
      success: false, 
      error: 'Network error while updating platform status' 
    };
  }
};

// Get enabled platforms for dropdown/selection
export const getEnabledPlatforms = async () => {
  try {
    const token = localStorage.getItem('token'); // or wherever you store your auth token

    const response = await fetch(`${API_BASE}/platforms/getActive`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, platforms: data.data }; // assuming your success method wraps data in "data" key
    } else {
      return { success: false, error: data.message || 'Failed to load enabled platforms' };
    }
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
};

