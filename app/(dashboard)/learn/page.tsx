import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { personalizeArticles, type UserContext } from '@/app/lib/personalize'

const CATEGORY_META: Record<string, { color: string; bg: string; icon: string }> = {
  Science:    { color: '#3b82f6', bg: 'rgba(59,130,246,0.08)',  icon: '🔬' },
  Treatments: { color: 'var(--color-primary)', bg: 'var(--color-primary-dim)',  icon: '💊' },
  Progress:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  icon: '📈' },
}

const TAG_STYLE: Record<string, { bg: string; color: string }> = {
  green: { bg: 'var(--color-primary-dim)',  color: 'var(--color-primary-dark)' },
  blue:  { bg: 'rgba(59,130,246,0.08)',  color: '#3b82f6' },
  amber: { bg: 'rgba(245,158,11,0.08)',  color: '#d97706' },
  gray:  { bg: 'rgba(156,163,175,0.12)', color: '#6b7280' },
}

const glassCard = {
  background: 'var(--bg-card)',
  backdropFilter: 'blur(20px) saturate(1.8)',
  WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
  border: '1px solid var(--bg-card-border)',
  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
  borderRadius: 20,
} as const

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
    <div className="space-y-5 pb-2">

      {/* ── Header ── */}
      <div className="pt-2 animate-fade-in-up">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Education</p>
        <h1 className="font-serif text-[26px] text-gray-900 mt-0.5">Learn</h1>
        <p className="text-xs text-gray-400 mt-1 leading-relaxed">
          Personalised to your stage and treatment stack.
        </p>
      </div>

      {/* ── Recommended ── */}
      {topPicks.length > 0 && (
        <div className="animate-fade-in-up delay-75">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm">⭐</span>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Recommended for you</p>
          </div>
          <div className="space-y-2.5">
            {topPicks.map((article, i) => {
              const meta = CATEGORY_META[article.category] ?? { color: '#6b7280', bg: 'rgba(156,163,175,0.08)', icon: '📄' }
              const tagStyle = article.tag ? (TAG_STYLE[article.tag.style] ?? TAG_STYLE.gray) : null
              return (
                <Link key={article.slug} href={`/learn/${article.slug}`}
                  className={`flex items-start gap-4 px-4 py-4 active:scale-[0.99] transition-transform block delay-${i * 75}`}
                  style={{
                    ...glassCard,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 70%, rgba(240,253,244,0.9) 100%)',
                    border: '1px solid var(--color-primary-dim)',
                  }}>
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: meta.bg }}>
                    <span className="text-base">{meta.icon}</span>
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      {tagStyle && article.tag && (
                        <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: tagStyle.bg, color: tagStyle.color }}>
                          {article.tag.label}
                        </span>
                      )}
                      <span className="text-[9px] text-gray-300">{article.readTime} read</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 leading-snug">{article.title}</p>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed line-clamp-2">{article.subtitle}</p>
                  </div>
                  {/* Arrow */}
                  <svg className="w-4 h-4 text-gray-200 shrink-0 mt-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* ── All articles ── */}
      {rest.length > 0 && (
        <div className="animate-fade-in-up delay-150">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-3">
            {topPicks.length > 0 ? 'All articles' : 'Articles'}
          </p>
          <div className="space-y-2.5">
            {rest.map((article, i) => {
              const meta = CATEGORY_META[article.category] ?? { color: '#6b7280', bg: 'rgba(156,163,175,0.08)', icon: '📄' }
              const tagStyle = article.tag ? (TAG_STYLE[article.tag.style] ?? TAG_STYLE.gray) : null
              return (
                <Link key={article.slug} href={`/learn/${article.slug}`}
                  className={`flex items-start gap-4 px-4 py-4 active:scale-[0.99] transition-transform block delay-${i * 50}`}
                  style={glassCard}>
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: meta.bg }}>
                    <span className="text-base">{meta.icon}</span>
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-[9px] font-semibold" style={{ color: meta.color }}>{article.category}</span>
                      {tagStyle && article.tag && (
                        <>
                          <span className="text-[9px] text-gray-200">·</span>
                          <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: tagStyle.bg, color: tagStyle.color }}>
                            {article.tag.label}
                          </span>
                        </>
                      )}
                      <span className="text-[9px] text-gray-300">· {article.readTime}</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 leading-snug">{article.title}</p>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed line-clamp-2">{article.subtitle}</p>
                  </div>
                  {/* Arrow */}
                  <svg className="w-4 h-4 text-gray-200 shrink-0 mt-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Disclaimer ── */}
      <p className="text-[10px] text-gray-300 text-center pb-4 leading-relaxed px-4 animate-fade-in-up delay-300">
        For general education only — not medical advice. Always consult a dermatologist before changing your treatment.
      </p>

    </div>
  )
}
