'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  {
    href: '/dashboard',
    label: 'Home',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor"
        strokeWidth={active ? 0 : 1.6} className="w-6 h-6">
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
        strokeWidth={active ? 0 : 1.6} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    href: '/log',
    label: 'Log',
    /* Centre floating action button — no active state, always green */
    icon: (_active: boolean) => (
      <div className="w-12 h-12 rounded-2xl bg-primary shadow-lg shadow-primary/30
        flex items-center justify-center -mt-5
        active:scale-95 transition-transform duration-100">
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.2} className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </div>
    ),
  },
  {
    href: '/progress',
    label: 'Progress',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor"
        strokeWidth={active ? 0 : 1.6} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    href: '/account',
    label: 'You',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor"
        strokeWidth={active ? 0 : 1.6} className="w-6 h-6">
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
      className="fixed bottom-0 inset-x-0 z-50 bg-white/90 backdrop-blur-xl"
      style={{
        borderTop: '0.5px solid rgba(0,0,0,0.06)',
        /* Push content above the iOS home indicator */
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="max-w-lg mx-auto flex items-end justify-around h-16 px-1">
        {NAV.map(({ href, label, icon }) => {
          const active = path === href || (href !== '/dashboard' && path.startsWith(href))
          const isLog  = href === '/log'

          return (
            <Link
              key={href}
              href={href}
              /* min 44×44 touch target — iOS HIG requirement */
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 min-h-[44px]
                transition-all duration-150 active:opacity-70
                ${isLog ? 'pb-1' : active ? 'text-primary' : 'text-gray-400'}`}
            >
              {icon(active)}
              {!isLog && (
                <span className={`text-[10px] font-medium leading-none
                  ${active ? 'text-primary' : 'text-gray-400'}`}>
                  {label}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
