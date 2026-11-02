'use client'

import { useEffect, useState } from 'react'

type Theme = 'system' | 'dark' | 'light'

const ICONS: Record<Theme, React.ReactNode> = {
  system: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
      <circle cx="12" cy="12" r="4"/>
      <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
    </svg>
  ),
  light: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
      <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none"/>
      <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
    </svg>
  ),
  dark: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
}

const CYCLE: Theme[] = ['system', 'dark', 'light']
const LABELS: Record<Theme, string> = { system: 'Auto', dark: 'Dark', light: 'Light' }

export default function DarkModeToggle() {
  const [theme, setTheme] = useState<Theme>('system')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('hairmap-theme') as Theme | null
    if (saved && CYCLE.includes(saved)) setTheme(saved)
  }, [])

  function cycle() {
    const next = CYCLE[(CYCLE.indexOf(theme) + 1) % CYCLE.length]
    setTheme(next)
    localStorage.setItem('hairmap-theme', next)
    const root = document.documentElement
    if (next === 'dark') root.setAttribute('data-theme', 'dark')
    else if (next === 'light') root.setAttribute('data-theme', 'light')
    else root.removeAttribute('data-theme')
  }

  if (!mounted) return null

  return (
    <button
      onClick={cycle}
      title={`Theme: ${LABELS[theme]}`}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all active:scale-95"
      style={{
        background: 'var(--bg-card)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid var(--bg-card-border)',
        color: 'var(--text-secondary)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      }}
    >
      {ICONS[theme]}
      <span className="text-[10px] font-semibold">{LABELS[theme]}</span>
    </button>
  )
}
