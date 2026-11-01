import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import PaddleButton from '@/app/components/PaddleButton'

const PRO_MONTHLY_ID  = process.env.NEXT_PUBLIC_PADDLE_PRO_MONTHLY_ID  ?? ''
const PRO_YEARLY_ID   = process.env.NEXT_PUBLIC_PADDLE_PRO_YEARLY_ID   ?? ''

export default async function PricingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = user
    ? await supabase.from('profiles').select('subscription_status').eq('user_id', user.id).single()
    : { data: null }

  const isPro = profile?.subscription_status === 'pro' || profile?.subscription_status === 'trialing'

  return (
    <div className="min-h-screen bg-[#fafaf8] px-5 py-10 flex flex-col items-center">

      <div className="text-center mb-8">
        <p className="text-[10px] text-primary uppercase tracking-widest font-semibold mb-2">Pricing</p>
        <h1 className="font-serif text-3xl text-gray-900 leading-tight mb-2">Simple, honest pricing</h1>
        <p className="text-sm text-gray-400 max-w-xs mx-auto">Start free. Upgrade when you&apos;re serious about your results.</p>
      </div>

      <div className="w-full max-w-sm space-y-4">

        {/* Free */}
        <div className="bg-white rounded-2xl border px-5 py-5" style={{ borderWidth: '0.5px', borderColor: '#e5e7eb' }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-semibold text-gray-900">Free</p>
              <p className="text-2xl font-serif text-gray-900 mt-0.5">$0</p>
            </div>
            {!isPro && user && (
              <span className="text-[10px] px-2 py-1 rounded-full bg-gray-100 text-gray-500 font-semibold">Current plan</span>
            )}
          </div>
          <ul className="space-y-2 text-sm text-gray-500 mb-4">
            {[
              '1 active treatment',
              'Up to 10 progress photos',
              'Daily dose logging',
              'Streak & adherence tracking',
            ].map(f => (
              <li key={f} className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
          {!user && (
            <Link href="/signup"
              className="block text-center w-full border border-gray-200 text-gray-600 text-sm font-semibold py-3 rounded-xl">
              Get started free
            </Link>
          )}
        </div>

        {/* Pro */}
        <div className="bg-primary rounded-2xl px-5 py-5 relative overflow-hidden">
          <div className="absolute top-4 right-4">
            <span className="text-[10px] px-2 py-1 rounded-full bg-white/20 text-white font-semibold">Most popular</span>
          </div>
          <div className="mb-4">
            <p className="font-semibold text-white">Pro</p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <p className="text-2xl font-serif text-white">$12</p>
              <p className="text-xs text-white/60">/month</p>
            </div>
            <p className="text-[10px] text-white/50 mt-0.5">or $99/year — save 31%</p>
          </div>
          <ul className="space-y-2 text-sm text-white/80 mb-5">
            {[
              'Unlimited treatments',
              'Unlimited progress photos',
              'AI progress analysis (monthly)',
              'Side-by-side photo comparison',
              'Email & push reminders',
              'PDF monthly report (coming soon)',
            ].map(f => (
              <li key={f} className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {f}
              </li>
            ))}
          </ul>

          {isPro ? (
            <div className="w-full text-center bg-white/20 text-white text-sm font-semibold py-3 rounded-xl">
              ✓ You&apos;re on Pro
            </div>
          ) : (
            <PaddleButton
              priceIdMonthly={PRO_MONTHLY_ID}
              priceIdYearly={PRO_YEARLY_ID}
              userEmail={user?.email ?? ''}
            />
          )}

          {!isPro && (
            <p className="text-[10px] text-white/40 text-center mt-2">7-day free trial · card required · cancel anytime</p>
          )}
        </div>

        {/* Clinic — coming soon */}
        <div className="bg-white rounded-2xl border px-5 py-5" style={{ borderWidth: '0.5px', borderColor: '#e5e7eb' }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-semibold text-gray-900">Clinic</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <p className="text-2xl font-serif text-gray-900">$49</p>
                <p className="text-xs text-gray-400">/month</p>
              </div>
            </div>
            <span className="text-[10px] px-2 py-1 rounded-full bg-amber-50 text-amber-600 font-semibold">Coming soon</span>
          </div>
          <ul className="space-y-2 text-sm text-gray-400 mb-4">
            {[
              'Everything in Pro',
              'Manage multiple patients',
              'Patient photo comparison',
              'Clinic-branded reports',
              'Priority support',
            ].map(f => (
              <li key={f} className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-gray-200 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
          <button disabled
            className="w-full text-center border border-gray-100 text-gray-300 text-sm font-semibold py-3 rounded-xl cursor-not-allowed">
            Notify me
          </button>
        </div>

      </div>

      <Link href="/dashboard" className="mt-6 text-xs text-gray-300 hover:text-gray-400 transition-colors">
        ← Back to dashboard
      </Link>
    </div>
  )
}
