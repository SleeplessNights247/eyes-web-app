import { theme } from '../config/theme';

interface Props {
  isProcessing: boolean;
  onTap: () => void;
}

export default function AnalyzeButton({ isProcessing, onTap }: Props) {
  return (
    <button
      onClick={isProcessing ? undefined : onTap}
      disabled={isProcessing}
      aria-label="Analyze surroundings"
      className="relative flex items-center justify-center"
      style={{ width: 88, height: 88 }}
    >
      {/* Outer ring */}
      <div
        className="absolute inset-0 rounded-full border-[3px] transition-opacity duration-200"
        style={{
          borderColor: isProcessing ? `${theme.accent}33` : `${theme.accent}66`,
          opacity: isProcessing ? 0.5 : 1,
        }}
      />
      {/* Inner button */}
      <div
        className="w-[72px] h-[72px] rounded-full flex items-center justify-center transition-all duration-200"
        style={{
          backgroundColor: isProcessing ? `${theme.accent}33` : theme.accent,
          boxShadow: isProcessing ? 'none' : `0 4px 20px ${theme.accent}66`,
        }}
      >
        {isProcessing ? (
          <div
            className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: `${theme.accent} transparent ${theme.accent} ${theme.accent}` }}
          />
        ) : (
          <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        )}
      </div>
    </button>
  );
}
