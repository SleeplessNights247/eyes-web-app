import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Settings, loadSettings, saveSettings, getDefaultSettings } from '../models/settings';
import { theme as themeConfig } from '../config/theme';

interface SettingsContextType {
  settings: Settings;
  updateSettings: (partial: Partial<Settings>) => void;
  isDark: boolean;
  colors: typeof themeConfig.dark;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(getDefaultSettings);

  useEffect(() => {
    const loaded = loadSettings();
    setSettings(loaded);
  }, []);

  const updateSettings = useCallback((partial: Partial<Settings>) => {
    setSettings(prev => {
      const next = { ...prev, ...partial };
      saveSettings(next);
      return next;
    });
  }, []);

  const isDark = settings.themeMode === 'dark' ||
    (settings.themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const colors = isDark ? themeConfig.dark : themeConfig.light;

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, isDark, colors }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
