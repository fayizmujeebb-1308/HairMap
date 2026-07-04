import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PhotoSlot from '@/app/components/PhotoSlot'
import AIAnalysis from '@/app/components/AIAnalysis'

const ANGLES = [
  { key: 'front',    label: 'Front',    desc: 'Face the mirror straight on' },
  { key: 'top',      label: 'Top',      desc: 'Camera directly above' },
  { key: 'crown',    label: 'Crown',    desc: 'Angle down at the crown' },
  { key: 'hairline', label: 'Hairline', desc: 'Close up of hairline' },
  { key: 'left',     label: 'Left',     desc: 'Turn head left 90°' },
  { key: 'right',    label: 'Right',    desc: 'Turn head right 90°' },
]

export default async function PhotosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: photos }, { data: profile }, { data: lastAnalysis }] = await Promise.all([
    supabase.from('progress_photos').select('id, angle, thumb_path, taken_at').eq('user_id', user.id).order('taken_at', { ascending: false }),
    supabase.from('profiles').select('subscription_status').eq('user_id', user.id).single(),
    supabase.from('ai_analyses').select('analysis, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
  ])

  // Keep only the most recent photo per angle
  const latestByAngle: Record<string, { id: string; url: string }> = {}
  for (const p of photos ?? []) {
    if (!latestByAngle[p.angle]) {
      latestByAngle[p.angle] = { id: p.id, url: p.thumb_path ?? '' }
    }
  }

  const doneCount = Object.keys(latestByAngle).length
  const isPro = profile?.subscription_status === 'pro' || profile?.subscription_status === 'trialing'

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between pt-2">
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">Progress</p>
          <h1 className="font-serif text-2xl text-gray-900 mt-0.5">Photos</h1>
        </div>
        <div className="text-right">
          <p className="font-serif text-2xl text-gray-900">{doneCount}<span className="text-sm text-gray-300">/6</span></p>
          <p className="text-[10px] text-gray-400">angles</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${(doneCount / 6) * 100}%` }}
        />
      </div>

      {/* Tip */}
      {doneCount < 6 && (
        <div className="bg-white rounded-2xl shadow-card px-4 py-3 flex items-center gap-3">
          <span className="text-lg shrink-0">💡</span>
          <p className="text-xs text-primary/80 leading-relaxed">
            {doneCount === 0
              ? 'Tap any slot to take or upload a photo. All 6 angles give the most accurate AI analysis.'
              : `${6 - doneCount} angle${6 - doneCount > 1 ? 's' : ''} remaining. Complete all 6 for full AI analysis.`
            }
          </p>
        </div>
      )}

      {doneCount === 6 && (
        <AIAnalysis lastAnalysis={lastAnalysis} isPro={isPro} compact />
      )}

      {/* Angle grid */}
      <div className="grid grid-cols-2 gap-3">
        {ANGLES.map(angle => {
          const existing = latestByAngle[angle.key] ?? null
          return (
            <PhotoSlot
              key={angle.key}
              angle={angle.key}
              label={angle.label}
              desc={angle.desc}
              photoUrl={existing?.url ?? null}
              photoId={existing?.id ?? null}
            />
          )
        })}
      </div>

      {/* How-to guide */}
      <div className="bg-white rounded-2xl shadow-card px-5 py-4 space-y-3">
        <p className="text-xs font-semibold text-gray-700">📸 Photo tips for best results</p>
        <ul className="space-y-2">
          {[
            'Use consistent lighting — natural light or bright bathroom',
            'Same distance each time — arm\'s length from mirror',
            'Dry hair — wet hair distorts density appearance',
            'No styling products — they hide thinning',
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-[11px] text-gray-500 leading-relaxed">
              <span className="text-primary font-bold mt-0.5 shrink-0">{i + 1}.</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

    </div>
  )
}
