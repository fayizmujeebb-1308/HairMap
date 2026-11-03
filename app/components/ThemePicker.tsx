'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type ThemeId =
  | 'blossom'
  | 'clinical'
  | 'mint'
  | 'calm-blue'
  | 'lavender'
  | 'sand'
  | 'dark'
  | 'midnight'
  | 'high-contrast'
  | 'system'

interface ThemeDef {
  id: ThemeId
  name: string
  bg: string       // card background preview
  surface: string  // surface swatch
  accent: string   // accent dot
  dark?: boolean   // true → light text on preview
}

const THEMES: ThemeDef[] = [
  { id: 'blossom',       name: 'Blossom',       bg: '#ffffff',  surface: '#FFF1F5', accent: '#E85D8A' },
  { id: 'clinical',      name: 'Clinical',      bg: '#ffffff',  surface: '#f0fdf9', accent: '#1D9E75' },
  { id: 'mint',          name: 'Mint',          bg: '#F2FBF7',  surface: '#ddf4eb', accent: '#1D9E75' },
  { id: 'calm-blue',     name: 'Calm Blue',     bg: '#F4F8FC',  surface: '#dce8f8', accent: '#2F6FDE' },
  { id: 'lavender',      name: 'Lavender',      bg: '#F7F4FD',  surface: '#e5ddf8', accent: '#7C5CD6' },
  { id: 'sand',          name: 'Sand',          bg: '#FAF7F2',  surface: '#f0e6d8', accent: '#B7794A' },
  { id: 'dark',          name: 'Dark',          bg: '#0f1117',  surface: '#1e241e', accent: '#10b981', dark: true },
  { id: 'midnight',      name: 'Midnight',      bg: '#000000',  surface: '#121212', accent: '#1D9E75', dark: true },
  { id: 'high-contrast', name: 'High Contrast', bg: '#ffffff',  surface: '#f0f0f0', accent: '#000000' },
  { id: 'system',        name: 'System',        bg: 'linear-gradient(135deg,#ffffff 50%,#0f1117 50%)', surface: '#FFF1F5', accent: '#E85D8A' },
]

const VALID_IDS = THEMES.map(t => t.id)

export default function ThemePicker() {
  const [active, setActive] = useState<ThemeId>('clinical')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Fast path: localStorage (already applied by inline script in layout)
    let localTheme: ThemeId | null = null
    try {
      const s = localStorage.getItem('hairmap-theme') as ThemeId | null
      if (s && VALID_IDS.includes(s)) localTheme = s
    } catch { /* ignore */ }
    setActive(localTheme ?? 'clinical')

    // Slow path: Supabase (wins on a fresh device with no localStorage)
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return
      supabase
        .from('profiles')
        .select('theme')
        .eq('user_id', data.user.id)
        .single()
        .then(({ data: profile }) => {
          const dbTheme = profile?.theme as ThemeId | null
          if (dbTheme && VALID_IDS.includes(dbTheme) && dbTheme !== localTheme) {
            // DB has a different (more up-to-date) theme — apply it
            setActive(dbTheme)
            document.documentElement.setAttribute('data-theme', dbTheme)
            try { localStorage.setItem('hairmap-theme', dbTheme) } catch { /* ignore */ }
          }
        })
    })
  }, [])

  function applyTheme(id: ThemeId) {
    setActive(id)
    // Apply instantly — no waiting for network
    document.documentElement.setAttribute('data-theme', id)
    try { localStorage.setItem('hairmap-theme', id) } catch { /* ignore */ }
    // Fire-and-forget sync to Supabase for cross-device persistence
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        supabase
          .from('profiles')
          .update({ theme: id })
          .eq('user_id', data.user.id)
          .then(() => { /* silent — localStorage is the fast path */ })
      }
    })
  }

  if (!mounted) return null

  return (
    <div className="space-y-3">
      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>
        Appearance
      </p>
      <div className="grid grid-cols-2 gap-2.5">
        {THEMES.map(theme => {
          const isActive = active === theme.id
          return (
            <button
              key={theme.id}
              onClick={() => applyTheme(theme.id)}
              className="relative rounded-2xl p-3 text-left transition-all active:scale-95"
              style={{
                background: theme.dark ? theme.bg : 'var(--bg-card)',
                border: isActive
                  ? `2px solid ${theme.accent}`
                  : '2px solid transparent',
                boxShadow: isActive
                  ? `0 0 0 1px ${theme.accent}22, 0 4px 16px ${theme.accent}18`
                  : '0 2px 8px rgba(0,0,0,0.06)',
                outline: 'none',
              }}
            >
              {/* Swatch row */}
              <div className="flex items-center gap-1.5 mb-2.5">
                {/* Background swatch */}
                <div
                  className="w-6 h-6 rounded-lg flex-shrink-0"
                  style={{
                    background: theme.bg,
                    border: '1px solid rgba(0,0,0,0.08)',
                  }}
                />
                {/* Surface swatch */}
                <div
                  className="w-4 h-4 rounded-md flex-shrink-0"
                  style={{
                    background: theme.surface,
                    border: '1px solid rgba(0,0,0,0.06)',
                  }}
                />
                {/* Accent dot */}
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0 ml-0.5"
                  style={{ background: theme.accent }}
                />
              </div>

              {/* Theme name */}
              <p
                className="text-xs font-semibold leading-none"
                style={{
                  color: theme.dark ? '#f3f4f6' : 'var(--text-primary)',
                }}
              >
                {theme.name}
              </p>

              {/* Active checkmark */}
              {isActive && (
                <div
                  className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: theme.accent }}
                >
                  <svg
                    viewBox="0 0 12 12"
                    fill="none"
                    className="w-3 h-3"
                  >
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="#fff"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
