import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: p } = await supabase.from('profiles').select('*, subscription_status').eq('user_id', user.id).single()
  const { data: stack } = await supabase.from('treatment_stack').select('id').eq('user_id', user.id).eq('is_active', true)
  const { data: logs } = await supabase.from('treatment_logs').select('id').eq('user_id', user.id)
  const { data: photos } = await supabase.from('progress_photos').select('id').eq('user_id', user.id)

  const memberSince = p?.created_at
    ? new Date(p.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '—'

  const daysTracked = p?.created_at
    ? Math.max(1, Math.floor((Date.now() - new Date(p.created_at).getTime()) / 86400000))
    : 0

  const initials = [p?.first_name?.[0], p?.last_name?.[0]].filter(Boolean).join('').toUpperCase() || '?'
  const isPro = p?.subscription_status === 'pro' || p?.subscription_status === 'trialing'

  return (
    <div className="space-y-4">

      <div className="pt-2 animate-fade-in-up">
        <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">Account</p>
        <h1 className="font-serif text-2xl text-gray-900 mt-0.5">Your Profile</h1>
      </div>

      {/* Avatar card — gradient banner */}
      <div className="rounded-2xl overflow-hidden shadow-card animate-fade-in-up delay-75">
        <div className="h-16 relative" style={{ background: 'linear-gradient(135deg, #0F6E56 0%, #1D9E75 60%, #16a34a 100%)' }}>
          <div className="absolute -bottom-px left-0 right-0 h-8 rounded-t-2xl" style={{ background: '#fff' }} />
        </div>
        <div className="bg-white px-5 pb-5">
          <div className="flex items-end justify-between -mt-8 mb-3">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-card-md shrink-0"
              style={{ background: 'linear-gradient(135deg, #0F6E56 0%, #1D9E75 100%)' }}>
              <span className="font-serif text-2xl text-white">{initials}</span>
            </div>
            <Link href="/account/edit"
              className="text-xs font-semibold text-primary bg-primary/8 px-3 py-1.5 rounded-xl active:scale-95 transition-transform mb-1">
              Edit profile
            </Link>
          </div>
          <p className="font-bold text-gray-900 text-base">
            {[p?.first_name, p?.last_name].filter(Boolean).join(' ') || 'Your name'}
          </p>
          <p className="text-sm text-gray-400 mt-0.5">{user.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold capitalize ${
              isPro ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              {isPro ? '✦ Pro' : 'Free'}
            </span>
            <span className="text-[10px] text-gray-300">Member since {memberSince}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 animate-fade-in-up delay-150">
        {[
          { label: 'Treatments', value: stack?.length ?? 0, sub: 'active' },
          { label: 'Doses', value: logs?.length ?? 0, sub: 'logged' },
          { label: 'Photos', value: photos?.length ?? 0, sub: 'uploaded' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl shadow-card px-3 py-4 text-center">
            <p className="font-serif text-2xl text-gray-900">{s.value}</p>
            <p className="text-[9px] text-primary font-semibold mt-0.5 uppercase tracking-wide">{s.sub}</p>
            <p className="text-[9px] text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Hair profile */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden animate-fade-in-up delay-200">
        <div className="px-5 py-3.5" style={{ borderBottom: '0.5px solid #f0f0ee' }}>
          <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Hair Profile</p>
        </div>
        <div>
          {[
            { label: 'Norwood Stage', value: p?.norwood_stage ? `NW${p.norwood_stage}` : null },
            { label: 'Days on treatment', value: `${daysTracked} days` },
            { label: 'Active treatments', value: stack?.length ? `${stack.length} treatments` : null },
          ].map((row, i, arr) => (
            <div key={row.label} className="flex items-center justify-between px-5 py-3.5"
              style={{ borderBottom: i < arr.length - 1 ? '0.5px solid #f4f3ef' : undefined }}>
              <p className="text-sm text-gray-400">{row.label}</p>
              <p className="text-sm font-semibold text-gray-900">
                {row.value ?? <span className="text-gray-200">—</span>}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden animate-fade-in-up delay-300">
        {[
          { href: '/log/setup', label: 'Manage treatment stack', icon: '💊' },
          { href: '/photos',    label: 'View progress photos',   icon: '📸' },
          { href: '/progress',  label: 'AI analysis & charts',   icon: '🤖' },
          { href: '/learn',     label: 'Education library',      icon: '📚' },
        ].map((item, i, arr) => (
          <Link key={item.href} href={item.href}
            className="flex items-center justify-between px-5 py-4 active:bg-gray-50 transition-colors"
            style={{ borderBottom: i < arr.length - 1 ? '0.5px solid #f4f3ef' : undefined }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-base">
                {item.icon}
              </div>
              <span className="text-sm font-medium text-gray-700">{item.label}</span>
            </div>
            <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>

      {/* Upgrade banner — free users only */}
      {!isPro && (
        <Link href="/pricing"
          className="block rounded-2xl px-5 py-5 shadow-glow-green active:opacity-90 transition-opacity animate-fade-in-up delay-400"
          style={{ background: 'linear-gradient(135deg, #0a6648 0%, #1D9E75 60%, #16a34a 100%)' }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] text-white/60 font-semibold uppercase tracking-wider mb-1">Upgrade</p>
              <p className="text-base font-bold text-white">Unlock Pro</p>
              <p className="text-xs text-white/60 mt-1 leading-relaxed">Unlimited photos, AI analysis, before/after comparison</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 ml-4">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          <div className="mt-3 pt-3 flex items-center gap-3" style={{ borderTop: '0.5px solid rgba(255,255,255,0.15)' }}>
            <span className="text-xs font-bold text-white">$12/month</span>
            <span className="text-[10px] text-white/50">·</span>
            <span className="text-[10px] text-white/60">7-day free trial</span>
          </div>
        </Link>
      )}

      {/* Sign out */}
      <div className="bg-white rounded-2xl shadow-card px-5 py-1 animate-fade-in-up delay-500">
        <form action="/auth/signout" method="post">
          <button type="submit"
            className="w-full text-sm text-red-400 font-semibold py-3.5 active:opacity-60 transition-opacity">
            Sign out
          </button>
        </form>
      </div>

    </div>
  )
}
