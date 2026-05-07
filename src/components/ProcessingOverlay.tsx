import { theme } from '../config/theme';

export default function ProcessingOverlay() {
  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/60">
      <div className="relative w-20 h-20 mb-6">
        {/* Pulsing ring */}
        <div
          className="absolute inset-0 rounded-full animate-ping"
          style={{ backgroundColor: `${theme.accent}1A` }}
        />
        {/* Spinning ring */}
        <div
          className="absolute inset-2 rounded-full border-[3px] border-t-transparent animate-spin"
          style={{ borderColor: `${theme.accent} transparent ${theme.accent} ${theme.accent}` }}
        />
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-8 h-8" style={{ color: theme.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </div>
      <p className="text-lg font-medium text-white">
        Analyzing your surroundings
      </p>
      <div className="mt-4 w-48 h-1 rounded-full overflow-hidden" style={{ backgroundColor: `${theme.accent}33` }}>
        <div
          className="h-full rounded-full animate-loading-bar"
          style={{ backgroundColor: theme.accent }}
        />
      </div>
    </div>
  );
}
