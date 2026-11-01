import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CoachChat from '@/app/components/CoachChat'
import Link from 'next/link'

export default async function CoachPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, subscription_status')
    .eq('user_id', user.id)
    .single()

  const isPro = profile?.subscription_status === 'pro' || profile?.subscription_status === 'trialing'

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">

      {/* ── Header ── */}
      <div className="flex items-center justify-between pt-2 pb-4 shrink-0 animate-fade-in-up">
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">AI</p>
          <h1 className="font-serif text-[26px] text-gray-900 mt-0.5">Hair Coach</h1>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
          style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
          <div className="w-1.5 h-1.5 rounded-full bg-primary" style={{ animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite' }} />
          <span className="text-[10px] font-semibold text-primary">GPT-4o mini</span>
        </div>
      </div>

      {isPro ? (
        <CoachChat firstName={profile?.first_name ?? 'there'} />
      ) : (
        /* ── Paywall ── */
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 animate-fade-in-up delay-75">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
            style={{
              background: 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,185,129,0.15)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}>
            <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>

          <p className="font-serif text-xl text-gray-900 mb-2">AI Hair Coach</p>
          <p className="text-sm text-gray-400 leading-relaxed mb-8 max-w-[260px]">
            Ask anything about hair loss, your treatments, what&apos;s working, or what to try next. Available 24/7.
          </p>

          {/* Feature chips */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {['Treatment Q&A', 'Side effect help', 'Progress insights', 'Protocol advice'].map(f => (
              <span key={f} className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(16,185,129,0.06)', color: '#059669', border: '1px solid rgba(16,185,129,0.12)' }}>
                {f}
              </span>
            ))}
          </div>

          <Link href="/pricing"
            className="text-white text-sm font-semibold px-8 py-3 rounded-2xl active:scale-95 transition-transform"
            style={{
              background: 'linear-gradient(135deg, #059669, #10b981)',
              boxShadow: '0 8px 24px rgba(16,185,129,0.30)',
            }}>
            Upgrade to Pro
          </Link>
          <p className="text-[10px] text-gray-300 mt-2.5">7-day free trial · cancel anytime</p>
        </div>
      )}

    </div>
  )
}
