'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type ThemeId =
  | 'clinical'
  | 'navy'
  | 'slate'
  | 'obsidian'
  | 'dark'
  | 'blossom'

interface ThemeDef {
  id: ThemeId
  name: string
  tagline: string
  bg: string
  surface: string
  accent: string
  dark?: boolean
}

const THEMES: ThemeDef[] = [
  {
    id: 'clinical',
    name: 'Clinical',
    tagline: 'Clean & precise',
    bg: '#ffffff',
    surface: '#f0fdf9',
    accent: '#1D9E75',
  },
  {
    id: 'navy',
    name: 'Navy Trust',
    tagline: 'Authority & premium',
    bg: '#112240',
    surface: 'rgba(201,168,76,0.12)',
    accent: '#C9A84C',
    dark: true,
  },
  {
    id: 'slate',
    name: 'Slate Pro',
    tagline: 'Science & focus',
    bg: '#f8fafc',
    surface: '#e0f2f7',
    accent: '#0E7490',
  },
  {
    id: 'obsidian',
    name: 'Obsidian',
    tagline: 'Luxury dark',
    bg: '#0c0c0e',
    surface: 'rgba(255,255,255,0.04)',
    accent: '#4ADE80',
    dark: true,
  },
  {
    id: 'dark',
    name: 'Dark',
    tagline: 'Deep forest',
    bg: '#0f1117',
    surface: 'rgba(255,255,255,0.05)',
    accent: '#10b981',
    dark: true,
  },
  {
    id: 'blossom',
    name: 'Blossom',
    tagline: 'Soft & warm',
    bg: '#ffffff',
    surface: '#FFF1F5',
    accent: '#E85D8A',
  },
]

const VALID_IDS = THEMES.map(t => t.id)

export default function ThemePicker() {
  const [active, setActive] = useState<ThemeId>('clinical')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    let localTheme: ThemeId | null = null
    try {
      const s = localStorage.getItem('hairmap-theme') as ThemeId | null
      if (s && VALID_IDS.includes(s)) localTheme = s
    } catch { /* ignore */ }
    setActive(localTheme ?? 'clinical')

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
            setActive(dbTheme)
            document.documentElement.setAttribute('data-theme', dbTheme)
            try { localStorage.setItem('hairmap-theme', dbTheme) } catch { /* ignore */ }
          }
        })
    })
  }, [])

  function applyTheme(id: ThemeId) {
    setActive(id)
    document.documentElement.setAttribute('data-theme', id)
    try { localStorage.setItem('hairmap-theme', id) } catch { /* ignore */ }
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        supabase
          .from('profiles')
          .update({ theme: id })
          .eq('user_id', data.user.id)
          .then(() => { /* silent */ })
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
                background: theme.bg,
                border: isActive
                  ? `2px solid ${theme.accent}`
                  : `2px solid ${theme.dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
                boxShadow: isActive
                  ? `0 0 0 1px ${theme.accent}22, 0 4px 16px ${theme.accent}20`
                  : '0 2px 8px rgba(0,0,0,0.08)',
                outline: 'none',
              }}
            >
              {/* Swatch row */}
              <div className="flex items-center gap-1.5 mb-2">
                <div
                  className="w-5 h-5 rounded-lg flex-shrink-0"
                  style={{
                    background: theme.surface,
                    border: `1px solid ${theme.dark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)'}`,
                  }}
                />
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ background: theme.accent }}
                />
              </div>

              {/* Theme name */}
              <p
                className="text-xs font-bold leading-tight"
                style={{ color: theme.dark ? '#f3f4f6' : '#111827' }}
              >
                {theme.name}
              </p>
              <p
                className="text-[9px] leading-none mt-0.5"
                style={{ color: theme.dark ? 'rgba(243,244,246,0.5)' : 'rgba(17,24,39,0.4)' }}
              >
                {theme.tagline}
              </p>

              {/* Active checkmark */}
              {isActive && (
                <div
                  className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: theme.accent }}
                >
                  <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5">
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
