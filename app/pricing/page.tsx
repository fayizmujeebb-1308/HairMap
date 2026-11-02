import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing — HairMap',
  description: 'Simple, transparent pricing for HairMap. Start free, upgrade when you\'re ready.',
}

const FREE_FEATURES = [
  'Hair loss stage tracker',
  'Photo progress log (up to 10 photos)',
  'Daily treatment logging',
  'Basic 28-day streak heatmap',
  'Education library (10+ articles)',
  'Norwood scale self-assessment',
]

const PRO_FEATURES = [
  'Everything in Free',
  'Unlimited progress photos',
  'AI Hair Coach — unlimited messages',
  'Before/after photo comparison slider',
  'Full analytics & adherence graphs',
  'Export photos & data (CSV)',
  'Priority support',
  'Early access to new features',
]

const FAQ = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel whenever you like — your Pro access continues until the end of the billing period, then reverts to Free. No data is deleted.',
  },
  {
    q: 'Is my photo data private?',
    a: 'Absolutely. Photos are stored with a UUID filename — your name is never in the file path. We never share or sell your data.',
  },
  {
    q: 'What happens to my photos if I cancel?',
    a: 'Your photos stay in your account on the Free plan, but you won\'t be able to add new ones beyond the 10-photo limit.',
  },
  {
    q: 'Does the AI coach store my chat history?',
    a: 'Chat history is stored per session in your browser. Each new session starts fresh — your privacy comes first.',
  },
  {
    q: 'Is there a family or team plan?',
    a: 'Not yet. HairMap is currently built for individuals. If you need multi-seat access, email us and we\'ll find a solution.',
  },
]

const glassCard = {
  background: 'rgba(255,255,255,0.92)',
  backdropFilter: 'blur(20px) saturate(1.8)',
  WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
  border: '1px solid rgba(255,255,255,0.75)',
  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
  borderRadius: 24,
} as const

export default function PricingPage() {
  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(160deg, #f0fdf4 0%, #f8fafb 50%, #ecfdf5 100%)' }}
    >
      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between max-w-4xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="4" r="2.5" fill="white" opacity="0.9" />
              <ellipse cx="7" cy="9.5" rx="4" ry="2.5" fill="white" opacity="0.5" />
              <path d="M4 8.5 Q7 11 10 8.5" stroke="white" strokeWidth="0.8" fill="none" opacity="0.7" />
            </svg>
          </div>
          <span className="font-serif text-lg text-gray-900">HairMap</span>
        </Link>
        <Link
          href="/login"
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          Sign in
        </Link>
      </nav>

      <main className="px-6 py-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[11px] text-primary font-bold uppercase tracking-widest mb-3">Pricing</p>
          <h1 className="font-serif text-4xl text-gray-900 mb-4 leading-tight">
            Simple pricing.<br />No surprises.
          </h1>
          <p className="text-base text-gray-500 max-w-sm mx-auto leading-relaxed">
            Start free. Upgrade to Pro when you want AI coaching and unlimited photo tracking.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-5 mb-14">

          {/* Free */}
          <div style={{ ...glassCard, padding: 0 }} className="overflow-hidden">
            <div className="px-7 pt-7 pb-6">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-2">Free</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="font-serif text-5xl text-gray-900 leading-none">$0</span>
              </div>
              <p className="text-sm text-gray-400 mb-7">Forever free, no card required</p>

              <ul className="space-y-3">
                {FREE_FEATURES.map(f => (
                  <li key={f} className="flex items-start gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center mt-0.5 shrink-0"
                      style={{ background: 'rgba(16,185,129,0.10)' }}
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5.5L4 7.5L8 3" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="px-7 pb-7">
              <Link
                href="/signup"
                className="block w-full py-3.5 rounded-2xl text-sm font-semibold text-center transition-opacity active:opacity-80"
                style={{
                  background: 'rgba(16,185,129,0.08)',
                  border: '1.5px solid rgba(16,185,129,0.20)',
                  color: '#059669',
                }}
              >
                Get started free
              </Link>
            </div>
          </div>

          {/* Pro */}
          <div className="relative overflow-hidden" style={{ ...glassCard, padding: 0 }}>
            {/* Green gradient accent */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, transparent 50%)' }}
            />
            <div
              className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)' }}
            />

            {/* Best value badge */}
            <div className="absolute top-5 right-6">
              <div
                className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
                style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}
              >
                Most popular
              </div>
            </div>

            <div className="px-7 pt-7 pb-6 relative">
              <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-2">Pro</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="font-serif text-5xl text-gray-900 leading-none">$9</span>
                <span className="text-gray-400 text-sm mb-1.5">/month</span>
              </div>
              <p className="text-sm text-gray-400 mb-7">Cancel anytime</p>

              <ul className="space-y-3">
                {PRO_FEATURES.map(f => (
                  <li key={f} className="flex items-start gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center mt-0.5 shrink-0"
                      style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5.5L4 7.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700 font-medium">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="px-7 pb-7 relative">
              <Link
                href="/signup?plan=pro"
                className="block w-full py-3.5 rounded-2xl text-sm font-semibold text-center text-white transition-opacity active:opacity-80"
                style={{
                  background: 'linear-gradient(135deg, #059669, #10b981)',
                  boxShadow: '0 6px 20px rgba(16,185,129,0.32)',
                }}
              >
                Start Pro free for 7 days →
              </Link>
              <p className="text-[10px] text-gray-400 text-center mt-2">No card required for trial</p>
            </div>
          </div>
        </div>

        {/* Feature comparison table */}
        <div className="mb-14" style={{ ...glassCard, padding: 0, overflow: 'hidden' }}>
          <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(229,231,235,0.5)' }}>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Feature comparison</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(229,231,235,0.4)' }}>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider w-1/2">Feature</th>
                  <th className="px-4 py-3 text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Free</th>
                  <th className="px-4 py-3 text-center text-[11px] font-semibold text-primary uppercase tracking-wider">Pro</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Hair stage tracker', true, true],
                  ['Treatment logging', true, true],
                  ['Progress photos', '10 max', 'Unlimited'],
                  ['Streak heatmap', true, true],
                  ['Education library', true, true],
                  ['AI Hair Coach', false, true],
                  ['Photo comparison slider', false, true],
                  ['Full analytics', false, true],
                  ['CSV data export', false, true],
                  ['Priority support', false, true],
                ].map(([feature, free, pro], i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? '' : ''}
                    style={{
                      borderBottom: i < 9 ? '1px solid rgba(229,231,235,0.3)' : undefined,
                      background: i % 2 === 1 ? 'rgba(249,250,251,0.5)' : undefined,
                    }}
                  >
                    <td className="px-6 py-3.5 text-sm text-gray-700">{feature}</td>
                    <td className="px-4 py-3.5 text-center">
                      {free === true ? (
                        <svg className="inline w-4 h-4" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="6" fill="rgba(16,185,129,0.12)" />
                          <path d="M5 8.5l2 2 4-4" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : free === false ? (
                        <svg className="inline w-4 h-4" viewBox="0 0 16 16" fill="none">
                          <path d="M5 11L11 5M5 5l6 6" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      ) : (
                        <span className="text-xs text-gray-500">{free}</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {pro === true ? (
                        <svg className="inline w-4 h-4" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="6" fill="rgba(16,185,129,0.15)" />
                          <path d="M5 8.5l2 2 4-4" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : pro === false ? (
                        <svg className="inline w-4 h-4" viewBox="0 0 16 16" fill="none">
                          <path d="M5 11L11 5M5 5l6 6" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      ) : (
                        <span className="text-xs font-semibold text-primary">{pro}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-14">
          <h2 className="font-serif text-2xl text-gray-900 mb-6 text-center">Common questions</h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div key={i} style={{ ...glassCard, borderRadius: 16, padding: '16px 22px' }}>
                <p className="text-sm font-semibold text-gray-900 mb-1.5">{item.q}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div
          className="rounded-3xl px-8 py-10 text-center mb-8"
          style={{
            background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
            boxShadow: '0 12px 40px rgba(16,185,129,0.28)',
          }}
        >
          <p className="font-serif text-3xl text-white mb-3">Start tracking today.</p>
          <p className="text-white/70 text-sm mb-7 max-w-xs mx-auto leading-relaxed">
            Join thousands of men taking their hair health seriously. Free to start, no card needed.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-3.5 rounded-2xl text-sm font-semibold bg-white text-gray-900 transition-opacity active:opacity-80"
            style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
          >
            Create free account →
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center pb-8">
          <p className="text-xs text-gray-400">
            Questions? Email <a href="mailto:support@hair-map.com" className="text-primary underline underline-offset-2">support@hair-map.com</a>
          </p>
        </div>
      </main>
    </div>
  )
}
