
import React, { useState } from 'react';
import { updateProfile } from '../services/userService';

const Profile = ({ user, setUser, showAlert }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    password: '',
    passwordConfirmation: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // If password is provided, check confirmation
    if (formData.password && formData.password !== formData.passwordConfirmation) {
      showAlert('error', 'Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const updateData = {
        name: formData.name,
        email: formData.email
      };

      // Only include password if provided
      if (formData.password) {
        updateData.password = formData.password;
      }

      const result = await updateProfile(updateData);
      
      if (result.success) {
        setUser(result.user);
        showAlert('success', 'Profile updated successfully!');
        // Clear password fields
        setFormData({
          ...formData,
          password: '',
          passwordConfirmation: ''
        });
      } else {
        showAlert('error', result.error || 'Update failed');
      }
    } catch (error) {
      showAlert('error', 'An error occurred during update');
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
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 className="mb-20">Profile Settings</h1>
      
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Update Your Information</h3>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

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
            <label htmlFor="password">New Password (optional)</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password (leave blank to keep current)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="passwordConfirmation">Confirm New Password</label>
            <input
              type="password"
              id="passwordConfirmation"
              name="passwordConfirmation"
              value={formData.passwordConfirmation}
              onChange={handleChange}
              placeholder="Confirm new password"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Current Information</h3>
        </div>
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Member since:</strong> Demo Account</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
