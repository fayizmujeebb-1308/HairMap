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

  // Keep only most recent photo per angle
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const latestByAngle: Record<string, { id: string; url: string }> = {}
  for (const p of photos ?? []) {
    if (!latestByAngle[p.angle]) {
      const url = p.thumb_path
        ? `${supabaseUrl}/storage/v1/object/public/${p.thumb_path}`
        : ''
      latestByAngle[p.angle] = { id: p.id, url }
    }
  }

  const doneCount = Object.keys(latestByAngle).length
  const isPro = profile?.subscription_status === 'pro' || profile?.subscription_status === 'trialing'
  const progress = (doneCount / 6) * 100

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="flex items-start justify-between pt-2 animate-fade-in-up">
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Progress</p>
          <h1 className="font-serif text-[26px] text-gray-900 mt-0.5">Photos</h1>
        </div>
        <div className="text-right animate-scale-in">
          <p className="font-serif text-2xl text-gray-900">
            {doneCount}<span className="text-sm text-gray-300 font-sans font-normal">/6</span>
          </p>
          <p className="text-[10px] text-gray-400">angles captured</p>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="space-y-1.5 animate-fade-in-up delay-75">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progress}%`,
              background: progress === 100
                ? 'linear-gradient(90deg, #059669, #10b981)'
                : 'linear-gradient(90deg, #10b981, #34d399)',
            }}
          />
        </div>
        <p className="text-[10px] text-gray-400">
          {doneCount === 6
            ? 'All angles complete — AI analysis ready'
            : `${6 - doneCount} angle${6 - doneCount !== 1 ? 's' : ''} remaining for full AI analysis`}
        </p>
      </div>

      {/* ── Tip / AI Analysis banner ── */}
      {doneCount < 6 ? (
        <div className="rounded-2xl px-4 py-3.5 flex items-center gap-3 animate-fade-in-up delay-100"
          style={{
            background: 'rgba(16,185,129,0.07)',
            border: '1px solid rgba(16,185,129,0.15)',
          }}>
          <span className="text-xl shrink-0">💡</span>
          <p className="text-xs text-gray-600 leading-relaxed">
            {doneCount === 0
              ? 'Tap any slot to take or upload a photo. All 6 angles give the most accurate AI analysis.'
              : `${6 - doneCount} angle${6 - doneCount > 1 ? 's' : ''} remaining. Complete all 6 for the full AI hair analysis.`}
          </p>
        </div>
      ) : (
        <div className="animate-fade-in-up delay-100">
          <AIAnalysis lastAnalysis={lastAnalysis} isPro={isPro} compact />
        </div>
      )}

      {/* ── Day 1 CTA card (empty state) ── */}
      {doneCount === 0 && (
        <div className="rounded-2xl px-5 py-6 text-center animate-fade-in-up delay-100"
          style={{ background: 'linear-gradient(135deg, #059669, #10b981)', boxShadow: '0 8px 24px rgba(16,185,129,0.30)' }}>
          <div className="text-4xl mb-3">📸</div>
          <h2 className="text-white font-bold text-lg mb-1">Capture your Day 1 baseline</h2>
          <p className="text-emerald-100 text-xs leading-relaxed mb-4">
            Your first photos unlock AI analysis and give you a reference point for all future comparisons.
          </p>
          <a href="#photo-grid"
            className="inline-block bg-white text-emerald-700 font-semibold text-sm px-5 py-2 rounded-full"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
            Start →
          </a>
        </div>
      )}

      {/* ── Angle grid ── */}
      <div id="photo-grid" className="grid grid-cols-2 gap-3 animate-fade-in-up delay-150">
        {ANGLES.map((angle, i) => {
          const existing = latestByAngle[angle.key] ?? null
          return (
            <div key={angle.key} className={`delay-${i * 75}`} style={doneCount === 0 ? { opacity: 0.5 } : undefined}>
              <PhotoSlot
                angle={angle.key}
                label={angle.label}
                desc={angle.desc}
                photoUrl={existing?.url ?? null}
                photoId={existing?.id ?? null}
              />
            </div>
          )
        })}
      </div>

      {/* ── Photo tips ── */}
      <div className="rounded-2xl px-5 py-4 space-y-3 animate-fade-in-up delay-400"
        style={{
          background: 'var(--bg-card)',
          backdropFilter: 'blur(20px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
          border: '1px solid var(--bg-card-border)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        }}>
        <div className="flex items-center gap-2">
          <span className="text-base">📸</span>
          <p className="text-xs font-semibold text-gray-700">Photo tips for best results</p>
        </div>
        <ul className="space-y-2.5">
          {[
            ['🌞', 'Consistent lighting — natural light or bright bathroom'],
            ['📏', 'Same distance each time — arm\'s length from mirror'],
            ['💧', 'Dry hair — wet hair distorts density appearance'],
            ['🚿', 'No styling products — they can hide thinning'],
          ].map(([icon, tip], i) => (
            <li key={i} className="flex items-start gap-2.5 text-[11px] text-gray-500 leading-relaxed">
              <span className="shrink-0 text-sm">{icon}</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

    </div>
  )
}
