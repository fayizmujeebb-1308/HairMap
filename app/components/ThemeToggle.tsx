'use client'

import { useEffect, useState } from 'react'

type Theme = 'system' | 'light' | 'dark'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('system')

  useEffect(() => {
    const stored = localStorage.getItem('hairmap-theme') as Theme | null
    if (stored) setTheme(stored)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark')
    } else if (theme === 'light') {
      root.setAttribute('data-theme', 'light')
    } else {
      root.removeAttribute('data-theme')
    }
    localStorage.setItem('hairmap-theme', theme)
  }, [theme])

  return { theme, setTheme }
}

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const cycle = () => {
    setTheme(t => t === 'system' ? 'dark' : t === 'dark' ? 'light' : 'system')
  }

  const icon = theme === 'dark' ? '🌙' : theme === 'light' ? '☀️' : '⚙️'
  const label = theme === 'dark' ? 'Dark' : theme === 'light' ? 'Light' : 'System'

  return (
    <button
      onClick={cycle}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        borderRadius: 20,
        border: '1px solid var(--bg-card-border)',
        background: 'var(--bg-card)',
        color: 'var(--text-secondary)',
        fontSize: 13,
        fontWeight: 500,
        cursor: 'pointer',
      }}
      title={`Theme: ${label} — tap to cycle`}
    >
      <span style={{ fontSize: 15 }}>{icon}</span>
      <span>{label}</span>
    </button>
  )
}
