import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

function calcStreak(logs: { taken_at: string }[]): number {
  const days = new Set(logs.map(l => l.taken_at.split('T')[0]))
  let streak = 0
  const d = new Date()
  while (days.has(d.toISOString().split('T')[0])) {
    streak++
    d.setDate(d.getDate() - 1)
  }
  return streak
}

function calcLongestStreak(logs: { taken_at: string }[]): number {
  const days = Array.from(new Set(logs.map(l => l.taken_at.split('T')[0]))).sort()
  if (!days.length) return 0
  let longest = 1, current = 1
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1])
    const curr = new Date(days[i])
    const diff = (curr.getTime() - prev.getTime()) / 86400000
    if (diff === 1) { current++; longest = Math.max(longest, current) }
    else current = 1
  }
  return longest
}

function getLast28Days(logs: { taken_at: string }[]): boolean[] {
  const logDays = new Set(logs.map(l => l.taken_at.split('T')[0]))
  return Array.from({ length: 28 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (27 - i))
    return logDays.has(d.toISOString().split('T')[0])
  })
}

function getMonthLabel(daysAgo: number): string {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const MILESTONES = [3, 7, 14, 21, 30, 60, 90, 180, 365]

const glassCard = {
  background: 'var(--bg-card)',
  backdropFilter: 'blur(20px) saturate(1.8)',
  WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
  border: '1px solid var(--bg-card-border)',
  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
  borderRadius: 20,
} as const

export default async function StreakPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: logs } = await supabase
    .from('treatment_logs')
    .select('taken_at')
    .eq('user_id', user.id)
    .order('taken_at', { ascending: false })

  const allLogs = logs ?? []
  const streak = calcStreak(allLogs)
  const longest = calcLongestStreak(allLogs)
  const totalDays = new Set(allLogs.map(l => l.taken_at.split('T')[0])).size
  const last28 = getLast28Days(allLogs)
  const adherence28 = Math.round((last28.filter(Boolean).length / 28) * 100)

  const nextMilestone = MILESTONES.find(m => m > streak) ?? 365
  const prevMilestone = [...MILESTONES].reverse().find(m => m <= streak) ?? 0
  const milestoneProgress = nextMilestone === prevMilestone
    ? 100
    : Math.round(((streak - prevMilestone) / (nextMilestone - prevMilestone)) * 100)

  const dayWord = streak === 1 ? 'day' : 'days'
  const motivational =
    streak === 0 ? 'Log your first treatment today to start your streak.' :
    streak < 3   ? 'Great start — keep going to build momentum.' :
    streak < 7   ? 'You\'re building a habit. Don\'t break the chain.' :
    streak < 14  ? 'One week in — consistency is compounding.' :
    streak < 30  ? 'Two weeks strong. This is where real results begin.' :
    streak < 60  ? 'One month. Most people give up before now.' :
    streak < 90  ? 'Two months of consistency. You\'re in the minority.' :
                   `${streak} days — elite consistency. Your follicles thank you.`

  return (
    <div className="space-y-4 pb-2">

      {/* Header */}
      <div className="flex items-center gap-3 pt-2 animate-fade-in-up">
        <Link href="/dashboard"
          className="w-8 h-8 rounded-xl flex items-center justify-center active:scale-95 transition-transform"
          style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(229,231,235,0.6)' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Consistency</p>
          <h1 className="font-serif text-[22px] text-gray-900 leading-tight">Your Streak</h1>
        </div>
      </div>

      {/* Hero streak card */}
      <div className="relative overflow-hidden animate-fade-in-up delay-75"
        style={{ ...glassCard, padding: 0 }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, var(--color-primary-dim) 0%, transparent 60%)' }} />

        <div className="px-6 pt-6 pb-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1">Current streak</p>
              <div className="flex items-end gap-2">
                <span className="font-serif text-6xl text-gray-900 leading-none">{streak}</span>
                <span className="text-lg text-gray-400 font-medium mb-1">{dayWord}</span>
              </div>
            </div>
            <div className="text-5xl select-none">
              {streak === 0 ? '💤' : streak < 3 ? '🌱' : streak < 7 ? '🔥' : streak < 30 ? '⚡' : '🏆'}
            </div>
          </div>

          <p className="text-sm text-gray-500 leading-relaxed mb-5">{motivational}</p>

          {/* Progress to next milestone */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-[11px] text-gray-400">Next milestone: {nextMilestone} days</p>
              <p className="text-[11px] font-semibold text-primary">{milestoneProgress}%</p>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-primary-dim)' }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${milestoneProgress}%`,
                  background: 'linear-gradient(90deg, var(--color-primary-dark), var(--color-primary))',
                }}
              />
            </div>
            <p className="text-[10px] text-gray-300">{nextMilestone - streak} more {nextMilestone - streak === 1 ? 'day' : 'days'} to go</p>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 animate-fade-in-up delay-100">
        {[
          { label: 'Best streak', value: longest, unit: 'd', icon: '🏅' },
          { label: 'Total days', value: totalDays, unit: 'd', icon: '📅' },
          { label: '28-day rate', value: adherence28, unit: '%', icon: '📊' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl px-3 py-3.5 text-center" style={glassCard}>
            <p className="text-sm mb-1.5">{s.icon}</p>
            <div className="flex items-end justify-center gap-0.5">
              <span className="font-serif text-xl text-gray-900 leading-none">{s.value}</span>
              <span className="text-xs text-gray-400 mb-0.5">{s.unit}</span>
            </div>
            <p className="text-[9px] text-gray-400 mt-1 uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      {/* 28-day heatmap */}
      <div className="animate-fade-in-up delay-150" style={{ ...glassCard, padding: '16px 20px' }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Last 28 days</p>
          <p className="text-[10px] text-gray-300">{getMonthLabel(27)} — today</p>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {['M','T','W','T','F','S','S'].map((d, i) => (
            <p key={i} className="text-[9px] text-center text-gray-300 font-medium">{d}</p>
          ))}
          {/* Offset for week alignment — find day of week 28 days ago */}
          {(() => {
            const startDay = new Date()
            startDay.setDate(startDay.getDate() - 27)
            // 0=Sun → remap to Mon-first: (day+6)%7
            const offset = (startDay.getDay() + 6) % 7
            return Array.from({ length: offset }, (_, i) => (
              <div key={`off-${i}`} />
            ))
          })()}
          {last28.map((logged, i) => (
            <div
              key={i}
              title={getMonthLabel(27 - i)}
              className="aspect-square rounded-lg transition-all"
              style={{
                background: logged
                  ? i === 27
                    ? 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))'
                    : 'rgba(16,185,129,0.70)'
                  : 'var(--color-primary-dim)',
                border: logged ? 'none' : '1px solid var(--color-primary-dim)',
              }}
            />
          ))}
        </div>

        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ background: 'rgba(16,185,129,0.70)' }} />
            <p className="text-[10px] text-gray-400">Logged</p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ background: 'var(--color-primary-dim)', border: '1px solid var(--color-primary-dim)' }} />
            <p className="text-[10px] text-gray-400">Missed</p>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="animate-fade-in-up delay-200" style={{ ...glassCard, padding: 0 }}>
        <div className="px-5 py-3.5" style={{ borderBottom: '1px solid rgba(229,231,235,0.5)' }}>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Milestones</p>
        </div>
        {MILESTONES.map((m, i) => {
          const achieved = streak >= m
          const isCurrent = !achieved && (i === 0 || streak >= MILESTONES[i - 1])
          return (
            <div
              key={m}
              className="flex items-center gap-4 px-5 py-3.5"
              style={{ borderBottom: i < MILESTONES.length - 1 ? '1px solid rgba(229,231,235,0.3)' : undefined }}
            >
              <div
                className="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 text-base"
                style={{
                  background: achieved
                    ? 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))'
                    : isCurrent
                    ? 'var(--color-primary-dim)'
                    : 'rgba(229,231,235,0.4)',
                  border: isCurrent ? '1.5px solid rgba(16,185,129,0.30)' : 'none',
                }}
              >
                {achieved ? '✓' : isCurrent ? '→' : '·'}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-semibold ${achieved ? 'text-gray-900' : isCurrent ? 'text-gray-700' : 'text-gray-300'}`}>
                  {m} {m === 1 ? 'day' : 'days'}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {m === 3 ? 'First habit loop' :
                   m === 7 ? 'One week strong' :
                   m === 14 ? 'Two weeks in' :
                   m === 21 ? '21-day habit lock-in' :
                   m === 30 ? 'One month' :
                   m === 60 ? 'Two months' :
                   m === 90 ? 'Three months — real results begin' :
                   m === 180 ? 'Six months' :
                   'One year — elite consistency'}
                </p>
              </div>
              {achieved && (
                <span className="text-[10px] font-bold text-primary shrink-0">✦ Done</span>
              )}
            </div>
          )
        })}
      </div>

      {/* CTA */}
      {streak === 0 && (
        <Link href="/dashboard"
          className="block rounded-2xl px-5 py-4 text-center animate-fade-in-up delay-300"
          style={{
            background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))',
            boxShadow: '0 8px 28px rgba(16,185,129,0.28)',
          }}>
          <p className="text-sm font-semibold text-white">Log today&apos;s treatment →</p>
          <p className="text-[11px] text-white/60 mt-0.5">Start your streak right now</p>
        </Link>
      )}

    </div>
  )
}
