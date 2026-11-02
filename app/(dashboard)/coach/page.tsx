import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CoachChat from '@/app/components/CoachChat'
import CoachPaywall from '@/app/components/CoachPaywall'

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
        <div className="flex-1 flex flex-col justify-center animate-fade-in-up delay-75">
          <CoachPaywall />
        </div>
      )}

    </div>
  )
}
