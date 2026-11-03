import { createClient } from '@/lib/supabase/server'

const card = {
  background: 'var(--bg-card)',
  border: '1px solid var(--bg-card-border)',
  borderRadius: 16,
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
} as const

export default async function AdminAnalytics() {
  const supabase = await createClient()

  // Signups per day last 14 days
  const since14 = new Date(Date.now() - 14 * 86400000).toISOString()
  const [
    { data: recentSignups },
    { data: norwoodDist },
    { data: treatmentNames },
    { data: analysisDates },
  ] = await Promise.all([
    supabase.from('profiles').select('created_at').gte('created_at', since14).order('created_at'),
    supabase.from('profiles').select('norwood_stage').not('norwood_stage', 'is', null),
    supabase.from('treatment_logs').select('treatment_name').order('treatment_name'),
    supabase.from('hair_analyses').select('created_at').gte('created_at', since14).order('created_at'),
  ])

  // Signups by day
  const signupByDay: Record<string, number> = {}
  const analysisByDay: Record<string, number> = {}
  const last14: string[] = []
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000)
    const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    last14.push(key)
    signupByDay[key] = 0
    analysisByDay[key] = 0
  }
  recentSignups?.forEach(r => {
    const key = new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    if (signupByDay[key] !== undefined) signupByDay[key]++
  })
  analysisDates?.forEach(r => {
    const key = new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    if (analysisByDay[key] !== undefined) analysisByDay[key]++
  })

  // Norwood distribution
  const norwoodCount: Record<number, number> = {}
  norwoodDist?.forEach(p => {
    if (p.norwood_stage) norwoodCount[p.norwood_stage] = (norwoodCount[p.norwood_stage] || 0) + 1
  })
  const norwoodTotal = Object.values(norwoodCount).reduce((a, b) => a + b, 0)

  // Top treatments
  const treatCount: Record<string, number> = {}
  treatmentNames?.forEach(t => {
    if (t.treatment_name) treatCount[t.treatment_name] = (treatCount[t.treatment_name] || 0) + 1
  })
  const topTreatments = Object.entries(treatCount).sort((a, b) => b[1] - a[1]).slice(0, 8)
  const maxTreat = topTreatments[0]?.[1] || 1

  const maxSignup = Math.max(...Object.values(signupByDay), 1)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-2xl" style={{ color: 'var(--text-primary)' }}>Analytics</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Last 14 days activity</p>
      </div>

      {/* Signups chart */}
      <div style={card} className="p-5">
        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-secondary)' }}>
          Daily Signups — 14 Days
        </p>
        <div className="flex items-end gap-1 h-24">
          {last14.map(day => {
            const val = signupByDay[day]
            const pct = (val / maxSignup) * 100
            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-1 group">
                <span className="text-[9px] opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: 'var(--text-tertiary)' }}>{val}</span>
                <div className="w-full rounded-t-sm transition-all"
                  style={{
                    height: `${Math.max(pct, 4)}%`,
                    background: val > 0 ? 'linear-gradient(180deg,#a855f7,#7c3aed)' : 'var(--bg-surface)',
                    minHeight: 3,
                  }} />
              </div>
            )
          })}
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[9px]" style={{ color: 'var(--text-tertiary)' }}>{last14[0]}</span>
          <span className="text-[9px]" style={{ color: 'var(--text-tertiary)' }}>{last14[last14.length - 1]}</span>
        </div>
      </div>

      {/* AI analyses chart */}
      <div style={card} className="p-5">
        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-secondary)' }}>
          AI Analyses — 14 Days
        </p>
        <div className="flex items-end gap-1 h-16">
          {last14.map(day => {
            const val = analysisByDay[day]
            const maxA = Math.max(...Object.values(analysisByDay), 1)
            const pct = (val / maxA) * 100
            return (
              <div key={day} className="flex-1 rounded-t-sm"
                style={{
                  height: `${Math.max(pct, 4)}%`,
                  background: val > 0 ? 'linear-gradient(180deg,var(--color-primary-light),var(--color-primary-dark))' : 'var(--bg-surface)',
                  minHeight: 3,
                }} />
            )
          })}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Norwood distribution */}
        <div style={{ ...card, padding: 0 }}>
          <div className="px-5 py-3.5" style={{ borderBottom: '1px solid var(--bg-card-border)' }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
              Norwood Stage Distribution
            </p>
          </div>
          <div className="px-5 py-4 space-y-3">
            {[1, 2, 3, 4, 5, 6, 7].map(stage => {
              const count = norwoodCount[stage] || 0
              const pct = norwoodTotal ? Math.round((count / norwoodTotal) * 100) : 0
              return (
                <div key={stage}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>NW{stage}</span>
                    <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{count} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'var(--bg-surface)' }}>
                    <div className="h-full rounded-full" style={{
                      width: `${pct}%`,
                      background: stage <= 2 ? 'var(--color-primary)' : stage <= 4 ? '#d97706' : '#dc2626',
                    }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top treatments */}
        <div style={{ ...card, padding: 0 }}>
          <div className="px-5 py-3.5" style={{ borderBottom: '1px solid var(--bg-card-border)' }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
              Most Used Treatments
            </p>
          </div>
          <div className="px-5 py-4 space-y-3">
            {topTreatments.length === 0 ? (
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>No treatment data yet</p>
            ) : topTreatments.map(([name, count]) => {
              const pct = Math.round((count / maxTreat) * 100)
              return (
                <div key={name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium truncate max-w-[160px]" style={{ color: 'var(--text-primary)' }}>
                      {name}
                    </span>
                    <span className="text-xs ml-2 shrink-0" style={{ color: 'var(--text-tertiary)' }}>{count}</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'var(--bg-surface)' }}>
                    <div className="h-full rounded-full" style={{
                      width: `${pct}%`,
                      background: 'linear-gradient(90deg,#2563eb,#60a5fa)',
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
