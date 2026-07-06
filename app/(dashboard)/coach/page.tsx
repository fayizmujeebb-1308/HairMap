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

      {/* Header */}
      <div className="flex items-center justify-between pt-2 pb-4 shrink-0">
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">AI</p>
          <h1 className="font-serif text-2xl text-gray-900 mt-0.5">Hair Coach</h1>
        </div>
        <div className="flex items-center gap-1.5 bg-primary/10 px-2.5 py-1.5 rounded-xl">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-semibold text-primary">GPT-4o mini</span>
        </div>
      </div>

      {isPro ? (
        <CoachChat firstName={profile?.first_name ?? 'there'} />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <p className="font-serif text-xl text-gray-900 mb-2">AI Hair Coach</p>
          <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-[260px]">
            Ask anything about hair loss, your treatments, what&apos;s working, or what to try next.
          </p>
          <Link href="/pricing"
            className="bg-primary text-white text-sm font-semibold px-6 py-3 rounded-xl active:scale-95 transition-transform shadow-glow-green">
            Upgrade to Pro
          </Link>
          <p className="text-[10px] text-gray-300 mt-2">7-day free trial · cancel anytime</p>
        </div>
      )}

    </div>
  )
}
