'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateProfile(formData: FormData): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const first_name    = formData.get('first_name') as string
  const last_name     = formData.get('last_name') as string
  const gender        = formData.get('gender') as string
  const country       = formData.get('country') as string
  const ethnicity     = formData.get('ethnicity') as string
  const norwood_stage = formData.get('norwood_stage') as string
  const treatment_status = formData.get('treatment_status') as string

  await supabase
    .from('profiles')
    .update({
      first_name,
      last_name,
      gender:           gender || null,
      country:          country || null,
      ethnicity:        ethnicity || null,
      norwood_stage:    norwood_stage ? parseInt(norwood_stage) : null,
      treatment_status: treatment_status || null,
      updated_at:       new Date().toISOString(),
    })
    .eq('user_id', user.id)

  revalidatePath('/account')
  redirect('/account')
}
