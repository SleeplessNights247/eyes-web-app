import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../hooks/useSettings';
import { ttsService } from '../services/tts';
import { AppConstants } from '../config/constants';
import { theme } from '../config/theme';

export default function SplashPage() {
  const navigate = useNavigate();
  const { settings, isDark } = useSettings();
  const [showRetry, setShowRetry] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const colors = isDark ? theme.dark : theme.light;

  useEffect(() => {
    setOpacity(1);
    initApp();
  }, []);

  async function initApp() {
    try {
      ttsService.init();
      await new Promise(r => setTimeout(r, 800));
      ttsService.speak('EYES. Loading.');
      await new Promise(r => setTimeout(r, 2000));

      if (!settings.onboardingComplete) {
        navigate('/onboarding', { replace: true });
      } else {
        navigate('/home', { replace: true });
      }
    } catch {
      setShowRetry(true);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: colors.background, transition: 'opacity 0.4s', opacity }}
    >
      <div className="flex flex-col items-center">
        <div
          className="w-[120px] h-[120px] rounded-[28px] overflow-hidden"
          style={{ boxShadow: `0 10px 30px ${theme.accent}4D` }}
        >
          <img src="/images/apk-icon.png" alt="EYES logo" className="w-full h-full object-cover" />
        </div>
        <h1
          className="mt-6 text-[32px] font-bold tracking-wide"
          style={{ color: colors.textPrimary }}
        >
          {AppConstants.appName}
        </h1>
        <p
          className="mt-2 text-lg font-medium"
          style={{ color: colors.textSecondary }}
        >
          {AppConstants.appTagline}
        </p>
        <div className="mt-16">
          {showRetry ? (
            <div className="flex flex-col items-center">
              <p className="text-sm" style={{ color: theme.warning }}>
                Taking longer than usual…
              </p>
              <button
                onClick={() => { setShowRetry(false); initApp(); }}
                className="mt-4 px-8 py-3 rounded-2xl text-lg font-semibold text-white"
                style={{ backgroundColor: theme.accent }}
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="w-[200px] h-[3px] rounded-full overflow-hidden" style={{ backgroundColor: colors.inactive }}>
              <div
                className="h-full rounded-full animate-loading-bar"
                style={{ backgroundColor: theme.accent }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
