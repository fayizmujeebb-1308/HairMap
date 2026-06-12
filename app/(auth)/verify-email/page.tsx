'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const [cooldown, setCooldown] = useState(0)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (cooldown > 0) {
      const t = setTimeout(() => setCooldown(c => c - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [cooldown])

  async function resend() {
    if (cooldown > 0) return
    const supabase = createClient()
    await supabase.auth.resend({ type: 'signup', email })
    setSent(true)
    setCooldown(60)
  }

  return (
    <div className="w-full max-w-md text-center">
      <div className="bg-white rounded-card border border-gray-200 p-8 shadow-sm" style={{ borderWidth: '0.5px' }}>
        <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h1 className="font-serif text-2xl text-gray-900 mb-2">Check your email</h1>
        <p className="text-gray-500 text-sm mb-2">We sent a verification link to</p>
        <p className="font-medium text-gray-900 text-sm mb-8">{email}</p>

        <p className="text-gray-500 text-sm mb-6">
          Click the link in the email to verify your account and continue to HairMap.
        </p>

        {sent && (
          <p className="text-primary text-sm mb-4">Email resent successfully!</p>
        )}

        <button
          onClick={resend}
          disabled={cooldown > 0}
          className="text-sm text-primary hover:text-primary-dark disabled:text-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend email'}
        </button>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  )
}
