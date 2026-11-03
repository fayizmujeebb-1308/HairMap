'use client'

interface Props {
  title?: string
  message?: string
  reset?: () => void
}

export default function ErrorScreen({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  reset,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      {/* Icon */}
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
        style={{
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.15)',
        }}
      >
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <circle cx="18" cy="18" r="14" stroke="#ef4444" strokeWidth="2" strokeOpacity="0.4"/>
          <path d="M18 11v8" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="18" cy="23.5" r="1.25" fill="#ef4444"/>
        </svg>
      </div>

      <h2 className="font-serif text-2xl text-gray-900 mb-2">{title}</h2>
      <p className="text-sm text-gray-400 leading-relaxed max-w-[260px] mb-8">{message}</p>

      {reset && (
        <button
          onClick={reset}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-white transition-opacity active:opacity-80"
          style={{
            background: 'linear-gradient(135deg, #059669, #10b981)',
            boxShadow: '0 6px 20px rgba(29,158,117,0.28)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 7a6 6 0 1 0 6-6 6 6 0 0 1-4.243 1.757M1 2.5V7h4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Try again
        </button>
      )}
    </div>
  )
}
