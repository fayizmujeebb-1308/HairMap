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
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-start justify-between pt-2 animate-fade-in-up">
        <div>
          <p className="text-[10px] text-gray-400 font-medium tracking-wide">{formatDate()}</p>
          <h1 className="font-serif text-2xl text-gray-900 mt-0.5">
            {greeting()}, {profile.first_name || 'there'}
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {treatmentCount === 0
              ? 'Set up your treatment stack to start tracking.'
              : allDoneToday
              ? 'All treatments logged today. Great consistency.'
              : pendingCount === 1
              ? '1 treatment remaining today.'
              : `${pendingCount} treatments remaining today.`}
          </p>
        </div>
        {/* Streak badge — glows amber */}
        <div className="flex items-center gap-1.5 bg-amber-50 rounded-2xl px-3 py-2 shrink-0 shadow-glow-amber animate-fade-in-up delay-100">
          <span className="text-lg">🔥</span>
          <div className="text-right">
            <p className="text-base font-bold text-amber-600 leading-none">{streak}</p>
            <p className="text-[10px] text-amber-400 leading-none mt-0.5">streak</p>
          </div>
        </div>
      </div>

      {/* Onboarding nudges */}
      {!profile.norwood_stage && (
        <Link href="/onboarding"
          className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-card animate-fade-in-up delay-150 active:scale-[0.99] transition-transform">
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
            <span className="text-base">📋</span>
          </div>
          <p className="text-xs text-gray-700 flex-1 font-medium">Complete your hair profile for accurate tracking.</p>
          <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
      {treatmentCount === 0 && (
        <Link href="/log/setup"
          className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-card animate-fade-in-up delay-150 active:scale-[0.99] transition-transform">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-base">💊</span>
          </div>
          <p className="text-xs text-gray-700 flex-1 font-medium">Add your first treatment to start tracking progress.</p>
          <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}

      {/* Today's treatment status */}
      {allDoneToday ? (
        <div className="rounded-2xl px-5 py-4 shadow-glow-green animate-fade-in-up delay-150"
          style={{ background: 'linear-gradient(135deg, #0F6E56 0%, #1D9E75 100%)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">All done for today</p>
              <p className="text-xs text-white/60 mt-0.5">
                {streak >= 2 ? `${streak}-day streak — keep it going.` : 'Come back tomorrow to keep your streak.'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <Link href="/log"
          className="block bg-white rounded-2xl shadow-card overflow-hidden active:scale-[0.99] transition-transform animate-fade-in-up delay-150">
          <div className="px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">Today</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">
                  {treatmentCount === 0 ? 'No treatments set up' : `${pendingCount} of ${treatmentCount} remaining`}
                </p>
              </div>
              {treatmentCount > 0 && (
                <div className="flex gap-1 items-center">
                  {(stack ?? []).map(s => (
                    <div key={s.id} className={`w-2 h-7 rounded-full transition-colors ${loggedToday.has(s.id) ? 'bg-primary' : 'bg-gray-100'}`} />
                  ))}
                </div>
              )}
            </div>

            {treatmentCount > 0 ? (
              <div className="space-y-2.5">
                {(stack ?? []).slice(0, 3).map(s => {
                  const done = loggedToday.has(s.id)
                  return (
                    <div key={s.id} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        done ? 'border-primary bg-primary shadow-sm shadow-primary/30' : 'border-gray-200'
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
              <p className="text-xs text-gray-400">Tap to set up your treatment stack →</p>
            )}
          </div>
          <div className="flex items-center justify-between px-5 py-3 bg-gray-50/80"
            style={{ borderTop: '0.5px solid #f0f0ee' }}>
            <span className="text-sm font-semibold text-primary">{treatmentCount === 0 ? 'Set up treatments' : 'Log treatments'}</span>
            <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      )}

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3 animate-fade-in-up delay-200">
        {/* Adherence ring */}
        <div className="bg-white rounded-2xl shadow-card p-3 flex flex-col items-center justify-center">
          <div className="relative w-14 h-14">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#EEEDE9" strokeWidth="10" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="#1D9E75" strokeWidth="10"
                strokeDasharray={adherenceRingCirc}
                strokeDashoffset={logDates.size === 0 ? adherenceRingCirc : ringOffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-bold text-xs text-gray-900">{logDates.size === 0 ? '—' : `${adherence}%`}</span>
            </div>
          </div>
          <p className="text-[9px] text-gray-400 text-center mt-1.5 leading-tight">Adherence</p>
        </div>

        {/* Norwood */}
        <div className="bg-white rounded-2xl shadow-card px-3 py-3 flex flex-col justify-between">
          <p className="text-[9px] text-gray-400 uppercase tracking-wide">Norwood</p>
          <p className="font-serif text-2xl text-gray-900 mt-1">
            {profile.norwood_stage ? `NW${profile.norwood_stage}` : <span className="text-gray-200 text-lg">—</span>}
          </p>
          <div className="flex gap-0.5 mt-1">
            {[1,2,3,4,5,6,7].map(n => (
              <div key={n} className={`flex-1 h-1 rounded-full transition-colors ${
                profile.norwood_stage && n <= profile.norwood_stage ? 'bg-primary' : 'bg-gray-100'
              }`} />
            ))}
          </div>
        </div>

        {/* Days tracked */}
        <div className="bg-white rounded-2xl shadow-card px-3 py-3 flex flex-col justify-between">
          <p className="text-[9px] text-gray-400 uppercase tracking-wide">On treatment</p>
          <p className="font-serif text-2xl text-gray-900 mt-1">{daysTracked}</p>
          <p className="text-[9px] text-gray-400">days</p>
        </div>
      </div>

      {/* Progress photos */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden animate-fade-in-up delay-300">
        <div className="px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">Progress</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">Photo log</p>
            </div>
            <span className="text-[10px] text-gray-400 font-medium">{photoAngles.length}/6 angles</span>
          </div>

          {hasPhotos ? (
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              {photoAngles.map(angle => (
                <div key={angle} className="w-20 h-20 rounded-xl flex-shrink-0 overflow-hidden relative bg-gray-100 shadow-sm">
                  <Image src={latestPhotos[angle]} alt={angle} fill className="object-cover" sizes="80px" unoptimized />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-1.5 py-1.5">
                    <p className="text-[9px] text-white font-semibold capitalize">{angle}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl px-4 py-5 text-center" style={{ background: '#F4F3EF' }}>
              <p className="text-2xl mb-2">📸</p>
              <p className="text-xs font-semibold text-gray-700 mb-0.5">No photos yet</p>
              <p className="text-[10px] text-gray-400 leading-relaxed">Photos are essential for tracking real change.</p>
            </div>
          )}
        </div>
        <Link href="/photos"
          className="flex items-center justify-between px-5 py-3 transition-colors active:bg-primary/5"
          style={{ borderTop: '0.5px solid #f0f0ee', background: 'rgba(244,243,239,0.5)' }}>
          <span className="text-sm font-semibold text-primary">{hasPhotos ? 'View all photos' : 'Upload first photos'}</span>
          <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Learn card */}
      <Link href="/learn"
        className="flex items-center gap-4 bg-white rounded-2xl shadow-card px-5 py-4 active:scale-[0.99] transition-transform animate-fade-in-up delay-400">
        <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">Education library</p>
          <p className="text-xs text-gray-400 mt-0.5">7 evidence-based guides on hair loss and treatment</p>
        </div>
        <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Link>

      {/* Progress link */}
      <Link href="/progress"
        className="flex items-center gap-4 bg-white rounded-2xl shadow-card px-5 py-4 active:scale-[0.99] transition-transform animate-fade-in-up delay-400">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">Progress & AI Analysis</p>
          <p className="text-xs text-gray-400 mt-0.5">Charts, heatmap, and monthly AI progress report</p>
        </div>
        <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Link>

      {/* AI Coach card */}
      <Link href="/coach"
        className="block rounded-2xl overflow-hidden relative active:scale-[0.99] transition-transform shadow-card-md animate-fade-in-up delay-500"
        style={{ background: 'linear-gradient(135deg, #0a6648 0%, #1D9E75 60%, #16a34a 100%)' }}>
        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/5" />
        <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-white/5" />
        <div className="relative px-5 py-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <span className="text-[10px] text-white/60 font-semibold uppercase tracking-wider">AI Coach</span>
          </div>
          <p className="font-serif text-lg text-white leading-snug mb-1">Ask your hair coach anything</p>
          <p className="text-xs text-white/60 leading-relaxed mb-4">
            Get answers about your treatments, what to expect, and how to improve results.
          </p>
          <div className="inline-flex items-center gap-2 bg-white text-primary text-xs font-bold px-4 py-2 rounded-xl shadow-sm">
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
