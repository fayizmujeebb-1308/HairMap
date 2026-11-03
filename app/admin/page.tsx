import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const card = {
  background: 'var(--bg-card)',
  border: '1px solid var(--bg-card-border)',
  borderRadius: 16,
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
} as const

function StatCard({ label, value, sub, accent, icon }: {
  label: string; value: string | number; sub?: string; accent: string; icon: string
}) {
  return (
    <div style={card} className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ background: `${accent}14` }}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-serif" style={{ color: 'var(--text-primary)' }}>{value}</p>
      <p className="text-xs font-semibold mt-0.5" style={{ color: accent }}>{label}</p>
      {sub && <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>{sub}</p>}
    </div>
  )
}

export default async function AdminOverview() {
  const supabase = await createClient()

  // Parallel data fetches
  const [
    { count: totalUsers },
    { count: proUsers },
    { count: totalPhotos },
    { count: totalAnalyses },
    { count: totalLogs },
    { data: recentUsers },
    { data: themeStats },
    { data: newUsersToday },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true })
      .in('subscription_status', ['pro', 'trialing']),
    supabase.from('progress_photos').select('*', { count: 'exact', head: true }),
    supabase.from('hair_analyses').select('*', { count: 'exact', head: true }),
    supabase.from('treatment_logs').select('*', { count: 'exact', head: true }),
    supabase.from('profiles')
      .select('first_name, last_name, email, subscription_status, theme, created_at, hairmap_id')
      .order('created_at', { ascending: false })
      .limit(8),
    supabase.from('profiles').select('theme'),
    supabase.from('profiles').select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 86400000).toISOString()),
  ])

  const conversionRate = totalUsers && proUsers
    ? ((proUsers / totalUsers) * 100).toFixed(1)
    : '0.0'

  // Theme breakdown
  const themeCounts: Record<string, number> = {}
  themeStats?.forEach(p => {
    const t = p.theme || 'blossom'
    themeCounts[t] = (themeCounts[t] || 0) + 1
  })
  const topThemes = Object.entries(themeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl" style={{ color: 'var(--text-primary)' }}>Overview</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={totalUsers ?? 0} sub={`+${newUsersToday?.length ?? 0} today`} accent="#7c3aed" icon="👥" />
        <StatCard label="Pro Subscribers" value={proUsers ?? 0} sub={`${conversionRate}% conversion`} accent="#059669" icon="⭐" />
        <StatCard label="Photos Uploaded" value={totalPhotos ?? 0} sub="across all users" accent="#2563eb" icon="📸" />
        <StatCard label="AI Analyses" value={totalAnalyses ?? 0} sub="total runs" accent="#d97706" icon="🤖" />
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="Doses Logged" value={totalLogs ?? 0} accent="#db2777" icon="💊" />
        <StatCard label="Avg Photos/User" value={totalUsers ? ((totalPhotos ?? 0) / totalUsers).toFixed(1) : '0'} accent="#0891b2" icon="📊" />
        <StatCard label="Free Users" value={(totalUsers ?? 0) - (proUsers ?? 0)} accent="#64748b" icon="👤" />
      </div>

      {/* Bottom grid: recent users + theme breakdown */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Recent signups */}
        <div className="md:col-span-2" style={{ ...card, padding: 0 }}>
          <div className="flex items-center justify-between px-5 py-3.5"
            style={{ borderBottom: '1px solid var(--bg-card-border)' }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
              Recent Signups
            </p>
            <Link href="/admin/users" className="text-xs font-semibold" style={{ color: '#7c3aed' }}>
              View all →
            </Link>
          </div>
          <div>
            {recentUsers?.map((u, i) => {
              const name = [u.first_name, u.last_name].filter(Boolean).join(' ') || 'Anonymous'
              const isPro = u.subscription_status === 'pro' || u.subscription_status === 'trialing'
              const date = new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              return (
                <div key={i} className="flex items-center justify-between px-5 py-3"
                  style={{ borderBottom: i < (recentUsers.length - 1) ? '1px solid var(--bg-card-border)' : undefined }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
                      {name[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{name}</p>
                      <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-right">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                      style={{
                        background: isPro ? 'rgba(5,150,105,0.12)' : 'rgba(100,116,139,0.1)',
                        color: isPro ? '#059669' : 'var(--text-tertiary)',
                      }}>
                      {isPro ? 'Pro' : 'Free'}
                    </span>
                    <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{date}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Theme breakdown */}
        <div style={{ ...card, padding: 0 }}>
          <div className="px-5 py-3.5" style={{ borderBottom: '1px solid var(--bg-card-border)' }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
              Theme Usage
            </p>
          </div>
          <div className="px-5 py-4 space-y-3">
            {topThemes.map(([theme, count]) => {
              const pct = totalUsers ? Math.round((count / totalUsers) * 100) : 0
              return (
                <div key={theme}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium capitalize" style={{ color: 'var(--text-primary)' }}>
                      {theme.replace('-', ' ')}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'var(--bg-surface)' }}>
                    <div className="h-full rounded-full" style={{
                      width: `${pct}%`,
                      background: 'linear-gradient(90deg,#7c3aed,#a855f7)',
                    }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
