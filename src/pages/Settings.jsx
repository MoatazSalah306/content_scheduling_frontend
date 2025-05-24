
import React, { useState, useEffect } from 'react';
import { getPlatforms, updatePlatformSettings, getEnabledPlatforms } from '../services/platformService';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';

const Settings = ({ showAlert }) => {
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPlatforms();
  }, []);

  const loadPlatforms = async () => {
    try {
      const [platformsResult, enabledResult] = await Promise.all([
        getPlatforms(),
        getEnabledPlatforms()
      ]);
      
      if (platformsResult.success && enabledResult.success) {
        // Create a map of enabled platform keys for quick lookup
        const enabledKeys = new Set(enabledResult.platforms.map(p => p.key));
        
        // Set enabled status based on getEnabledPlatforms result
        const platformsWithStatus = platformsResult.platforms.map(platform => ({
          ...platform,
          enabled: enabledKeys.has(platform.key)
        }));
        
        setPlatforms(platformsWithStatus);
      } else {
        showAlert('error', 'Failed to load platforms');
      }
    } catch (error) {
      showAlert('error', 'Error loading platforms');
    }
    setLoading(false);
  };

  const handleTogglePlatform = (platformKey, newChecked) => {
    setPlatforms(prev => 
      prev.map(platform => 
        platform.key === platformKey 
          ? { ...platform, enabled: newChecked }
          : platform
      )
    );
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    
    try {
      const settings = platforms.map(platform => ({
        key: platform.key,
        enabled: platform.enabled
      }));

      const result = await updatePlatformSettings(settings);
      
      if (result.success) {
        showAlert('success', 'Platform settings updated successfully!');
        setPlatforms(result.platforms);
      } else {
        showAlert('error', result.error || 'Failed to update settings');
      }
    } catch (error) {
      showAlert('error', 'Error saving settings');
    }
    
    setSaving(false);
  };

  if (loading) {
    return <div className="text-center">Loading settings...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="mb-20">Settings</h1>
      
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Platform Settings</h3>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
            Enable or disable social media platforms for posting
          </p>
        </div>
        
        <div>
          {platforms.map(platform => (
            <div key={platform.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg mb-3">
              <div className="flex items-center space-x-3">
                <Label htmlFor={`platform-${platform.key}`} className="cursor-pointer">
                  <div>
                    <strong>{platform.name}</strong>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {platform.enabled ? 'Posts will be published to this platform' : 'This platform is disabled'}
                    </div>
                  </div>
                </Label>
              </div>
              
              <Switch
                id={`platform-${platform.key}`}
                checked={platform.enabled}
                onCheckedChange={(checked) => handleTogglePlatform(platform.key, checked)}
              />
            </div>
          ))}
          
          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <button 
              onClick={handleSaveSettings}
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Integration Notes</h3>
        </div>
        <div style={{ fontSize: '14px', color: '#666' }}>
          <p><strong>For Backend Integration:</strong></p>
          <ul style={{ paddingLeft: '20px' }}>
            <li>Platform settings are stored in user preferences</li>
            <li>Only enabled platforms will appear in post creation forms</li>
            <li>API endpoint: PUT /api/user/platform-settings</li>
            <li>Each platform can have additional configuration (API keys, tokens, etc.)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Settings;
