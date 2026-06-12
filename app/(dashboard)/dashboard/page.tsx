import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function daysSince(date: string) {
  return Math.floor((Date.now() - new Date(date).getTime()) / 86400000)
}

function formatDate() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
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

  const { data: photos } = await supabase
    .from('progress_photos')
    .select('angle, taken_at, storage_path')
    .eq('user_id', user.id)
    .order('taken_at', { ascending: false })
    .limit(6)

  const { data: logs } = await supabase
    .from('treatment_logs')
    .select('treatment_name, taken_at')
    .eq('user_id', user.id)
    .order('taken_at', { ascending: false })
    .limit(5)

  const daysTracked    = daysSince(profile.created_at)
  const hasPhotos      = (photos?.length ?? 0) > 0
  const hasTreatments  = (logs?.length ?? 0) > 0
  const photoCount     = photos?.length ?? 0

  // Score ring percentage for CSS
  const score = profile.hair_health_score
  const scorePercent = score ? (score / 100) * 283 : 0   // circumference of r=45 circle

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="flex items-start justify-between pt-2">
        <div>
          <p className="text-xs text-gray-400 font-medium tracking-wide">{formatDate()}</p>
          <h1 className="font-serif text-2xl text-gray-900 mt-0.5">
            {greeting()}, {profile.first_name || 'there'}
          </h1>
        </div>
        {/* Streak badge */}
        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 rounded-xl px-3 py-1.5" style={{ borderWidth: '0.5px' }}>
          <span className="text-base">🔥</span>
          <div className="text-right">
            <p className="text-sm font-bold text-amber-600 leading-none">{daysTracked}</p>
            <p className="text-[10px] text-amber-500 leading-none mt-0.5">day streak</p>
          </div>
        </div>
      </div>

      {/* ── Score + Stats row ── */}
      <div className="grid grid-cols-3 gap-3">

        {/* Hair Health Score ring */}
        <div className="col-span-1 bg-white rounded-2xl border border-gray-100 p-4 flex flex-col items-center justify-center" style={{ borderWidth: '0.5px' }}>
          <div className="relative w-16 h-16">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#F3F4F6" strokeWidth="8" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="#1D9E75" strokeWidth="8"
                strokeDasharray="283" strokeDashoffset={score ? 283 - scorePercent : 283}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s ease' }} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-bold text-sm text-gray-900">{score ?? '—'}</span>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 text-center mt-2 leading-tight">Hair<br/>Score</p>
        </div>

        {/* Right stats */}
        <div className="col-span-2 grid grid-rows-2 gap-3">
          <div className="bg-white rounded-2xl border border-gray-100 px-4 py-3 flex items-center justify-between" style={{ borderWidth: '0.5px' }}>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">Norwood Stage</p>
              <p className="font-serif text-xl text-gray-900 mt-0.5">
                {profile.norwood_stage ? `NW${profile.norwood_stage}` : '—'}
              </p>
            </div>
            <div className="flex gap-1">
              {[1,2,3,4,5,6,7].map(n => (
                <div key={n} className={`w-1.5 h-4 rounded-full ${
                  profile.norwood_stage && n <= profile.norwood_stage ? 'bg-primary' : 'bg-gray-100'
                }`} />
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 px-4 py-3 flex items-center justify-between" style={{ borderWidth: '0.5px' }}>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">Days Tracked</p>
              <p className="font-serif text-xl text-gray-900 mt-0.5">{daysTracked}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ── Today's action card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ borderWidth: '0.5px' }}>
        <div className="px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">Today</p>
              <h2 className="font-semibold text-gray-900 text-sm mt-0.5">Treatment log</h2>
            </div>
            {hasTreatments && (
              <span className="text-[10px] text-primary font-medium bg-primary/8 px-2 py-0.5 rounded-full">
                {logs?.filter(l => new Date(l.taken_at).toDateString() === new Date().toDateString()).length ?? 0} logged today
              </span>
            )}
          </div>

          {hasTreatments ? (
            <div className="space-y-2">
              {logs?.slice(0, 3).map((log, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center">
                    <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">{log.treatment_name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-3 py-1">
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-sm text-gray-400">No treatments logged yet</p>
            </div>
          )}
        </div>
        <Link href="/log"
          className="flex items-center justify-between px-5 py-3 bg-gray-50 hover:bg-primary/5 transition-colors group"
          style={{ borderTop: '0.5px solid #f3f4f6' }}>
          <span className="text-sm font-medium text-primary">Log today&apos;s treatment</span>
          <svg className="w-4 h-4 text-primary group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* ── Progress photos card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ borderWidth: '0.5px' }}>
        <div className="px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">Progress</p>
              <h2 className="font-semibold text-gray-900 text-sm mt-0.5">Photos</h2>
            </div>
            <span className="text-[10px] text-gray-400">{photoCount} uploaded</span>
          </div>

          {hasPhotos ? (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {photos?.slice(0, 4).map((p, i) => (
                <div key={i} className="w-20 h-20 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="absolute bottom-1 left-0 right-0 text-center text-[9px] text-gray-400 capitalize">{p.angle}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-3 py-1">
              <div className="flex gap-1.5">
                {['front','crown','top'].map(a => (
                  <div key={a} className="w-14 h-14 rounded-xl bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center gap-0.5" style={{ borderWidth: '1px' }}>
                    <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-[8px] text-gray-300 capitalize">{a}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 leading-tight">Upload your first<br/>progress photos</p>
            </div>
          )}
        </div>
        <Link href="/photos"
          className="flex items-center justify-between px-5 py-3 bg-gray-50 hover:bg-primary/5 transition-colors group"
          style={{ borderTop: '0.5px solid #f3f4f6' }}>
          <span className="text-sm font-medium text-primary">{hasPhotos ? 'View all photos' : 'Upload photos'}</span>
          <svg className="w-4 h-4 text-primary group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* ── AI Analysis card ── */}
      <div className="rounded-2xl overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, #0f7a5a 0%, #1D9E75 50%, #22c55e 100%)' }}>
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
        <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-white/5" />

        <div className="relative px-5 py-5">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <span className="text-xs text-white/70 font-medium uppercase tracking-wide">AI Analysis</span>
              </div>
              <h2 className="font-serif text-lg text-white leading-tight mb-1">
                {hasPhotos ? 'Run your hair analysis' : 'Upload photos first'}
              </h2>
              <p className="text-xs text-white/60 leading-relaxed">
                {hasPhotos
                  ? 'Get your hair age, health score, and 10-year forecast'
                  : 'AI analysis requires at least one progress photo'}
              </p>
            </div>
          </div>
          <Link href={hasPhotos ? '/analysis' : '/photos'}
            className="inline-flex items-center gap-2 mt-4 bg-white text-primary text-sm font-semibold px-4 py-2 rounded-xl transition-all hover:scale-105 active:scale-95">
            {hasPhotos ? 'Analyse now' : 'Add photos'}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <p className="text-[10px] text-white/40 mt-3">Not medical advice. For tracking purposes only.</p>
        </div>
      </div>

      {/* ── Email verification warning ── */}
      {!profile.email_verified && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 flex items-center gap-3" style={{ borderWidth: '0.5px' }}>
          <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-xs text-amber-700">Please verify your email to unlock all features.</p>
        </div>
      )}

    </div>
  )
}
