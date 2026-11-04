'use client'
import { useEffect, useState } from 'react'

export default function OfflinePage() {
  const [dots, setDots] = useState('.')

  useEffect(() => {
    const iv = setInterval(() => setDots(d => d.length >= 3 ? '.' : d + '.'), 600)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    const onOnline = () => window.location.reload()
    window.addEventListener('online', onOnline)
    return () => window.removeEventListener('online', onOnline)
  }, [])

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: 'linear-gradient(160deg, #f0fdf4 0%, #f8fafb 50%, #ecfdf5 100%)' }}
    >
      {/* Icon */}
      <div
        className="w-24 h-24 rounded-[28px] flex items-center justify-center mb-8"
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(20px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
          border: '1px solid rgba(255,255,255,0.75)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
        }}
      >
        <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
          {/* WiFi signal — faded */}
          <circle cx="21" cy="31" r="2.5" fill="#d1d5db" />
          <path d="M14.5 24.5a9 9 0 0113 0" stroke="#e5e7eb" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M9 19a16 16 0 0124 0" stroke="#f3f4f6" strokeWidth="2.2" strokeLinecap="round" />
          {/* Slash */}
          <path d="M8 8l26 26" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        </svg>
      </div>

      <h1 className="font-serif text-3xl text-gray-900 mb-3 leading-tight">
        No connection
      </h1>
      <p className="text-gray-500 text-sm max-w-[260px] leading-relaxed mb-2">
        HairMap needs an internet connection to sync your data.
      </p>
      <p className="text-xs text-gray-400 mb-10">
        Waiting for connection{dots}
      </p>

      {/* What still works */}
      <div
        className="w-full max-w-xs rounded-2xl text-left mb-8"
        style={{
          background: 'rgba(255,255,255,0.80)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.7)',
          padding: '16px 20px',
        }}
      >
        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-3">What you can still do</p>
        {[
          { icon: '📖', text: 'Read cached articles' },
          { icon: '📊', text: 'View your saved progress' },
          { icon: '🎯', text: 'Check your streak history' },
        ].map(item => (
          <div key={item.text} className="flex items-center gap-3 py-2">
            <span className="text-base">{item.icon}</span>
            <span className="text-sm text-gray-600">{item.text}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => window.location.reload()}
        className="flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-semibold text-white transition-opacity active:opacity-80"
        style={{
          background: 'linear-gradient(135deg, #059669, #10b981)',
          boxShadow: '0 6px 20px rgba(16,185,129,0.28)',
        }}
      >
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path d="M1 7.5a6.5 6.5 0 1 0 6.5-6.5A6.5 6.5 0 0 1 2.5 2.75M1 1v4h4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Try again
      </button>
    </div>
  )
}
