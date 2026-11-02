import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ThemeToggle from '@/app/components/ThemeToggle'

const glassCard = {
  background: 'var(--bg-card)',
  backdropFilter: 'blur(20px) saturate(1.8)',
  WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
  border: '1px solid var(--bg-card-border)',
  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
  borderRadius: 20,
} as const

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
    <div className="space-y-4 pb-2">

      {/* ── Header ── */}
      <div className="pt-2 animate-fade-in-up">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Account</p>
        <h1 className="font-serif text-[26px] text-gray-900 mt-0.5">Your Profile</h1>
      </div>

      {/* ── Avatar card ── */}
      <div className="overflow-hidden animate-fade-in-up delay-75" style={{ ...glassCard, padding: 0 }}>
        {/* Gradient banner */}
        <div className="h-24 relative"
          style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 60%, #34d399 100%)' }}>
          {/* Decorative blobs */}
          <div className="absolute top-2 right-6 w-12 h-12 rounded-full opacity-20"
            style={{ background: 'rgba(255,255,255,0.4)' }} />
          <div className="absolute top-6 right-14 w-7 h-7 rounded-full opacity-15"
            style={{ background: 'rgba(255,255,255,0.5)' }} />
          {/* Fade into card */}
          <div className="absolute bottom-0 left-0 right-0 h-5 rounded-t-2xl"
            style={{ background: 'var(--bg-card)', zIndex: 0 }} />
        </div>

        <div className="px-5 pb-5" style={{ background: 'var(--bg-card)' }}>
          <div className="flex items-end justify-between -mt-8 mb-4">
            {/* Avatar circle */}
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 relative"
              style={{ zIndex: 10 }}
              style={{
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                boxShadow: '0 4px 16px rgba(16,185,129,0.35)',
              }}>
              <span className="font-serif text-2xl text-white">{initials}</span>
            </div>
            <Link href="/account/edit"
              className="flex items-center gap-1.5 text-xs font-semibold text-primary px-3 py-2 rounded-xl active:scale-95 transition-transform mb-1"
              style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit
            </Link>
          </div>

          <p className="font-serif text-lg text-gray-900">
            {[p?.first_name, p?.last_name].filter(Boolean).join(' ') || 'Your name'}
          </p>
          <p className="text-sm text-gray-400 mt-0.5">{user.email}</p>

          <div className="flex items-center gap-2 mt-3">
            <span className="text-[10px] px-2.5 py-1 rounded-full font-bold"
              style={{
                background: isPro ? 'linear-gradient(135deg, #059669, #10b981)' : 'rgba(229,231,235,0.8)',
                color: isPro ? '#fff' : '#9ca3af',
              }}>
              {isPro ? '✦ Pro' : 'Free plan'}
            </span>
            <span className="text-[10px] text-gray-300">·</span>
            <span className="text-[10px] text-gray-400">Since {memberSince}</span>
          </div>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-3 gap-3 animate-fade-in-up delay-100">
        {[
          { label: 'Treatments', value: stack?.length ?? 0, sub: 'active',   icon: '💊' },
          { label: 'Doses',      value: logs?.length ?? 0,  sub: 'logged',   icon: '📊' },
          { label: 'Photos',     value: photos?.length ?? 0, sub: 'uploaded', icon: '📸' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl px-3 py-3.5 text-center" style={glassCard}>
            <p className="text-sm mb-1">{s.icon}</p>
            <p className="font-serif text-xl text-gray-900 leading-none">{s.value}</p>
            <p className="text-[9px] text-primary font-semibold mt-0.5 uppercase tracking-wider">{s.sub}</p>
            <p className="text-[9px] text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Hair profile ── */}
      <div className="overflow-hidden animate-fade-in-up delay-150" style={{ ...glassCard, padding: 0 }}>
        <div className="px-5 py-3.5" style={{ borderBottom: '1px solid rgba(229,231,235,0.6)' }}>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Hair Profile</p>
        </div>
        {[
          { label: 'Norwood Stage',     value: p?.norwood_stage ? `NW${p.norwood_stage}` : null },
          { label: 'Days on treatment', value: `${daysTracked} days` },
          { label: 'Active treatments', value: stack?.length ? `${stack.length} treatment${stack.length !== 1 ? 's' : ''}` : null },
        ].map((row, i, arr) => (
          <div key={row.label}
            className="flex items-center justify-between px-5 py-3.5"
            style={{
              borderBottom: i < arr.length - 1 ? '1px solid rgba(229,231,235,0.4)' : undefined,
              background: i % 2 === 0 ? 'rgba(248,250,251,0.5)' : 'transparent',
            }}>
            <p className="text-sm text-gray-400">{row.label}</p>
            <p className="text-sm font-semibold text-gray-900">
              {row.value ?? <span className="text-gray-200 font-normal">—</span>}
            </p>
          </div>
        ))}
      </div>

      {/* ── Quick links ── */}
      <div className="overflow-hidden animate-fade-in-up delay-200" style={{ ...glassCard, padding: 0 }}>
        {[
          { href: '/log/setup', label: 'Manage treatment stack', icon: '💊', iconBg: 'rgba(16,185,129,0.10)' },
          { href: '/photos',    label: 'Progress photos',        icon: '📸', iconBg: 'rgba(99,102,241,0.08)' },
          { href: '/progress',  label: 'AI analysis & charts',   icon: '🤖', iconBg: 'rgba(139,92,246,0.08)' },
          { href: '/learn',     label: 'Education library',      icon: '📚', iconBg: 'rgba(245,158,11,0.10)' },
        ].map((item, i, arr) => (
          <Link key={item.href} href={item.href}
            className="flex items-center justify-between px-5 py-4 active:bg-white/50 transition-colors"
            style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(229,231,235,0.4)' : undefined }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                style={{ background: item.iconBg }}>
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

      {/* ── Upgrade banner ── */}
      {!isPro && (
        <Link href="/pricing"
          className="block rounded-2xl px-5 py-5 active:opacity-90 transition-opacity animate-fade-in-up delay-300"
          style={{
            background: 'linear-gradient(135deg, #065f46 0%, #059669 50%, #10b981 100%)',
            boxShadow: '0 12px 40px rgba(16,185,129,0.25)',
          }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] text-white/60 font-semibold uppercase tracking-widest mb-1.5">Upgrade</p>
              <p className="text-base font-serif text-white">Unlock Pro</p>
              <p className="text-xs text-white/60 mt-1 leading-relaxed max-w-[200px]">
                Unlimited AI analysis, before/after comparison, priority support
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 ml-4 mt-1">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          <div className="mt-4 pt-3.5 flex items-center gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
            <span className="text-xs font-bold text-white">$12 / month</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-[10px] text-white/60">7-day free trial · cancel anytime</span>
          </div>
        </Link>
      )}

      {/* ── Preferences ── */}
      <div className="overflow-hidden animate-fade-in-up delay-350" style={{ ...glassCard, padding: 0 }}>
        <div className="px-5 py-3.5" style={{ borderBottom: '1px solid rgba(229,231,235,0.6)' }}>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Preferences</p>
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{ background: 'rgba(99,102,241,0.08)' }}>
              🎨
            </div>
            <span className="text-sm font-medium text-gray-700">Appearance</span>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* ── Sign out ── */}
      <div className="overflow-hidden animate-fade-in-up delay-400" style={{ ...glassCard, padding: 0 }}>
        <form action="/auth/signout" method="post">
          <button type="submit"
            className="w-full text-sm text-red-400 font-semibold py-4 px-5 active:bg-red-50 transition-colors text-center">
            Sign out
          </button>
        </form>
      </div>

    </div>
  )
}
