import Link from 'next/link'

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-gray-100" style={{ borderWidth: '0.5px' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">H</span>
          </div>
          <span className="font-semibold text-gray-900 text-lg">HairMap</span>
        </div>
        <Link
          href="/login"
          className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          Sign in
        </Link>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-primary-light text-primary text-xs font-medium px-3 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
          Professional Hair Health Platform
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-gray-900 leading-tight mb-6 max-w-3xl">
          Track, Preserve and Restore Your Hair
        </h1>

        <p className="text-gray-500 text-lg sm:text-xl max-w-xl mb-10 leading-relaxed">
          Professional hair health tracking and long-term progress monitoring. Know exactly what your hair will look like in the future.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          <Link
            href="/signup"
            className="flex-1 bg-primary hover:bg-primary-dark text-white font-medium py-3 px-6 rounded-lg transition-colors text-center text-sm"
          >
            Create Account
          </Link>
          <Link
            href="/login"
            className="flex-1 bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-6 rounded-lg transition-colors text-center text-sm border border-gray-200"
            style={{ borderWidth: '0.5px' }}
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 py-12 border-t border-gray-100" style={{ borderWidth: '0.5px' }}>
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="font-serif text-3xl text-gray-900">7</p>
            <p className="text-gray-500 text-sm mt-1">Photo angles tracked</p>
          </div>
          <div>
            <p className="font-serif text-3xl text-gray-900">AI</p>
            <p className="text-gray-500 text-sm mt-1">Powered analysis</p>
          </div>
          <div>
            <p className="font-serif text-3xl text-gray-900">10yr</p>
            <p className="text-gray-500 text-sm mt-1">Hair forecasting</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400" style={{ borderWidth: '0.5px' }}>
        <span>© 2025 HairMap</span>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-gray-600 transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-gray-600 transition-colors">Terms</Link>
        </div>
      </footer>
    </main>
  )
}
