'use client'

import { useState } from 'react'
import Link from 'next/link'

const CHIPS = [
  {
    label: 'Treatment Q&A',
    response: 'Minoxidil works best applied to a completely dry scalp. Wait 4 hours before washing. Consistency matters more than timing.',
  },
  {
    label: 'Side effect help',
    response: 'Initial shedding with minoxidil usually peaks at weeks 6–8 and resolves by month 3. It\'s a sign the follicles are cycling — not a bad sign.',
  },
  {
    label: 'Progress insights',
    response: 'Based on your 94% adherence over 60 days, you\'re in the top 15% of users. Most people see visible density improvement between months 4–6.',
  },
  {
    label: 'Protocol advice',
    response: 'Adding a ketoconazole shampoo 2× per week to your minoxidil routine has shown a 15% improvement in density in clinical trials.',
  },
]

export default function CoachPaywall() {
  const [selected, setSelected] = useState<string | null>(null)
  const [typing, setTyping] = useState(false)
  const [shown, setShown] = useState<string | null>(null)

  function handleChip(label: string, response: string) {
    if (selected === label) return
    setSelected(label)
    setShown(null)
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setShown(response)
    }, 800)
  }

  const glassCard = {
    background: 'var(--bg-card)',
    backdropFilter: 'blur(20px) saturate(1.8)',
    WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
    border: '1px solid var(--bg-card-border)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
    borderRadius: 24,
  } as const

  return (
    <div className="px-5 py-6 space-y-5" style={glassCard}>
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center text-2xl"
          style={{ background: 'linear-gradient(135deg, #059669, #10b981)', boxShadow: '0 6px 20px rgba(16,185,129,0.30)' }}>
          🧬
        </div>
        <h2 className="font-bold text-gray-900 text-lg">AI Hair Coach</h2>
        <p className="text-sm text-gray-500 mt-1">Personalised guidance from your treatment data</p>
      </div>

      {/* Interactive feature chips */}
      <div>
        <p className="text-xs text-gray-400 text-center mb-3">Tap to preview</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {CHIPS.map(chip => {
            const isActive = selected === chip.label
            return (
              <button
                key={chip.label}
                type="button"
                onClick={() => handleChip(chip.label, chip.response)}
                className="text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all duration-200"
                style={isActive ? {
                  background: 'linear-gradient(135deg, #059669, #10b981)',
                  color: 'white',
                  border: '1px solid transparent',
                  boxShadow: '0 3px 10px rgba(16,185,129,0.30)',
                } : {
                  background: 'rgba(16,185,129,0.06)',
                  color: '#059669',
                  border: '1px solid rgba(16,185,129,0.18)',
                }}
              >
                {chip.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Typing / response bubble */}
      {(typing || shown) && (
        <div className="rounded-2xl px-4 py-3 text-sm leading-relaxed transition-all"
          style={{
            background: 'rgba(16,185,129,0.06)',
            border: '1px solid rgba(16,185,129,0.15)',
            color: '#1a3a2a',
          }}>
          {typing ? (
            <span className="flex gap-1 items-center h-5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          ) : (
            <span className="animate-fade-in">{shown}</span>
          )}
        </div>
      )}

      {/* CTA */}
      <div className="space-y-3 pt-1">
        <Link href="/upgrade"
          className="block w-full text-center text-white font-semibold py-3 rounded-2xl text-sm"
          style={{ background: 'linear-gradient(135deg, #059669, #10b981)', boxShadow: '0 6px 20px rgba(16,185,129,0.32)' }}>
          Unlock AI Coach — £9.99/mo
        </Link>
        <p className="text-center text-[11px] text-gray-400">Cancel anytime · No commitment</p>
      </div>
    </div>
  )
}
