'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/components/backoffice/auth/AuthContext';
import { useRouter } from 'next/navigation';

export const dynamic = "force-dynamic";

const CompanySettingsPage = () => {
  const t = useTranslations('backoffice');
  const { user } = useAuth();
  const router = useRouter();
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Platform configurations
  const platformConfig = {
    email: {
      icon: 'fas fa-envelope',
      color: '#dc3545',
      label: 'Email',
      placeholder: 'admin@company.com',
      type: 'email'
    },
    line: {
      icon: 'fab fa-line',
      color: '#00c300',
      label: 'LINE',
      placeholder: '@lineofficial',
      type: 'text'
    },
    whatsapp: {
      icon: 'fab fa-whatsapp',
      color: '#25d366',
      label: 'WhatsApp',
      placeholder: '+66123456789',
      type: 'tel'
    },
    wechat: {
      icon: 'fab fa-weixin',
      color: '#7bb32e',
      label: 'WeChat',
      placeholder: 'wechat_id',
      type: 'text'
    },
    messenger: {
      icon: 'fab fa-facebook-messenger',
      color: '#0084ff',
      label: 'Messenger',
      placeholder: 'messenger_username',
      type: 'text'
    },
    instagram: {
      icon: 'fab fa-instagram',
      color: '#e4405f',
      label: 'Instagram',
      placeholder: '@instagram_handle',
      type: 'text'
    }
  };

  // Check if user is admin
  useEffect(() => {
    if (!user) return;
    
    if (user.role !== 'ADMIN') {
      router.push('/backoffice');
      return;
    }
    
    loadSettings();
  }, [user, router]);

  // Load settings from backend
  const loadSettings = async () => {
    try {
      setLoading(true);
      setMessage({ type: '', text: '' }); // Clear previous messages
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messaging-settings`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (response.ok && data.status === 'success') {
        // Initialize settings with all platforms
        const allPlatforms = ['email', 'line', 'whatsapp', 'wechat', 'messenger', 'instagram'];
        const initializedSettings = allPlatforms.map(platform => {
          const existingSetting = data.data.find(s => s.platform === platform);
          return existingSetting || {
            platform,
            platformValue: '',
            isEnabled: false
          };
        });
        setSettings(initializedSettings);
      } else {
        throw new Error(data.message || `HTTP ${response.status}: Failed to load settings`);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      setMessage({ 
        type: 'error', 
        text: `Failed to load settings: ${error.message}` 
      });
      // Initialize with empty settings if load fails
      const allPlatforms = ['email', 'line', 'whatsapp', 'wechat', 'messenger', 'instagram'];
      const emptySettings = allPlatforms.map(platform => ({
        platform,
        platformValue: '',
        isEnabled: false
      }));
      setSettings(emptySettings);
    } finally {
      setLoading(false);
    }
  };

  // Update setting value
  const updateSetting = (platform, field, value) => {
    setSettings(prevSettings => {
      const existingIndex = prevSettings.findIndex(s => s.platform === platform);
      
      if (existingIndex >= 0) {
        // Update existing setting
        const updated = [...prevSettings];
        updated[existingIndex] = { ...updated[existingIndex], [field]: value };
        return updated;
      } else {
        // Add new setting
        return [...prevSettings, {
          platform,
          platformValue: field === 'platformValue' ? value : '',
          isEnabled: field === 'isEnabled' ? value : false
        }];
      }
    });
  };

  // Save all settings
  const saveAllSettings = async () => {
    try {
      setSaving(true);
      setMessage({ type: '', text: '' }); // Clear previous messages
      
      // Use bulk update endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messaging-settings/bulk`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY
        },
        body: JSON.stringify({ settings })
      });

      const data = await response.json();
      
      if (response.ok && (data.status === 'success' || data.status === 'partial_success')) {
        // Handle both full success and partial success
        if (data.status === 'success') {
          setMessage({ type: 'success', text: 'All settings saved successfully!' });
        } else {
          // Partial success - show warning with details
          const errorCount = data.errors ? data.errors.length : 0;
          const successCount = data.data ? data.data.length : 0;
          setMessage({ 
            type: 'warning', 
            text: `Partially saved: ${successCount} settings updated successfully${errorCount > 0 ? `, ${errorCount} had errors` : ''}` 
          });
        }
        // Reload settings to get updated data
        await loadSettings();
      } else {
        throw new Error(data.message || `HTTP ${response.status}: Failed to save settings`);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ 
        type: 'error', 
        text: `Failed to save settings: ${error.message}` 
      });
    } finally {
      setSaving(false);
    }
  };

  // Get setting value
  const getSetting = (platform) => {
    return settings.find(s => s.platform === platform) || {
      platform,
      platformValue: '',
      isEnabled: false
    };
  };

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="text-center py-5">
        <h3>Access Denied</h3>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  return (
    <>
      <div className="row align-items-center pb-4">
        <div className="col-lg-12">
          <div className="dashboard_title_area">
            <h2><i className="fas fa-cogs"></i> {t('menu.companySettings')}</h2>
            <p className="text">Manage company messaging and social media settings</p>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {message.text && (
        <div className={`alert alert-${message.type === 'error' ? 'danger' : message.type === 'warning' ? 'warning' : 'success'} alert-dismissible fade show`}>
          {message.text}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setMessage({ type: '', text: '' })}
          ></button>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading company settings...</p>
        </div>
      )}

      {/* Settings Form */}
      {!loading && (
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="fas fa-comments"></i> Messaging & Social Media Settings
                </h5>
                <button 
                  className="btn btn-outline-secondary btn-sm"
                  onClick={loadSettings}
                  disabled={loading}
                >
                  <i className="fas fa-sync-alt"></i> Refresh
                </button>
              </div>
              <div className="card-body">
                <div className="row">
                  {Object.keys(platformConfig).map(platform => {
                    const config = platformConfig[platform];
                    const setting = getSetting(platform);
                    
                    return (
                      <div key={platform} className="col-md-6 col-lg-4 mb-4">
                        <div className="border rounded p-3 h-100" style={{ backgroundColor: '#f8f9fa' }}>
                          <div className="text-center mb-3">
                            <i 
                              className={`${config.icon} fa-2x mb-2`} 
                              style={{ color: config.color }}
                            ></i>
                            <h6>{config.label}</h6>
                          </div>
                          
                          <div className="form-check form-switch mb-3">
                            <input 
                              className="form-check-input" 
                              type="checkbox" 
                              id={`enabled_${platform}`}
                              checked={setting.isEnabled}
                              onChange={(e) => updateSetting(platform, 'isEnabled', e.target.checked)}
                            />
                           
                          </div>

                          <div className="mb-3">
                            <label htmlFor={`value_${platform}`} className="form-label">
                              {config.label} Contact Info
                            </label>
                            <input 
                              type={config.type}
                              className="form-control" 
                              id={`value_${platform}`}
                              placeholder={config.placeholder}
                              value={setting.platformValue || ''}
                              disabled={!setting.isEnabled}
                              onChange={(e) => updateSetting(platform, 'platformValue', e.target.value)}
                            />
                          </div>

                          <div className="text-muted small">
                            {setting.id ? `ID: ${setting.id}` : 'New'}
                            {setting.updatedAt && (
                              <><br />Updated: {new Date(setting.updatedAt).toLocaleString()}</>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="text-center mt-4">
                  <button 
                    className="btn btn-primary btn-lg"
                    onClick={saveAllSettings}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2 text-white"></i>
                        <span className="text-white">Save All Settings</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .form-switch .form-check-input {
          width: 3rem;
          height: 1.5rem;
        }
        .card {
          box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
          border: 1px solid rgba(0, 0, 0, 0.125);
        }
        .card-header {
          background-color: #f8f9fa;
          border-bottom: 1px solid rgba(0, 0, 0, 0.125);
        }
      `}</style>
    </>
  );
};

export default CompanySettingsPage;
