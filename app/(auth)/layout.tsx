import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #f0fdf4 0%, #f8fafb 50%, #ecfdf5 100%)' }}>

      {/* Decorative blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div style={{ position: 'absolute', top: '-100px', right: '-80px', width: '360px', height: '360px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.09) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-100px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(52,211,153,0.07) 0%, transparent 70%)' }} />
      </div>

      <header className="relative z-10 px-6 py-5">
        <Link href="/" className="flex items-center gap-2.5 w-fit">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm" style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 3.5V14.5M14 3.5V14.5M4 9H10.5C11.5 9 12.5 8.2 13 7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-semibold text-gray-900 text-lg">HairMap</span>
        </Link>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-10">
        {children}
      </main>

      <footer className="relative z-10 px-6 py-4 text-center text-xs text-gray-400">
        <Link href="/privacy" className="hover:text-gray-600 mr-4 transition-colors">Privacy Policy</Link>
        <Link href="/terms" className="hover:text-gray-600 transition-colors">Terms of Service</Link>
      </footer>
    </div>
  )
}
