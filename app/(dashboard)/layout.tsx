import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BottomNav from '@/app/components/BottomNav'
import DarkModeToggle from '@/app/components/DarkModeToggle'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

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
