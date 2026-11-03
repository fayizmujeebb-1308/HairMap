'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

declare global {
  interface Window {
    Paddle?: {
      Initialize: (opts: { token: string }) => void
      Checkout: { open: (opts: object) => void }
    }
  }
}

const PRO_FEATURES = [
  'Unlimited progress photos',
  'AI hair analysis — on demand',
  'Full article library (20+ guides)',
  'Advanced streak & adherence analytics',
  'Export your data anytime',
  'Priority support',
  'Early access to new features',
]

type Props = {
  userEmail: string
  priceIdMonthly: string
  priceIdYearly: string
}

export default function UpgradeClient({ userEmail, priceIdMonthly, priceIdYearly }: Props) {
  const [annual, setAnnual] = useState(false)
  const [paddleLoaded, setPaddleLoaded] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
    if (!token) return

    if (window.Paddle) {
      setPaddleLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js'
    script.async = true
    script.onload = () => {
      window.Paddle?.Initialize({ token })
      setPaddleLoaded(true)
    }
    document.head.appendChild(script)
    return () => {
      // cleanup not strictly needed for one-time loads
    }
  }, [])

  function handleCheckout() {
    if (!paddleLoaded || !window.Paddle) return
    const priceId = annual ? priceIdYearly : priceIdMonthly
    if (!priceId) {
      // Paddle not configured yet — redirect to contact
      window.open('mailto:fayizmujeebb@gmail.com?subject=HairMap Pro Upgrade', '_blank')
      return
    }
    setLoading(true)
    window.Paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customer: userEmail ? { email: userEmail } : undefined,
      settings: {
        successUrl: `${window.location.origin}/account?upgraded=1`,
        theme: 'light',
      },
    })
    setLoading(false)
  }

  const monthlyPrice = annual ? (99 / 12).toFixed(2) : '12'
  const savings = Math.round(100 - (99 / (12 * 12)) * 100)

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ background: 'var(--bg-page)' }}
    >
      {/* Back nav */}
      <div className="w-full max-w-md mb-8">
        <Link
          href="/account"
          className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
          style={{ color: 'var(--color-primary-dark)' }}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
      </div>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-3xl flex items-center justify-center mx-auto mb-5"
            style={{ background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))', boxShadow: '0 8px 24px rgba(from var(--color-primary) r g b / 30%)' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="white" />
            </svg>
          </div>
          <h1 className="font-serif text-3xl text-gray-900 mb-3">Upgrade to Pro</h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Everything you need to track your recovery seriously.
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: 'var(--bg-card)',
            backdropFilter: 'blur(20px) saturate(1.8)',
            WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
            border: '1.5px solid rgba(from var(--color-primary) r g b / 25%)',
            boxShadow: '0 8px 40px var(--color-primary-dim)',
          }}
        >
          {/* Billing toggle */}
          <div className="px-6 pt-6 pb-5" style={{ borderBottom: '1px solid rgba(229,231,235,0.5)' }}>
            <div
              className="flex rounded-2xl p-1 gap-1"
              style={{ background: 'rgba(241,245,249,0.8)' }}
            >
              {[
                { key: false, label: 'Monthly · $12/mo' },
                { key: true,  label: `Annual · $${(99/12).toFixed(2)}/mo` },
              ].map(({ key, label }) => (
                <button
                  key={String(key)}
                  type="button"
                  onClick={() => setAnnual(key)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200"
                  style={annual === key ? {
                    background: 'white',
                    color: 'var(--color-primary-dark)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  } : {
                    color: '#9ca3af',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            {annual && (
              <p className="text-center text-[10px] font-bold mt-2.5" style={{ color: 'var(--color-primary-dark)' }}>
                Save {savings}% — billed as $99/year
              </p>
            )}
          </div>

          {/* Price display */}
          <div className="px-6 py-5 text-center" style={{ borderBottom: '1px solid rgba(229,231,235,0.5)' }}>
            <div className="flex items-end justify-center gap-1 mb-1">
              <span className="font-serif text-5xl text-gray-900">${monthlyPrice}</span>
              <span className="text-gray-400 text-sm mb-1.5">/mo</span>
            </div>
            <p className="text-xs text-gray-400">
              {annual ? 'Billed as $99 once per year' : 'Billed monthly · cancel anytime'}
            </p>
          </div>

          {/* Features */}
          <div className="px-6 py-5" style={{ borderBottom: '1px solid rgba(229,231,235,0.5)' }}>
            <ul className="space-y-3">
              {PRO_FEATURES.map(f => (
                <li key={f} className="flex items-start gap-2.5">
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))' }}
                  >
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 4l1.5 1.5L6.5 2" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700 leading-snug">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="px-6 py-5">
            <button
              type="button"
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-4 rounded-2xl text-sm font-semibold text-white transition-opacity active:opacity-80 disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))',
                boxShadow: '0 6px 20px rgba(from var(--color-primary) r g b / 32%)',
              }}
            >
              {loading ? 'Opening checkout…' : `Upgrade to Pro · ${ annual ? '$99/yr' : '$12/mo' }`}
            </button>

            <div className="flex items-center gap-4 mt-4">
              <div className="flex-1 h-px bg-gray-100" />
              <p className="text-[10px] text-gray-400 shrink-0">Secure checkout via Paddle</p>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <p className="text-center text-[10px] text-gray-400 mt-3 leading-relaxed">
              Cancel anytime · No hidden fees
            </p>
          </div>
        </div>

        {/* Trust footer */}
        <p className="text-center text-[10px] text-gray-400 mt-6 leading-relaxed">
          By subscribing you agree to our{' '}
          <Link href="/terms" className="underline" style={{ color: 'var(--color-primary-dark)' }}>Terms</Link>
          {' '}and{' '}
          <Link href="/privacy" className="underline" style={{ color: 'var(--color-primary-dark)' }}>Privacy Policy</Link>.
        </p>
      </div>
    </div>
  )
}
