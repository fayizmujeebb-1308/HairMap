import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import AIAnalysis from '@/app/components/AIAnalysis'
import UpgradeGate from '@/app/components/UpgradeGate'
import PhotoComparisonSlider from '@/app/components/PhotoComparisonSlider'

function toDate(iso: string) { return iso.split('T')[0] }
function today() { return new Date().toISOString().split('T')[0] }

function calcStreak(logDates: Set<string>): number {
  let streak = 0
  const d = new Date()
  while (true) {
    if (logDates.has(d.toISOString().split('T')[0])) { streak++; d.setDate(d.getDate() - 1) }
    else break
  }
  return streak
}

function last28Days(): string[] {
  return Array.from({ length: 28 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (27 - i))
    return d.toISOString().split('T')[0]
  })
}

function last8Weeks(): { label: string; start: string; end: string }[] {
  return Array.from({ length: 8 }, (_, i) => {
    const end = new Date()
    end.setDate(end.getDate() - i * 7)
    const start = new Date(end)
    start.setDate(start.getDate() - 6)
    return {
      label: end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      start: start.toISOString().split('T')[0],
      end:   end.toISOString().split('T')[0],
    }
  }).reverse()
}

type Milestone = { icon: string; label: string; done: boolean; progress?: number; total?: number }

function milestones(daysTracked: number, streak: number, logCount: number, photoCount: number): Milestone[] {
  return [
    { icon: '🌱', label: 'First day logged',      done: daysTracked >= 1 },
    { icon: '🔥', label: '7-day streak',           done: streak >= 7,  progress: streak,     total: 7  },
    { icon: '💊', label: '30 doses logged',        done: logCount >= 30, progress: logCount, total: 30 },
    { icon: '📸', label: 'All 6 angles captured',  done: photoCount >= 6, progress: photoCount, total: 6 },
    { icon: '🏆', label: '30-day streak',          done: streak >= 30, progress: streak,     total: 30 },
  ]
}

const RING_R = 44
const RING_CIRC = 2 * Math.PI * RING_R

const glassCard = {
  background: 'var(--bg-card)',
  backdropFilter: 'blur(20px) saturate(1.8)',
  WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
  border: '1px solid var(--bg-card-border)',
  boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
  borderRadius: 20,
} as const

export default async function ProgressPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [{ data: profile }, { data: photos }, { data: logs }, { data: lastAnalysis }] = await Promise.all([
    supabase.from('profiles').select('created_at, norwood_stage, first_name, subscription_status').eq('user_id', user.id).single(),
    supabase.from('progress_photos').select('taken_at, angle, thumb_path').eq('user_id', user.id).order('taken_at', { ascending: true }),
    supabase.from('treatment_logs').select('taken_at').eq('user_id', user.id).order('taken_at', { ascending: false }),
    supabase.from('ai_analyses').select('analysis, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
  ])

  const photosByAngle: Record<string, { first: string; latest: string; count: number }> = {}
  for (const p of photos ?? []) {
    if (!p.thumb_path) continue
    if (!photosByAngle[p.angle]) {
      photosByAngle[p.angle] = { first: p.thumb_path, latest: p.thumb_path, count: 1 }
    } else {
      photosByAngle[p.angle].latest = p.thumb_path
      photosByAngle[p.angle].count++
    }
  }
  const comparisonAngles = Object.entries(photosByAngle).filter(([, v]) => v.count >= 2)

  const todayStr    = today()
  const logDates    = new Set((logs ?? []).map(l => toDate(l.taken_at)))
  const streak      = calcStreak(logDates)
  const photoCount  = new Set((photos ?? []).map(p => p.angle)).size
  const logCount    = logs?.length ?? 0
  const daysTracked = Math.max(1, Math.floor((Date.now() - new Date(profile?.created_at ?? Date.now()).getTime()) / 86400000))
  const adherence   = Math.min(100, Math.round((logDates.size / daysTracked) * 100))
  const days28      = last28Days()
  const weeks8      = last8Weeks()

  const weeklyData = weeks8.map(w => {
    const loggedDays = days28.filter(d => d >= w.start && d <= w.end && logDates.has(d)).length
    const pct = Math.round((loggedDays / 7) * 100)
    return { ...w, pct, loggedDays }
  })

  const latestPhotos: Record<string, string> = {}
  for (const p of [...(photos ?? [])].reverse()) {
    if (!latestPhotos[p.angle] && p.thumb_path) latestPhotos[p.angle] = p.thumb_path
  }

  const isPro = profile?.subscription_status === 'pro' || profile?.subscription_status === 'trialing'
  const ms = milestones(daysTracked, streak, logCount, photoCount)
  const ringOffset = RING_CIRC * (1 - adherence / 100)

  const adherenceMessage =
    adherence >= 90 ? 'Outstanding — top tier consistency.' :
    adherence >= 75 ? 'Great consistency. Keep it up.' :
    adherence >= 50 ? 'Good start. Aim for daily logging.' :
    'Log daily to see your adherence grow.'

  const photoAngles = ['front', 'top', 'crown', 'hairline', 'left', 'right']

  return (
    <div className="space-y-4 pb-2">

      {/* ── Header ── */}
      <div className="pt-2 animate-fade-in-up">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Your journey</p>
        <h1 className="font-serif text-[26px] text-gray-900 mt-0.5">Progress</h1>
      </div>

      {/* ── Hero adherence card ── */}
      <div className="px-5 py-5 animate-scale-in delay-75" style={glassCard}>
        <div className="flex items-center gap-5">
          {/* Animated ring */}
          <div className="relative shrink-0 w-[110px] h-[110px]">
            <svg width="110" height="110" viewBox="0 0 110 110">
              <circle cx="55" cy="55" r={RING_R} fill="none" stroke="rgba(229,231,235,0.8)" strokeWidth="9" />
              <circle cx="55" cy="55" r={RING_R} fill="none"
                stroke="var(--color-primary)" strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={RING_CIRC}
                strokeDashoffset={ringOffset}
                transform="rotate(-90 55 55)"
                style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1)', filter: 'drop-shadow(0 0 6px var(--color-primary))' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="font-serif text-2xl text-gray-900 leading-none">{adherence}<span className="text-sm text-gray-400">%</span></p>
              <p className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-widest">adherence</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 space-y-2.5">
            {[
              { icon: '🔥', label: 'Current streak',  value: `${streak} days` },
              { icon: '📅', label: 'Days tracked',    value: `${daysTracked} days` },
              { icon: '💊', label: 'Doses logged',    value: logCount },
              { icon: '📸', label: 'Angles captured', value: `${photoCount}/6` },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{s.icon}</span>
                  <span className="text-xs text-gray-500">{s.label}</span>
                </div>
                <span className="text-xs font-semibold text-gray-900">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-[10px] text-gray-400 mt-4 pt-3"
          style={{ borderTop: '0.5px solid rgba(0,0,0,0.06)' }}>{adherenceMessage}</p>
      </div>

      {/* ── 28-day heatmap ── */}
      <div className="px-5 py-4 animate-fade-in-up delay-150" style={glassCard}>
        <p className="text-xs font-semibold text-gray-700 mb-3">Last 28 days</p>
        <div className="grid grid-cols-7 gap-1.5">
          {days28.map(date => {
            const logged  = logDates.has(date)
            const isToday = date === todayStr
            const future  = date > todayStr
            return (
              <div key={date}
                className={`aspect-square rounded-lg transition-all duration-200 ${
                  isToday && logged  ? 'ring-2 ring-primary/40'
                  : isToday         ? 'ring-2 ring-primary/30'
                  : ''
                }`}
                style={{
                  background: logged
                    ? (isToday ? 'var(--color-primary)' : 'rgba(from var(--color-primary) r g b / 65%)')
                    : future ? 'rgba(249,250,251,0.5)' : 'rgba(229,231,235,0.8)',
                }}
                title={date}
              />
            )
          })}
        </div>
        <div className="flex items-center gap-3 mt-3">
          {[
            { color: 'rgba(229,231,235,0.8)', label: 'Missed' },
            { color: 'rgba(from var(--color-primary) r g b / 65%)', label: 'Logged' },
            { color: 'var(--color-primary)',               label: 'Today' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded" style={{ background: color }} />
              <span className="text-[10px] text-gray-400">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 8-week bar chart ── */}
      <div className="px-5 py-4 animate-fade-in-up delay-200" style={glassCard}>
        <p className="text-xs font-semibold text-gray-700 mb-4">Weekly adherence</p>
        <div className="flex items-end gap-1.5 h-24">
          {weeklyData.map((w, i) => {
            const isLast = i === weeklyData.length - 1
            const height = Math.max(4, (w.pct / 100) * 96)
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full relative flex items-end" style={{ height: 96 }}>
                  <div
                    className="w-full rounded-t-lg transition-all duration-700"
                    style={{
                      height,
                      background: isLast
                        ? 'linear-gradient(180deg, var(--color-primary), var(--color-primary-dark))'
                        : 'rgba(from var(--color-primary) r g b / 22%)',
                      boxShadow: isLast ? '0 4px 12px rgba(from var(--color-primary) r g b / 25%)' : 'none',
                    }}
                  />
                  {w.pct > 0 && (
                    <span className="absolute -top-4 left-0 right-0 text-center text-[9px] font-semibold text-gray-500">
                      {w.pct}%
                    </span>
                  )}
                </div>
                <span className={`text-[9px] font-medium ${isLast ? 'text-primary' : 'text-gray-400'}`}>
                  {w.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── AI Analysis ── */}
      {photoCount < 2 ? (
        <div className="animate-fade-in-up delay-300 relative" style={{ ...glassCard, overflow: 'hidden' }}>
          {/* Blurred preview content */}
          <div style={{ filter: 'blur(2px)', padding: '20px', pointerEvents: 'none', userSelect: 'none' }}>
            <p className="text-xs font-semibold text-gray-700 mb-2">AI Hair Analysis</p>
            <p className="text-sm text-gray-500 leading-relaxed">Your personalised AI analysis will appear here once you have before and after photos to compare. Track density changes, shedding patterns, and regrowth progress.</p>
            <div className="mt-3 h-2 bg-gray-100 rounded-full w-3/4" />
            <div className="mt-2 h-2 bg-gray-100 rounded-full w-1/2" />
          </div>
          {/* Lock overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}>
            <span className="text-3xl mb-2">🔒</span>
            <p className="text-sm font-semibold text-gray-700 text-center px-6 mb-3">
              AI analysis unlocks after your first Before / After comparison
            </p>
            <Link href="/photos"
              className="inline-block text-white text-xs font-semibold px-4 py-2 rounded-full"
              style={{ background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))' }}>
              Add Photos →
            </Link>
          </div>
        </div>
      ) : (
        <div className="animate-fade-in-up delay-300">
          <AIAnalysis lastAnalysis={lastAnalysis} isPro={isPro} />
        </div>
      )}

      {/* ── Milestones ── */}
      <div className="px-5 py-4 animate-fade-in-up delay-350" style={glassCard}>
        <p className="text-xs font-semibold text-gray-700 mb-4">Milestones</p>
        <div className="space-y-3.5">
          {ms.map((m, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 transition-all ${
                m.done
                  ? 'bg-primary/10'
                  : 'bg-gray-50'
              }`}>
                {m.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold ${m.done ? 'text-gray-900' : 'text-gray-400'}`}>{m.label}</p>
                {!m.done && m.progress != null && (
                  <div className="mt-1.5 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.min(100, Math.round((m.progress / (m.total ?? 1)) * 100))}%`,
                        background: 'linear-gradient(90deg, var(--color-primary), var(--color-primary-light))',
                      }}
                    />
                  </div>
                )}
              </div>
              {m.done
                ? (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )
                : (
                  <span className="text-[10px] text-gray-300 shrink-0 tabular-nums">
                    {m.progress != null ? `${m.progress}/${m.total}` : ''}
                  </span>
                )
              }
            </div>
          ))}
        </div>
      </div>

      {/* ── Latest photos grid ── */}
      {photoCount > 0 && (
        <div className="px-5 py-4 animate-fade-in-up delay-400" style={glassCard}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-gray-700">Latest photos</p>
            <Link href="/photos" className="text-[10px] text-primary font-semibold">View all →</Link>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {photoAngles.filter(a => latestPhotos[a]).slice(0, 6).map(angle => (
              <div key={angle} className="aspect-square rounded-xl overflow-hidden bg-gray-50 relative">
                <Image src={latestPhotos[angle]} alt={angle} fill className="object-cover" sizes="30vw" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <p className="absolute bottom-1.5 left-1.5 text-[9px] text-white font-semibold capitalize">{angle}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Before vs Now ── */}
      {comparisonAngles.length > 0 && (
        isPro ? (
          <div className="px-5 py-4 animate-fade-in-up delay-450" style={glassCard}>
            <p className="text-xs font-semibold text-gray-700 mb-0.5">Before vs Now</p>
            <p className="text-[10px] text-gray-400 mb-4">Your first photo compared to your latest</p>
            <div className="space-y-5">
              {comparisonAngles.slice(0, 3).map(([angle, data]) => (
                <PhotoComparisonSlider
                  key={angle}
                  angle={angle}
                  beforeSrc={data.first}
                  afterSrc={data.latest}
                  beforeLabel="First"
                  afterLabel="Latest"
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-fade-in-up delay-450">
            <UpgradeGate
              feature="Before vs Now comparison"
              description="See your first photo side-by-side with your latest to measure real progress."
            />
          </div>
        )
      )}

      {/* ── Empty photo CTA ── */}
      {photoCount === 0 && (
        <div className="px-5 py-6 text-center animate-fade-in-up delay-400" style={glassCard}>
          <p className="text-2xl mb-2">📸</p>
          <p className="text-sm font-semibold text-gray-900 mb-1">Add progress photos</p>
          <p className="text-xs text-gray-400 mb-4 leading-relaxed">
            Photos are the most powerful way to see real change over time.
          </p>
          <Link href="/photos"
            className="inline-flex items-center gap-2 text-white text-xs font-semibold px-5 py-2.5 rounded-xl active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))' }}>
            Take photos now
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}

    </div>
  )
}
