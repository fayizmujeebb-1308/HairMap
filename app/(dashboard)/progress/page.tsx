import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

/* ── helpers ── */
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

function milestone(daysTracked: number, streak: number, logCount: number, photoCount: number) {
  const list = []
  if (daysTracked >= 1)   list.push({ icon: '🌱', label: 'First day logged',    done: true })
  if (streak >= 7)        list.push({ icon: '🔥', label: '7-day streak',        done: true })
  else                    list.push({ icon: '🔥', label: '7-day streak',        done: false, progress: streak, total: 7 })
  if (logCount >= 30)     list.push({ icon: '💊', label: '30 doses logged',     done: true })
  else                    list.push({ icon: '💊', label: '30 doses logged',     done: false, progress: logCount, total: 30 })
  if (photoCount >= 6)    list.push({ icon: '📸', label: 'All 6 angles captured', done: true })
  else                    list.push({ icon: '📸', label: 'All 6 angles captured', done: false, progress: photoCount, total: 6 })
  if (streak >= 30)       list.push({ icon: '🏆', label: '30-day streak',       done: true })
  else                    list.push({ icon: '🏆', label: '30-day streak',       done: false, progress: streak, total: 30 })
  return list.slice(0, 5)
}

const RING_R = 44
const RING_CIRC = 2 * Math.PI * RING_R

export default async function ProgressPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [{ data: profile }, { data: photos }, { data: logs }] = await Promise.all([
    supabase.from('profiles').select('created_at, norwood_stage, first_name').eq('user_id', user.id).single(),
    supabase.from('progress_photos').select('taken_at, angle, thumb_path').eq('user_id', user.id).order('taken_at', { ascending: false }),
    supabase.from('treatment_logs').select('taken_at').eq('user_id', user.id).order('taken_at', { ascending: false }),
  ])

  const todayStr    = today()
  const logDates    = new Set((logs ?? []).map(l => toDate(l.taken_at)))
  const streak      = calcStreak(logDates)
  const photoCount  = new Set((photos ?? []).map(p => p.angle)).size
  const logCount    = logs?.length ?? 0
  const daysTracked = Math.max(1, Math.floor((Date.now() - new Date(profile?.created_at ?? Date.now()).getTime()) / 86400000))
  const adherence   = Math.min(100, Math.round((logDates.size / daysTracked) * 100))
  const days28      = last28Days()
  const weeks8      = last8Weeks()

  // Weekly adherence data
  const weeklyData = weeks8.map(w => {
    const daysInWeek = 7
    const loggedDays = days28.filter(d => d >= w.start && d <= w.end && logDates.has(d)).length
    const pct = Math.round((loggedDays / daysInWeek) * 100)
    return { ...w, pct, loggedDays }
  })

  // Latest photo per angle
  const latestPhotos: Record<string, string> = {}
  for (const p of photos ?? []) {
    if (!latestPhotos[p.angle] && p.thumb_path) latestPhotos[p.angle] = p.thumb_path
  }

  const milestones = milestone(daysTracked, streak, logCount, photoCount)
  const ringOffset = RING_CIRC * (1 - adherence / 100)

  const adherenceMessage =
    adherence >= 90 ? 'Outstanding — top 10% of users' :
    adherence >= 75 ? 'Great consistency. Keep it up.' :
    adherence >= 50 ? 'Good start. Aim for daily logging.' :
    'Log daily to see your adherence grow.'

  const photoAngles = ['front', 'top', 'crown', 'hairline', 'left', 'right']

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="pt-2">
        <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">Your journey</p>
        <h1 className="font-serif text-2xl text-gray-900 mt-0.5">Progress</h1>
      </div>

      {/* Hero — adherence ring + stats */}
      <div className="bg-white rounded-2xl border border-gray-100 px-5 py-5" style={{ borderWidth: '0.5px' }}>
        <div className="flex items-center gap-5">
          {/* Ring */}
          <div className="relative shrink-0 w-[110px] h-[110px]">
            <svg width="110" height="110" viewBox="0 0 110 110">
              <circle cx="55" cy="55" r={RING_R} fill="none" stroke="#f3f4f6" strokeWidth="9" />
              <circle cx="55" cy="55" r={RING_R} fill="none" stroke="#1D9E75" strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={RING_CIRC}
                strokeDashoffset={ringOffset}
                transform="rotate(-90 55 55)"
                style={{ transition: 'stroke-dashoffset 1s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="font-serif text-2xl text-gray-900 leading-none">{adherence}<span className="text-sm text-gray-400">%</span></p>
              <p className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-wide">adherence</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 space-y-3">
            {[
              { icon: '🔥', label: 'Current streak',    value: `${streak} days` },
              { icon: '📅', label: 'Days tracked',      value: `${daysTracked} days` },
              { icon: '💊', label: 'Doses logged',      value: logCount },
              { icon: '📸', label: 'Angles captured',   value: `${photoCount}/6` },
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
        <p className="text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-50">{adherenceMessage}</p>
      </div>

      {/* 28-day heatmap */}
      <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4" style={{ borderWidth: '0.5px' }}>
        <p className="text-xs font-semibold text-gray-700 mb-3">Last 28 days</p>
        <div className="grid grid-cols-7 gap-1.5">
          {days28.map(date => {
            const logged  = logDates.has(date)
            const isToday = date === todayStr
            const future  = date > todayStr
            return (
              <div key={date} className={`aspect-square rounded-lg transition-colors ${
                isToday && logged  ? 'bg-primary ring-2 ring-primary/30'
                : isToday         ? 'bg-white ring-2 ring-primary/30'
                : logged          ? 'bg-primary/70'
                : future          ? 'bg-gray-50'
                :                   'bg-gray-100'
              }`} title={date} />
            )
          })}
        </div>
        <div className="flex items-center gap-2 mt-3">
          <div className="w-3 h-3 rounded bg-gray-100" />
          <span className="text-[10px] text-gray-400">Missed</span>
          <div className="w-3 h-3 rounded bg-primary/70 ml-2" />
          <span className="text-[10px] text-gray-400">Logged</span>
          <div className="w-3 h-3 rounded bg-primary ml-2" />
          <span className="text-[10px] text-gray-400">Today</span>
        </div>
      </div>

      {/* 8-week bar chart */}
      <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4" style={{ borderWidth: '0.5px' }}>
        <p className="text-xs font-semibold text-gray-700 mb-4">Weekly adherence</p>
        <div className="flex items-end gap-1.5 h-24">
          {weeklyData.map((w, i) => {
            const isLast = i === weeklyData.length - 1
            const height = Math.max(4, (w.pct / 100) * 96)
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full relative flex items-end" style={{ height: 96 }}>
                  <div
                    className={`w-full rounded-t-lg transition-all duration-700 ${isLast ? 'bg-primary' : 'bg-primary/25'}`}
                    style={{ height }}
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

      {/* Milestones */}
      <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4" style={{ borderWidth: '0.5px' }}>
        <p className="text-xs font-semibold text-gray-700 mb-3">Milestones</p>
        <div className="space-y-3">
          {milestones.map((m, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0 ${m.done ? 'bg-primary/10' : 'bg-gray-50'}`}>
                {m.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold ${m.done ? 'text-gray-900' : 'text-gray-400'}`}>{m.label}</p>
                {!m.done && 'progress' in m && (
                  <div className="mt-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary/40 rounded-full"
                      style={{ width: `${Math.round((m.progress / m.total) * 100)}%` }} />
                  </div>
                )}
              </div>
              {m.done
                ? <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                : <span className="text-[10px] text-gray-300 shrink-0">{'progress' in m ? `${m.progress}/${m.total}` : ''}</span>
              }
            </div>
          ))}
        </div>
      </div>

      {/* Photo gallery */}
      {photoCount > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4" style={{ borderWidth: '0.5px' }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-gray-700">Latest photos</p>
            <Link href="/photos" className="text-[10px] text-primary font-semibold">View all →</Link>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {photoAngles.filter(a => latestPhotos[a]).slice(0, 6).map(angle => (
              <div key={angle} className="aspect-square rounded-xl overflow-hidden bg-gray-50 relative">
                <Image src={latestPhotos[angle]} alt={angle} fill className="object-cover" sizes="30vw" unoptimized />
                <div className="absolute bottom-0 left-0 right-0 bg-black/30 px-1.5 py-1">
                  <p className="text-[9px] text-white font-medium capitalize">{angle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty photo CTA */}
      {photoCount === 0 && (
        <div className="bg-primary/5 border border-primary/10 rounded-2xl px-5 py-5 text-center" style={{ borderWidth: '0.5px' }}>
          <p className="text-2xl mb-2">📸</p>
          <p className="text-sm font-semibold text-gray-900 mb-1">Add progress photos</p>
          <p className="text-xs text-gray-400 mb-3 leading-relaxed">Photos are the most powerful way to see real change over time.</p>
          <Link href="/photos"
            className="inline-flex bg-primary text-white text-xs font-semibold px-4 py-2 rounded-xl active:scale-95 transition-transform">
            Take photos now
          </Link>
        </div>
      )}

    </div>
  )
}
