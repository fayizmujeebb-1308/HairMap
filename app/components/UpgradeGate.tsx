'use client'

import Link from 'next/link'

type Props = {
  feature: string
  description: string
  children?: React.ReactNode
}

export default function UpgradeGate({ feature, description, children }: Props) {
  return (
    <div className="bg-white rounded-2xl border overflow-hidden relative" style={{ borderWidth: '0.5px', borderColor: '#e5e7eb' }}>
      {/* Blurred preview slot */}
      {children && (
        <div className="pointer-events-none select-none opacity-30 blur-sm p-4">
          {children}
        </div>
      )}
      {/* Overlay */}
      <div className={`${children ? 'absolute inset-0' : ''} flex flex-col items-center justify-center px-6 py-8 text-center`}>
        <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center mb-3">
          <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-gray-900 mb-1">{feature}</p>
        <p className="text-xs text-gray-400 mb-4 leading-relaxed max-w-[220px]">{description}</p>
        <Link href="/pricing"
          className="bg-primary text-white text-xs font-semibold px-5 py-2.5 rounded-xl active:scale-95 transition-transform">
          Upgrade to Pro
        </Link>
        <p className="text-[10px] text-gray-300 mt-2">7-day free trial · cancel anytime</p>
      </div>
    </div>
  )
}
