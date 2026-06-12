import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProgressPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('created_at, norwood_stage, hair_health_score, hair_age')
    .eq('user_id', user.id)
    .single()

  const { data: photos } = await supabase
    .from('progress_photos')
    .select('taken_at, angle')
    .eq('user_id', user.id)
    .order('taken_at', { ascending: true })

  const { data: logs } = await supabase
    .from('treatment_logs')
    .select('taken_at')
    .eq('user_id', user.id)
    .order('taken_at', { ascending: false })

  const photoCount     = photos?.length ?? 0
  const logCount       = logs?.length ?? 0
  const daysTracked    = Math.floor((Date.now() - new Date(profile?.created_at ?? Date.now()).getTime()) / 86400000)
  const adherencePct   = daysTracked > 0 ? Math.min(100, Math.round((logCount / daysTracked) * 100)) : 0

  const STATS = [
    { label: 'Days tracked',      value: daysTracked,                  unit: 'days' },
    { label: 'Photos uploaded',   value: photoCount,                   unit: 'photos' },
    { label: 'Treatments logged', value: logCount,                     unit: 'logs' },
    { label: 'Adherence',         value: adherencePct,                 unit: '%' },
  ]

  return (
    <div className="space-y-5">

      <div className="pt-2">
        <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">Overview</p>
        <h1 className="font-serif text-2xl text-gray-900 mt-0.5">Progress</h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        {STATS.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 px-4 py-4" style={{ borderWidth: '0.5px' }}>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">{s.label}</p>
            <div className="flex items-end gap-1">
              <span className="font-serif text-2xl text-gray-900">{s.value}</span>
              <span className="text-xs text-gray-400 mb-0.5">{s.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Adherence bar */}
      <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4" style={{ borderWidth: '0.5px' }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-900">Treatment adherence</p>
          <p className="text-sm font-bold text-primary">{adherencePct}%</p>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-700"
            style={{ width: `${adherencePct}%` }} />
        </div>
        <p className="text-[10px] text-gray-400 mt-2">
          {adherencePct >= 80 ? 'Great consistency — keep it up.' : adherencePct >= 50 ? 'Room to improve. Daily logging helps track results.' : 'Start logging daily to see your adherence score grow.'}
        </p>
      </div>

      {/* Charts placeholder */}
      <div className="bg-white rounded-2xl border border-gray-100 px-5 py-8 text-center" style={{ borderWidth: '0.5px' }}>
        <div className="w-12 h-12 bg-primary/8 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-gray-900 mb-1">Charts coming soon</p>
        <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">
          Hair health score over time, Norwood progression, and photo timeline will appear here once you have more data logged.
        </p>
      </div>

      {/* Photo timeline preview */}
      {photoCount > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4" style={{ borderWidth: '0.5px' }}>
          <p className="text-sm font-semibold text-gray-900 mb-3">Photo timeline</p>
          <div className="space-y-2">
            {photos?.slice(0, 5).map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary/40 shrink-0" />
                <p className="text-xs text-gray-600 capitalize">{p.angle} view</p>
                <p className="text-[10px] text-gray-400 ml-auto">
                  {new Date(p.taken_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
