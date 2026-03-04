import { useNavigate } from 'react-router-dom';
import { useSettings } from '../hooks/useSettings';
import { t } from '../config/localizations';
import { theme } from '../config/theme';
import { AppConstants } from '../config/constants';

export default function AboutPage() {
  const navigate = useNavigate();
  const { colors, settings } = useSettings();
  const lang = settings.language;

  function section(title: string, children: React.ReactNode) {
    return (
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-wider mb-3" style={{ color: colors.textTertiary }}>{title}</p>
        <div className="rounded-2xl p-4" style={{ backgroundColor: colors.surface }}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* App bar */}
      <div className="flex items-center px-4 py-3 pt-safe" style={{ backgroundColor: colors.background }}>
        <button onClick={() => navigate(-1)} className="w-14 h-14 flex items-center justify-center">
          <svg className="w-7 h-7" style={{ color: colors.textPrimary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-semibold ml-2" style={{ color: colors.textPrimary }}>
          {t('about_title', lang)}
        </h1>
      </div>

      <div className="px-4 pb-12">
        {/* Logo header */}
        <div className="flex flex-col items-center py-8">
          <div
            className="w-20 h-20 rounded-[20px] overflow-hidden"
            style={{ boxShadow: `0 8px 24px ${theme.accent}33` }}
          >
            <img src="/images/apk-icon.png" alt="EYES" className="w-full h-full object-cover" />
          </div>
          <h2 className="mt-4 text-2xl font-bold" style={{ color: colors.textPrimary }}>
            {AppConstants.appName}
          </h2>
          <p className="text-base" style={{ color: colors.textSecondary }}>
            {AppConstants.appTagline}
          </p>
          <p className="mt-1 text-sm" style={{ color: colors.textTertiary }}>
            v{AppConstants.appVersion} · {AppConstants.academicYear}
          </p>
        </div>

        {/* Purpose */}
        {section(t('purpose', lang).toUpperCase(), (
          <p className="text-base leading-relaxed" style={{ color: colors.textSecondary }}>
            {AppConstants.aboutDescription}
          </p>
        ))}

        {/* Technology */}
        {section(t('technology', lang).toUpperCase(), (
          <div className="space-y-3">
            {AppConstants.aiModels.map((model, i) => {
              const [name, desc] = model.split(' — ');
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.accent }} />
                  <div>
                    <span className="text-base font-semibold" style={{ color: colors.textPrimary }}>{name}</span>
                    {desc && <span className="text-base" style={{ color: colors.textSecondary }}> — {desc}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* Disclaimer */}
        {section(t('disclaimer', lang).toUpperCase(), (
          <p className="text-base leading-relaxed" style={{ color: colors.textSecondary }}>
            {AppConstants.thesisDisclaimer}
          </p>
        ))}

        {/* Developers */}
        {section(t('developers', lang).toUpperCase(), (
          <div className="space-y-3">
            {AppConstants.developers.map((dev, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base"
                  style={{ backgroundColor: `${theme.accent}33` }}
                >
                  <span style={{ color: theme.accent }}>{dev.charAt(0)}</span>
                </div>
                <span className="text-base font-medium" style={{ color: colors.textPrimary }}>{dev}</span>
              </div>
            ))}
          </div>
        ))}

        {/* Footer */}
        <div className="text-center mt-8 mb-4">
          <p className="text-sm" style={{ color: colors.textTertiary }}>
            {t('made_with_purpose', lang)}
          </p>
        </div>
      </div>
    </div>
  );
}
