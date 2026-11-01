'use client'

import { useState, useEffect } from 'react'

declare global {
  interface Window {
    Paddle?: {
      Initialize: (opts: { token: string }) => void
      Checkout: { open: (opts: object) => void }
    }
  }
}

type Props = {
  priceIdMonthly: string
  priceIdYearly: string
  userEmail: string
}

export default function PaddleButton({ priceIdMonthly, priceIdYearly, userEmail }: Props) {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (window.Paddle) { setLoaded(true); return }
    const script = document.createElement('script')
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js'
    script.onload = () => {
      window.Paddle?.Initialize({ token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? '' })
      setLoaded(true)
    }
    document.head.appendChild(script)
  }, [])

  function checkout() {
    if (!loaded || !window.Paddle) return
    const priceId = billing === 'yearly' ? priceIdYearly : priceIdMonthly
    window.Paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customer: userEmail ? { email: userEmail } : undefined,
      settings: { successUrl: `${window.location.origin}/account?upgraded=1` },
    })
  }

  return (
    <div className="space-y-2">
      {/* Billing toggle */}
      <div className="flex bg-white/10 rounded-xl p-1 gap-1">
        {(['monthly', 'yearly'] as const).map(b => (
          <button key={b} type="button"
            onClick={() => setBilling(b)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              billing === b ? 'bg-white text-primary' : 'text-white/60'
            }`}>
            {b === 'monthly' ? 'Monthly' : 'Yearly · save 31%'}
          </button>
        ))}
      </div>
      <button type="button"
        onClick={checkout}
        disabled={!loaded}
        className="w-full bg-white text-primary text-sm font-semibold py-3 rounded-xl disabled:opacity-60 active:scale-95 transition-transform">
        {loaded ? 'Start 7-day free trial' : 'Loading…'}
      </button>
    </div>
  )
}
