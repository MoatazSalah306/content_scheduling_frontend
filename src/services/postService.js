const API_BASE = 'http://127.0.0.1:8000/api';


export const getPosts = async (filters = {}) => {
  try {
    const token = localStorage.getItem('token');
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_BASE}/posts?${queryParams}`, {
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
        posts: data.data.map(post => ({
          id: post.id,
          title: post.title,
          content: post.content,
          scheduled_at: post.scheduled_time,
          platforms: post.platforms,
          status: post.status
        }))
      };
    } else {
      return { success: false, error: data.message };
    }
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
};


export const createPost = async (postData) => {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    
    // Append basic fields
    formData.append('title', postData.title);
    formData.append('content', postData.content);
    formData.append('status', postData.status); 
    
    // Format scheduled time correctly
    if (postData.scheduled_at) {
      const scheduledDate = new Date(postData.scheduled_at);
      formData.append('scheduled_time', scheduledDate.toISOString());
    }
    
    // Append platforms as IDs (not keys)
    postData.platforms.forEach(platformId => {
      formData.append('platforms[]', platformId);
    });
    
    // Append image if exists
    if (postData.image) {
      formData.append('image', postData.image);
    }
    
    const response = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: formData
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return { 
        success: true, 
        post: {
          ...data.data,
          platforms: data.data.platforms || []
        }
      };
    } else {
      return { 
        success: false, 
        error: data.message || 'Failed to create post' 
      };
    }
  } catch (error) {
    return { 
      success: false, 
      error: error.message || 'Network error'
    };
  }
};




export const getPost = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/posts/${id}`, {
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
          title: data.data.title,
          content: data.data.content,
          scheduled_at: data.data.scheduled_time,
          platforms: data.data.platforms.map(p => p.type), // Use platform type
          status: data.data.status,
          image: data.data.image_url // Use image_url for display
        }
      };
    } else {
      return { success: false, error: data.message };
    }
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
};

export const updatePost = async (id, postData) => {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    
    // Laravel method spoofing for PUT
    formData.append('_method', 'PUT');
    formData.append('title', postData.title);
    formData.append('content', postData.content);
    
    // Format scheduled time correctly
    if (postData.scheduled_at) {
      const scheduledDate = new Date(postData.scheduled_at);
      formData.append('scheduled_time', scheduledDate.toISOString());
    }
    
    // Append platforms as types
    postData.platforms.forEach(platformType => {
      formData.append('platforms[]', platformType);
    });
    
    // Append new image if provided (and it's a file, not a string URL)
    if (postData.image && typeof postData.image !== 'string') {
      formData.append('image', postData.image);
    }
    
    const response = await fetch(`${API_BASE}/posts/${id}`, {
      method: 'POST', // Using POST with _method=PUT
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: formData
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return { success: true, post: data.data };
    } else {
      return { success: false, error: data.message || 'Failed to update post' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deletePost = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/posts/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    });
    
    if (response.ok) {
      return { success: true };
    } else {
      const data = await response.json();
      return { success: false, error: data.message };
    }
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
};