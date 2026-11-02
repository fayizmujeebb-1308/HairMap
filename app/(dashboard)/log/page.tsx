import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogDoseButton from '@/app/components/LogDoseButton'
import SideEffectLogger from '@/app/components/SideEffectLogger'
import ReminderSetup from '@/app/components/ReminderSetup'

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

const glassCard = {
  background: 'var(--bg-card)',
  backdropFilter: 'blur(20px) saturate(1.8)',
  WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
  border: '1px solid var(--bg-card-border)',
  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
  borderRadius: 20,
} as const

export default async function LogPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const todayStr = today()
  const monthStart = todayStr.slice(0, 7) + '-01'

  const [{ data: stack }, { data: todayLogs }, { data: monthLogs }, { data: reminders }] = await Promise.all([
    supabase.from('treatment_stack').select('*').eq('user_id', user.id).eq('is_active', true).order('created_at'),
    supabase.from('treatment_logs').select('stack_item_id, notes, treatment_name').eq('user_id', user.id).gte('taken_at', todayStr + 'T00:00:00').lte('taken_at', todayStr + 'T23:59:59'),
    supabase.from('treatment_logs').select('taken_at').eq('user_id', user.id).gte('taken_at', monthStart),
    supabase.from('reminder_settings').select('*').eq('user_id', user.id).eq('is_active', true),
  ])

  const streak      = calcStreak(monthLogs ?? [])
  const loggedDays  = new Set((monthLogs ?? []).map(l => l.taken_at.split('T')[0]))
  const daysInMonth = new Date().getDate()
  const adherence   = daysInMonth > 0 ? Math.round((loggedDays.size / daysInMonth) * 100) : 0
  const week        = weekDays()

  const loggedSet = new Set(
    (todayLogs ?? []).map(l => `${l.stack_item_id}:${l.notes ?? 'once'}`)
  )

  const remindersByItem: Record<string, { id: string; reminder_time: string; email_enabled: boolean; push_enabled: boolean }[]> = {}
  for (const r of reminders ?? []) {
    if (!remindersByItem[r.stack_item_id]) remindersByItem[r.stack_item_id] = []
    remindersByItem[r.stack_item_id].push(r)
  }

  const morning = (stack ?? []).filter(s => s.times_of_day?.includes('morning'))
  const evening = (stack ?? []).filter(s => s.times_of_day?.includes('evening'))
  const once    = (stack ?? []).filter(s => !s.times_of_day?.includes('morning') && !s.times_of_day?.includes('evening'))

  const hasStack = (stack?.length ?? 0) > 0
  const dateLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  const allLoggedToday = hasStack && (stack ?? []).every(s =>
    loggedSet.has(`${s.id}:morning`) || loggedSet.has(`${s.id}:once`) || loggedSet.has(`${s.id}:evening`)
  )

  const loggedCount = (stack ?? []).filter(s =>
    loggedSet.has(`${s.id}:morning`) || loggedSet.has(`${s.id}:once`) || loggedSet.has(`${s.id}:evening`)
  ).length

  return (
    <div className="space-y-4 pb-2">

      {/* ── Header ── */}
      <div className="flex items-start justify-between pt-2 animate-fade-in-up">
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">{dateLabel}</p>
          <h1 className="font-serif text-[26px] text-gray-900 mt-0.5">Treatment Log</h1>
        </div>
        <Link href="/log/setup"
          className="flex items-center gap-1.5 text-xs font-semibold text-primary px-3 py-2 rounded-xl active:scale-95 transition-transform"
          style={{
            background: 'rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.15)',
          }}>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          My Stack
        </Link>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-3 gap-3 animate-fade-in-up delay-75">
        {[
          { label: 'Streak',     value: streak,              unit: 'days',   icon: '🔥' },
          { label: 'Adherence',  value: adherence,           unit: '%',      icon: '📊' },
          { label: 'Treatments', value: stack?.length ?? 0,  unit: 'active', icon: '💊' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl px-3 py-3 text-center" style={glassCard}>
            <p className="text-base mb-1">{s.icon}</p>
            <p className="font-serif text-xl text-gray-900 leading-none">
              {s.value}<span className="text-xs text-gray-400 font-sans ml-0.5">{s.unit}</span>
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── This week ── */}
      <div className="px-5 py-4 animate-fade-in-up delay-100" style={glassCard}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-gray-600">This week</p>
          {hasStack && (
            <p className="text-[10px] text-gray-400 font-medium">
              {loggedCount}/{stack?.length ?? 0} today
            </p>
          )}
        </div>
        <div className="flex justify-between">
          {week.map(({ label, date }) => {
            const isToday = date === todayStr
            const logged  = loggedDays.has(date)
            const future  = date > todayStr
            return (
              <div key={date} className="flex flex-col items-center gap-1.5">
                <span className={`text-[10px] font-semibold ${isToday ? 'text-primary' : 'text-gray-400'}`}>{label}</span>
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    background: logged
                      ? (isToday ? '#10b981' : 'rgba(16,185,129,0.2)')
                      : isToday ? 'transparent' : future ? 'rgba(249,250,251,0.8)' : 'rgba(229,231,235,0.8)',
                    border: isToday ? '2px solid #10b981' : 'none',
                    boxShadow: isToday && logged ? '0 2px 8px rgba(16,185,129,0.35)' : 'none',
                  }}>
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

      {/* ── All done banner ── */}
      {allLoggedToday && (
        <div className="rounded-2xl px-5 py-4 flex items-center gap-3 animate-scale-in"
          style={{
            background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
            boxShadow: '0 8px 32px rgba(16,185,129,0.25)',
          }}>
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">All done for today 🎉</p>
            <p className="text-xs text-white/70 mt-0.5">
              {streak >= 2 ? `${streak}-day streak — great consistency!` : 'Come back tomorrow to build your streak.'}
            </p>
          </div>
        </div>
      )}

      {/* ── Empty state ── */}
      {!hasStack && (
        <div className="px-5 py-8 text-center animate-scale-in" style={glassCard}>
          <p className="text-3xl mb-3">💊</p>
          <p className="text-sm font-semibold text-gray-900 mb-1">No treatments yet</p>
          <p className="text-xs text-gray-400 mb-5 leading-relaxed">
            Add your treatment stack to start logging daily doses and tracking adherence.
          </p>
          <Link href="/log/setup"
            className="inline-flex items-center gap-2 text-white text-sm font-semibold px-6 py-2.5 rounded-xl active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}>
            Set up my stack
          </Link>
        </div>
      )}

      {/* ── Morning doses ── */}
      {morning.length > 0 && (
        <div className="space-y-2.5 animate-fade-in-up delay-150">
          <div className="flex items-center gap-2 px-1">
            <span className="text-sm">🌅</span>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Morning</p>
          </div>
          {morning.map(item => (
            <TreatmentRow key={item.id} item={item}
              isLogged={loggedSet.has(`${item.id}:morning`)}
              timeOfDay="morning"
              existingReminders={remindersByItem[item.id] ?? []}
            />
          ))}
        </div>
      )}

      {/* ── Once daily ── */}
      {once.length > 0 && (
        <div className="space-y-2.5 animate-fade-in-up delay-200">
          {(morning.length > 0 || evening.length > 0) && (
            <div className="flex items-center gap-2 px-1">
              <span className="text-sm">📅</span>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Daily</p>
            </div>
          )}
          {once.map(item => (
            <TreatmentRow key={item.id} item={item}
              isLogged={loggedSet.has(`${item.id}:once`)}
              timeOfDay="once"
              existingReminders={remindersByItem[item.id] ?? []}
            />
          ))}
        </div>
      )}

      {/* ── Evening doses ── */}
      {evening.length > 0 && (
        <div className="space-y-2.5 animate-fade-in-up delay-250">
          <div className="flex items-center gap-2 px-1">
            <span className="text-sm">🌙</span>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Evening</p>
          </div>
          {evening.map(item => (
            <TreatmentRow key={item.id} item={item}
              isLogged={loggedSet.has(`${item.id}:evening`)}
              timeOfDay="evening"
              existingReminders={remindersByItem[item.id] ?? []}
            />
          ))}
        </div>
      )}

      {/* ── Side effect logger ── */}
      {hasStack && (
        <div className="animate-fade-in-up delay-300">
          <SideEffectLogger stack={(stack ?? []).map(s => ({ id: s.id, treatment_name: s.treatment_name }))} />
        </div>
      )}

    </div>
  )
}

/* ── Treatment row card ── */
function TreatmentRow({ item, isLogged, timeOfDay, existingReminders }: {
  item: Record<string, string>
  isLogged: boolean
  timeOfDay: string
  existingReminders: { id: string; reminder_time: string; email_enabled: boolean; push_enabled: boolean }[]
}) {
  return (
    <div
      className="overflow-hidden px-4 py-3.5 transition-all duration-300"
      style={{
        background: isLogged ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(20px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
        border: isLogged ? '1px solid rgba(16,185,129,0.20)' : '1px solid rgba(255,255,255,0.7)',
        boxShadow: isLogged
          ? '0 2px 12px rgba(16,185,129,0.10)'
          : '0 1px 8px rgba(0,0,0,0.05)',
        borderRadius: 18,
      }}>
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
          style={{ background: isLogged ? 'rgba(16,185,129,0.12)' : 'rgba(249,250,251,0.8)' }}>
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

      {/* Reminder setup */}
      <ReminderSetup
        stackItemId={item.id}
        treatmentName={item.treatment_name}
        existingReminders={existingReminders}
      />
    </div>
  )
}
