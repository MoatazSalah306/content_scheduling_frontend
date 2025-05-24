
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPost, updatePost, deletePost } from '../services/postService';
import { getEnabledPlatforms } from '../services/platformService';

const EditPost = ({ showAlert }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [platforms, setPlatforms] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null,
    platforms: [],
    scheduled_at: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  useEffect(() => {
    setCharacterCount(formData.content.length);
  }, [formData.content]);

  const loadData = async () => {
    try {
      const [postResult, platformsResult] = await Promise.all([
        getPost(id),
        getEnabledPlatforms()
      ]);

      if (postResult.success) {
        const post = postResult.post;
        setFormData({
          title: post.title,
          content: post.content,
          image: post.image,
          platforms: post.platforms,
          scheduled_at: post.scheduled_at.slice(0, 16) // Format for datetime-local
        });
      } else {
        showAlert('error', 'Post not found');
        navigate('/dashboard');
        return;
      }

      if (platformsResult.success) {
        setPlatforms(platformsResult.platforms);
      } else {
        showAlert('error', 'Failed to load platforms');
      }
    } catch (error) {
      showAlert('error', 'Error loading post data');
      navigate('/dashboard');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.platforms.length === 0) {
      showAlert('error', 'Please select at least one platform');
      return;
    }

    setSaving(true);

    try {
      const result = await updatePost(id, formData);
      
      if (result.success) {
        showAlert('success', 'Post updated successfully!');
        navigate('/dashboard');
      } else {
        showAlert('error', result.error || 'Failed to update post');
      }
    } catch (error) {
      showAlert('error', 'Error updating post');
    }

    setSaving(false);
  };

  const handleDelete = async () => {
    try {
      const result = await deletePost(id);
      
      if (result.success) {
        showAlert('success', 'Post deleted successfully!');
        navigate('/dashboard');
      } else {
        showAlert('error', result.error || 'Failed to delete post');
      }
    } catch (error) {
      showAlert('error', 'Error deleting post');
    }
    setShowDeleteConfirm(false);
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handlePlatformChange = (platformKey) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platformKey)
        ? prev.platforms.filter(p => p !== platformKey)
        : [...prev.platforms, platformKey]
    }));
  };

  const getCharacterCountClass = () => {
    if (characterCount > 280) return 'char-counter danger';
    if (characterCount > 200) return 'char-counter warning';
    return 'char-counter';
  };

  if (loading) {
    return <div className="text-center">Loading post...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="mb-20">Edit Post</h1>
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Post Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter post title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              placeholder="What's on your mind?"
              rows="6"
            />
            <div className={getCharacterCountClass()}>
              {characterCount} characters
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="image">Update Image (optional)</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleChange}
              accept="image/*"
            />
            {formData.image && typeof formData.image === 'string' && (
              <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                Current image: {formData.image}
              </div>
            )}
            {formData.image && typeof formData.image === 'object' && (
              <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                New image selected: {formData.image.name}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Platforms</label>
            {platforms.length === 0 ? (
              <p style={{ color: '#666' }}>
                No platforms enabled. <a href="/settings">Enable platforms in settings</a>
              </p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
                {platforms.map(platform => (
                  <label key={platform.key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={formData.platforms.includes(platform.key)}
                      onChange={() => handlePlatformChange(platform.key)}
                    />
                    {platform.name}
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="scheduled_at">Schedule Date & Time</label>
            <input
              type="datetime-local"
              id="scheduled_at"
              name="scheduled_at"
              value={formData.scheduled_at}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
            <button 
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="btn btn-danger"
            >
              Delete Post
            </button>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Update Post'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '400px',
            textAlign: 'center'
          }}>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this post? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPost;
