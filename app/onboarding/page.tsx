'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const STEPS = ['Hair loss', 'Treatment', 'Reminder']

const TREATMENT_TYPES = ['oral', 'topical', 'supplement', 'shampoo', 'device', 'other']
const TYPE_LABEL: Record<string, string> = {
  oral: 'Pill / Tablet', topical: 'Topical / Liquid', supplement: 'Supplement',
  shampoo: 'Shampoo', device: 'Device', other: 'Other',
}
const TYPE_ICON: Record<string, string> = {
  oral: '💊', topical: '💧', supplement: '🌿', shampoo: '🧴', device: '⚡', other: '➕',
}
const POPULAR = ['Minoxidil', 'Finasteride', 'Dutasteride', 'Biotin', 'Ketoconazole shampoo', 'Derma roller']

const glassCard = {
  background: 'rgba(255,255,255,0.92)',
  backdropFilter: 'blur(20px) saturate(1.8)',
  WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
  border: '1px solid rgba(255,255,255,0.75)',
  boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
  borderRadius: 24,
} as const

function WhyWeAskTooltip() {
  const [open, setOpen] = useState(false)
  return (
    <span className="relative inline-block ml-2">
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onTouchStart={() => setOpen(v => !v)}
        className="w-4 h-4 rounded-full inline-flex items-center justify-center text-[10px] font-bold"
        style={{ background: 'rgba(16,185,129,0.12)', color: '#059669' }}
        aria-label="Why we ask this"
      >
        i
      </button>
      {open && (
        <span className="absolute left-6 top-0 z-10 w-64 text-white text-xs rounded-xl px-3 py-2.5 shadow-xl leading-relaxed"
          style={{ background: 'rgba(15,23,42,0.92)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderRadius: 12 }}>
          This helps us personalise your treatment protocol and track your progress accurately.
        </span>
      )}
    </span>
  )
}

function NorwoodTooltip() {
  const [open, setOpen] = useState(false)
  return (
    <span className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onTouchStart={() => setOpen(v => !v)}
        className="ml-1.5 w-4 h-4 rounded-full inline-flex items-center justify-center text-[10px] font-bold"
        style={{ background: 'rgba(16,185,129,0.12)', color: '#059669' }}
        aria-label="What is the Norwood Scale?"
      >
        i
      </button>
      {open && (
        <span className="absolute left-6 top-0 z-10 w-56 text-white text-xs rounded-xl px-3 py-2.5 shadow-xl leading-relaxed"
          style={{ background: 'rgba(15,23,42,0.92)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
          The Norwood Scale is the standard system used by doctors to classify male hair loss, from Stage 1 (no loss) to Stage 7 (severe loss).
        </span>
      )}
    </span>
  )
}

function norwoodFromAnswers(receding: string, crown: string, duration: string): number {
  const r = receding === 'Yes' ? 2 : receding === 'A little' ? 1 : 0
  const c = crown === 'Yes' ? 2 : crown === 'A little' ? 1 : 0
  const d = duration === 'A few years' || duration === 'Long time' ? 1 : 0
  const score = r + c + d
  if (score === 0) return 1
  if (score === 1) return 2
  if (score === 2) return 3
  if (score === 3) return 4
  if (score === 4) return 5
  return 6
}

interface OptionBtnProps {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
  className?: string
}

function OptionBtn({ selected, onClick, children, className = '' }: OptionBtnProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 ${className}`}
      style={selected ? {
        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
        color: '#fff',
        border: '1px solid transparent',
        boxShadow: '0 4px 12px rgba(16,185,129,0.30)',
      } : {
        background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        color: '#374151',
        border: '1px solid rgba(229,231,235,0.8)',
      }}
    >
      {children}
    </button>
  )
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)

  // Step 1 — hair loss
  const [receding, setReceding] = useState('')
  const [crown, setCrown] = useState('')
  const [duration, setDuration] = useState('')

  // Step 2 — treatment
  const [treatmentName, setTreatmentName] = useState('')
  const [treatmentType, setTreatmentType] = useState('topical')
  const [frequency, setFrequency] = useState('once_daily')
  const [skipTreatment, setSkipTreatment] = useState(false)

  // Step 3 — reminder
  const [reminderTime, setReminderTime] = useState('08:00')
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [skipReminder, setSkipReminder] = useState(false)

  const step1Valid = receding && crown && duration
  const step2Valid = skipTreatment || treatmentName.trim().length > 0

  async function finish() {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const norwood = norwoodFromAnswers(receding, crown, duration)

    await supabase.from('profiles').upsert({
      user_id: user.id,
      email: user.email,
      norwood_stage: norwood,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })

    let stackItemId: string | null = null
    if (!skipTreatment && treatmentName.trim()) {
      const { data: stackItem } = await supabase.from('treatment_stack').insert({
        user_id: user.id,
        treatment_name: treatmentName.trim(),
        treatment_type: treatmentType,
        frequency,
        is_active: true,
      }).select('id').single()
      stackItemId = stackItem?.id ?? null
    }

    if (!skipReminder && stackItemId && treatmentName.trim()) {
      await supabase.from('reminder_settings').insert({
        user_id: user.id,
        stack_item_id: stackItemId,
        treatment_name: treatmentName.trim(),
        reminder_time: reminderTime,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        email_enabled: emailEnabled,
        push_enabled: false,
        is_active: true,
      })
    }

    router.push('/dashboard')
  }

  const stepIcons = ['💆', '💊', '⏰']

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #f0fdf4 0%, #f8fafb 50%, #ecfdf5 100%)' }}>

      {/* Decorative blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div style={{ position: 'absolute', top: '-80px', right: '-60px', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-80px', width: '280px', height: '280px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm"
              style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }}>
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="font-semibold text-gray-900">HairMap</span>
          </div>
          <div className="px-3 py-1 rounded-full text-xs font-medium"
            style={{ background: 'rgba(16,185,129,0.10)', color: '#059669', border: '1px solid rgba(16,185,129,0.18)' }}>
            Step {step + 1} of {STEPS.length}
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="relative z-10 h-1 mx-6 max-w-lg mx-auto rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.06)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${((step + 1) / STEPS.length) * 100}%`,
            background: 'linear-gradient(90deg, #059669 0%, #10b981 100%)',
            boxShadow: '0 0 8px rgba(16,185,129,0.40)',
          }}
        />
      </div>

      <main className="relative z-10 flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-lg animate-fade-in-up">

          {/* Step indicator pills */}
          <div className="flex gap-2 mb-5 justify-center">
            {STEPS.map((s, i) => (
              <div key={s}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300"
                style={i === step ? {
                  background: 'linear-gradient(135deg, rgba(5,150,105,0.12) 0%, rgba(16,185,129,0.08) 100%)',
                  color: '#059669',
                  border: '1px solid rgba(16,185,129,0.22)',
                } : i < step ? {
                  background: 'rgba(16,185,129,0.06)',
                  color: '#10b981',
                  border: '1px solid rgba(16,185,129,0.12)',
                } : {
                  background: 'rgba(0,0,0,0.04)',
                  color: '#9ca3af',
                  border: '1px solid rgba(0,0,0,0.06)',
                }}>
                <span>{i < step ? '✓' : stepIcons[i]}</span>
                <span>{s}</span>
              </div>
            ))}
          </div>

          {/* Card */}
          <div style={{ ...glassCard, padding: '32px' }}>

            {/* ── Screen 1: Hair loss stage ── */}
            {step === 0 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#10b981' }}>Hair Profile</p>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    What&apos;s your hair loss like?
                    <WhyWeAskTooltip />
                  </h2>
                  <p className="text-sm text-gray-500 mt-1.5">
                    We&apos;ll calculate your{' '}
                    <span className="font-semibold text-gray-700">Norwood Scale</span>
                    <NorwoodTooltip /> stage automatically.
                  </p>
                </div>

                {/* Q1 */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2.5">Is your hairline receding?</p>
                  <div className="flex gap-2">
                    {['Yes', 'A little', 'No'].map(opt => (
                      <OptionBtn key={opt} selected={receding === opt} onClick={() => setReceding(opt)} className="flex-1">
                        {opt}
                      </OptionBtn>
                    ))}
                  </div>
                </div>

                {/* Q2 */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2.5">Is the top of your head thinning?</p>
                  <div className="flex gap-2">
                    {['Yes', 'A little', 'No'].map(opt => (
                      <OptionBtn key={opt} selected={crown === opt} onClick={() => setCrown(opt)} className="flex-1">
                        {opt}
                      </OptionBtn>
                    ))}
                  </div>
                </div>

                {/* Q3 */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2.5">How long has this been happening?</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['Just started', '1–2 years', 'A few years', 'Long time'].map(opt => (
                      <OptionBtn key={opt} selected={duration === opt} onClick={() => setDuration(opt)}>
                        {opt}
                      </OptionBtn>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Screen 2: Treatment ── */}
            {step === 1 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#10b981' }}>Treatment Stack</p>
                  <h2 className="text-2xl font-bold text-gray-900">What are you currently using?</h2>
                  <p className="text-sm text-gray-500 mt-1.5">Add your first treatment to start tracking.</p>
                </div>

                {!skipTreatment && (
                  <>
                    {/* Popular picks */}
                    <div>
                      <p className="text-xs font-semibold text-gray-400 mb-2.5">Popular choices</p>
                      <div className="flex flex-wrap gap-2">
                        {POPULAR.map(t => (
                          <button key={t} type="button" onClick={() => setTreatmentName(t)}
                            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95"
                            style={treatmentName === t ? {
                              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                              color: '#fff',
                              border: '1px solid transparent',
                              boxShadow: '0 2px 8px rgba(16,185,129,0.28)',
                            } : {
                              background: 'rgba(255,255,255,0.7)',
                              color: '#374151',
                              border: '1px solid rgba(229,231,235,0.8)',
                            }}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Or type a name</label>
                      <input
                        type="text"
                        value={treatmentName}
                        onChange={e => setTreatmentName(e.target.value)}
                        placeholder="e.g. Minoxidil 5%"
                        className="w-full px-4 py-3 text-sm focus:outline-none transition-all"
                        style={{
                          background: 'rgba(255,255,255,0.7)',
                          border: '1px solid rgba(229,231,235,0.8)',
                          borderRadius: 14,
                          color: '#111827',
                        }}
                        onFocus={e => {
                          e.currentTarget.style.border = '1px solid rgba(16,185,129,0.45)'
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.10)'
                        }}
                        onBlur={e => {
                          e.currentTarget.style.border = '1px solid rgba(229,231,235,0.8)'
                          e.currentTarget.style.boxShadow = 'none'
                        }}
                      />
                    </div>

                    {/* Type */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Type</label>
                      <div className="grid grid-cols-3 gap-2">
                        {TREATMENT_TYPES.map(t => (
                          <button key={t} type="button" onClick={() => setTreatmentType(t)}
                            className="py-2.5 rounded-xl text-xs font-medium transition-all active:scale-95 flex items-center justify-center gap-1"
                            style={treatmentType === t ? {
                              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                              color: '#fff',
                              border: '1px solid transparent',
                              boxShadow: '0 2px 8px rgba(16,185,129,0.28)',
                            } : {
                              background: 'rgba(255,255,255,0.7)',
                              color: '#374151',
                              border: '1px solid rgba(229,231,235,0.8)',
                            }}>
                            <span>{TYPE_ICON[t]}</span>
                            <span>{TYPE_LABEL[t]}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Frequency */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">How often?</label>
                      <div className="flex gap-2">
                        {[['once_daily', 'Once daily'], ['twice_daily', 'Twice daily'], ['weekly', 'Weekly']].map(([val, label]) => (
                          <OptionBtn key={val} selected={frequency === val} onClick={() => setFrequency(val)} className="flex-1 text-xs">
                            {label}
                          </OptionBtn>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {skipTreatment && (
                  <div className="py-8 text-center rounded-2xl"
                    style={{ background: 'rgba(16,185,129,0.04)', border: '1px dashed rgba(16,185,129,0.20)' }}>
                    <p className="text-2xl mb-2">💊</p>
                    <p className="text-sm text-gray-500">You can add treatments later from your dashboard.</p>
                  </div>
                )}

                <button type="button" onClick={() => setSkipTreatment(v => !v)}
                  className="text-xs font-medium transition-colors"
                  style={{ color: '#10b981' }}>
                  {skipTreatment ? '← Add a treatment' : 'Skip for now →'}
                </button>
              </div>
            )}

            {/* ── Screen 3: Reminder ── */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#10b981' }}>Daily Reminder</p>
                  <h2 className="text-2xl font-bold text-gray-900">Never miss a treatment</h2>
                  <p className="text-sm text-gray-500 mt-1.5">Consistency is the #1 factor in results. We&apos;ll remind you every day.</p>
                </div>

                {!skipReminder && (
                  <>
                    {/* Consistency tip */}
                    <div className="flex items-start gap-3 px-4 py-3 rounded-2xl"
                      style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
                      <span className="text-lg mt-0.5">🔥</span>
                      <div>
                        <p className="text-xs font-semibold text-gray-700">Streaks boost results</p>
                        <p className="text-xs text-gray-500 mt-0.5">Users who log daily see 2× better outcomes after 6 months.</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Reminder time</label>
                      <input
                        type="time"
                        value={reminderTime}
                        onChange={e => setReminderTime(e.target.value)}
                        className="w-full px-4 py-3 text-sm focus:outline-none transition-all"
                        style={{
                          background: 'rgba(255,255,255,0.7)',
                          border: '1px solid rgba(229,231,235,0.8)',
                          borderRadius: 14,
                          color: '#111827',
                        }}
                        onFocus={e => {
                          e.currentTarget.style.border = '1px solid rgba(16,185,129,0.45)'
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.10)'
                        }}
                        onBlur={e => {
                          e.currentTarget.style.border = '1px solid rgba(229,231,235,0.8)'
                          e.currentTarget.style.boxShadow = 'none'
                        }}
                      />
                    </div>

                    {/* Email toggle */}
                    <div className="flex items-center justify-between px-4 py-3.5 rounded-2xl"
                      style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(229,231,235,0.8)' }}>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Email reminder</p>
                        <p className="text-xs text-gray-400 mt-0.5">Daily nudge to your inbox</p>
                      </div>
                      <button type="button" onClick={() => setEmailEnabled(v => !v)}
                        className="relative w-12 h-6 rounded-full transition-all duration-200 shrink-0"
                        style={{ background: emailEnabled ? 'linear-gradient(135deg, #059669, #10b981)' : 'rgba(209,213,219,1)', boxShadow: emailEnabled ? '0 2px 8px rgba(16,185,129,0.35)' : 'none' }}>
                        <span
                          className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                          style={{ transform: emailEnabled ? 'translateX(24px)' : 'translateX(0)' }}
                        />
                      </button>
                    </div>
                  </>
                )}

                {skipReminder && (
                  <div className="py-8 text-center rounded-2xl"
                    style={{ background: 'rgba(16,185,129,0.04)', border: '1px dashed rgba(16,185,129,0.20)' }}>
                    <p className="text-2xl mb-2">⏰</p>
                    <p className="text-sm text-gray-500">You can set reminders anytime from your account settings.</p>
                  </div>
                )}

                <button type="button" onClick={() => setSkipReminder(v => !v)}
                  className="text-xs font-medium transition-colors"
                  style={{ color: '#10b981' }}>
                  {skipReminder ? '← Set a reminder' : 'Skip for now →'}
                </button>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6"
              style={{ borderTop: '1px solid rgba(229,231,235,0.6)' }}>
              <button
                type="button"
                onClick={() => setStep(s => Math.max(0, s - 1))}
                disabled={step === 0}
                className="text-sm font-medium transition-colors disabled:opacity-0"
                style={{ color: '#6b7280' }}>
                ← Back
              </button>

              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(s => s + 1)}
                  disabled={(step === 0 && !step1Valid) || (step === 1 && !step2Valid)}
                  className="text-sm font-semibold px-7 py-3 rounded-2xl transition-all active:scale-95 disabled:opacity-40"
                  style={{
                    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                    color: '#fff',
                    boxShadow: '0 6px 20px rgba(16,185,129,0.32)',
                  }}>
                  Continue →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={finish}
                  disabled={saving}
                  className="text-sm font-semibold px-7 py-3 rounded-2xl transition-all active:scale-95 disabled:opacity-40"
                  style={{
                    background: saving ? 'rgba(16,185,129,0.6)' : 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                    color: '#fff',
                    boxShadow: '0 6px 20px rgba(16,185,129,0.32)',
                  }}>
                  {saving ? 'Saving…' : 'Go to Dashboard →'}
                </button>
              )}
            </div>

          </div>

          {/* Footer trust note */}
          <p className="text-center text-xs text-gray-400 mt-5">
            🔒 Your data is private and never shared
          </p>

        </div>
      </main>
    </div>
  )
}
