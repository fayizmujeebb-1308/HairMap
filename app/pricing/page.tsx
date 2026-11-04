'use client'
import Link from 'next/link'
import { useState } from 'react'

const glassCard = {
  background: 'var(--bg-card)',
  backdropFilter: 'blur(20px) saturate(1.8)',
  WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
  border: '1px solid var(--bg-card-border)',
  boxShadow: 'var(--bg-card-shadow)',
  borderRadius: 24,
} as const

const FREE_FEATURES = [
  'Track up to 10 progress photos',
  'Basic treatment logging',
  'Streak tracking',
  '3 educational articles per month',
  'Norwood stage assessment',
]

const PRO_FEATURES = [
  'Unlimited progress photos',
  'AI hair analysis (on-demand)',
  'Full article library — 20+ guides',
  'Advanced streak & adherence analytics',
  'Export your data anytime',
  'Priority support',
  'Early access to new features',
]

const CLINIC_FEATURES = [
  'Everything in Pro',
  'Up to 50 patient accounts',
  'Clinic dashboard & overview',
  'Patient progress reporting',
  'Custom branding (logo + colors)',
  'Bulk patient onboarding',
  'Dedicated account manager',
  'HIPAA-ready data handling',
]

const FAQ = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes — cancel from your account settings with one click, no questions asked. Your Pro access continues until the end of your billing period.',
  },
  {
    q: 'Is there a free trial?',
    a: 'The Free plan lets you try HairMap with no credit card required. You can upgrade to Pro whenever you\'re ready.',
  },
  {
    q: 'What does the AI analysis do?',
    a: 'When you tap "Analyse my hair," our AI reviews your latest photo and gives you a detailed assessment of density, coverage, and regrowth progress — completely on-demand, never automatic.',
  },
  {
    q: 'Is my data private?',
    a: 'Your photos and health data are stored securely and never shared with third parties. You can export or delete everything at any time.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit and debit cards, Apple Pay, and Google Pay — processed securely via Paddle.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'If you\'re not satisfied within 7 days of your first Pro payment, contact us and we\'ll refund you in full.',
  },
]

export default function PricingPage() {
  const [annual, setAnnual] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const proMonthly = 12
  const proAnnual = 99
  const proAnnualPerMonth = (proAnnual / 12).toFixed(2)
  const savings = Math.round(100 - (proAnnual / (proMonthly * 12)) * 100)

  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--bg-page)' }}
    >
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="3" fill="white" />
              <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="1.2" fill="none" opacity="0.5" />
            </svg>
          </div>
          <span className="font-serif text-gray-900 font-semibold">HairMap</span>
        </Link>
        <Link
          href="/login"
          className="text-sm font-semibold px-4 py-2 rounded-xl transition-opacity active:opacity-70"
          style={{ color: '#059669' }}
        >
          Sign in
        </Link>
      </nav>

      <div className="px-4 pb-24 max-w-5xl mx-auto">

        {/* Hero */}
        <div className="text-center pt-10 pb-12">
          <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-3">Pricing</p>
          <h1 className="font-serif text-4xl text-gray-900 mb-4 leading-tight">
            Simple, honest pricing
          </h1>
          <p className="text-gray-500 text-base max-w-sm mx-auto leading-relaxed">
            Start free. Upgrade when you&apos;re ready to go deeper.
          </p>
        </div>

        {/* Annual toggle */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <span className={`text-sm font-semibold ${!annual ? 'text-gray-900' : 'text-gray-400'}`}>Monthly</span>
          <button
            onClick={() => setAnnual(a => !a)}
            className="relative w-12 h-6 rounded-full transition-colors duration-200"
            style={{ background: annual ? 'linear-gradient(135deg, #059669, #10b981)' : 'rgba(229,231,235,0.8)' }}
          >
            <span
              className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200"
              style={{ left: annual ? '28px' : '4px' }}
            />
          </button>
          <span className={`text-sm font-semibold ${annual ? 'text-gray-900' : 'text-gray-400'}`}>
            Annual
            <span
              className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ background: 'rgba(16,185,129,0.12)', color: '#059669' }}
            >
              Save {savings}%
            </span>
          </span>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-5 mb-16">

          {/* Free */}
          <div style={{ ...glassCard, padding: '28px 24px' }}>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-4">Free</p>
            <div className="flex items-end gap-1 mb-1">
              <span className="font-serif text-4xl text-gray-900">$0</span>
            </div>
            <p className="text-xs text-gray-400 mb-8">Forever free — no credit card</p>

            <Link
              href="/login"
              className="block w-full py-3.5 rounded-2xl text-sm font-semibold text-center mb-8 transition-opacity active:opacity-70"
              style={{ background: 'rgba(229,231,235,0.6)', color: '#4b5563' }}
            >
              Get started free
            </Link>

            <ul className="space-y-3">
              {FREE_FEATURES.map(f => (
                <li key={f} className="flex items-start gap-2.5">
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: 'rgba(16,185,129,0.10)' }}
                  >
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 4l1.5 1.5L6.5 2" stroke="#10b981" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-600 leading-snug">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pro */}
          <div
            className="relative"
            style={{
              ...glassCard,
              padding: '28px 24px',
              border: '1.5px solid rgba(16,185,129,0.30)',
              boxShadow: '0 8px 40px rgba(16,185,129,0.14)',
            }}
          >
            {/* Popular badge */}
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}
            >
              Most popular
            </div>

            <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-4">Pro</p>
            <div className="flex items-end gap-1 mb-1">
              <span className="font-serif text-4xl text-gray-900">
                {annual ? `$${proAnnualPerMonth}` : `$${proMonthly}`}
              </span>
              <span className="text-sm text-gray-400 mb-1">/mo</span>
            </div>
            <p className="text-xs text-gray-400 mb-8">
              {annual ? `Billed annually ($${proAnnual}/yr)` : 'Billed monthly · or $99/yr'}
            </p>

            <Link
              href="/upgrade"
              className="block w-full py-3.5 rounded-2xl text-sm font-semibold text-center text-white mb-8 transition-opacity active:opacity-80"
              style={{
                background: 'linear-gradient(135deg, #059669, #10b981)',
                boxShadow: '0 6px 20px rgba(16,185,129,0.32)',
              }}
            >
              Upgrade to Pro
            </Link>

            <ul className="space-y-3">
              {PRO_FEATURES.map(f => (
                <li key={f} className="flex items-start gap-2.5">
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}
                  >
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 4l1.5 1.5L6.5 2" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700 leading-snug font-medium">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Clinic */}
          <div style={{ ...glassCard, padding: '28px 24px' }}>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-4">Clinic</p>
            <div className="flex items-end gap-1 mb-1">
              <span className="font-serif text-4xl text-gray-900">$49</span>
              <span className="text-sm text-gray-400 mb-1">/mo</span>
            </div>
            <p className="text-xs text-gray-400 mb-8">Per clinic · up to 50 patients</p>

            <Link
              href="/clinic"
              className="block w-full py-3.5 rounded-2xl text-sm font-semibold text-center mb-8 transition-opacity active:opacity-70"
              style={{
                background: 'rgba(16,185,129,0.08)',
                color: '#059669',
                border: '1px solid rgba(16,185,129,0.20)',
              }}
            >
              Learn more →
            </Link>

            <ul className="space-y-3">
              {CLINIC_FEATURES.map(f => (
                <li key={f} className="flex items-start gap-2.5">
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: 'rgba(16,185,129,0.10)' }}
                  >
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 4l1.5 1.5L6.5 2" stroke="#10b981" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-600 leading-snug">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Feature comparison table */}
        <div className="mb-16" style={{ ...glassCard, padding: 0, overflow: 'hidden' }}>
          <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(229,231,235,0.5)' }}>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Full feature comparison</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(229,231,235,0.4)' }}>
                  <th className="text-left px-6 py-3 text-xs text-gray-400 font-semibold w-1/2">Feature</th>
                  <th className="text-center px-4 py-3 text-xs text-gray-400 font-semibold">Free</th>
                  <th className="text-center px-4 py-3 text-xs font-bold" style={{ color: '#059669' }}>Pro</th>
                  <th className="text-center px-4 py-3 text-xs text-gray-400 font-semibold">Clinic</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Progress photos', '10', 'Unlimited', 'Unlimited'],
                  ['Treatment logging', '✓', '✓', '✓'],
                  ['Streak tracking', '✓', '✓', '✓'],
                  ['AI hair analysis', '—', '✓', '✓'],
                  ['Educational articles', '3/month', 'Unlimited', 'Unlimited'],
                  ['Data export', '—', '✓', '✓'],
                  ['Patient management', '—', '—', '✓'],
                  ['Clinic dashboard', '—', '—', '✓'],
                  ['Custom branding', '—', '—', '✓'],
                  ['Priority support', '—', '✓', '✓'],
                ].map(([feature, free, pro, clinic], i) => (
                  <tr
                    key={feature}
                    style={{ borderBottom: i < 9 ? '1px solid rgba(229,231,235,0.3)' : undefined }}
                  >
                    <td className="px-6 py-3.5 text-sm text-gray-700">{feature}</td>
                    <td className="px-4 py-3.5 text-center text-sm text-gray-400">{free}</td>
                    <td className="px-4 py-3.5 text-center text-sm font-semibold" style={{ color: '#059669' }}>{pro}</td>
                    <td className="px-4 py-3.5 text-center text-sm text-gray-500">{clinic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold text-center mb-6">
            Common questions
          </p>
          <div className="space-y-2">
            {FAQ.map((item, i) => (
              <div
                key={i}
                style={{ ...glassCard, padding: 0, borderRadius: 16 }}
                className="overflow-hidden"
              >
                <button
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-sm font-semibold text-gray-800">{item.q}</span>
                  <svg
                    width="16" height="16" viewBox="0 0 16 16" fill="none"
                    className="shrink-0 transition-transform duration-200"
                    style={{ transform: openFaq === i ? 'rotate(180deg)' : undefined }}
                  >
                    <path d="M4 6l4 4 4-4" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          className="rounded-3xl text-center px-8 py-12"
          style={{
            background: 'linear-gradient(135deg, rgba(5,150,105,0.06) 0%, rgba(16,185,129,0.10) 100%)',
            border: '1px solid rgba(16,185,129,0.15)',
          }}
        >
          <p className="font-serif text-2xl text-gray-900 mb-3">
            Start tracking today
          </p>
          <p className="text-sm text-gray-500 mb-8 max-w-xs mx-auto leading-relaxed">
            Join thousands of men taking their hair recovery seriously.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/login"
              className="px-8 py-3.5 rounded-2xl text-sm font-semibold text-white"
              style={{
                background: 'linear-gradient(135deg, #059669, #10b981)',
                boxShadow: '0 6px 20px rgba(16,185,129,0.32)',
              }}
            >
              Get started free
            </Link>
            <Link
              href="/clinic"
              className="px-8 py-3.5 rounded-2xl text-sm font-semibold"
              style={{
                background: 'var(--bg-card)',
                color: '#059669',
                border: '1px solid rgba(16,185,129,0.20)',
              }}
            >
              For clinics →
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
