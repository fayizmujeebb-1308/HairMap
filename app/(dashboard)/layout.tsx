import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BottomNav from '@/app/components/BottomNav'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-gray-50">
      <main
        className="max-w-lg mx-auto px-4 pb-nav"
        style={{
          /* Push content below the status bar / Dynamic Island.
             black-translucent status bar overlays the page, so we compensate. */
          paddingTop: 'calc(env(safe-area-inset-top, 0px) + 1.25rem)',
        }}
      >
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
