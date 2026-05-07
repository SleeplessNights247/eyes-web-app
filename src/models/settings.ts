import { AppConstants } from '../config/constants';
import { ThemeMode } from '../config/theme';

export interface Settings {
  voiceEnabled: boolean;
  vibrationEnabled: boolean;
  vibrationIntensity: number;
  speechRate: number;
  autoScan: boolean;
  scanIntervalSeconds: number;
  language: 'en' | 'fil';
  themeMode: ThemeMode;
  onboardingComplete: boolean;
}

const STORAGE_KEY = 'eyes_settings';

export function getDefaultSettings(): Settings {
  return {
    voiceEnabled: AppConstants.defaultVoiceEnabled,
    vibrationEnabled: AppConstants.defaultVibrationEnabled,
    vibrationIntensity: AppConstants.defaultVibrationIntensity,
    speechRate: AppConstants.defaultSpeechRate,
    autoScan: AppConstants.defaultAutoScan,
    scanIntervalSeconds: AppConstants.defaultScanIntervalSeconds,
    language: AppConstants.defaultLanguage,
    themeMode: 'dark',
    onboardingComplete: false,
  };
}

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...getDefaultSettings(), ...parsed };
    }
  } catch {
    // ignore
  }
  return getDefaultSettings();
}

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}
