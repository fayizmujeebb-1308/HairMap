import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import UpgradeClient from './UpgradeClient'

export default async function UpgradePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?next=/upgrade')

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status')
    .eq('user_id', user.id)
    .single()

  const isPro = profile?.subscription_status === 'pro' || profile?.subscription_status === 'trialing'
  if (isPro) redirect('/account?already_pro=1')

  const PRICE_ID_MONTHLY = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_MONTHLY ?? ''
  const PRICE_ID_YEARLY  = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_YEARLY ?? ''

  return (
    <UpgradeClient
      userEmail={user.email ?? ''}
      priceIdMonthly={PRICE_ID_MONTHLY}
      priceIdYearly={PRICE_ID_YEARLY}
    />
  )
}
