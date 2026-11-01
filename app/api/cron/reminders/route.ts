export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { sendReminderEmail } from '@/lib/resend'
import webpush from 'web-push'
import { NextResponse } from 'next/server'
import { Receiver } from '@upstash/qstash'

export async function POST(req: Request) {
  // Verify request is from QStash
  const receiver = new Receiver({
    currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
    nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
  })

  const body = await req.text()
  const signature = req.headers.get('upstash-signature') ?? ''

  const isValid = await receiver.verify({ body, signature }).catch(() => false)
  if (!isValid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!,
  )

  const supabase = await createClient()

  // Get current UTC time — check 15 min window
  const now = new Date()
  const hh = now.getUTCHours().toString().padStart(2, '0')
  const mm = (Math.floor(now.getUTCMinutes() / 15) * 15).toString().padStart(2, '0')
  const nextMm = ((Math.floor(now.getUTCMinutes() / 15) * 15) + 15).toString().padStart(2, '0')
  const currentTime = `${hh}:${mm}`
  const nextTime = `${hh}:${nextMm}`

  const { data: reminders } = await supabase
    .from('reminder_settings')
    .select('*')
    .eq('is_active', true)
    .gte('reminder_time', currentTime)
    .lt('reminder_time', nextTime)

  // Early warning alerts — run once daily around 20:00 UTC
  if (hh === '20' && mm === '00') {
    await sendEarlyWarnings(supabase)
  }

  if (!reminders?.length) return NextResponse.json({ sent: 0 })

  let sent = 0

  for (const reminder of reminders) {
    const today = new Date().toISOString().split('T')[0]
    const { data: alreadyLogged } = await supabase
      .from('treatment_logs')
      .select('id')
      .eq('user_id', reminder.user_id)
      .eq('stack_item_id', reminder.stack_item_id)
      .gte('taken_at', `${today}T00:00:00Z`)
      .limit(1)

    if (alreadyLogged?.length) continue

    // Get streak
    const { data: logs } = await supabase
      .from('treatment_logs')
      .select('taken_at')
      .eq('user_id', reminder.user_id)
      .order('taken_at', { ascending: false })
      .limit(60)

    const days = new Set((logs ?? []).map((l: { taken_at: string }) => l.taken_at.split('T')[0]))
    let streak = 0
    const d = new Date()
    while (days.has(d.toISOString().split('T')[0])) {
      streak++
      d.setDate(d.getDate() - 1)
    }

    const { data: { user } } = await supabase.auth.admin.getUserById(reminder.user_id)
    const email = user?.email

    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name')
      .eq('user_id', reminder.user_id)
      .single()

    const firstName = profile?.first_name ?? 'there'

    if (reminder.email_enabled && email) {
      try {
        await sendReminderEmail({ to: email, firstName, treatmentName: reminder.treatment_name, streak })
        sent++
      } catch {}
    }

    if (reminder.push_enabled) {
      const { data: subs } = await supabase
        .from('push_subscriptions')
        .select('subscription')
        .eq('user_id', reminder.user_id)

      for (const { subscription } of subs ?? []) {
        try {
          await webpush.sendNotification(subscription, JSON.stringify({
            title: `💊 Time for your ${reminder.treatment_name}`,
            body: streak >= 2
              ? `${streak}-day streak 🔥 Don't break it! Tap to log.`
              : `Every dose counts. Tap to log now.`,
            url: '/log',
          }))
          sent++
        } catch {}
      }
    }
  }

  return NextResponse.json({ sent })
}

async function sendEarlyWarnings(supabase: Awaited<ReturnType<typeof createClient>>) {
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]

  // Get all users with an active treatment stack
  const { data: profiles } = await supabase
    .from('profiles')
    .select('user_id, first_name')

  if (!profiles?.length) return

  for (const profile of profiles) {
    const { data: logs } = await supabase
      .from('treatment_logs')
      .select('taken_at')
      .eq('user_id', profile.user_id)
      .gte('taken_at', `${sevenDaysAgo}T00:00:00Z`)

    if (!logs?.length) continue

    const logDates = new Set(logs.map((l: { taken_at: string }) => l.taken_at.split('T')[0]))
    const loggedToday = logDates.has(today)
    const loggedYesterday = logDates.has(yesterday)
    const weeklyAdherence = Math.round((logDates.size / 7) * 100)

    // Streak about to break: had streak yesterday, nothing today
    const streakWarning = loggedYesterday && !loggedToday
    // Low adherence
    const adherenceWarning = weeklyAdherence < 70 && logDates.size >= 3

    if (!streakWarning && !adherenceWarning) continue

    const { data: { user } } = await supabase.auth.admin.getUserById(profile.user_id)
    const email = user?.email
    const firstName = profile.first_name ?? 'there'

    const title = streakWarning ? '⚠️ Don\'t break your streak!' : '📉 Your adherence is slipping'
    const body = streakWarning
      ? `You haven\'t logged today yet, ${firstName}. Log now to keep your streak alive.`
      : `Your adherence is ${weeklyAdherence}% this week. Daily consistency is key to results.`

    // Push notification
    const { data: subs } = await supabase
      .from('push_subscriptions')
      .select('subscription')
      .eq('user_id', profile.user_id)

    for (const { subscription } of subs ?? []) {
      try {
        await webpush.sendNotification(subscription, JSON.stringify({ title, body, url: '/log' }))
      } catch {}
    }

    // Email
    if (email) {
      try {
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)
        await resend.emails.send({
          from: 'HairMap <reminders@hair-map.vercel.app>',
          to: email,
          subject: title,
          html: `<p>${body}</p><p><a href="https://hair-map.vercel.app/log">Log now →</a></p>`,
        })
      } catch {}
    }
  }
}

// Keep GET for manual testing
export async function GET(req: Request) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json({ ok: true, message: 'Use POST for actual cron execution' })
}
