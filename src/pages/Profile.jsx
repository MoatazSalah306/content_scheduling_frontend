import React, { useState } from 'react';
import { updateProfile } from '../services/userService';

const Profile = ({ user, setUser, showAlert }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    current_password: '',
    password: '',
    password_confirmation: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password) {
      if (formData.password !== formData.password_confirmation) {
        showAlert('error', 'Passwords do not match');
        return;
      }
      if (!formData.current_password) {
        showAlert('error', 'Current password is required to change password');
        return;
      }
      if (formData.password.length < 6) {
        showAlert('error', 'New password must be at least 6 characters');
        return;
      }
    }

    setLoading(true);

    try {
      const updateData = {
        name: formData.name,
        email: formData.email
      };

      if (formData.password) {
        updateData.current_password = formData.current_password;
        updateData.password = formData.password;
        updateData.password_confirmation = formData.password_confirmation;
      }

      const result = await updateProfile(updateData);
      
      if (result.success) {
        setUser(result.user);
        showAlert('success', 'Profile updated successfully!');
        setFormData({
          ...formData,
          current_password: '',
          password: '',
          password_confirmation: ''
        });
        setShowPasswordFields(false);
      } else {
        console.log(result.errors);
        showAlert('error', result.errors.current_password || 'Update failed');
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

  const togglePasswordFields = () => {
    setShowPasswordFields(!showPasswordFields);
    if (!showPasswordFields) {
      setFormData({
        ...formData,
        current_password: '',
        password: '',
        password_confirmation: ''
      });
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '#e9ecef' };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const levels = [
      { label: 'Very Weak', color: '#dc3545' },
      { label: 'Weak', color: '#fd7e14' },
      { label: 'Fair', color: '#ffc107' },
      { label: 'Good', color: '#20c997' },
      { label: 'Strong', color: '#28a745' }
    ];

    return { strength, ...levels[strength] };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
    },
    header: {
      marginBottom: '30px',
      textAlign: 'center',
      background: 'linear-gradient(90deg, #007BFF 0%, #00b7eb 100%)',
      padding: '20px',
      borderRadius: '12px',
      color: 'white',
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#fff',
      marginBottom: '8px',
    },
    subtitle: {
      color: '#e9ecef',
      fontSize: '16px',
      fontWeight: '400',
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: '16px',
      padding: '30px',
      marginBottom: '24px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      border: '1px solid #e9ecef',
    },
    cardHeader: {
      marginBottom: '25px',
      paddingBottom: '15px',
      borderBottom: '2px solid #f8f9fa',
    },
    cardTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#333',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    formGroup: {
      marginBottom: '24px',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontSize: '15px',
      fontWeight: '600',
      color: '#333',
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid #e9ecef',
      borderRadius: '10px',
      fontSize: '15px',
      transition: 'all 0.3s ease',
      backgroundColor: '#fff',
      fontFamily: 'inherit',
    },
    inputFocus: {
      borderColor: '#007BFF',
      outline: 'none',
      boxShadow: '0 0 0 3px rgba(0, 123, 255, 0.1)',
    },
    button: {
      padding: '12px 28px',
      borderRadius: '10px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
    },
    primaryButton: {
      backgroundColor: '#007BFF',
      color: 'white',
      boxShadow: '0 4px 12px rgba(0, 123, 255, 0.3)',
    },
    secondaryButton: {
      backgroundColor: '#6c757d',
      color: 'white',
      marginRight: '12px',
    },
    disabledButton: {
      backgroundColor: '#e9ecef',
      color: '#6c757d',
      cursor: 'not-allowed',
      boxShadow: 'none',
    },
    passwordToggle: {
      backgroundColor: 'transparent',
      color: '#007BFF',
      border: '2px solid #007BFF',
      padding: '8px 16px',
      fontSize: '14px',
      marginBottom: '20px',
    },
    passwordSection: {
      backgroundColor: '#f8f9fa',
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid #e9ecef',
      marginBottom: '20px',
    },
    passwordStrength: {
      marginTop: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    strengthBar: {
      flex: 1,
      height: '4px',
      backgroundColor: '#e9ecef',
      borderRadius: '2px',
      overflow: 'hidden',
    },
    strengthFill: {
      height: '100%',
      backgroundColor: passwordStrength.color,
      width: `${(passwordStrength.strength / 4) * 100}%`,
      transition: 'all 0.3s ease',
    },
    strengthLabel: {
      fontSize: '12px',
      fontWeight: '500',
      color: passwordStrength.color,
    },
    infoCard: {
      backgroundColor: '#f8f9fa',
      border: '1px solid #e9ecef',
    },
    infoItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 0',
      borderBottom: '1px solid #e9ecef',
    },
    infoLabel: {
      fontWeight: '600',
      color: '#333',
      minWidth: '120px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    infoValue: {
      color: '#6c757d',
      flex: 1,
    },
    avatar: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      backgroundColor: '#007BFF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '32px',
      fontWeight: 'bold',
      color: 'white',
      margin: '0 auto 20px',
    },
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Profile Settings</h1>
        <p style={styles.subtitle}>Manage your account information and security</p>
      </div>
      
      <div style={{...styles.card, ...styles.infoCard}}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>
            <i className="bi bi-person"></i> Current Profile
          </h3>
        </div>
        
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={styles.avatar}>
            {getInitials(user.name || 'User')}
          </div>
        </div>

        <div>
          <div style={styles.infoItem}>
            <div style={styles.infoLabel}>
              <i className="bi bi-person-badge"></i> Name:
            </div>
            <div style={styles.infoValue}>{user.name}</div>
          </div>
          <div style={styles.infoItem}>
            <div style={styles.infoLabel}>
              <i className="bi bi-envelope"></i> Email:
            </div>
            <div style={styles.infoValue}>{user.email}</div>
          </div>
          <div style={{...styles.infoItem, borderBottom: 'none'}}>
            <div style={styles.infoLabel}>
              <i className="bi bi-calendar"></i> Member since:
            </div>
            <div className='ps-2' style={styles.infoValue}>{formatDate(user.created_at)}</div>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>
            <i className="bi bi-pencil"></i> Update Information
          </h3>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="name">
              Full Name *
            </label>
            <input
              style={styles.input}
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              onFocus={(e) => e.target.style.borderColor = '#007BFF'}
              onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="email">
              Email Address *
            </label>
            <input
              style={styles.input}
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email address"
              onFocus={(e) => e.target.style.borderColor = '#007BFF'}
              onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
            />
          </div>

          <div style={styles.formGroup}>
            <button
              type="button"
              style={{...styles.button, ...styles.passwordToggle}}
              onClick={togglePasswordFields}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 123, 255, 0.1)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <i className="bi bi-lock"></i> {showPasswordFields ? 'Cancel Password Change' : 'Change Password'}
            </button>

            {showPasswordFields && (
              <div style={styles.passwordSection}>
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="current_password">
                    Current Password *
                  </label>
                  <input
                    style={styles.input}
                    type="password"
                    id="current_password"
                    name="current_password"
                    value={formData.current_password}
                    onChange={handleChange}
                    placeholder="Enter your current password"
                    onFocus={(e) => e.target.style.borderColor = '#007BFF'}
                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="password">
                    New Password *
                  </label>
                  <input
                    style={styles.input}
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter new password (min. 6 characters)"
                    onFocus={(e) => e.target.style.borderColor = '#007BFF'}
                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                  />
                  {formData.password && (
                    <div style={styles.passwordStrength}>
                      <div style={styles.strengthBar}>
                        <div style={styles.strengthFill}></div>
                      </div>
                      <span style={styles.strengthLabel}>
                        {passwordStrength.label}
                      </span>
                    </div>
                  )}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="password_confirmation">
                    Confirm New Password *
                  </label>
                  <input
                    style={styles.input}
                    type="password"
                    id="password_confirmation"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    placeholder="Confirm your new password"
                    onFocus={(e) => e.target.style.borderColor = '#007BFF'}
                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                  />
                  {formData.password && formData.password_confirmation && (
                    <div style={{ 
                      marginTop: '5px', 
                      fontSize: '13px',
                      color: formData.password === formData.password_confirmation ? '#28a745' : '#dc3545',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <i className={formData.password === formData.password_confirmation ? 'bi bi-check-circle' : 'bi bi-x-circle'}></i>
                      {formData.password === formData.password_confirmation ? 
                        'Passwords match' : 
                        'Passwords do not match'
                      }
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div style={{ paddingTop: '20px', borderTop: '1px solid #e9ecef' }}>
            <button 
              type="submit" 
              style={{
                ...styles.button,
                ...(loading ? styles.disabledButton : styles.primaryButton)
              }}
              disabled={loading}
              onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#0056b3')}
              onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#007BFF')}
            >
              {loading ? (
                <>
                  <i className="bi bi-hourglass-split"></i> Updating...
                </>
              ) : (
                <>
                  <i className="bi bi-save"></i> Update Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;