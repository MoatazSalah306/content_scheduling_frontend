// import React, { useState, useEffect } from 'react';
// import { getPlatforms, getEnabledPlatforms, updatePlatformSettings } from '../services/platformService';

// const Settings = ({ showAlert }) => {
//   const [allPlatforms, setAllPlatforms] = useState([]);
//   const [enabledPlatforms, setEnabledPlatforms] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     loadPlatforms();
//   }, []);

//   const loadPlatforms = async () => {
//     try {
//       setLoading(true);
//       const [platformsResponse, enabledResponse] = await Promise.all([
//         getPlatforms(),
//         getEnabledPlatforms()
//       ]);

//       if (platformsResponse.success && enabledResponse.success) {
//         setAllPlatforms(platformsResponse.platforms);
//         setEnabledPlatforms(enabledResponse.platforms);
//       } else {
//         showAlert('error', 'Failed to load platform data');
//       }
//     } catch (error) {
//       showAlert('error', 'Error loading platforms');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isPlatformEnabled = (platformtype) => {
//     return enabledPlatforms.some(p => p.type === platformtype);
//   };

//   const handleTogglePlatform = (platformtype) => {
//     setEnabledPlatforms(prev => {
//       if (prev.some(p => p.type === platformtype)) {
//         // Remove if already enabled
//         return prev.filter(p => p.type !== platformtype);
//       } else {
//         // Add if not enabled
//         const platformToAdd = allPlatforms.find(p => p.type === platformtype);
//         return platformToAdd ? [...prev, platformToAdd] : prev;
//       }
//     });
//   };

//   const handleSaveSettings = async () => {
//     setSaving(true);
//     try {
//       const result = await updatePlatformSettings({
//         enabledPlatforms: enabledPlatforms.map(p => p.type)
//       });

//       if (result.success) {
//         showAlert('success', 'Platform settings updated successfully!');
//         // Refresh enabled platforms after successful save
//         const enabledResponse = await getEnabledPlatforms();
//         if (enabledResponse.success) {
//           setEnabledPlatforms(enabledResponse.platforms);
//         }
//       } else {
//         showAlert('error', result.error || 'Failed to update settings');
//       }
//     } catch (error) {
//       showAlert('error', 'Error saving settings');
//     }
//     setSaving(false);
//   };

//   if (loading) {
//     return <div className="text-center">Loading settings...</div>;
//   }

//   return (
//     <div className="settings-container" style={{ 
//       maxWidth: '800px', 
//       margin: '0 auto',
//       padding: '20px'
//     }}>
//       <h1 style={{ marginBottom: '20px', color: '#333' }}>Platform Settings</h1>

//       <div style={{ 
//         backgroundColor: '#fff',
//         borderRadius: '8px',
//         boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//         marginBottom: '20px'
//       }}>
//         <div style={{ 
//           padding: '20px',
//           borderBottom: '1px solid #eee'
//         }}>
//           <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>Social Platforms</h3>
//           <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
//             Enable or disable social media platforms for posting
//           </p>
//         </div>

//         <div>
//           {allPlatforms.map(platform => {
//             const isEnabled = isPlatformEnabled(platform.type);
//             return (
//               <div type={platform.type} style={{ 
//                 display: 'flex', 
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 padding: '15px 20px',
//                 borderBottom: '1px solid #eee',
//                 ':last-child': {
//                   borderBottom: 'none'
//                 }
//               }}>
//                 <div>
//                   <div style={{ fontWeight: '600', color: '#333' }}>{platform.name}</div>
//                   <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
//                     {isEnabled ? 'Posts will be published to this platform' : 'This platform is disabled'}
//                   </div>
//                 </div>

//                 <div 
//                   onClick={() => handleTogglePlatform(platform.type)}
//                   style={{
//                     position: 'relative',
//                     width: '50px',
//                     height: '24px',
//                     borderRadius: '12px',
//                     backgroundColor: isEnabled ? '#4CAF50' : '#ccc',
//                     cursor: 'pointer',
//                     transition: 'background-color 0.3s'
//                   }}
//                 >
//                   <div 
//                     style={{
//                       position: 'absolute',
//                       width: '20px',
//                       height: '20px',
//                       borderRadius: '50%',
//                       backgroundColor: 'white',
//                       top: '2px',
//                       left: isEnabled ? 'calc(100% - 22px)' : '2px',
//                       transition: 'left 0.3s',
//                       boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
//                     }}
//                   ></div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         <div style={{ 
//           padding: '15px 20px',
//           textAlign: 'right',
//           borderTop: '1px solid #eee'
//         }}>
//           <button 
//             onClick={handleSaveSettings}
//             style={{
//               padding: '8px 16px',
//               backgroundColor: '#4CAF50',
//               color: 'white',
//               border: 'none',
//               borderRadius: '4px',
//               cursor: 'pointer',
//               fontSize: '14px',
//               fontWeight: '500',
//               opacity: saving ? 0.7 : 1,
//               pointerEvents: saving ? 'none' : 'auto'
//             }}
//             disabled={saving}
//           >
//             {saving ? 'Saving...' : 'Save Settings'}
//           </button>
//         </div>
//       </div>

//       <div style={{ 
//         backgroundColor: '#fff',
//         borderRadius: '8px',
//         boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//         padding: '20px'
//       }}>
//         <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>Integration Notes</h3>
//         <div style={{ fontSize: '14px', color: '#666' }}>
//           <p style={{ fontWeight: '600', marginBottom: '10px' }}>For Backend Integration:</p>
//           <ul style={{ 
//             paddingLeft: '20px',
//             margin: 0,
//             listStyleType: 'disc'
//           }}>
//             <li style={{ marginBottom: '5px' }}>Platform settings are stored in user preferences</li>
//             <li style={{ marginBottom: '5px' }}>Only enabled platforms will appear in post creation forms</li>
//             <li style={{ marginBottom: '5px' }}>API endpoint: PUT /api/user/platform-settings</li>
//             <li>Each platform can have additional configuration (API types, tokens, etc.)</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Settings;

import React, { useState, useEffect } from 'react';
import { getPlatforms, getEnabledPlatforms, updatePlatformSettings } from '../services/platformService';

const Settings = ({ showAlert }) => {
  const [allPlatforms, setAllPlatforms] = useState([]);
  const [enabledPlatforms, setEnabledPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
        // Refresh the enabled platforms list
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

  if (loading) {
    return <div className="text-center">Loading settings...</div>;
  }

  return (
    <div className="settings-container" style={{ 
      maxWidth: '800px', 
      margin: '0 auto',
      padding: '20px'
    }}>
      <h1 style={{ marginBottom: '20px', color: '#333' }}>Platform Settings</h1>

      <div style={{ 
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <div style={{ 
          padding: '20px',
          borderBottom: '1px solid #eee'
        }}>
          <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>Social Platforms</h3>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
            Enable or disable social media platforms for posting
          </p>
        </div>

        <div>
          {allPlatforms.map(platform => {
            const isEnabled = isPlatformEnabled(platform.type);
            const isToggling = togglingPlatform === platform.type;
            
            return (
              <div key={platform.type} style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px 20px',
                borderBottom: '1px solid #eee',
                ':last-child': {
                  borderBottom: 'none'
                }
              }}>
                <div>
                  <div style={{ fontWeight: '600', color: '#333' }}>{platform.name}</div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                    {isEnabled ? 'Posts will be published to this platform' : 'This platform is disabled'}
                  </div>
                </div>

                <div 
                  onClick={() => !isToggling && handleTogglePlatform(platform.type, platform.id)}
                  style={{
                    position: 'relative',
                    width: '50px',
                    height: '24px',
                    borderRadius: '12px',
                    backgroundColor: isEnabled ? '#4CAF50' : '#ccc',
                    cursor: isToggling ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.3s',
                    opacity: isToggling ? 0.7 : 1
                  }}
                >
                  <div 
                    style={{
                      position: 'absolute',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: 'white',
                      top: '2px',
                      left: isEnabled ? 'calc(100% - 22px)' : '2px',
                      transition: isToggling ? 'none' : 'left 0.3s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                    }}
                  ></div>
                  {isToggling && (
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: 'white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
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