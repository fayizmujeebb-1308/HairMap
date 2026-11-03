import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin, first_name, last_name')
    .eq('user_id', user.id)
    .single()

  if (!profile?.is_admin) redirect('/dashboard')

  const name = [profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'Admin'

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      {/* Top nav */}
      <nav className="sticky top-0 z-40 border-b" style={{
        background: 'var(--bg-nav)',
        borderColor: 'var(--bg-nav-border)',
        backdropFilter: 'blur(16px)',
      }}>
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
                ⚡
              </div>
              <span className="font-serif text-base" style={{ color: 'var(--text-primary)' }}>HairMap Admin</span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {[
                { href: '/admin', label: 'Overview' },
                { href: '/admin/users', label: 'Users' },
                { href: '/admin/analytics', label: 'Analytics' },
              ].map(item => (
                <Link key={item.href} href={item.href}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                  style={{ color: 'var(--text-secondary)' }}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs px-2 py-1 rounded-full font-semibold"
              style={{ background: 'rgba(124,58,237,0.12)', color: '#7c3aed' }}>
              Admin
            </span>
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{name}</span>
            <Link href="/dashboard" className="text-xs font-medium px-3 py-1.5 rounded-lg"
              style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
              ← App
            </Link>
          </div>
        </div>
        {/* Mobile nav */}
        <div className="md:hidden flex gap-1 px-4 pb-2">
          {[
            { href: '/admin', label: 'Overview' },
            { href: '/admin/users', label: 'Users' },
            { href: '/admin/analytics', label: 'Analytics' },
          ].map(item => (
            <Link key={item.href} href={item.href}
              className="text-xs font-medium px-3 py-1.5 rounded-lg"
              style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
