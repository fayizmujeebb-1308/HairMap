'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  {
    href: '/dashboard',
    label: 'Home',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor"
        strokeWidth={active ? 0 : 1.6} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: '/photos',
    label: 'Photos',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor"
        strokeWidth={active ? 0 : 1.6} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    href: '/log',
    label: 'Log',
    icon: () => (
      <div className="w-13 h-13 rounded-[18px] bg-primary flex items-center justify-center -mt-6
        shadow-glow-green active:scale-95 transition-all duration-150"
        style={{ width: 52, height: 52 }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.2} className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </div>
    ),
  },
  {
    href: '/coach',
    label: 'Coach',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor"
        strokeWidth={active ? 0 : 1.6} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
  {
    href: '/account',
    label: 'You',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor"
        strokeWidth={active ? 0 : 1.6} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
]

export default function BottomNav() {
  const path = usePathname()

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50"
      style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '0.5px solid rgba(0,0,0,0.07)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="max-w-lg mx-auto flex items-end justify-around h-16 px-2">
        {NAV.map(({ href, label, icon }) => {
          const active = path === href || (href !== '/dashboard' && path.startsWith(href))
          const isLog  = href === '/log'

          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-1 flex-1 min-h-[44px]
                transition-all duration-200 active:opacity-60
                ${isLog ? 'pb-1' : ''}`}
            >
              {isLog ? (
                icon(false)
              ) : (
                <>
                  <div className={`flex items-center justify-center w-10 h-8 rounded-2xl transition-all duration-200
                    ${active ? 'bg-primary/10 text-primary' : 'text-gray-400'}`}>
                    {icon(active)}
                  </div>
                  <span className={`text-[10px] font-medium leading-none transition-colors duration-200
                    ${active ? 'text-primary font-semibold' : 'text-gray-400'}`}>
                    {label}
                  </span>
                </>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
