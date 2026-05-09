import { useNavigate } from 'react-router-dom';
import { useAppState } from '../hooks/useAppState';
import { useSettings } from '../hooks/useSettings';
import { ttsService } from '../services/tts';
import { theme } from '../config/theme';
import { ResultModel, toSpokenSentence } from '../models/result';

export default function HistoryPage() {
  const navigate = useNavigate();
  const { history } = useAppState();
  const { colors, settings } = useSettings();

  function timeAgo(d: Date): string {
    const diff = Date.now() - d.getTime();
    const secs = Math.floor(diff / 1000);
    if (secs < 60) return 'Just now';
    const mins = Math.floor(secs / 60);
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  function speakResult(r: ResultModel) {
    ttsService.speak(r.voiceAlert || toSpokenSentence(r), settings.language);
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* App bar */}
      <div className="flex items-center px-4 py-3 pt-safe" style={{ backgroundColor: colors.background }}>
        <button
          onClick={() => navigate(-1)}
          className="w-14 h-14 flex items-center justify-center"
        >
          <svg className="w-7 h-7" style={{ color: colors.textPrimary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-semibold ml-2" style={{ color: colors.textPrimary }}>History</h1>
      </div>

      {/* Content */}
      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-32">
          <svg className="w-16 h-16" style={{ color: colors.inactive }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-4 text-2xl font-semibold" style={{ color: colors.textTertiary }}>No results yet</p>
          <p className="mt-2 text-lg text-center px-12" style={{ color: colors.textSecondary }}>
            Analyze your surroundings to see results here
          </p>
        </div>
      ) : (
        <div className="px-4 py-2 space-y-3 pb-8">
          {history.map((result, i) => (
            <button
              key={i}
              onClick={() => speakResult(result)}
              className="w-full text-left p-4 rounded-2xl"
              style={{ backgroundColor: colors.surface }}
            >
              <div className="flex justify-between items-start">
                <span className="text-lg font-bold truncate flex-1" style={{ color: colors.textPrimary }}>
                  {result.priorityObject}
                </span>
                <span className="text-lg font-bold ml-2" style={{ color: theme.accent }}>
                  {result.distance.toFixed(1)}m
                </span>
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-sm" style={{ color: colors.textSecondary }}>{result.sceneType}</span>
                <span className="text-sm" style={{ color: colors.textTertiary }}>{timeAgo(result.timestamp)}</span>
              </div>
              {(result.alerts.length > 0 || result.currency) && (
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {result.alerts.map((a, j) => (
                    <span key={j} className="px-2.5 py-1 rounded-xl text-xs" style={{
                      backgroundColor: `${theme.warning}26`,
                      color: theme.warning,
                    }}>{a}</span>
                  ))}
                  {result.currency && (
                    <span className="px-2.5 py-1 rounded-xl text-xs" style={{
                      backgroundColor: `${theme.success}26`,
                      color: theme.success,
                    }}>{result.currency}</span>
                  )}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
