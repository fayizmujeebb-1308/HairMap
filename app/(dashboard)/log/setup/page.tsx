'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { addToStack, applyTemplate, removeFromStack } from '@/app/actions/treatment'
import { createClient } from '@/lib/supabase/client'
import { useEffect } from 'react'

/* ────── Protocol templates ────── */
const TEMPLATES = [
  {
    id: 'gold',
    name: 'Gold Standard',
    description: 'Dermatologist-endorsed first-line protocol for androgenetic alopecia',
    badge: '⭐ Most recommended',
    badgeColor: 'bg-primary/10 text-primary',
    treatments: [
      { treatment_name: 'Finasteride', generic_name: 'finasteride 1mg', treatment_type: 'oral', dose: '1mg', frequency: 'once_daily', times_of_day: ['morning'] },
      { treatment_name: 'Minoxidil', generic_name: 'minoxidil 5%', treatment_type: 'topical', dose: '1ml', frequency: 'twice_daily', times_of_day: ['morning', 'evening'] },
    ],
  },
  {
    id: 'conservative',
    name: 'Conservative Start',
    description: 'Monotherapy for those cautious about oral DHT inhibitors',
    badge: '🌿 Low-risk entry',
    badgeColor: 'bg-green-50 text-green-700',
    treatments: [
      { treatment_name: 'Minoxidil', generic_name: 'minoxidil 5%', treatment_type: 'topical', dose: '1ml', frequency: 'twice_daily', times_of_day: ['morning', 'evening'] },
      { treatment_name: 'Ketoconazole Shampoo', generic_name: 'ketoconazole 2%', treatment_type: 'shampoo', dose: '', frequency: 'weekly', times_of_day: ['morning'] },
    ],
  },
  {
    id: 'aggressive',
    name: 'Aggressive Protocol',
    description: 'Maximum evidence-based approach for rapid progression or NW4+',
    badge: '⚡ For NW4+ / fast loss',
    badgeColor: 'bg-orange-50 text-orange-700',
    treatments: [
      { treatment_name: 'Dutasteride', generic_name: 'dutasteride 0.5mg', treatment_type: 'oral', dose: '0.5mg', frequency: 'once_daily', times_of_day: ['morning'] },
      { treatment_name: 'Minoxidil', generic_name: 'minoxidil 5%', treatment_type: 'topical', dose: '1ml', frequency: 'twice_daily', times_of_day: ['morning', 'evening'] },
      { treatment_name: 'Ketoconazole Shampoo', generic_name: 'ketoconazole 2%', treatment_type: 'shampoo', dose: '', frequency: 'weekly', times_of_day: ['morning'] },
    ],
  },
  {
    id: 'post_transplant',
    name: 'Post-Transplant',
    description: 'Support protocol for hair transplant recovery and graft survival',
    badge: '🏥 Post-surgery',
    badgeColor: 'bg-blue-50 text-blue-700',
    treatments: [
      { treatment_name: 'Finasteride', generic_name: 'finasteride 1mg', treatment_type: 'oral', dose: '1mg', frequency: 'once_daily', times_of_day: ['morning'] },
      { treatment_name: 'Minoxidil', generic_name: 'minoxidil 5%', treatment_type: 'topical', dose: '1ml', frequency: 'once_daily', times_of_day: ['evening'] },
      { treatment_name: 'Biotin', generic_name: '', treatment_type: 'supplement', dose: '5000mcg', frequency: 'once_daily', times_of_day: ['morning'] },
    ],
  },
]

const TYPE_OPTIONS = [
  { value: 'oral',       label: '💊 Oral (pill/tablet)' },
  { value: 'topical',    label: '💧 Topical (liquid/foam)' },
  { value: 'supplement', label: '🌿 Supplement / vitamin' },
  { value: 'shampoo',    label: '🧴 Shampoo / wash' },
  { value: 'device',     label: '⚡ Device (LLLT/laser)' },
  { value: 'other',      label: '🔬 Other' },
]

const FREQ_OPTIONS = [
  { value: 'once_daily',        label: 'Once daily' },
  { value: 'twice_daily',       label: 'Twice daily' },
  { value: 'three_times_daily', label: '3× daily' },
  { value: 'weekly',            label: 'Weekly' },
  { value: 'as_needed',         label: 'As needed' },
]

const TYPE_ICON: Record<string, string> = {
  oral: '💊', topical: '💧', supplement: '🌿', device: '⚡', shampoo: '🧴', other: '🔬',
}

interface StackItem {
  id: string
  treatment_name: string
  treatment_type: string
  dose: string
  frequency: string
  times_of_day: string[]
  is_active: boolean
}

export default function SetupPage() {
  const router = useRouter()
  const [stack, setStack] = useState<StackItem[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'stack' | 'templates' | 'add'>('stack')
  const [pending, start] = useTransition()
  const [addMsg, setAddMsg] = useState('')
  const [templateApplying, setTemplateApplying] = useState<string | null>(null)

  // Form state
  const [name, setName]     = useState('')
  const [type, setType]     = useState('oral')
  const [dose, setDose]     = useState('')
  const [freq, setFreq]     = useState('once_daily')
  const [morn, setMorn]     = useState(true)
  const [eve, setEve]       = useState(false)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('treatment_stack')
        .select('*')
        .eq('is_active', true)
        .order('created_at')
      setStack(data ?? [])
      setLoading(false)
      if ((data?.length ?? 0) === 0) setTab('templates')
    }
    load()
  }, [])

  const handleRemove = (id: string) => {
    start(async () => {
      await removeFromStack(id)
      setStack(s => s.filter(x => x.id !== id))
    })
  }

  const handleTemplate = (templateId: string) => {
    const t = TEMPLATES.find(x => x.id === templateId)
    if (!t) return
    setTemplateApplying(templateId)
    start(async () => {
      const res = await applyTemplate(t.treatments)
      if (!res?.error) {
        // Reload
        const supabase = createClient()
        const { data } = await supabase.from('treatment_stack').select('*').eq('is_active', true).order('created_at')
        setStack(data ?? [])
        setTab('stack')
      }
      setTemplateApplying(null)
    })
  }

  const handleAdd = () => {
    if (!name.trim()) { setAddMsg('Treatment name is required'); return }
    const times = [morn && 'morning', eve && 'evening'].filter(Boolean) as string[]
    const fd = new FormData()
    fd.set('treatment_name', name.trim())
    fd.set('treatment_type', type)
    fd.set('dose', dose)
    fd.set('frequency', freq)
    if (morn) fd.set('morning', '1')
    if (eve)  fd.set('evening', '1')

    start(async () => {
      const res = await addToStack(fd)
      if (res?.error) { setAddMsg(res.error); return }
      const supabase = createClient()
      const { data } = await supabase.from('treatment_stack').select('*').eq('is_active', true).order('created_at')
      setStack(data ?? [])
      setName(''); setDose(''); setType('oral'); setFreq('once_daily'); setMorn(true); setEve(false)
      setAddMsg('✓ Added')
      setTimeout(() => { setAddMsg(''); setTab('stack') }, 1200)
    })
  }

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center gap-3 pt-2">
        <button onClick={() => router.back()}
          className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center active:scale-95 transition-transform shrink-0">
          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="font-serif text-2xl text-gray-900">My Stack</h1>
          <p className="text-[10px] text-gray-400 mt-0.5">{stack.length} active treatment{stack.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="grid grid-cols-3 bg-gray-100 rounded-2xl p-1 gap-1">
        {(['stack', 'templates', 'add'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`py-2 rounded-xl text-xs font-semibold transition-all capitalize ${
              tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'
            }`}>
            {t === 'stack' ? '📋 My Stack' : t === 'templates' ? '⭐ Templates' : '+ Add Custom'}
          </button>
        ))}
      </div>

      {/* ── MY STACK ── */}
      {tab === 'stack' && (
        <div className="space-y-3">
          {loading && (
            <div className="py-10 flex justify-center">
              <svg className="w-6 h-6 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            </div>
          )}

          {!loading && stack.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 px-5 py-8 text-center" style={{ borderWidth: '0.5px' }}>
              <p className="text-3xl mb-3">💊</p>
              <p className="text-sm font-semibold text-gray-900 mb-1">Stack is empty</p>
              <p className="text-xs text-gray-400 mb-4">Start with a protocol template or add a custom treatment.</p>
              <div className="flex gap-2 justify-center">
                <button onClick={() => setTab('templates')}
                  className="bg-primary text-white text-xs font-semibold px-4 py-2 rounded-xl active:scale-95 transition-transform">
                  Browse templates
                </button>
                <button onClick={() => setTab('add')}
                  className="bg-gray-100 text-gray-700 text-xs font-semibold px-4 py-2 rounded-xl active:scale-95 transition-transform">
                  Add custom
                </button>
              </div>
            </div>
          )}

          {stack.map(item => (
            <div key={item.id}
              className="bg-white rounded-2xl border border-gray-100 px-4 py-3.5 flex items-center gap-4"
              style={{ borderWidth: '0.5px' }}>
              <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center text-lg shrink-0">
                {TYPE_ICON[item.treatment_type] ?? '💊'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{item.treatment_name}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {item.dose && `${item.dose} · `}
                  {FREQ_OPTIONS.find(f => f.value === item.frequency)?.label ?? item.frequency}
                  {item.times_of_day?.length ? ` · ${item.times_of_day.join(' & ')}` : ''}
                </p>
              </div>
              <button onClick={() => handleRemove(item.id)} disabled={pending}
                className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-red-400 active:scale-90 transition-transform disabled:opacity-40 shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}

          {stack.length > 0 && (
            <button onClick={() => setTab('add')}
              className="w-full py-3 border border-dashed border-gray-200 rounded-2xl text-xs font-semibold text-gray-400 active:bg-gray-50 transition-colors">
              + Add another treatment
            </button>
          )}
        </div>
      )}

      {/* ── TEMPLATES ── */}
      {tab === 'templates' && (
        <div className="space-y-3">
          <p className="text-xs text-gray-400 px-1 leading-relaxed">
            These evidence-based protocols are used by dermatologists worldwide.
            Applying a template adds treatments to your existing stack.
          </p>
          {TEMPLATES.map(t => (
            <div key={t.id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
              style={{ borderWidth: '0.5px' }}>
              <div className="px-4 pt-4 pb-3">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">{t.description}</p>
                  </div>
                  <span className={`text-[9px] font-semibold px-2 py-1 rounded-lg whitespace-nowrap shrink-0 ${t.badgeColor}`}>
                    {t.badge}
                  </span>
                </div>
                <div className="space-y-1 mt-3">
                  {t.treatments.map((tr, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] text-gray-600">
                      <span>{TYPE_ICON[tr.treatment_type]}</span>
                      <span className="font-medium">{tr.treatment_name}</span>
                      {tr.dose && <span className="text-gray-400">· {tr.dose}</span>}
                      <span className="text-gray-300">·</span>
                      <span className="text-gray-400">{FREQ_OPTIONS.find(f => f.value === tr.frequency)?.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-gray-50 px-4 py-3" style={{ borderWidth: '0.5px' }}>
                <button onClick={() => handleTemplate(t.id)}
                  disabled={pending}
                  className="w-full bg-primary text-white text-xs font-semibold py-2 rounded-xl active:scale-95 transition-all disabled:opacity-50">
                  {templateApplying === t.id ? 'Applying…' : 'Apply this protocol →'}
                </button>
              </div>
            </div>
          ))}

          <p className="text-[10px] text-gray-300 text-center px-4 leading-relaxed pt-1">
            Always consult your dermatologist before starting or changing any treatment.
          </p>
        </div>
      )}

      {/* ── ADD CUSTOM ── */}
      {tab === 'add' && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ borderWidth: '0.5px' }}>
          <div className="px-5 py-5 space-y-4">

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Treatment name *</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Finasteride, Biotin…"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                style={{ borderWidth: '0.5px' }} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Type</label>
              <div className="grid grid-cols-2 gap-2">
                {TYPE_OPTIONS.map(o => (
                  <button key={o.value} type="button" onClick={() => setType(o.value)}
                    className={`text-left px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                      type === o.value
                        ? 'bg-primary/8 border-primary/20 text-primary'
                        : 'bg-gray-50 border-gray-100 text-gray-600'
                    }`} style={{ borderWidth: '0.5px' }}>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Dose</label>
                <input value={dose} onChange={e => setDose(e.target.value)} placeholder="e.g. 1mg, 1ml"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  style={{ borderWidth: '0.5px' }} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Frequency</label>
                <select value={freq} onChange={e => setFreq(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  style={{ borderWidth: '0.5px' }}>
                  {FREQ_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Time of day</label>
              <div className="flex gap-2">
                {[
                  { key: 'morning', label: '🌅 Morning', val: morn, set: setMorn },
                  { key: 'evening', label: '🌙 Evening', val: eve,  set: setEve  },
                ].map(({ key, label, val, set }) => (
                  <button key={key} type="button" onClick={() => set(!val)}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      val ? 'bg-primary/8 border-primary/20 text-primary' : 'bg-gray-50 border-gray-100 text-gray-400'
                    }`} style={{ borderWidth: '0.5px' }}>
                    {label}
                  </button>
                ))}
              </div>
              {!morn && !eve && <p className="text-[10px] text-gray-400 mt-1.5">No time set — will appear as "Daily" in log.</p>}
            </div>

            {addMsg && (
              <p className={`text-xs font-medium ${addMsg.startsWith('✓') ? 'text-primary' : 'text-red-500'}`}>{addMsg}</p>
            )}

            <button onClick={handleAdd} disabled={pending || !name.trim()}
              className="w-full bg-primary text-white text-sm font-semibold py-3 rounded-xl active:scale-95 transition-all disabled:opacity-40">
              {pending ? 'Adding…' : 'Add to my stack'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
