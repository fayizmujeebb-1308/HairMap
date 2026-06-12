'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import DateScrollPicker from '@/app/components/DateScrollPicker'

const STEPS = ['Personal', 'Hair Profile', 'Medical', 'Treatment', 'Complete']

const CONCERNS   = ['Receding hairline', 'Crown thinning', 'Overall thinning', 'Slow growth', 'Hair texture changes', 'Excessive shedding']
const CONDITIONS = ['Diabetes', 'Thyroid disorder', 'Anaemia', 'Alopecia areata', 'Scalp conditions', 'None']
const LIFESTYLE  = ['High stress', 'Poor diet', 'Smoker', 'Heavy alcohol use', 'Poor sleep', 'None']
const TREATMENTS = ['Minoxidil (Rogaine)', 'Finasteride (Propecia)', 'Dutasteride', 'Biotin supplements', 'Laser therapy', 'PRP therapy', 'None currently']
const GOALS      = ['Slow hair loss', 'Regrow lost hair', 'Track progress', 'Prepare for transplant', 'Post-transplant tracking', 'General hair health']
const HEARD_FROM = ['Google search', 'Social media', 'Friend/family', 'Doctor recommendation', 'App store', 'Other']

/* Required field label with asterisk */
function Req({ children }: { children: React.ReactNode }) {
  return (
    <span className="block text-sm font-medium text-gray-700 mb-1.5">
      {children} <span className="text-red-400">*</span>
    </span>
  )
}

/* Inline error message */
function Err({ msg }: { msg?: string }) {
  if (!msg) return null
  return <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
    <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
    {msg}
  </p>
}

/* Validation rules per step */
function validate(step: number, data: Record<string, unknown>): Record<string, string> {
  const e: Record<string, string> = {}
  if (step === 0) {
    if (!data.dob)     e.dob    = 'Date of birth is required'
    if (!data.gender)  e.gender = 'Please select your gender'
    if (!data.country) e.country = 'Country is required'
  }
  if (step === 1) {
    if (!data.hair_loss_duration)                         e.hair_loss_duration = 'Please select how long you have had hair loss'
    if ((data.concerns as string[]).length === 0)         e.concerns           = 'Select at least one concern'
  }
  if (step === 2) {
    if (!data.family_history)                             e.family_history = 'Please select an option'
    if ((data.conditions as string[]).length === 0)       e.conditions     = 'Select at least one option'
  }
  if (step === 3) {
    if ((data.treatments as string[]).length === 0)       e.treatments = 'Select at least one option'
    if ((data.goals as string[]).length === 0)            e.goals      = 'Select at least one goal'
    if (!data.heard_from)                                 e.heard_from = 'Please tell us how you heard about HairMap'
  }
  return e
}

/* Zoom button */
function ZoomBtn({
  onClick, disabled, children, variant = 'primary',
}: {
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
  variant?: 'primary' | 'ghost'
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        'text-sm font-medium px-6 py-2.5 rounded-lg transition-all duration-150',
        'active:scale-95',
        variant === 'primary'
          ? 'bg-primary hover:bg-primary-dark hover:scale-105 text-white disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed'
          : 'text-gray-500 hover:text-gray-800 hover:scale-105 disabled:opacity-0 disabled:scale-100',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep]       = useState(0)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors]   = useState<Record<string, string>>({})
  const [data, setData]       = useState({
    dob: '', gender: '', phone: '', country: '', ethnicity: '',
    hair_loss_duration: '', concerns: [] as string[], norwood_stage: '',
    hair_texture: '', hair_colour: '', family_history: '',
    conditions: [] as string[], medications: '', lifestyle: [] as string[],
    treatments: [] as string[], transplants: '', goals: [] as string[], heard_from: '',
  })

  function toggle(field: 'concerns' | 'conditions' | 'lifestyle' | 'treatments' | 'goals', value: string) {
    setData(d => ({
      ...d,
      [field]: d[field].includes(value)
        ? d[field].filter((v: string) => v !== value)
        : [...d[field], value],
    }))
    // Clear that field's error when user picks something
    setErrors(e => { const n = { ...e }; delete n[field]; return n })
  }

  function tryNext() {
    const errs = validate(step, data as unknown as Record<string, unknown>)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setStep(s => s + 1)
  }

  function goBack() { setErrors({}); setStep(s => Math.max(0, s - 1)) }

  async function finish() {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { alert('Not logged in'); setLoading(false); return }

    // Calculate age from DOB
    let age: number | null = null
    if (data.dob) {
      const dob = new Date(data.dob)
      const today = new Date()
      age = today.getFullYear() - dob.getFullYear()
      const m = today.getMonth() - dob.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--
    }

    // Primary treatment for treatment_status field
    const primaryTreatment = data.treatments.filter(t => t !== 'None currently')[0] || null

    const payload = {
      onboarding_completed: true,
      age,
      gender:           data.gender || null,
      country:          data.country || null,
      ethnicity:        data.ethnicity || null,
      norwood_stage:    data.norwood_stage ? parseInt(data.norwood_stage) : null,
      treatment_status: primaryTreatment,
      updated_at:       new Date().toISOString(),
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update(payload)
      .eq('user_id', user.id)

    if (updateError) {
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({ user_id: user.id, email: user.email, hairmap_id: 'HM-000001', ...payload })
      if (insertError) { alert('Error: ' + insertError.message); setLoading(false); return }
    }

    router.push('/dashboard')
  }

  /* Shared input classes — red border when error */
  const inputCls = (field: string) =>
    `w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
      errors[field] ? 'border-red-300 bg-red-50/30' : 'border-gray-200'
    }`

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100 px-6 py-4" style={{ borderWidth: '0.5px' }}>
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-xs">H</span>
            </div>
            <span className="font-semibold text-gray-900">HairMap</span>
          </div>
          <span className="text-xs text-gray-500">Step {step + 1} of {STEPS.length}</span>
        </div>
      </header>

      <div className="h-1 bg-gray-100">
        <div className="h-full bg-primary transition-all duration-300"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
      </div>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-card border border-gray-200 p-8 shadow-sm w-full max-w-xl" style={{ borderWidth: '0.5px' }}>

          {/* Step progress dots */}
          <div className="flex gap-1 mb-8">
            {STEPS.map((s, i) => (
              <div key={s} className={`flex-1 h-1 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-gray-100'}`} />
            ))}
          </div>

          {/* ── Step 1: Personal ── */}
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="font-serif text-xl text-gray-900">Personal details</h2>

              <div>
                <Req>Date of birth</Req>
                <DateScrollPicker value={data.dob} onChange={val => { setData(d => ({ ...d, dob: val })); setErrors(e => { const n={...e}; delete n.dob; return n }) }} />
                <Err msg={errors.dob} />
              </div>

              <div>
                <Req>Gender</Req>
                <select value={data.gender}
                  onChange={e => { setData(d => ({ ...d, gender: e.target.value })); setErrors(e2 => { const n={...e2}; delete n.gender; return n }) }}
                  className={inputCls('gender')} style={{ borderWidth: '0.5px' }}>
                  <option value="">Select…</option>
                  <option>Male</option><option>Female</option><option>Non-binary</option><option>Prefer not to say</option>
                </select>
                <Err msg={errors.gender} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone <span className="text-gray-400 font-normal">(optional)</span></label>
                <input type="tel" value={data.phone}
                  onChange={e => setData(d => ({ ...d, phone: e.target.value }))}
                  className={inputCls('phone')} style={{ borderWidth: '0.5px' }} placeholder="+1 555 000 0000" />
              </div>

              <div>
                <Req>Country</Req>
                <input type="text" value={data.country}
                  onChange={e => { setData(d => ({ ...d, country: e.target.value })); setErrors(e2 => { const n={...e2}; delete n.country; return n }) }}
                  className={inputCls('country')} style={{ borderWidth: '0.5px' }} placeholder="United States" />
                <Err msg={errors.country} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ethnicity <span className="text-gray-400 font-normal">(optional)</span></label>
                <input type="text" value={data.ethnicity}
                  onChange={e => setData(d => ({ ...d, ethnicity: e.target.value }))}
                  className={inputCls('ethnicity')} style={{ borderWidth: '0.5px' }} placeholder="Optional" />
              </div>
            </div>
          )}

          {/* ── Step 2: Hair Profile ── */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="font-serif text-xl text-gray-900">Hair profile</h2>

              <div>
                <Req>How long have you had hair loss?</Req>
                <select value={data.hair_loss_duration}
                  onChange={e => { setData(d => ({ ...d, hair_loss_duration: e.target.value })); setErrors(e2 => { const n={...e2}; delete n.hair_loss_duration; return n }) }}
                  className={inputCls('hair_loss_duration')} style={{ borderWidth: '0.5px' }}>
                  <option value="">Select…</option>
                  <option>Less than 1 year</option><option>1–2 years</option><option>2–5 years</option><option>5–10 years</option><option>More than 10 years</option>
                </select>
                <Err msg={errors.hair_loss_duration} />
              </div>

              <div>
                <Req>Main concerns</Req>
                <div className="flex flex-wrap gap-2">
                  {CONCERNS.map(c => (
                    <button key={c} type="button" onClick={() => toggle('concerns', c)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${data.concerns.includes(c) ? 'bg-primary text-white border-primary' : errors.concerns ? 'bg-white text-gray-600 border-red-300 hover:border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary'}`}
                      style={{ borderWidth: '0.5px' }}>
                      {c}
                    </button>
                  ))}
                </div>
                <Err msg={errors.concerns} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Norwood stage <span className="text-gray-400 font-normal">(optional — if known)</span></label>
                <div className="flex gap-2">
                  {[1,2,3,4,5,6,7].map(n => (
                    <button key={n} type="button" onClick={() => setData(d => ({ ...d, norwood_stage: String(n) }))}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${data.norwood_stage === String(n) ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary'}`}
                      style={{ borderWidth: '0.5px' }}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 3: Medical ── */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="font-serif text-xl text-gray-900">Medical history</h2>

              <div>
                <Req>Family history of baldness</Req>
                <select value={data.family_history}
                  onChange={e => { setData(d => ({ ...d, family_history: e.target.value })); setErrors(e2 => { const n={...e2}; delete n.family_history; return n }) }}
                  className={inputCls('family_history')} style={{ borderWidth: '0.5px' }}>
                  <option value="">Select…</option>
                  <option>Yes, father&apos;s side</option><option>Yes, mother&apos;s side</option><option>Yes, both sides</option><option>No family history</option><option>Unknown</option>
                </select>
                <Err msg={errors.family_history} />
              </div>

              <div>
                <Req>Medical conditions</Req>
                <div className="flex flex-wrap gap-2">
                  {CONDITIONS.map(c => (
                    <button key={c} type="button" onClick={() => toggle('conditions', c)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${data.conditions.includes(c) ? 'bg-primary text-white border-primary' : errors.conditions ? 'bg-white text-gray-600 border-red-300 hover:border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary'}`}
                      style={{ borderWidth: '0.5px' }}>
                      {c}
                    </button>
                  ))}
                </div>
                <Err msg={errors.conditions} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Current medications <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea value={data.medications}
                  onChange={e => setData(d => ({ ...d, medications: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  style={{ borderWidth: '0.5px' }} rows={3} placeholder="List any medications you currently take…" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lifestyle factors <span className="text-gray-400 font-normal">(optional)</span></label>
                <div className="flex flex-wrap gap-2">
                  {LIFESTYLE.map(l => (
                    <button key={l} type="button" onClick={() => toggle('lifestyle', l)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${data.lifestyle.includes(l) ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary'}`}
                      style={{ borderWidth: '0.5px' }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 4: Treatment ── */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="font-serif text-xl text-gray-900">Treatment history</h2>

              <div>
                <Req>Current treatments</Req>
                <div className="flex flex-wrap gap-2">
                  {TREATMENTS.map(t => (
                    <button key={t} type="button" onClick={() => toggle('treatments', t)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${data.treatments.includes(t) ? 'bg-primary text-white border-primary' : errors.treatments ? 'bg-white text-gray-600 border-red-300 hover:border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary'}`}
                      style={{ borderWidth: '0.5px' }}>
                      {t}
                    </button>
                  ))}
                </div>
                <Err msg={errors.treatments} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Previous transplants <span className="text-gray-400 font-normal">(optional)</span></label>
                <select value={data.transplants}
                  onChange={e => setData(d => ({ ...d, transplants: e.target.value }))}
                  className={inputCls('transplants')} style={{ borderWidth: '0.5px' }}>
                  <option value="">Select…</option>
                  <option>No transplants</option><option>1 transplant</option><option>2 transplants</option><option>3 or more</option>
                </select>
              </div>

              <div>
                <Req>Your goals</Req>
                <div className="flex flex-wrap gap-2">
                  {GOALS.map(g => (
                    <button key={g} type="button" onClick={() => toggle('goals', g)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${data.goals.includes(g) ? 'bg-primary text-white border-primary' : errors.goals ? 'bg-white text-gray-600 border-red-300 hover:border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary'}`}
                      style={{ borderWidth: '0.5px' }}>
                      {g}
                    </button>
                  ))}
                </div>
                <Err msg={errors.goals} />
              </div>

              <div>
                <Req>How did you hear about HairMap?</Req>
                <select value={data.heard_from}
                  onChange={e => { setData(d => ({ ...d, heard_from: e.target.value })); setErrors(e2 => { const n={...e2}; delete n.heard_from; return n }) }}
                  className={inputCls('heard_from')} style={{ borderWidth: '0.5px' }}>
                  <option value="">Select…</option>
                  {HEARD_FROM.map(h => <option key={h}>{h}</option>)}
                </select>
                <Err msg={errors.heard_from} />
              </div>
            </div>
          )}

          {/* ── Step 5: Complete ── */}
          {step === 4 && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="font-serif text-xl text-gray-900">You&apos;re all set!</h2>
              <p className="text-gray-500 text-sm">Your HairMap profile has been created. Start by uploading your first progress photos.</p>
              <p className="text-xs text-gray-400">Don&apos;t forget to verify your email address.</p>
            </div>
          )}

          {/* ── Navigation ── */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100" style={{ borderWidth: '0.5px' }}>
            <ZoomBtn onClick={goBack} disabled={step === 0} variant="ghost">
              ← Back
            </ZoomBtn>

            {step < STEPS.length - 1 ? (
              <ZoomBtn onClick={tryNext}>Continue →</ZoomBtn>
            ) : (
              <ZoomBtn onClick={finish} disabled={loading}>
                {loading ? 'Saving…' : 'Go to Dashboard →'}
              </ZoomBtn>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}
