'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveReminder(formData: FormData): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const stackItemId    = formData.get('stack_item_id') as string
  const treatmentName  = formData.get('treatment_name') as string
  const reminderTime   = formData.get('reminder_time') as string
  const emailEnabled   = formData.get('email_enabled') === 'true'
  const pushEnabled    = formData.get('push_enabled') === 'true'

  if (!reminderTime) return

  await supabase.from('reminder_settings').upsert({
    user_id:        user.id,
    stack_item_id:  stackItemId,
    treatment_name: treatmentName,
    reminder_time:  reminderTime,
    email_enabled:  emailEnabled,
    push_enabled:   pushEnabled,
    is_active:      true,
  }, { onConflict: 'user_id,stack_item_id,reminder_time' })

  revalidatePath('/log')
}

export async function deleteReminder(id: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('reminder_settings')
    .update({ is_active: false })
    .eq('id', id)
    .eq('user_id', user.id)

  revalidatePath('/log')
}
