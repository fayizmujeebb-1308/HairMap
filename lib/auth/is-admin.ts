import { createClient } from '@/lib/supabase/server'

/**
 * Returns true if the currently logged-in user has is_admin = true.
 * This is checked server-side only — never exposed to the browser.
 */
export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('user_id', user.id)
    .single()

  return profile?.is_admin === true
}

/**
 * Returns true if the user has Pro access.
 * Admins always get Pro. Otherwise checks subscription status.
 */
export async function hasPro(): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin, subscription_status')
    .eq('user_id', user.id)
    .single()

  if (profile?.is_admin) return true

  return ['pro', 'clinic', 'trialing'].includes(profile?.subscription_status || '')
}
