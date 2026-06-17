import { createClient } from '@/lib/supabase/server'
import { sendReminderEmail } from '@/lib/resend'
import webpush from 'web-push'
import { NextResponse } from 'next/server'

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
)

export async function GET(req: Request) {
  // Verify cron secret so only Vercel can call this
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()

  // Get current UTC time rounded to nearest 15 min window
  const now = new Date()
  const hh = now.getUTCHours().toString().padStart(2, '0')
  const mm = (Math.floor(now.getUTCMinutes() / 15) * 15).toString().padStart(2, '0')
  const currentTime = `${hh}:${mm}`

  // Find all active reminders due right now
  const { data: reminders } = await supabase
    .from('reminder_settings')
    .select(`
      *,
      profiles!inner(first_name, email:user_id),
      push_subscriptions(subscription)
    `)
    .eq('is_active', true)
    .eq('timezone', 'UTC') // simplified: UTC only for now
    .gte('reminder_time', currentTime)
    .lt('reminder_time', `${hh}:${(parseInt(mm) + 15).toString().padStart(2, '0')}`)

  if (!reminders?.length) return NextResponse.json({ sent: 0 })

  let sent = 0

  for (const reminder of reminders) {
    // Check if user already logged this treatment today
    const today = new Date().toISOString().split('T')[0]
    const { data: alreadyLogged } = await supabase
      .from('treatment_logs')
      .select('id')
      .eq('user_id', reminder.user_id)
      .eq('stack_item_id', reminder.stack_item_id)
      .gte('taken_at', `${today}T00:00:00Z`)
      .limit(1)

    if (alreadyLogged?.length) continue // already logged today, skip

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

    const profile = Array.isArray(reminder.profiles) ? reminder.profiles[0] : reminder.profiles
    const firstName = profile?.first_name ?? 'there'

    // Get user email
    const { data: { user } } = await supabase.auth.admin.getUserById(reminder.user_id)
    const email = user?.email

    // Send email reminder
    if (reminder.email_enabled && email) {
      try {
        await sendReminderEmail({ to: email, firstName, treatmentName: reminder.treatment_name, streak })
        sent++
      } catch {}
    }

    // Send push notification
    if (reminder.push_enabled) {
      const subs = Array.isArray(reminder.push_subscriptions) ? reminder.push_subscriptions : []
      for (const { subscription } of subs) {
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
