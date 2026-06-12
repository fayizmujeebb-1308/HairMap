import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogDoseButton from '@/app/components/LogDoseButton'
import SideEffectLogger from '@/app/components/SideEffectLogger'

const TYPE_ICON: Record<string, string> = {
  oral:       '💊',
  topical:    '💧',
  supplement: '🌿',
  device:     '⚡',
  shampoo:    '🧴',
  other:      '🔬',
}

const FREQ_LABEL: Record<string, string> = {
  once_daily:         'Once daily',
  twice_daily:        'Twice daily',
  three_times_daily:  '3× daily',
  weekly:             'Weekly',
  as_needed:          'As needed',
}

function today() { return new Date().toISOString().split('T')[0] }

function calcStreak(logs: { taken_at: string }[]): number {
  const days = new Set(logs.map(l => l.taken_at.split('T')[0]))
  let streak = 0
  const d = new Date()
  while (true) {
    const key = d.toISOString().split('T')[0]
    if (days.has(key)) { streak++; d.setDate(d.getDate() - 1) }
    else break
  }
  return streak
}

function weekDays() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return { label: ['S','M','T','W','T','F','S'][d.getDay()], date: d.toISOString().split('T')[0] }
  })
}

export default async function LogPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const todayStr = today()
  const monthStart = todayStr.slice(0, 7) + '-01'

  const [{ data: stack }, { data: todayLogs }, { data: monthLogs }] = await Promise.all([
    supabase.from('treatment_stack').select('*').eq('user_id', user.id).eq('is_active', true).order('created_at'),
    supabase.from('treatment_logs').select('stack_item_id, notes, treatment_name').eq('user_id', user.id).gte('taken_at', todayStr + 'T00:00:00').lte('taken_at', todayStr + 'T23:59:59'),
    supabase.from('treatment_logs').select('taken_at').eq('user_id', user.id).gte('taken_at', monthStart),
  ])

  const streak    = calcStreak(monthLogs ?? [])
  const loggedDays = new Set((monthLogs ?? []).map(l => l.taken_at.split('T')[0]))
  const daysInMonth = new Date().getDate()
  const adherence  = daysInMonth > 0 ? Math.round((loggedDays.size / daysInMonth) * 100) : 0
  const week       = weekDays()

  // Build a set of "item_id:timeOfDay" for quick lookup
  const loggedSet = new Set(
    (todayLogs ?? []).map(l => `${l.stack_item_id}:${l.notes ?? 'once'}`)
  )

  const morning = (stack ?? []).filter(s => s.times_of_day?.includes('morning'))
  const evening = (stack ?? []).filter(s => s.times_of_day?.includes('evening'))
  const once    = (stack ?? []).filter(s => !s.times_of_day?.includes('morning') && !s.times_of_day?.includes('evening'))

  const hasStack = (stack?.length ?? 0) > 0

  const dateLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between pt-2">
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">{dateLabel}</p>
          <h1 className="font-serif text-2xl text-gray-900 mt-0.5">Treatment Log</h1>
        </div>
        <Link href="/log/setup"
          className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/8 px-3 py-1.5 rounded-xl active:scale-95 transition-transform">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          My Stack
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Streak', value: streak, unit: 'days', icon: '🔥' },
          { label: 'Adherence', value: adherence, unit: '%', icon: '📊' },
          { label: 'Treatments', value: stack?.length ?? 0, unit: 'active', icon: '💊' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 px-3 py-3 text-center" style={{ borderWidth: '0.5px' }}>
            <p className="text-base mb-1">{s.icon}</p>
            <p className="font-serif text-xl text-gray-900 leading-none">{s.value}<span className="text-xs text-gray-400 font-sans ml-0.5">{s.unit}</span></p>
            <p className="text-[10px] text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* This week */}
      <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4" style={{ borderWidth: '0.5px' }}>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">This week</p>
        <div className="flex justify-between">
          {week.map(({ label, date }) => {
            const isToday  = date === todayStr
            const logged   = loggedDays.has(date)
            const future   = date > todayStr
            return (
              <div key={date} className="flex flex-col items-center gap-1.5">
                <span className={`text-[10px] font-medium ${isToday ? 'text-primary' : 'text-gray-400'}`}>{label}</span>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                  isToday && logged  ? 'bg-primary shadow-sm shadow-primary/30'
                  : isToday         ? 'border-2 border-primary bg-white'
                  : logged          ? 'bg-primary/20'
                  : future          ? 'bg-gray-50'
                  :                   'bg-gray-100'
                }`}>
                  {logged && (
                    <svg className={`w-3 h-3 ${isToday ? 'text-white' : 'text-primary'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Empty state */}
      {!hasStack && (
        <div className="bg-white rounded-2xl border border-gray-100 px-5 py-8 text-center" style={{ borderWidth: '0.5px' }}>
          <p className="text-3xl mb-3">💊</p>
          <p className="text-sm font-semibold text-gray-900 mb-1">No treatments yet</p>
          <p className="text-xs text-gray-400 mb-4 leading-relaxed">
            Add your treatment stack to start logging daily doses and tracking adherence.
          </p>
          <Link href="/log/setup"
            className="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl active:scale-95 transition-transform">
            Set up my stack
          </Link>
        </div>
      )}

      {/* Morning doses */}
      {morning.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-1">🌅 Morning</p>
          {morning.map(item => (
            <TreatmentRow key={item.id} item={item}
              isLogged={loggedSet.has(`${item.id}:morning`)}
              timeOfDay="morning" />
          ))}
        </div>
      )}

      {/* Once daily */}
      {once.length > 0 && (
        <div className="space-y-2">
          {(morning.length > 0 || evening.length > 0) &&
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-1">📅 Daily</p>}
          {once.map(item => (
            <TreatmentRow key={item.id} item={item}
              isLogged={loggedSet.has(`${item.id}:once`)}
              timeOfDay="once" />
          ))}
        </div>
      )}

      {/* Evening doses */}
      {evening.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-1">🌙 Evening</p>
          {evening.map(item => (
            <TreatmentRow key={item.id} item={item}
              isLogged={loggedSet.has(`${item.id}:evening`)}
              timeOfDay="evening" />
          ))}
        </div>
      )}

      {/* Side effect logger */}
      {hasStack && <SideEffectLogger stack={(stack ?? []).map(s => ({ id: s.id, treatment_name: s.treatment_name }))} />}

    </div>
  )
}

/* ── Treatment row card ── */
function TreatmentRow({ item, isLogged, timeOfDay }: {
  item: Record<string, string>
  isLogged: boolean
  timeOfDay: string
}) {
  return (
    <div className={`bg-white rounded-2xl border overflow-hidden flex items-center gap-4 px-4 py-3.5 transition-colors ${
      isLogged ? 'border-primary/15' : 'border-gray-100'
    }`} style={{ borderWidth: '0.5px' }}>
      {/* Icon */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
        isLogged ? 'bg-primary/10' : 'bg-gray-50'
      }`}>
        {TYPE_ICON[item.treatment_type] ?? '💊'}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold truncate ${isLogged ? 'text-primary' : 'text-gray-900'}`}>
          {item.treatment_name}
        </p>
        <p className="text-[10px] text-gray-400 mt-0.5">
          {item.dose && `${item.dose} · `}{FREQ_LABEL[item.frequency] ?? item.frequency}
        </p>
      </div>

      {/* Log button */}
      <LogDoseButton
        stackItemId={item.id}
        treatmentName={item.treatment_name}
        timeOfDay={timeOfDay}
        isLogged={isLogged}
      />
    </div>
  )
}
