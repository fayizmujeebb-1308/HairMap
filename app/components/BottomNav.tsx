'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState, useCallback } from 'react'

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
      <div className="w-13 h-13 rounded-[18px] flex items-center justify-center -mt-6
        active:scale-95 transition-all duration-150"
        style={{
          width: 52, height: 52,
          background: 'linear-gradient(135deg, #10b981, #059669)',
          boxShadow: '0 4px 16px rgba(16,185,129,0.4)',
        }}>
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

const logIdx = NAV.findIndex(n => n.href === '/log')

export default function BottomNav() {
  const path = usePathname()
  const router = useRouter()
  const navRef = useRef<HTMLDivElement>(null)

  // Resolved active index from route
  const routeActiveIdx = NAV.findIndex(({ href }) =>
    href === path || (href !== '/dashboard' && path.startsWith(href))
  )

  // Drag state
  const [mounted, setMounted] = useState(false)
  const [dragging, setDragging] = useState(false)
  // dragIdx = which tab the pill is hovering over during drag
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  // pillStyle: computed from either route or drag
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number } | null>(null)

  useEffect(() => { setMounted(true) }, [])

  // Compute pill position for a given nav index
  const getPillForIdx = useCallback((idx: number) => {
    if (!navRef.current) return null
    const btns = navRef.current.querySelectorAll<HTMLElement>('[data-navbtn]')
    const btn = btns[idx]
    if (!btn || idx === logIdx) return null
    const navRect = navRef.current.getBoundingClientRect()
    const btnRect = btn.getBoundingClientRect()
    return {
      left: btnRect.left - navRect.left + (btnRect.width - 50) / 2,
      width: 50,
    }
  }, [])

  // Update pill when route changes (no drag in progress)
  useEffect(() => {
    if (!mounted || dragging) return
    const idx = routeActiveIdx >= 0 ? routeActiveIdx : 0
    setPillStyle(getPillForIdx(idx))
  }, [path, mounted, routeActiveIdx, dragging, getPillForIdx])

  // Figure out which tab index a clientX corresponds to
  const idxFromClientX = useCallback((clientX: number): number => {
    if (!navRef.current) return 0
    const btns = navRef.current.querySelectorAll<HTMLElement>('[data-navbtn]')
    let closest = 0
    let closestDist = Infinity
    btns.forEach((btn, i) => {
      const rect = btn.getBoundingClientRect()
      const center = rect.left + rect.width / 2
      const dist = Math.abs(clientX - center)
      if (dist < closestDist) {
        closestDist = dist
        closest = i
      }
    })
    return closest
  }, [])

  const handleDragStart = useCallback((clientX: number) => {
    setDragging(true)
    const idx = idxFromClientX(clientX)
    setDragIdx(idx)
    if (idx !== logIdx) setPillStyle(getPillForIdx(idx))
  }, [idxFromClientX, getPillForIdx])

  const handleDragMove = useCallback((clientX: number) => {
    const idx = idxFromClientX(clientX)
    setDragIdx(idx)
    if (idx !== logIdx) setPillStyle(getPillForIdx(idx))
  }, [idxFromClientX, getPillForIdx])

  const handleDragEnd = useCallback((clientX: number) => {
    const idx = idxFromClientX(clientX)
    setDragging(false)
    setDragIdx(null)
    if (idx !== logIdx) {
      router.push(NAV[idx].href)
    }
    // pill snaps to route via the route effect after navigation
  }, [idxFromClientX, router])

  // Mouse drag
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleDragStart(e.clientX)

    const onMove = (ev: MouseEvent) => handleDragMove(ev.clientX)
    const onUp   = (ev: MouseEvent) => {
      handleDragEnd(ev.clientX)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  // Touch drag
  const onTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX)

    const onMove = (ev: TouchEvent) => { ev.preventDefault(); handleDragMove(ev.touches[0].clientX) }
    const onEnd  = (ev: TouchEvent) => {
      const x = ev.changedTouches[0]?.clientX ?? ev.touches[0]?.clientX ?? 0
      handleDragEnd(x)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onEnd)
    }
    window.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('touchend', onEnd)
  }

  // Which index is visually "active" (route or drag-hover)
  const displayIdx = dragging && dragIdx !== null ? dragIdx : routeActiveIdx

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50"
      style={{
        background: 'var(--bg-nav)',
        backdropFilter: 'blur(24px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
        borderTop: '0.5px solid var(--bg-nav-border)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div
        ref={navRef}
        className="max-w-lg mx-auto flex items-end justify-around h-16 px-2 relative"
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        {/* animated glass pill — no transition during drag for instant response, spring on release */}
        {pillStyle && mounted && (
          <div
            aria-hidden
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              left: pillStyle.left,
              width: pillStyle.width,
              height: 30,
              background: 'rgba(16,185,129,0.10)',
              backdropFilter: 'blur(14px) saturate(1.6)',
              WebkitBackdropFilter: 'blur(14px) saturate(1.6)',
              border: '1px solid rgba(16,185,129,0.22)',
              borderRadius: 100,
              pointerEvents: 'none',
              // Instant during drag, spring on route-based snap
              transition: dragging ? 'none' : 'left 0.36s cubic-bezier(0.22,1,0.36,1)',
              zIndex: 0,
            }}
          />
        )}

        {NAV.map(({ href, label, icon }, i) => {
          const active = displayIdx === i
          const isLog  = href === '/log'

          return (
            <Link
              key={href}
              href={href}
              data-navbtn
              onClick={e => {
                // During drag, prevent Link navigation — we handle it in handleDragEnd
                if (dragging) e.preventDefault()
              }}
              className={`flex flex-col items-center justify-center gap-1 flex-1 min-h-[44px] relative z-10
                transition-all duration-200 active:opacity-60
                ${isLog ? 'pb-1' : ''}`}
            >
              {isLog ? (
                icon(false)
              ) : (
                <>
                  <div className={`flex items-center justify-center w-10 h-8 rounded-2xl transition-all duration-200
                    ${active ? 'text-emerald-500' : 'text-gray-400'}`}>
                    {icon(active)}
                  </div>
                  <span className={`text-[10px] font-medium leading-none transition-colors duration-200
                    ${active ? 'text-emerald-500 font-semibold' : 'text-gray-400'}`}>
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
