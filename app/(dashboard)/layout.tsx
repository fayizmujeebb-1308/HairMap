'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import BottomNav from '@/app/components/BottomNav'
import DarkModeToggle from '@/app/components/DarkModeToggle'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.replace('/login')
    })
  }, [router])

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-body)' }}>
      <main
        className="max-w-lg mx-auto px-4 pb-nav"
        style={{
          paddingTop: 'calc(env(safe-area-inset-top, 0px) + 1.25rem)',
        }}
      >
        {children}
      </main>
      {/* Dark mode toggle — fixed top-right, always visible */}
      <div
        className="fixed z-40"
        style={{
          top: 'calc(env(safe-area-inset-top, 0px) + 12px)',
          right: 16,
        }}
      >
        <DarkModeToggle />
      </div>
      <BottomNav />
    </div>
  )
}
