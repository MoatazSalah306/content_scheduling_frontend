
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../services/postService';
import { getEnabledPlatforms, getPlatforms } from '../services/platformService';

const Dashboard = ({ showAlert }) => {
  const [posts, setPosts] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [enabledPlatforms, setEnabledPlatforms] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // 'list' or 'calendar'
  const [filters, setFilters] = useState({
    status: '',
    date: ''
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [postsResult, platformsResult,enabledPlatformsResult] = await Promise.all([
        getPosts(filters),
        getPlatforms(),
        getEnabledPlatforms()
      ]);

      if (postsResult.success) {
        setPosts(postsResult.posts);
      } else {
        showAlert('error', 'Failed to load posts');
      }

      if (platformsResult.success) {
        setPlatforms(platformsResult.platforms);
      } else {
        showAlert('error', 'Failed to load platforms');
      }

        if (enabledPlatformsResult.success) {
        setEnabledPlatforms(enabledPlatformsResult.platforms);
      } else {
        showAlert('error', 'Failed to load enabled platforms');
        
      }
    } catch (error) {
      showAlert('error', 'Error loading dashboard data');
    }
    setLoading(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status) => {
    return <span className={`status-badge status-${status}`}>{status}</span>;
  };

  if (loading) {
    return <div className="text-center">Loading dashboard...</div>;
  }

  return (
    <div>
      <div className="flex-between mb-20">
        <h1>Dashboard</h1>
        <Link to="/create-post" className="btn btn-primary">
          Create New Post
        </Link>
      </div>

      {/* View Toggle */}
      <div className="mb-20">
        <button
          className={`btn ${view === 'list' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setView('list')}
          style={{ marginRight: '10px' }}
        >
          List View
        </button>
        <button
          className={`btn ${view === 'calendar' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setView('calendar')}
        >
          Calendar View
        </button>
      </div>

      {/* Calendar View */}
      {view === 'calendar' && (
        <div className="calendar-placeholder">
          <h3>Calendar View</h3>
          <p>Calendar integration placeholder - replace with your preferred calendar library</p>
          <p>Posts would be displayed here by scheduled date</p>
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="grid grid-2">
          {/* Posts Section */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Recent Posts</h3>
            </div>

            {/* Filters */}
            <div className="mb-20" style={{ display: 'flex', gap: '10px' }}>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                style={{ padding: '5px' }}
              >
                <option value="">All Status</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="published">Published</option>
              </select>

              <input
                type="date"
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                style={{ padding: '5px' }}
              />
            </div>

            {/* Posts List */}
            {posts.length === 0 ? (
              <p>No posts found. <Link to="/create-post">Create your first post</Link></p>
            ) : (
              <div>
                {posts.map(post => (
                  <div key={post.id} style={{
                    border: '1px solid #ddd',
                    padding: '15px',
                    marginBottom: '10px',
                    borderRadius: '4px'
                  }}>
                    <div className="flex-between">
                      <h4>{post.title}</h4>
                      {getStatusBadge(post.status)}
                    </div>
                    <p style={{ color: '#666', margin: '5px 0' }}>
                      {post.content.substring(0, 100)}...
                    </p>
                    <p style={{ fontSize: '12px', color: '#666' }}>
                      Platforms: {post.platforms.join(', ')}
                    </p>
                    <p style={{ fontSize: '12px', color: '#666' }}>
                      Scheduled: {formatDate(post.scheduled_at)}
                    </p>
                    <div style={{ marginTop: '10px' }}>
                      <Link 
                        to={`/edit-post/${post.id}`} 
                        className="btn btn-secondary"
                        style={{ marginRight: '10px', fontSize: '12px', padding: '5px 10px' }}
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Platforms Section */}
           <div className="card">
        <div className="card-header">
          <h3 className="card-title">Platform Status</h3>
        </div>
        
        <div>
          {platforms.map(platform => {
            // Check if platform is in enabledPlatforms by id
            const isActive = enabledPlatforms.some(ep => ep.id === platform.id);

            return (
              <div key={platform.id} className="platform-toggle" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                <div>
                  <strong>{platform.name}</strong>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    Status: {isActive ? 'Enabled' : 'Disabled'}
                  </div>
                </div>
                <div style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  backgroundColor: isActive ? '#28a745' : '#dc3545',
                  color: 'white'
                }}>
                  {isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
            );
          })}
          
          <div style={{ marginTop: '15px' }}>
            <Link to="/settings" className="btn btn-secondary">
              Manage Platforms
            </Link>
          </div>
        </div>
      </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
