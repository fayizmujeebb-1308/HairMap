export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636a9 9 0 010 12.728M15.536 8.464a5 5 0 010 7.072M12 12h.01M8.464 15.536a5 5 0 010-7.072M5.636 18.364a9 9 0 010-12.728" />
        </svg>
      </div>
      <h1 className="font-serif text-2xl text-gray-900 mb-2">You&apos;re offline</h1>
      <p className="text-gray-500 text-sm max-w-xs">
        Please check your internet connection and try again.
      </p>
    </div>
  )
}
