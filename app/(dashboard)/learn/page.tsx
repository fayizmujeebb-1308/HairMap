import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { personalizeArticles, type UserContext } from '@/app/lib/personalize'

const CATEGORY_META: Record<string, { color: string; bg: string; icon: string }> = {
  Science:    { color: 'text-blue-600',  bg: 'bg-blue-50',   icon: '🔬' },
  Treatments: { color: 'text-primary',   bg: 'bg-primary/8', icon: '💊' },
  Progress:   { color: 'text-amber-600', bg: 'bg-amber-50',  icon: '📈' },
}

const TAG_STYLE: Record<string, string> = {
  green: 'bg-primary/8 text-primary',
  blue:  'bg-blue-50 text-blue-600',
  amber: 'bg-amber-50 text-amber-600',
  gray:  'bg-gray-100 text-gray-500',
}

export default async function LearnPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const monthStart = new Date()
  monthStart.setDate(1)

  const [{ data: profile }, { data: stack }, { data: logs }] = await Promise.all([
    supabase.from('profiles').select('norwood_stage, created_at').eq('user_id', user.id).single(),
    supabase.from('treatment_stack').select('treatment_name').eq('user_id', user.id).eq('is_active', true),
    supabase.from('treatment_logs').select('taken_at').eq('user_id', user.id).gte('taken_at', monthStart.toISOString()),
  ])

  const treatmentNames = (stack ?? []).map(s => s.treatment_name.toLowerCase())
  const daysTracked    = profile?.created_at
    ? Math.max(1, Math.floor((Date.now() - new Date(profile.created_at).getTime()) / 86400000))
    : 1
  const logDays        = new Set((logs ?? []).map(l => l.taken_at.split('T')[0])).size
  const daysInMonth    = new Date().getDate()
  const adherence      = daysInMonth > 0 ? Math.min(100, Math.round((logDays / daysInMonth) * 100)) : 0

  const ctx: UserContext = {
    norwoodStage:      profile?.norwood_stage ?? null,
    daysTracked,
    adherence,
    treatmentNames,
    isOnFinasteride:   treatmentNames.some(n => n.includes('finasteride') || n.includes('propecia')),
    isOnMinoxidil:     treatmentNames.some(n => n.includes('minoxidil') || n.includes('rogaine')),
    isOnKetoconazole:  treatmentNames.some(n => n.includes('ketoconazole') || n.includes('nizoral')),
    streak:            0,
  }

  const articles   = personalizeArticles(ctx)
  const topPicks   = articles.filter(a => a.recommended)
  const restBySlug = new Set(topPicks.map(a => a.slug))
  const rest       = articles.filter(a => !restBySlug.has(a.slug))

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="pt-2">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Education</p>
        <h1 className="font-serif text-2xl text-gray-900 mt-1">Learn</h1>
        <p className="text-xs text-gray-400 mt-1 leading-relaxed">
          Personalised to your stage and treatment stack.
        </p>
      </div>

      {/* Recommended for you */}
      {topPicks.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Recommended for you</p>
          </div>
          <div className="space-y-2.5">
            {topPicks.map(article => {
              const meta = CATEGORY_META[article.category] ?? { color: 'text-gray-500', bg: 'bg-gray-50', icon: '📄' }
              return (
                <Link key={article.slug} href={`/learn/${article.slug}`}
                  className="flex items-start gap-4 bg-white rounded-2xl border px-4 py-4 active:scale-[0.99] transition-transform"
                  style={{ borderWidth: '0.5px', borderColor: '#f0fdf9', background: 'linear-gradient(135deg, #fff 80%, #f0fdf9 100%)' }}>
                  <div className={`w-10 h-10 rounded-xl ${meta.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                    <span className="text-base">{meta.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      {article.tag && (
                        <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${TAG_STYLE[article.tag.style]}`}>
                          {article.tag.label}
                        </span>
                      )}
                      <span className="text-[9px] text-gray-300">{article.readTime} read</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 leading-snug">{article.title}</p>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed line-clamp-2">{article.subtitle}</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-200 shrink-0 mt-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* All articles */}
      {rest.length > 0 && (
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-3">
            {topPicks.length > 0 ? 'All articles' : 'Articles'}
          </p>
          <div className="space-y-2.5">
            {rest.map(article => {
              const meta = CATEGORY_META[article.category] ?? { color: 'text-gray-500', bg: 'bg-gray-50', icon: '📄' }
              return (
                <Link key={article.slug} href={`/learn/${article.slug}`}
                  className="flex items-start gap-4 bg-white rounded-2xl border px-4 py-4 active:scale-[0.99] transition-transform"
                  style={{ borderWidth: '0.5px', borderColor: '#f3f4f6' }}>
                  <div className={`w-10 h-10 rounded-xl ${meta.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                    <span className="text-base">{meta.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className={`text-[9px] font-semibold ${meta.color}`}>{article.category}</span>
                      {article.tag && (
                        <>
                          <span className="text-[9px] text-gray-200">·</span>
                          <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${TAG_STYLE[article.tag.style]}`}>
                            {article.tag.label}
                          </span>
                        </>
                      )}
                      <span className="text-[9px] text-gray-300">· {article.readTime}</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 leading-snug">{article.title}</p>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed line-clamp-2">{article.subtitle}</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-200 shrink-0 mt-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-[10px] text-gray-300 text-center pb-4 leading-relaxed px-4">
        For general education only — not medical advice. Always consult a dermatologist before changing your treatment.
      </p>

    </div>
  )
}
