'use client'

import { useState, useTransition, useRef } from 'react'
import { logSideEffect } from '@/app/actions/treatment'

interface StackItem { id: string; treatment_name: string }

export default function SideEffectLogger({ stack }: { stack: StackItem[] }) {
  const [open, setOpen]       = useState(false)
  const [severity, setSev]    = useState(0)
  const [pending, start]      = useTransition()
  const [done, setDone]       = useState(false)
  const formRef               = useRef<HTMLFormElement>(null)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!severity) return
    const fd = new FormData(formRef.current!)
    fd.set('severity', String(severity))
    start(async () => {
      const res = await logSideEffect(fd)
      if (!res?.error) {
        setDone(true)
        setTimeout(() => { setDone(false); setSev(0); setOpen(false); formRef.current?.reset() }, 2000)
      }
    })
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ borderWidth: '0.5px' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 active:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center">
            <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-900">Log a side effect</p>
            <p className="text-[10px] text-gray-400">Track symptoms by treatment</p>
          </div>
        </div>
        <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <form ref={formRef} onSubmit={submit}
          className="px-5 pb-5 space-y-4 border-t border-gray-50" style={{ borderWidth: '0.5px' }}>
          <div className="pt-4">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Treatment</label>
            <select name="treatmentName" required
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              style={{ borderWidth: '0.5px' }}>
              <option value="">Select treatment…</option>
              {stack.map(s => <option key={s.id} value={s.treatment_name}>{s.treatment_name}</option>)}
              <option value="Other">Other</option>
            </select>
            <input type="hidden" name="stackItemId" value="" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Severity
            </label>
            <div className="flex gap-2">
              {[
                { n: 1, label: 'Mild',     color: 'bg-green-100 text-green-700 border-green-200' },
                { n: 2, label: 'Moderate', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
                { n: 3, label: 'Notable',  color: 'bg-orange-100 text-orange-700 border-orange-200' },
                { n: 4, label: 'Severe',   color: 'bg-red-100 text-red-700 border-red-200' },
                { n: 5, label: 'Critical', color: 'bg-red-200 text-red-800 border-red-300' },
              ].map(({ n, label, color }) => (
                <button key={n} type="button" onClick={() => setSev(n)}
                  className={`flex-1 py-2 rounded-xl border text-[10px] font-semibold transition-all ${
                    severity === n ? color + ' scale-105' : 'bg-gray-50 text-gray-400 border-gray-100'
                  }`} style={{ borderWidth: '0.5px' }}>
                  {n}<br/>{label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Notes <span className="text-gray-300 font-normal normal-case">(optional)</span>
            </label>
            <textarea name="notes" rows={2} placeholder="Describe what you're experiencing…"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              style={{ borderWidth: '0.5px' }} />
          </div>

          <button type="submit" disabled={!severity || pending}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white text-sm font-semibold py-2.5 rounded-xl transition-all active:scale-95">
            {done ? '✓ Logged' : pending ? 'Saving…' : 'Log side effect'}
          </button>

          <p className="text-[10px] text-gray-400 text-center">
            Your dermatologist can review this data during your next visit.
          </p>
        </form>
      )}
    </div>
  )
}
