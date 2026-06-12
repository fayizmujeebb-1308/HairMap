'use client'

import { useTransition, useState } from 'react'
import { logDose } from '@/app/actions/treatment'

interface Props {
  stackItemId: string
  treatmentName: string
  timeOfDay: string       // 'morning' | 'evening' | 'once'
  isLogged: boolean
  label?: string
}

export default function LogDoseButton({ stackItemId, treatmentName, timeOfDay, isLogged, label }: Props) {
  const [pending, start] = useTransition()
  const [done, setDone] = useState(isLogged)

  const handle = () => {
    if (done) return
    start(async () => {
      const res = await logDose(stackItemId, treatmentName, timeOfDay)
      if (!res?.error) setDone(true)
    })
  }

  if (done) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/8 text-primary">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-xs font-semibold">Done</span>
      </div>
    )
  }

  return (
    <button
      onClick={handle}
      disabled={pending}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-gray-500
        hover:border-primary hover:text-primary active:scale-95
        transition-all duration-100 disabled:opacity-50"
      style={{ borderWidth: '0.5px' }}
    >
      {pending ? (
        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      )}
      <span className="text-xs font-semibold">{label ?? 'Log'}</span>
    </button>
  )
}
