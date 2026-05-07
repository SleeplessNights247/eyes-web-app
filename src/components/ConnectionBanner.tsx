import { theme } from '../config/theme';

interface Props {
  isConnected: boolean;
  isBackendReachable: boolean;
  onRetry: () => void;
}

export default function ConnectionBanner({ isConnected, isBackendReachable, onRetry }: Props) {
  if (isConnected && isBackendReachable) return null;

  const isOffline = !isConnected;
  const color = isOffline ? theme.danger : theme.warning;
  const message = isOffline ? 'No internet connection' : 'Backend server unreachable';

  return (
    <div
      className="mx-4 px-4 py-2.5 rounded-2xl flex items-center justify-between"
      style={{ backgroundColor: `${color}26` }}
    >
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5" style={{ color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          {isOffline ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 010 12.728M5.636 5.636a9 9 0 000 12.728M12 12h.01" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h2m16 0h2M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
          )}
        </svg>
        <span className="text-sm font-medium" style={{ color }}>{message}</span>
      </div>
      <button
        onClick={onRetry}
        className="text-sm font-semibold px-3 py-1 rounded-lg"
        style={{ color }}
      >
        Retry
      </button>
    </div>
  );
}
