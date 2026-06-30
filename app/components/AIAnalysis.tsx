'use client'

import { useState } from 'react'
import Link from 'next/link'

function renderMarkdown(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]*?<\/li>(?:\s*<li>[\s\S]*?<\/li>)*)/g, '<ul class="list-disc list-inside space-y-1 mt-1">$1</ul>')
    .split('\n\n')
    .map(p => p.startsWith('<ul') ? p : `<p>${p}</p>`)
    .join('')
}

export default function AIAnalysis({ lastAnalysis, isPro }: { lastAnalysis?: { analysis: string; created_at: string } | null; isPro: boolean }) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function runAnalysis() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/ai-analysis', { method: 'POST' })
      const data = await res.json()
      if (data.error) { setError(data.error); return }
      setResult(data.analysis)
      setDone(true)
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const displayAnalysis = result ?? lastAnalysis?.analysis ?? null
  const analysisDate = lastAnalysis?.created_at
    ? new Date(lastAnalysis.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null

  if (!isPro) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 px-5 py-6 text-center" style={{ borderWidth: '0.5px' }}>
        <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center mb-3 mx-auto">
          <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-gray-900 mb-1">AI Analysis · Pro feature</p>
        <p className="text-xs text-gray-400 mb-4 leading-relaxed max-w-[220px] mx-auto">
          Get a plain-English review of your photos, adherence and progress — every 30 days.
        </p>
        <Link href="/pricing"
          className="inline-block bg-primary text-white text-xs font-semibold px-5 py-2.5 rounded-xl active:scale-95 transition-transform">
          Upgrade to Pro
        </Link>
        <p className="text-[10px] text-gray-300 mt-2">7-day free trial · cancel anytime</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 px-5 py-5 space-y-4" style={{ borderWidth: '0.5px' }}>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-700">AI Analysis</p>
          {analysisDate && !done && (
            <p className="text-[10px] text-gray-400 mt-0.5">Last run {analysisDate}</p>
          )}
        </div>
        <span className="text-xs bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">GPT-4o</span>
      </div>

      {/* Result */}
      {displayAnalysis && (
        <div
          className="text-xs text-gray-600 leading-relaxed space-y-2 [&_strong]:text-gray-900 [&_strong]:font-semibold [&_ul]:mt-1 [&_li]:text-gray-600"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(displayAnalysis) }}
        />
      )}

      {/* Error */}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      {/* CTA */}
      {!done && (
        <button
          onClick={runAnalysis}
          disabled={loading}
          className="w-full bg-primary disabled:opacity-50 text-white text-sm font-semibold py-3 rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>Analysing… this takes 10–20 seconds</span>
            </>
          ) : displayAnalysis ? 'Run new analysis' : 'Analyse my progress'}
        </button>
      )}

      {done && (
        <button
          onClick={() => { setDone(false); setResult(null) }}
          className="w-full text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors"
        >
          Run again
        </button>
      )}

      {displayAnalysis && (
        <p className="text-[10px] text-gray-300 leading-relaxed border-t pt-3" style={{ borderTopWidth: '0.5px', borderColor: '#f3f4f6' }}>
          HairMap AI provides general progress observations based on your tracking data and photos. It is not a medical tool and does not provide diagnosis, prognosis, or medical advice. Results are for informational purposes only. Always consult a qualified healthcare professional before making any changes to your treatment.
        </p>
      )}

      {!displayAnalysis && !loading && (
        <p className="text-[10px] text-gray-400 leading-relaxed">
          Our AI reviews your photos, treatment history, and adherence to give you a plain-English summary of your progress.
        </p>
      )}
    </div>
  )
}
