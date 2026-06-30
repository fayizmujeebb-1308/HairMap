import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getArticle } from '@/app/lib/articles'
import { getCallout, personalizeArticles, type UserContext } from '@/app/lib/personalize'

const CATEGORY_META: Record<string, { color: string; bg: string; border: string; pill: string }> = {
  Science:    { color: 'text-blue-600',  bg: 'bg-blue-50',   border: 'border-blue-100',    pill: 'bg-blue-50 text-blue-600' },
  Treatments: { color: 'text-primary',   bg: 'bg-primary/8', border: 'border-primary/15',  pill: 'bg-primary/8 text-primary' },
  Progress:   { color: 'text-amber-600', bg: 'bg-amber-50',  border: 'border-amber-100',   pill: 'bg-amber-50 text-amber-600' },
}

const CALLOUT_STYLE: Record<string, { bg: string; border: string; heading: string; body: string; icon: string }> = {
  green: { bg: 'bg-primary/5',  border: 'border-primary/15', heading: 'text-primary',   body: 'text-primary/70',   icon: '✓' },
  blue:  { bg: 'bg-blue-50',    border: 'border-blue-100',   heading: 'text-blue-700',  body: 'text-blue-600/70',  icon: 'ℹ' },
  amber: { bg: 'bg-amber-50',   border: 'border-amber-100',  heading: 'text-amber-700', body: 'text-amber-600/80', icon: '!' },
}

const CATEGORY_ICON: Record<string, string> = {
  Science: '🔬', Treatments: '💊', Progress: '📈',
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const article = getArticle(params.slug)
  if (!article) notFound()

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
  const logDays     = new Set((logs ?? []).map(l => l.taken_at.split('T')[0])).size
  const adherence   = Math.min(100, Math.round((logDays / new Date().getDate()) * 100))

  const ctx: UserContext = {
    norwoodStage:     profile?.norwood_stage ?? null,
    daysTracked,
    adherence,
    treatmentNames,
    isOnFinasteride:  treatmentNames.some(n => n.includes('finasteride') || n.includes('propecia')),
    isOnMinoxidil:    treatmentNames.some(n => n.includes('minoxidil') || n.includes('rogaine')),
    isOnKetoconazole: treatmentNames.some(n => n.includes('ketoconazole') || n.includes('nizoral')),
    streak:           0,
  }

  const callout = getCallout(article.slug, ctx)
  const meta    = CATEGORY_META[article.category] ?? { color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-100', pill: 'bg-gray-100 text-gray-500' }

  // Related: personalised, same category first, max 2
  const scored  = personalizeArticles(ctx)
  const related = scored.filter(a => a.slug !== article.slug).slice(0, 2)

  return (
    <div>

      {/* Back */}
      <div className="pt-2 pb-5">
        <Link href="/learn"
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 active:text-gray-600 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Learn
        </Link>
      </div>

      {/* Hero */}
      <div className="pb-7">
        <div className="flex items-center gap-2.5 mb-4">
          <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${meta.pill}`}>
            {article.category}
          </span>
          <span className="text-[10px] text-gray-300">{article.readTime} read</span>
        </div>
        <h1 className="font-serif text-[1.65rem] text-gray-900 leading-tight mb-3">{article.title}</h1>
        <p className="text-sm text-gray-500 leading-relaxed">{article.subtitle}</p>
      </div>

      {/* Personalised callout — shown before body if present */}
      {callout && (() => {
        const cs = CALLOUT_STYLE[callout.style]
        return (
          <div className={`rounded-2xl px-5 py-4 mb-6 border ${cs.bg} ${cs.border}`} style={{ borderWidth: '0.5px' }}>
            <div className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${cs.bg} ${cs.heading}`}
                style={{ border: '0.5px solid currentColor', opacity: 0.6 }}>
                {cs.icon}
              </div>
              <div>
                <p className={`text-xs font-semibold mb-1 ${cs.heading}`}>{callout.heading}</p>
                <p className={`text-xs leading-relaxed ${cs.body}`}>{callout.body}</p>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Divider */}
      <div className="h-px bg-gray-100 mb-8" />

      {/* Article body */}
      <div className="space-y-8 pb-10">
        {article.content.map((section, i) => {
          const paragraphs = section.body.split('\n\n')

          // First section with no heading → pull-quote opener
          if (i === 0 && !section.heading) {
            return (
              <div key={i} className={`rounded-2xl px-5 py-5 border ${meta.bg} ${meta.border}`} style={{ borderWidth: '0.5px' }}>
                {paragraphs.map((para, j) => (
                  <p key={j} className={`text-sm font-medium leading-relaxed ${meta.color}`}>{para}</p>
                ))}
              </div>
            )
          }

          return (
            <div key={i} className="space-y-3">
              {section.heading && (
                <h2 className="font-serif text-lg text-gray-900 leading-snug">{section.heading}</h2>
              )}
              <div className="space-y-3">
                {paragraphs.map((para, j) => (
                  <p key={j} className="text-[15px] text-gray-600 leading-loose">{para}</p>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Disclaimer */}
      <div className="flex gap-3 bg-gray-50 rounded-2xl px-4 py-4 mb-8" style={{ border: '0.5px solid #f3f4f6' }}>
        <svg className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-[10px] text-gray-400 leading-relaxed">
          For general educational purposes only — not medical advice. Always consult a qualified dermatologist or healthcare professional before starting, stopping, or changing any treatment.
        </p>
      </div>

      {/* Read next — personalised */}
      {related.length > 0 && (
        <div className="pb-6">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-3">Read next</p>
          <div className="space-y-2.5">
            {related.map(rel => {
              const relMeta = CATEGORY_META[rel.category] ?? { color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-100', pill: 'bg-gray-100 text-gray-500' }
              return (
                <Link key={rel.slug} href={`/learn/${rel.slug}`}
                  className="flex items-center gap-3 bg-white rounded-2xl border px-4 py-3.5 active:scale-[0.99] transition-transform"
                  style={{ borderWidth: '0.5px', borderColor: '#f3f4f6' }}>
                  <div className={`w-9 h-9 rounded-xl ${relMeta.bg} flex items-center justify-center shrink-0`}>
                    <span className="text-sm">{CATEGORY_ICON[rel.category] ?? '📄'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 leading-snug line-clamp-2">{rel.title}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {rel.tag && (
                        <span className={`text-[9px] font-semibold`} style={{ color: rel.tag.style === 'green' ? '#1D9E75' : rel.tag.style === 'amber' ? '#d97706' : '#2563eb' }}>
                          {rel.tag.label}
                        </span>
                      )}
                      {rel.tag && <span className="text-[9px] text-gray-200">·</span>}
                      <span className="text-[9px] text-gray-400">{rel.readTime} read</span>
                    </div>
                  </div>
                  <svg className="w-3.5 h-3.5 text-gray-200 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )
            })}
          </div>
        </div>
      )}

    </div>
  )
}
