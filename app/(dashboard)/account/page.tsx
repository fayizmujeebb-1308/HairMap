import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: p } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const memberSince = p?.created_at
    ? new Date(p.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '—'

  const rows = [
    { label: 'Name',             value: [p?.first_name, p?.last_name].filter(Boolean).join(' ') },
    { label: 'Email',            value: user.email },
    { label: 'Age',              value: p?.age ? `${p.age} years old` : null },
    { label: 'Gender',           value: p?.gender },
    { label: 'Country',          value: p?.country },
    { label: 'Ethnicity',        value: p?.ethnicity },
    { label: 'Norwood Stage',    value: p?.norwood_stage ? `NW${p.norwood_stage}` : null },
    { label: 'Treatment',        value: p?.treatment_status },
    { label: 'Subscription',     value: p?.subscription_status ?? 'free' },
    { label: 'Member since',     value: memberSince },
  ]

  return (
    <div className="space-y-5">

      <div className="flex items-start justify-between pt-2">
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">Account</p>
          <h1 className="font-serif text-2xl text-gray-900 mt-0.5">Your Profile</h1>
        </div>
        <Link href="/account/edit"
          className="text-xs font-semibold text-primary bg-primary/8 px-3 py-1.5 rounded-xl active:scale-95 transition-transform">
          Edit
        </Link>
      </div>

      {/* Avatar / name card */}
      <div className="bg-white rounded-2xl border border-gray-100 px-5 py-5 flex items-center gap-4" style={{ borderWidth: '0.5px' }}>
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
          <span className="font-serif text-2xl text-primary">
            {(p?.first_name?.[0] ?? '?').toUpperCase()}
          </span>
        </div>
        <div>
          <p className="font-semibold text-gray-900">
            {[p?.first_name, p?.last_name].filter(Boolean).join(' ') || 'Your name'}
          </p>
          <p className="text-sm text-gray-400">{user.email}</p>
          <span className="inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full bg-primary/8 text-primary font-medium capitalize">
            {p?.subscription_status ?? 'free'}
          </span>
        </div>
      </div>

      {/* Profile details */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ borderWidth: '0.5px' }}>
        <div className="px-5 py-3.5" style={{ borderBottom: '0.5px solid #f3f4f6' }}>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Details</p>
        </div>
        <div className="divide-y divide-gray-50">
          {rows.map(row => (
            <div key={row.label} className="flex items-center justify-between px-5 py-3.5">
              <p className="text-sm text-gray-400">{row.label}</p>
              <p className="text-sm font-medium text-gray-900 text-right max-w-[55%] truncate">
                {row.value || <span className="text-gray-300">—</span>}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Sign out */}
      <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4" style={{ borderWidth: '0.5px' }}>
        <form action="/auth/signout" method="post">
          <button type="submit"
            className="w-full text-sm text-red-500 font-medium py-1 active:opacity-70 transition-opacity">
            Sign out
          </button>
        </form>
      </div>

    </div>
  )
}
