import React, { useState, useEffect } from 'react';
import { getPlatforms, getEnabledPlatforms, updatePlatformSettings } from '../services/platformService';

const Settings = ({ showAlert }) => {
  const [allPlatforms, setAllPlatforms] = useState([]);
  const [enabledPlatforms, setEnabledPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingPlatform, setTogglingPlatform] = useState(null);

  useEffect(() => {
    loadPlatforms();
  }, []);

  const loadPlatforms = async () => {
    try {
      setLoading(true);
      const [platformsResponse, enabledResponse] = await Promise.all([
        getPlatforms(),
        getEnabledPlatforms()
      ]);

      if (platformsResponse.success && enabledResponse.success) {
        setAllPlatforms(platformsResponse.platforms);
        setEnabledPlatforms(enabledResponse.platforms);
      } else {
        showAlert('error', 'Failed to load platform data');
      }
    } catch (error) {
      showAlert('error', 'Error loading platforms');
    } finally {
      setLoading(false);
    }
  };

  const isPlatformEnabled = (platformType) => {
    return enabledPlatforms.some(p => p.type === platformType);
  };

  const handleTogglePlatform = async (platformType, platformId) => {
    setTogglingPlatform(platformType);
    try {
      const result = await updatePlatformSettings(platformId);
      
      if (result.success) {
        showAlert('success', result.message);
        const enabledResponse = await getEnabledPlatforms();
        if (enabledResponse.success) {
          setEnabledPlatforms(enabledResponse.platforms);
        }
      } else {
        showAlert('error', result.error);
      }
    } catch (error) {
      showAlert('error', 'Error toggling platform');
    } finally {
      setTogglingPlatform(null);
    }
  };

  const getPlatformIcon = (type) => {
    const icons = {
      twitter: 'bi bi-twitter',
      facebook: 'bi bi-facebook',
      instagram: 'bi bi-instagram',
      linkedin: 'bi bi-linkedin',
      youtube: 'bi bi-youtube'
    };
    return icons[type] || 'bi bi-phone';
  };

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
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      border: '1px solid #e9ecef',
    },
    cardHeader: {
      paddingBottom: '15px',
      borderBottom: '2px solid #f8f9fa',
      marginBottom: '20px',
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
    platformItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 0',
      borderBottom: '1px solid #e9ecef',
    },
    platformInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    platformName: {
      fontWeight: '600',
      color: '#333',
      fontSize: '15px',
    },
    platformStatus: {
      fontSize: '12px',
      color: '#6c757d',
      marginTop: '4px',
    },
    toggleSwitch: {
      position: 'relative',
      width: '50px',
      height: '26px',
      borderRadius: '13px',
      backgroundColor: '#ccc',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    toggleSwitchEnabled: {
      backgroundColor: '#007BFF',
    },
    toggleKnob: {
      position: 'absolute',
      width: '22px',
      height: '22px',
      borderRadius: '50%',
      backgroundColor: '#fff',
      top: '2px',
      left: '2px',
      transition: 'left 0.3s ease',
      boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
    },
    toggleKnobEnabled: {
      left: 'calc(100% - 24px)',
    },
    spinner: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '18px',
      height: '18px',
      border: '2px solid rgba(255,255,255,0.3)',
      borderTopColor: '#fff',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px',
      color: '#6c757d',
      fontSize: '16px',
      fontWeight: '500',
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <i className="bi bi-hourglass-split" style={{ marginRight: '8px' }}></i> Loading settings...
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Platform Settings</h1>
        <p style={styles.subtitle}>Manage your social media platform connections</p>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>
            <i className="bi bi-gear"></i> Social Platforms
          </h3>
          <p style={{ margin: '5px 0 0 0', color: '#6c757d', fontSize: '14px' }}>
            Enable or disable social media platforms for posting
          </p>
        </div>

        <div>
          {allPlatforms.map(platform => {
            const isEnabled = isPlatformEnabled(platform.type);
            const isToggling = togglingPlatform === platform.type;
            
            return (
              <div key={platform.type} style={styles.platformItem}>
                <div style={styles.platformInfo}>
                  <i className={getPlatformIcon(platform.type)} style={{ fontSize: '20px', color: '#333' }}></i>
                  <div>
                    <div style={styles.platformName}>{platform.name}</div>
                    <div style={styles.platformStatus}>
                      {isEnabled ? 'Posts will be published to this platform' : 'This platform is disabled'}
                    </div>
                  </div>
                </div>

                <div 
                  onClick={() => !isToggling && handleTogglePlatform(platform.type, platform.id)}
                  style={{
                    ...styles.toggleSwitch,
                    ...(isEnabled ? styles.toggleSwitchEnabled : {}),
                    ...(isToggling ? { cursor: 'not-allowed', opacity: 0.7 } : {})
                  }}
                >
                  <div 
                    style={{
                      ...styles.toggleKnob,
                      ...(isEnabled ? styles.toggleKnobEnabled : {})
                    }}
                  ></div>
                  {isToggling && (
                    <div style={styles.spinner}></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Settings;