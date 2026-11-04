import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Call at the top of any Pro-only server page.
 * Redirects to /upgrade if the user is not Pro.
 * Returns the user object if they are Pro.
 */
export async function requirePro() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status')
    .eq('user_id', user.id)
    .single()

  const isPro =
    profile?.subscription_status === 'pro' ||
    profile?.subscription_status === 'trialing'

  if (!isPro) redirect('/upgrade?locked=1')

  return { user, isPro }
}

/**
 * Returns isPro without redirecting — useful for conditional UI.
 */
export async function getProStatus(): Promise<{ isPro: boolean; userId: string | null }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { isPro: false, userId: null }

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status')
    .eq('user_id', user.id)
    .single()

  const isPro =
    profile?.subscription_status === 'pro' ||
    profile?.subscription_status === 'trialing'

  return { isPro, userId: user.id }
}
