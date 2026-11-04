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
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#1D9E75', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontWeight: 800, fontSize: 19, fontFamily: 'Arial, sans-serif', lineHeight: 1 }}>H</span>
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
