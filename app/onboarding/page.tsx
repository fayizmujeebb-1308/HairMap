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
const POPULAR = ['Minoxidil', 'Finasteride', 'Dutasteride', 'Biotin', 'Ketoconazole shampoo', 'Derma roller']

function NorwoodTooltip() {
  const [open, setOpen] = useState(false)
  return (
    <span className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onTouchStart={() => setOpen(v => !v)}
        className="ml-1 w-4 h-4 rounded-full bg-gray-200 text-gray-500 text-[10px] font-bold inline-flex items-center justify-center"
        aria-label="What is the Norwood Scale?"
      >
        i
      </button>
      {open && (
        <span className="absolute left-6 top-0 z-10 w-56 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg leading-relaxed">
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

    // Save profile
    await supabase.from('profiles').upsert({
      user_id: user.id,
      email: user.email,
      norwood_stage: norwood,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })

    // Save treatment if provided
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

    // Save reminder if provided
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Header */}
      <header className="bg-white border-b px-6 py-4" style={{ borderBottomWidth: '0.5px', borderColor: '#f3f4f6' }}>
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-xs">H</span>
            </div>
            <span className="font-semibold text-gray-900">HairMap</span>
          </div>
          <span className="text-xs text-gray-400">Step {step + 1} of {STEPS.length}</span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-0.5 bg-gray-100">
        <div className="h-full bg-primary transition-all duration-300"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
      </div>

      <main className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="bg-white rounded-2xl border px-8 py-8 shadow-sm w-full max-w-lg" style={{ borderWidth: '0.5px', borderColor: '#e5e7eb' }}>

          {/* Step dots */}
          <div className="flex gap-1.5 mb-8">
            {STEPS.map((s, i) => (
              <div key={s} className={`flex-1 h-1 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-gray-100'}`} />
            ))}
          </div>

          {/* ── Screen 1: Hair loss stage ── */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-xl text-gray-900">
                  What&apos;s your hair loss like?
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  We&apos;ll determine your{' '}
                  <span className="text-gray-600 font-medium">Norwood Scale</span>
                  <NorwoodTooltip /> stage automatically.
                </p>
              </div>

              {/* Q1 */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Is your hairline receding?</p>
                <div className="flex gap-2">
                  {['Yes', 'A little', 'No'].map(opt => (
                    <button key={opt} type="button" onClick={() => setReceding(opt)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${receding === opt ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary'}`}
                      style={{ borderWidth: '0.5px' }}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q2 */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Is the top of your head thinning?</p>
                <div className="flex gap-2">
                  {['Yes', 'A little', 'No'].map(opt => (
                    <button key={opt} type="button" onClick={() => setCrown(opt)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${crown === opt ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary'}`}
                      style={{ borderWidth: '0.5px' }}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q3 */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">How long has this been happening?</p>
                <div className="grid grid-cols-2 gap-2">
                  {['Just started', '1–2 years', 'A few years', 'Long time'].map(opt => (
                    <button key={opt} type="button" onClick={() => setDuration(opt)}
                      className={`py-2.5 rounded-xl text-sm font-medium border transition-colors ${duration === opt ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary'}`}
                      style={{ borderWidth: '0.5px' }}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Screen 2: Treatment ── */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-serif text-xl text-gray-900">What are you currently using?</h2>
                <p className="text-sm text-gray-400 mt-1">Add your first treatment to start tracking.</p>
              </div>

              {!skipTreatment && (
                <>
                  {/* Popular picks */}
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-2">Popular</p>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR.map(t => (
                        <button key={t} type="button" onClick={() => setTreatmentName(t)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${treatmentName === t ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary'}`}
                          style={{ borderWidth: '0.5px' }}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Or type a name</label>
                    <input
                      type="text"
                      value={treatmentName}
                      onChange={e => setTreatmentName(e.target.value)}
                      placeholder="e.g. Minoxidil 5%"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      style={{ borderWidth: '0.5px' }}
                    />
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {TREATMENT_TYPES.map(t => (
                        <button key={t} type="button" onClick={() => setTreatmentType(t)}
                          className={`py-2 rounded-xl text-xs font-medium border transition-colors ${treatmentType === t ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary'}`}
                          style={{ borderWidth: '0.5px' }}>
                          {TYPE_LABEL[t]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Frequency */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">How often?</label>
                    <div className="flex gap-2">
                      {[['once_daily', 'Once daily'], ['twice_daily', 'Twice daily'], ['weekly', 'Weekly']].map(([val, label]) => (
                        <button key={val} type="button" onClick={() => setFrequency(val)}
                          className={`flex-1 py-2.5 rounded-xl text-xs font-medium border transition-colors ${frequency === val ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary'}`}
                          style={{ borderWidth: '0.5px' }}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <button type="button" onClick={() => setSkipTreatment(v => !v)}
                className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2">
                {skipTreatment ? 'Add a treatment' : 'Skip for now'}
              </button>
            </div>
          )}

          {/* ── Screen 3: Reminder ── */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-xl text-gray-900">Set a daily reminder</h2>
                <p className="text-sm text-gray-400 mt-1">Consistency is the #1 factor in results. We&apos;ll remind you every day.</p>
              </div>

              {!skipReminder && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Reminder time</label>
                    <input
                      type="time"
                      value={reminderTime}
                      onChange={e => setReminderTime(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      style={{ borderWidth: '0.5px' }}
                    />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b" style={{ borderBottomWidth: '0.5px', borderColor: '#f3f4f6' }}>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Email reminder</p>
                      <p className="text-xs text-gray-400 mt-0.5">We&apos;ll send you a daily email</p>
                    </div>
                    <button type="button" onClick={() => setEmailEnabled(v => !v)}
                      className={`w-11 h-6 rounded-full transition-colors ${emailEnabled ? 'bg-primary' : 'bg-gray-200'}`}>
                      <span className={`block w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${emailEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </>
              )}

              <button type="button" onClick={() => setSkipReminder(v => !v)}
                className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2">
                {skipReminder ? 'Set a reminder' : 'Skip for now'}
              </button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t" style={{ borderTopWidth: '0.5px', borderColor: '#f3f4f6' }}>
            <button type="button" onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
              className="text-sm text-gray-400 hover:text-gray-700 disabled:opacity-0 transition-colors">
              ← Back
            </button>

            {step < STEPS.length - 1 ? (
              <button type="button"
                onClick={() => setStep(s => s + 1)}
                disabled={step === 0 && !step1Valid || step === 1 && !step2Valid}
                className="bg-primary disabled:opacity-40 text-white text-sm font-semibold px-6 py-2.5 rounded-xl active:scale-95 transition-all">
                Continue →
              </button>
            ) : (
              <button type="button" onClick={finish} disabled={saving}
                className="bg-primary disabled:opacity-40 text-white text-sm font-semibold px-6 py-2.5 rounded-xl active:scale-95 transition-all">
                {saving ? 'Saving…' : 'Go to Dashboard →'}
              </button>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}
