import { useNavigate } from 'react-router-dom';
import { useSettings } from '../hooks/useSettings';
import { HapticService } from '../services/haptic';
import { t } from '../config/localizations';
import { theme } from '../config/theme';
import { AppConstants } from '../config/constants';
import { ThemeMode } from '../config/theme';
import { useState } from 'react';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { settings, updateSettings, colors } = useSettings();
  const lang = settings.language;
  const [showVoiceWarning, setShowVoiceWarning] = useState(false);

  function section(title: string, children: React.ReactNode) {
    return (
      <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: colors.surface }}>
        <p className="text-xs font-semibold tracking-wider mb-3" style={{ color: colors.textTertiary }}>{title}</p>
        {children}
      </div>
    );
  }

  function divider() {
    return <div className="h-px my-3" style={{ backgroundColor: colors.divider }} />;
  }

  function toggle(label: string, value: boolean, onChange: (v: boolean) => void) {
    return (
      <div className="flex items-center justify-between py-2 min-h-[56px]">
        <span className="text-lg font-medium" style={{ color: colors.textPrimary }}>{label}</span>
        <button
          onClick={() => { onChange(!value); HapticService.confirm(); }}
          className="w-12 h-7 rounded-full relative transition-colors duration-200"
          style={{
            backgroundColor: value ? `${theme.accent}66` : colors.inactive,
          }}
        >
          <div
            className="w-5 h-5 rounded-full absolute top-1 transition-all duration-200"
            style={{
              backgroundColor: value ? theme.accent : colors.textSecondary,
              left: value ? 26 : 4,
            }}
          />
        </button>
      </div>
    );
  }

  function navRow(label: string, onTap: () => void) {
    return (
      <button
        onClick={onTap}
        className="flex items-center justify-between py-3 w-full min-h-[56px]"
      >
        <span className="text-lg font-medium" style={{ color: colors.textPrimary }}>{label}</span>
        <svg className="w-5 h-5" style={{ color: colors.textTertiary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    );
  }

  function infoRow(label: string, value: string) {
    return (
      <div className="flex items-center justify-between py-3 min-h-[56px]">
        <span className="text-lg font-medium" style={{ color: colors.textPrimary }}>{label}</span>
        <span className="text-base" style={{ color: colors.textTertiary }}>{value}</span>
      </div>
    );
  }

  const themeModes: { mode: ThemeMode; key: string }[] = [
    { mode: 'light', key: 'light' },
    { mode: 'dark', key: 'dark' },
    { mode: 'system', key: 'system' },
  ];

  const intensityOptions = [
    { value: 1, key: 'light_intensity' },
    { value: 2, key: 'medium_intensity' },
    { value: 3, key: 'strong_intensity' },
  ];

  return (
    <div className="h-screen overflow-y-auto" style={{ backgroundColor: colors.background }}>
      {/* App bar */}
      <div className="flex items-center px-4 py-3 pt-safe" style={{ backgroundColor: colors.background }}>
        <button onClick={() => navigate(-1)} className="w-14 h-14 flex items-center justify-center">
          <svg className="w-7 h-7" style={{ color: colors.textPrimary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-semibold ml-2" style={{ color: colors.textPrimary }}>
          {t('settings', lang)}
        </h1>
      </div>

      <div className="px-4 pb-12">
        {/* Appearance */}
        {section(t('appearance', lang), (
          <>
            <p className="text-lg font-medium mb-2" style={{ color: colors.textPrimary }}>{t('theme', lang)}</p>
            <div className="flex gap-2">
              {themeModes.map(({ mode, key }) => (
                <button
                  key={mode}
                  onClick={() => { updateSettings({ themeMode: mode }); HapticService.confirm(); }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                  style={{
                    backgroundColor: settings.themeMode === mode ? theme.accent : 'transparent',
                    color: settings.themeMode === mode ? '#fff' : colors.textSecondary,
                    border: settings.themeMode === mode ? 'none' : `1px solid ${colors.inactive}`,
                  }}
                >
                  {t(key, lang)}
                </button>
              ))}
            </div>
          </>
        ))}

        {/* Feedback */}
        {section(t('feedback', lang), (
          <>
            {toggle(t('voice_feedback', lang), settings.voiceEnabled, (v) => {
              if (!v) { setShowVoiceWarning(true); } else { updateSettings({ voiceEnabled: v }); }
            })}
            {divider()}
            {toggle(t('vibration_feedback', lang), settings.vibrationEnabled, (v) => {
              updateSettings({ vibrationEnabled: v });
            })}
            {settings.vibrationEnabled && (
              <>
                {divider()}
                <div className="py-2">
                  <p className="text-lg font-medium mb-2" style={{ color: colors.textPrimary }}>{t('vibration_intensity', lang)}</p>
                  <div className="flex gap-2">
                    {intensityOptions.map(({ value, key }) => (
                      <button
                        key={value}
                        onClick={() => { updateSettings({ vibrationIntensity: value }); HapticService.confirm(); }}
                        className="flex-1 py-2 rounded-xl text-sm font-semibold transition-colors"
                        style={{
                          backgroundColor: settings.vibrationIntensity === value ? theme.accent : 'transparent',
                          color: settings.vibrationIntensity === value ? '#fff' : colors.textSecondary,
                          border: settings.vibrationIntensity === value ? 'none' : `1px solid ${colors.inactive}`,
                        }}
                      >
                        {t(key, lang)}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
            {divider()}
            <div className="py-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg font-medium" style={{ color: colors.textPrimary }}>{t('speech_rate', lang)}</span>
                <span className="text-sm font-medium" style={{ color: colors.textTertiary }}>
                  {Math.round(settings.speechRate * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.25"
                max="1.0"
                step="0.25"
                value={settings.speechRate}
                onChange={(e) => updateSettings({ speechRate: parseFloat(e.target.value) })}
                className="w-full accent-blue-500"
              />
            </div>
          </>
        ))}

        {/* Scanning */}
        {section(t('scanning', lang), (
          <>
            {toggle(t('auto_scan', lang), settings.autoScan, (v) => {
              updateSettings({ autoScan: v });
            })}
            {settings.autoScan && (
              <>
                {divider()}
                <div className="py-2">
                  <p className="text-lg font-medium mb-2" style={{ color: colors.textPrimary }}>{t('scan_interval', lang)}</p>
                  <div className="flex gap-2">
                    {AppConstants.scanIntervals.map(val => (
                      <button
                        key={val}
                        onClick={() => { updateSettings({ scanIntervalSeconds: val }); HapticService.confirm(); }}
                        className="flex-1 py-2 rounded-xl text-sm font-semibold transition-colors"
                        style={{
                          backgroundColor: settings.scanIntervalSeconds === val ? theme.accent : 'transparent',
                          color: settings.scanIntervalSeconds === val ? '#fff' : colors.textSecondary,
                          border: settings.scanIntervalSeconds === val ? 'none' : `1px solid ${colors.inactive}`,
                        }}
                      >
                        {val}s
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        ))}

        {/* General */}
        {section(t('general', lang), (
          <>
            <div className="py-2">
              <p className="text-lg font-medium mb-2" style={{ color: colors.textPrimary }}>{t('language', lang)}</p>
              <div className="flex gap-2">
                {(['en', 'fil'] as const).map(l => (
                  <button
                    key={l}
                    onClick={() => { updateSettings({ language: l }); HapticService.confirm(); }}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                    style={{
                      backgroundColor: settings.language === l ? theme.accent : 'transparent',
                      color: settings.language === l ? '#fff' : colors.textSecondary,
                      border: settings.language === l ? 'none' : `1px solid ${colors.inactive}`,
                    }}
                  >
                    {l === 'en' ? t('english', lang) : t('filipino', lang)}
                  </button>
                ))}
              </div>
            </div>
            {divider()}
            {navRow(t('history', lang), () => navigate('/history'))}
          </>
        ))}

        {/* About */}
        {section(t('about', lang), (
          <>
            {navRow(t('about_eyes', lang), () => navigate('/about'))}
            {divider()}
            {infoRow(t('version', lang), AppConstants.appVersion)}
          </>
        ))}
      </div>

      {/* Voice warning dialog */}
      {showVoiceWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setShowVoiceWarning(false)}>
          <div
            className="mx-8 p-6 rounded-[20px] max-w-sm w-full"
            style={{ backgroundColor: colors.surface }}
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-2xl font-semibold" style={{ color: colors.textPrimary }}>
              {t('disable_voice_title', lang)}
            </h3>
            <p className="mt-3 text-lg" style={{ color: colors.textSecondary }}>
              {t('disable_voice_message', lang)}
            </p>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowVoiceWarning(false)}
                className="px-4 py-2 text-base"
                style={{ color: colors.textSecondary }}
              >
                {t('cancel', lang)}
              </button>
              <button
                onClick={() => { updateSettings({ voiceEnabled: false }); setShowVoiceWarning(false); }}
                className="px-4 py-2 text-base font-medium"
                style={{ color: theme.danger }}
              >
                {t('turn_off', lang)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
