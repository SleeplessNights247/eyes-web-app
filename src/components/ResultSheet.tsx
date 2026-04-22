import { ResultModel } from '../models/result';
import { theme } from '../config/theme';

interface Props {
  result: ResultModel;
  onDismiss: () => void;
}

export default function ResultSheet({ result, onDismiss }: Props) {
  const distanceColor = result.distance < 1.0
    ? theme.danger
    : result.distance < 3.0
    ? theme.warning
    : theme.accent;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-40">
      <div
        className="mx-4 mb-4 rounded-3xl p-5 backdrop-blur-sm"
        style={{
          backgroundColor: 'rgba(26,26,26,0.95)',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.3)',
        }}
      >
        {/* Header row */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {result.isCritical && (
                <svg className="w-5 h-5 flex-shrink-0" style={{ color: theme.danger }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                </svg>
              )}
              <h3 className="text-xl font-bold text-white truncate">
                {result.currencyMode ? 'Currency Detected' : result.priorityObject}
              </h3>
            </div>
            <p className="text-sm mt-1" style={{ color: '#B0BEC5' }}>
              {result.sceneType}
            </p>
          </div>
          {!result.currencyMode && result.distance > 0 && (
            <div className="flex flex-col items-end ml-4">
              <span className="text-2xl font-bold" style={{ color: distanceColor }}>
                {result.distance.toFixed(1)}m
              </span>
              <span className="text-xs" style={{ color: '#666' }}>away</span>
            </div>
          )}
        </div>

        {/* Alerts */}
        {result.alerts.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {result.alerts.map((alert, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: `${theme.warning}26`,
                  color: theme.warning,
                }}
              >
                {alert}
              </span>
            ))}
          </div>
        )}

        {/* Currency */}
        {result.currencyMode && result.currencyTotal != null && (
          <div
            className="mt-3 px-4 py-2.5 rounded-2xl flex items-center gap-2"
            style={{ backgroundColor: `${theme.success}1A` }}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg" style={{ color: theme.success }}>₱</span>
              <span className="text-base font-medium" style={{ color: theme.success }}>
                {'Total: ' + result.currencyTotal.toFixed(0)}
              </span>
            </div>
            {result.currency && (
              <span className="text-xs text-right" style={{ color: theme.success }}> 
              {result.currency}
              </span>
            )}
          </div>
        )}

        {/* Detection count */}
        {result.detections.length > 0 && (
          <p className="mt-3 text-xs" style={{ color: '#666' }}>
            {result.detections.length} object{result.detections.length !== 1 ? 's' : ''} detected
          </p>
        )}

        {/* Dismiss button */}
        <button
          onClick={onDismiss}
          className="mt-4 w-full h-12 rounded-2xl text-base font-semibold text-white"
          style={{ backgroundColor: theme.accent }}
        >
          Continue Scanning
        </button>
      </div>
    </div>
  );
}