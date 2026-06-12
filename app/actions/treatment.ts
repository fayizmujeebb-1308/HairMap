'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function logDose(stackItemId: string, treatmentName: string, timeOfDay: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase.from('treatment_logs').insert({
    user_id:        user.id,
    stack_item_id:  stackItemId,
    treatment_name: treatmentName,
    taken_at:       new Date().toISOString(),
    notes:          timeOfDay,   // 'morning' | 'evening' | 'once'
  })

  if (error) return { error: error.message }
  revalidatePath('/log')
  return { success: true }
}

export async function logSideEffect(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const stackItemId = formData.get('stackItemId') as string
  const treatmentName = formData.get('treatmentName') as string
  const severity = parseInt(formData.get('severity') as string)
  const notes = formData.get('notes') as string

  const { error } = await supabase.from('treatment_logs').insert({
    user_id:               user.id,
    stack_item_id:         stackItemId || null,
    treatment_name:        treatmentName,
    taken_at:              new Date().toISOString(),
    side_effects:          notes,
    side_effect_severity:  severity,
    skipped:               true,
    skip_reason:           'side_effect',
  })

  if (error) return { error: error.message }
  revalidatePath('/log')
  return { success: true }
}

export async function addToStack(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const times: string[] = []
  if (formData.get('morning')) times.push('morning')
  if (formData.get('evening')) times.push('evening')

  const { error } = await supabase.from('treatment_stack').insert({
    user_id:        user.id,
    treatment_name: formData.get('treatment_name') as string,
    generic_name:   formData.get('generic_name') as string || null,
    treatment_type: formData.get('treatment_type') as string,
    dose:           formData.get('dose') as string || null,
    frequency:      formData.get('frequency') as string,
    times_of_day:   times.length ? times : ['once'],
    started_at:     new Date().toISOString().split('T')[0],
  })

  if (error) return { error: error.message }
  revalidatePath('/log')
  revalidatePath('/log/setup')
  return { success: true }
}

export async function applyTemplate(treatments: Array<{
  treatment_name: string
  generic_name?: string
  treatment_type: string
  dose: string
  frequency: string
  times_of_day: string[]
}>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const rows = treatments.map(t => ({
    ...t,
    user_id:    user.id,
    started_at: new Date().toISOString().split('T')[0],
    is_active:  true,
  }))

  const { error } = await supabase.from('treatment_stack').insert(rows)
  if (error) return { error: error.message }
  revalidatePath('/log')
  revalidatePath('/log/setup')
  return { success: true }
}

export async function removeFromStack(stackItemId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  await supabase
    .from('treatment_stack')
    .update({ is_active: false })
    .eq('id', stackItemId)
    .eq('user_id', user.id)

  revalidatePath('/log')
  revalidatePath('/log/setup')
  return { success: true }
}
