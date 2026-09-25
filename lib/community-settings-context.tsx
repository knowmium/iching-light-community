import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import {
  COMMUNITY_SETTINGS_KEY,
  DEFAULT_COMMUNITY_SETTINGS,
  normalizeCommunitySettings,
  type CommunitySettings,
} from './community-settings';

interface CommunitySettingsContextValue {
  settings: CommunitySettings;
  isLoading: boolean;
  updateSettings: (updates: Partial<CommunitySettings>) => Promise<void>;
}

const CommunitySettingsContext = createContext<CommunitySettingsContextValue | null>(null);

export function CommunitySettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState(DEFAULT_COMMUNITY_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const hydrate = async () => {
      try {
        const stored = await AsyncStorage.getItem(COMMUNITY_SETTINGS_KEY);
        if (stored && isMounted) {
          setSettings(normalizeCommunitySettings(JSON.parse(stored)));
        }
      } catch (error) {
        console.error('Failed to load Community settings:', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void hydrate();
    return () => {
      isMounted = false;
    };
  }, []);

  const updateSettings = useCallback(async (updates: Partial<CommunitySettings>) => {
    const nextSettings = normalizeCommunitySettings({ ...settings, ...updates });
    setSettings(nextSettings);
    await AsyncStorage.setItem(COMMUNITY_SETTINGS_KEY, JSON.stringify(nextSettings));
  }, [settings]);

  const value = useMemo(
    () => ({ settings, isLoading, updateSettings }),
    [settings, isLoading, updateSettings],
  );

  return (
    <CommunitySettingsContext.Provider value={value}>
      {children}
    </CommunitySettingsContext.Provider>
  );
}

export function useCommunitySettings() {
  const context = useContext(CommunitySettingsContext);
  if (!context) {
    throw new Error('useCommunitySettings must be used within CommunitySettingsProvider');
  }
  return context;
}
