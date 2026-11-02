import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatDate() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

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

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!profile?.onboarding_completed) redirect('/onboarding')

  const today = new Date().toISOString().split('T')[0]
  const ninetyDaysAgo = new Date()
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

  const [{ data: photos }, { data: allLogs }, { data: todayLogs }, { data: stack }] = await Promise.all([
    supabase.from('progress_photos').select('angle, thumb_path').eq('user_id', user.id).order('taken_at', { ascending: false }),
    supabase.from('treatment_logs').select('taken_at').eq('user_id', user.id).gte('taken_at', ninetyDaysAgo.toISOString()),
    supabase.from('treatment_logs').select('treatment_name, taken_at, stack_item_id').eq('user_id', user.id).gte('taken_at', `${today}T00:00:00`),
    supabase.from('treatment_stack').select('id, treatment_name, treatment_type').eq('user_id', user.id).eq('is_active', true),
  ])

  const daysTracked    = Math.max(1, Math.floor((Date.now() - new Date(profile.created_at).getTime()) / 86400000))
  const logDates       = new Set((allLogs ?? []).map(l => l.taken_at.split('T')[0]))
  const streak         = calcStreak(allLogs ?? [])
  const adherence      = Math.min(100, Math.round((logDates.size / Math.min(daysTracked, 90)) * 100))
  const treatmentCount = stack?.length ?? 0
  const loggedToday    = new Set((todayLogs ?? []).map(l => l.stack_item_id))
  const pendingCount   = (stack ?? []).filter(s => !loggedToday.has(s.id)).length
  const allDoneToday   = treatmentCount > 0 && pendingCount === 0

  const latestPhotos: Record<string, string> = {}
  for (const p of photos ?? []) {
    if (!latestPhotos[p.angle] && p.thumb_path) latestPhotos[p.angle] = p.thumb_path
  }
  const photoAngles = Object.keys(latestPhotos).slice(0, 4)
  const hasPhotos   = photoAngles.length > 0

  const adherenceRingCirc = 2 * Math.PI * 45
  const ringOffset = adherenceRingCirc * (1 - adherence / 100)

  return (
    <div className="space-y-4 pb-2">

      {/* ── Header ── */}
      <div className="flex items-start justify-between pt-2 animate-fade-in-up">
        <div>
          <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">{formatDate()}</p>
          <h1 className="font-serif text-[26px] leading-tight text-gray-900 mt-0.5">
            {greeting()},&nbsp;{profile.first_name || 'there'}
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {treatmentCount === 0
              ? 'Set up your treatment stack to start tracking.'
              : allDoneToday
              ? '✓ All treatments logged today.'
              : pendingCount === 1
              ? '1 treatment remaining today.'
              : `${pendingCount} treatments remaining today.`}
          </p>
        </div>
        {/* Streak badge */}
        <div className="flex flex-col items-end gap-2 shrink-0">
        <div className="flex items-center gap-1.5 animate-scale-in delay-100"
          style={{
            background: 'rgba(251,191,36,0.12)',
            backdropFilter: 'blur(12px) saturate(1.6)',
            WebkitBackdropFilter: 'blur(12px) saturate(1.6)',
            border: '1px solid rgba(251,191,36,0.25)',
            borderRadius: 18,
            padding: '8px 14px',
          }}>
          <span className="text-lg">🔥</span>
          <div className="text-right">
            <p className="text-base font-bold text-amber-600 leading-none">{streak}</p>
            <p className="text-[10px] text-amber-500 leading-none mt-0.5">streak</p>
          </div>
        </div>
        </div>
      </div>

      {/* ── Nudge: complete profile ── */}
      {!profile.norwood_stage && (
        <Link href="/onboarding"
          className="flex items-center gap-3 rounded-2xl px-4 py-3.5 active:scale-[0.99] transition-transform animate-fade-in-up delay-100"
          style={{
            background: 'rgba(251,191,36,0.08)',
            border: '1px solid rgba(251,191,36,0.22)',
            borderRadius: 16,
          }}>
          <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <span className="text-base">📋</span>
          </div>
          <p className="text-xs text-gray-700 flex-1 font-medium">Complete your hair profile for accurate tracking.</p>
          <svg className="w-4 h-4 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
      {treatmentCount === 0 && (
        <Link href="/log/setup"
          className="flex items-center gap-3 rounded-2xl px-4 py-3.5 active:scale-[0.99] transition-transform animate-fade-in-up delay-100"
          style={{
            background: 'rgba(16,185,129,0.07)',
            border: '1px solid rgba(16,185,129,0.18)',
            borderRadius: 16,
          }}>
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-base">💊</span>
          </div>
          <p className="text-xs text-gray-700 flex-1 font-medium">Add your first treatment to start tracking progress.</p>
          <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}

      {/* ── Today's treatment status ── */}
      {allDoneToday ? (
        <div className="rounded-2xl px-5 py-4 animate-scale-in delay-150"
          style={{
            background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
            boxShadow: '0 8px 32px rgba(16,185,129,0.28)',
          }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">All done for today 🎉</p>
              <p className="text-xs text-white/70 mt-0.5">
                {streak >= 2 ? `${streak}-day streak — keep it going!` : 'Come back tomorrow to keep your streak.'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <Link href="/log"
          className="block rounded-2xl overflow-hidden active:scale-[0.99] transition-transform animate-fade-in-up delay-150"
          style={{
            background: 'var(--bg-card)',
            backdropFilter: 'blur(20px) saturate(1.8)',
            WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
            border: '1px solid var(--bg-card-border)',
            boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
          }}>
          <div className="px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Today</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">
                  {treatmentCount === 0 ? 'No treatments set up' : `${pendingCount} of ${treatmentCount} remaining`}
                </p>
              </div>
              {treatmentCount > 0 && (
                <div className="flex gap-1 items-center">
                  {(stack ?? []).map(s => (
                    <div key={s.id}
                      className={`w-2 h-7 rounded-full transition-all duration-500 ${loggedToday.has(s.id) ? 'bg-primary' : 'bg-gray-100'}`} />
                  ))}
                </div>
              )}
            </div>

            {treatmentCount > 0 ? (
              <div className="space-y-2.5">
                {pendingCount > 0 && streak > 0 && (
                  <div style={{
                    background: 'rgba(251,191,36,0.12)',
                    border: '1px solid rgba(251,191,36,0.28)',
                    borderRadius: 12,
                    padding: '10px 14px',
                    color: '#92400e',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}>
                    🔥 {streak}-day streak at risk — log before midnight
                  </div>
                )}
                {(stack ?? []).slice(0, 3).map(s => {
                  const done = loggedToday.has(s.id)
                  return (
                    <div key={s.id} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        done ? 'border-primary bg-primary' : 'border-gray-200'
                      }`}>
                        {done && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm transition-colors ${done ? 'text-gray-300 line-through' : 'text-gray-700 font-medium'}`}>
                        {s.treatment_name}
                      </span>
                    </div>
                  )
                })}
                {(stack?.length ?? 0) > 3 && (
                  <p className="text-[10px] text-gray-400 pl-8">+{(stack?.length ?? 0) - 3} more</p>
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-400">Tap to set up your treatment stack</p>
            )}
          </div>
          <div className="flex items-center justify-between px-5 py-3"
            style={{
              background: 'rgba(16,185,129,0.04)',
              borderTop: '0.5px solid rgba(16,185,129,0.10)',
            }}>
            <span className="text-sm font-semibold text-primary">
              {treatmentCount === 0 ? 'Set up treatments' : 'Log treatments'}
            </span>
            <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      )}

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-3 gap-3 animate-fade-in-up delay-200">
        {/* Adherence ring */}
        <div className="rounded-2xl p-3 flex flex-col items-center justify-center"
          style={{
            background: 'var(--bg-card)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--bg-card-border)',
            boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
          }}>
          <div className="relative w-14 h-14">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="#10b981" strokeWidth="10"
                strokeDasharray={adherenceRingCirc}
                strokeDashoffset={logDates.size === 0 ? adherenceRingCirc : ringOffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1)' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-bold text-xs text-gray-900">{logDates.size === 0 ? '—' : `${adherence}%`}</span>
            </div>
          </div>
          <p className="text-[9px] text-gray-400 text-center mt-1.5 leading-tight">Adherence</p>
        </div>

        {/* Norwood */}
        <div className="rounded-2xl px-3 py-3 flex flex-col justify-between"
          style={{
            background: 'var(--bg-card)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--bg-card-border)',
            boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
          }}>
          <p className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold">Norwood</p>
          <p className="font-serif text-2xl text-gray-900 mt-1">
            {profile.norwood_stage ? `NW${profile.norwood_stage}` : <span className="text-gray-200 text-lg">—</span>}
          </p>
          <div className="flex gap-0.5 mt-1">
            {[1,2,3,4,5,6,7].map(n => (
              <div key={n} className={`flex-1 h-1.5 rounded-full transition-colors ${
                profile.norwood_stage && n <= profile.norwood_stage ? 'bg-primary' : 'bg-gray-100'
              }`} />
            ))}
          </div>
        </div>

        {/* Days tracked */}
        <div className="rounded-2xl px-3 py-3 flex flex-col justify-between"
          style={{
            background: 'var(--bg-card)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--bg-card-border)',
            boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
          }}>
          <p className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold">On treatment</p>
          <p className="font-serif text-2xl text-gray-900 mt-1">{daysTracked}</p>
          <p className="text-[9px] text-gray-400">days tracked</p>
        </div>
      </div>

      {/* ── Progress photos ── */}
      <div className="rounded-2xl overflow-hidden animate-fade-in-up delay-300"
        style={{
          background: 'var(--bg-card)',
          backdropFilter: 'blur(20px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
          border: '1px solid var(--bg-card-border)',
          boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
        }}>
        <div className="px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Progress</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">Photo log</p>
            </div>
            <span className="text-[10px] text-gray-400 font-medium px-2 py-1 bg-gray-50 rounded-lg">
              {photoAngles.length}/6 angles
            </span>
          </div>

          {hasPhotos ? (
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
              {photoAngles.map(angle => (
                <div key={angle} className="w-20 h-20 rounded-xl flex-shrink-0 overflow-hidden relative bg-gray-100">
                  <Image src={latestPhotos[angle]} alt={angle} fill className="object-cover" sizes="80px" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <p className="absolute bottom-1.5 left-1.5 text-[9px] text-white font-semibold capitalize">{angle}</p>
                </div>
              ))}
              {/* Progress rings for missing angles */}
              {photoAngles.length < 4 && Array.from({ length: Math.min(2, 4 - photoAngles.length) }).map((_, i) => (
                <div key={`empty-${i}`} className="w-20 h-20 rounded-xl flex-shrink-0 bg-gray-50 flex items-center justify-center border border-dashed border-gray-200">
                  <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl px-4 py-5 text-center bg-gray-50/80">
              <p className="text-2xl mb-2">📸</p>
              <p className="text-xs font-semibold text-gray-700 mb-0.5">No photos yet</p>
              <p className="text-[10px] text-gray-400 leading-relaxed">Photos are essential for tracking real change.</p>
            </div>
          )}
        </div>
        <Link href="/photos"
          className="flex items-center justify-between px-5 py-3 transition-colors active:bg-primary/5"
          style={{ borderTop: '0.5px solid rgba(16,185,129,0.10)', background: 'rgba(16,185,129,0.03)' }}>
          <span className="text-sm font-semibold text-primary">{hasPhotos ? 'View all photos' : 'Upload first photos'}</span>
          <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* ── Quick links row ── */}
      <div className="grid grid-cols-2 gap-3 animate-fade-in-up delay-400">
        <Link href="/learn"
          className="flex flex-col gap-2 rounded-2xl px-4 py-4 active:scale-[0.98] transition-transform"
          style={{
            background: 'var(--bg-card)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--bg-card-border)',
            boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
          }}>
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
            <svg className="w-4.5 h-4.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 leading-snug">Learn</p>
            <p className="text-[10px] text-gray-400 mt-0.5">7 evidence-based guides</p>
          </div>
        </Link>

        <Link href="/progress"
          className="flex flex-col gap-2 rounded-2xl px-4 py-4 active:scale-[0.98] transition-transform"
          style={{
            background: 'var(--bg-card)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--bg-card-border)',
            boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
          }}>
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <svg className="w-4.5 h-4.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 leading-snug">Progress</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Charts & AI analysis</p>
          </div>
        </Link>
      </div>

      {/* ── AI Coach card ── */}
      <Link href="/coach"
        className="block rounded-2xl overflow-hidden relative active:scale-[0.99] transition-transform animate-fade-in-up delay-500"
        style={{
          background: 'linear-gradient(135deg, #065f46 0%, #10b981 55%, #34d399 100%)',
          boxShadow: '0 12px 40px rgba(16,185,129,0.30)',
        }}>
        {/* Decorative blobs */}
        <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }} />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
        <div className="absolute top-4 left-1/2 w-48 h-20 rounded-full" style={{ background: 'rgba(255,255,255,0.04)', filter: 'blur(20px)' }} />

        <div className="relative px-5 py-5">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <span className="text-[9px] text-white/60 font-bold uppercase tracking-widest">AI Hair Coach</span>
          </div>
          <p className="font-serif text-xl text-white leading-snug mb-1">Ask your coach anything</p>
          <p className="text-xs text-white/60 leading-relaxed mb-4">
            Get personalised answers about your treatments, timeline, and how to improve results.
          </p>
          <div className="inline-flex items-center gap-2 bg-white text-primary text-xs font-bold px-4 py-2.5 rounded-xl"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.12)' }}>
            Chat now
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>

    </div>
  )
}
