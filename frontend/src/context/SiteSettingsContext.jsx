import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/api';

const SiteSettingsContext = createContext({
  settings: {},
  loading: true,
  error: null,
  getSetting: (key, fallback = '') => fallback,
});

export const SiteSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await api.get('/settings');
        if (isMounted) {
          if (res.data && res.data.success && res.data.settings) {
            setSettings(res.data.settings);
            setError(null);
          } else {
            setError('Failed to parse settings response.');
          }
        }
      } catch (err) {
        console.error('SiteSettingsProvider: Error fetching site settings:', err);
        if (isMounted) {
          setError(err.response?.data?.message || 'Failed to connect to site settings service.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  const getSetting = (key, fallback = '') => {
    if (settings && settings[key] !== undefined && settings[key] !== null && settings[key] !== '') {
      return settings[key];
    }
    return fallback;
  };

  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        loading,
        error,
        getSetting,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};

export default SiteSettingsContext;
