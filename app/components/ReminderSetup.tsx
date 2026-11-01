'use client'

import { useState, useTransition } from 'react'
import { saveReminder, deleteReminder } from '@/app/actions/reminders'

type Reminder = {
  id: string
  reminder_time: string
  email_enabled: boolean
  push_enabled: boolean
}

type Props = {
  stackItemId: string
  treatmentName: string
  existingReminders: Reminder[]
}

export default function ReminderSetup({ stackItemId, treatmentName, existingReminders }: Props) {
  const [open, setOpen] = useState(false)
  const [time, setTime] = useState('08:00')
  const [emailOn, setEmailOn] = useState(true)
  const [pushOn, setPushOn] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [pushSupported] = useState(() =>
    typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator
  )

  async function requestPushAndEnable() {
    if (!pushSupported) return
    const perm = await Notification.requestPermission()
    if (perm !== 'granted') { alert('Please allow notifications to enable push reminders.'); return }

    const reg = await navigator.serviceWorker.ready
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    })

    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sub),
    })

    setPushOn(true)
  }

  function handlePushToggle() {
    if (!pushOn) requestPushAndEnable()
    else setPushOn(false)
  }

  function handleAdd() {
    const fd = new FormData()
    fd.set('stack_item_id', stackItemId)
    fd.set('treatment_name', treatmentName)
    fd.set('reminder_time', time)
    fd.set('email_enabled', String(emailOn))
    fd.set('push_enabled', String(pushOn))
    startTransition(() => saveReminder(fd))
  }

  function handleDelete(id: string) {
    startTransition(() => deleteReminder(id))
  }

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-primary transition-colors"
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {existingReminders.length > 0 ? `${existingReminders.length} reminder${existingReminders.length > 1 ? 's' : ''}` : 'Set reminder'}
      </button>

      {open && (
        <div className="mt-3 bg-gray-50 rounded-xl p-3 space-y-3 border border-gray-100" style={{ borderWidth: '0.5px' }}>

          {/* Existing reminders */}
          {existingReminders.map(r => (
            <div key={r.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-700">{r.reminder_time.slice(0, 5)}</span>
                <span className="text-[10px] text-gray-400">
                  {[r.email_enabled && 'email', r.push_enabled && 'push'].filter(Boolean).join(' + ')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(r.id)}
                disabled={isPending}
                className="text-[10px] text-red-400 hover:text-red-600"
              >
                Remove
              </button>
            </div>
          ))}

          {/* Add new reminder */}
          <div className="space-y-2">
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Add reminder</p>
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              style={{ borderWidth: '0.5px' }}
            />

            {/* Channels */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEmailOn(v => !v)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium border transition-colors ${
                  emailOn ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-white border-gray-100 text-gray-400'
                }`}
                style={{ borderWidth: '0.5px' }}
              >
                ✉️ Email
              </button>
              <button
                type="button"
                onClick={handlePushToggle}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium border transition-colors ${
                  pushOn ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-white border-gray-100 text-gray-400'
                } ${!pushSupported ? 'opacity-40 cursor-not-allowed' : ''}`}
                style={{ borderWidth: '0.5px' }}
                disabled={!pushSupported}
                title={!pushSupported ? 'Push notifications not supported on this device' : ''}
              >
                🔔 Push
              </button>
            </div>
            {!pushSupported && (
              <p className="text-[10px] text-gray-300">Push notifications not available on iOS — email works on all devices.</p>
            )}

            <button
              type="button"
              onClick={handleAdd}
              disabled={isPending || (!emailOn && !pushOn)}
              className="w-full bg-primary text-white text-xs font-semibold py-2 rounded-lg disabled:opacity-40 transition-opacity"
            >
              {isPending ? 'Saving…' : 'Save reminder'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
