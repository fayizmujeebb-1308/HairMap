'use client'

import { useEffect, useRef, useState } from 'react'

type Theme = 'system' | 'dark' | 'light'

const OPTIONS: { value: Theme; icon: React.ReactNode; label: string }[] = [
  {
    value: 'system',
    label: 'Auto',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
        <circle cx="12" cy="12" r="4" />
        <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    ),
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
  },
  {
    value: 'light',
    label: 'Light',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <circle cx="12" cy="12" r="5" />
        <path strokeLinecap="round" stroke="currentColor" strokeWidth={2} fill="none"
          d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    ),
  },
]

export default function DarkModeToggle() {
  const [theme, setTheme] = useState<Theme>('system')
  const [mounted, setMounted] = useState(false)
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('hairmap-theme') as Theme | null
    if (saved && OPTIONS.find(o => o.value === saved)) setTheme(saved)
  }, [])

  // Move pill to active option
  useEffect(() => {
    if (!mounted) return
    const idx = OPTIONS.findIndex(o => o.value === theme)
    const btn = optionRefs.current[idx]
    const container = containerRef.current
    if (!btn || !container) return
    const containerRect = container.getBoundingClientRect()
    const btnRect = btn.getBoundingClientRect()
    setPillStyle({
      left: btnRect.left - containerRect.left,
      width: btnRect.width,
    })
  }, [theme, mounted])

  function select(value: Theme) {
    setTheme(value)
    localStorage.setItem('hairmap-theme', value)
    const root = document.documentElement
    if (value === 'dark') root.setAttribute('data-theme', 'dark')
    else if (value === 'light') root.setAttribute('data-theme', 'light')
    else root.removeAttribute('data-theme')
  }

  if (!mounted) return null

  return (
    <div
      ref={containerRef}
      className="relative flex items-center p-1 rounded-2xl"
      style={{
        background: 'rgba(120,120,128,0.16)',
        backdropFilter: 'blur(20px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
        gap: 2,
      }}
    >
      {/* Sliding glass pill */}
      <div
        className="absolute top-1 bottom-1 rounded-xl pointer-events-none"
        style={{
          left: pillStyle.left,
          width: pillStyle.width,
          background: 'rgba(255,255,255,0.92)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
          transition: 'left 0.28s cubic-bezier(0.34,1.56,0.64,1), width 0.28s cubic-bezier(0.34,1.56,0.64,1)',
          zIndex: 0,
        }}
      />

      {OPTIONS.map((opt, i) => {
        const active = theme === opt.value
        return (
          <button
            key={opt.value}
            ref={el => { optionRefs.current[i] = el }}
            onClick={() => select(opt.value)}
            className="relative flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-colors duration-150 select-none"
            style={{
              color: active ? '#059669' : 'rgba(60,60,67,0.6)',
              zIndex: 1,
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            {opt.icon}
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
