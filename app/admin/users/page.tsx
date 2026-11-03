import { createClient } from '@/lib/supabase/server'

const card = {
  background: 'var(--bg-card)',
  border: '1px solid var(--bg-card-border)',
  borderRadius: 16,
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
} as const

export default async function AdminUsers({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; page?: string }>
}) {
  const { filter = 'all', page = '1' } = await searchParams
  const supabase = await createClient()

  const pageNum = parseInt(page) || 1
  const PAGE_SIZE = 20
  const from = (pageNum - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from('profiles')
    .select(`
      user_id, hairmap_id, first_name, last_name, email,
      subscription_status, theme, norwood_stage, onboarding_completed,
      is_admin, created_at, updated_at
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (filter === 'pro') query = query.in('subscription_status', ['pro', 'trialing'])
  if (filter === 'free') query = query.eq('subscription_status', 'free')
  if (filter === 'admin') query = query.eq('is_admin', true)

  const { data: users, count } = await query

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)

  const filterTabs = [
    { id: 'all', label: 'All Users' },
    { id: 'pro', label: 'Pro' },
    { id: 'free', label: 'Free' },
    { id: 'admin', label: 'Admin' },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl" style={{ color: 'var(--text-primary)' }}>Users</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            {count ?? 0} total users
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {filterTabs.map(tab => (
          <a key={tab.id} href={`/admin/users?filter=${tab.id}`}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
            style={{
              background: filter === tab.id ? '#7c3aed' : 'var(--bg-surface)',
              color: filter === tab.id ? '#fff' : 'var(--text-secondary)',
            }}>
            {tab.label}
          </a>
        ))}
      </div>

      {/* Table */}
      <div style={{ ...card, padding: 0, overflowX: 'auto' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--bg-card-border)' }}>
              {['User', 'ID', 'Status', 'Theme', 'Norwood', 'Onboarded', 'Joined', 'Flags'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider"
                  style={{ color: 'var(--text-tertiary)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users?.map((u, i) => {
              const name = [u.first_name, u.last_name].filter(Boolean).join(' ') || '—'
              const isPro = u.subscription_status === 'pro' || u.subscription_status === 'trialing'
              const date = new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })
              return (
                <tr key={u.user_id}
                  style={{ borderBottom: i < (users.length - 1) ? '1px solid var(--bg-card-border)' : undefined }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
                        {name[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="font-medium text-xs" style={{ color: 'var(--text-primary)' }}>{name}</p>
                        <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-mono" style={{ color: 'var(--text-tertiary)' }}>
                      {u.hairmap_id || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                      style={{
                        background: isPro ? 'rgba(5,150,105,0.12)' : 'rgba(100,116,139,0.1)',
                        color: isPro ? 'var(--color-primary)' : 'var(--text-tertiary)',
                      }}>
                      {u.subscription_status || 'free'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] capitalize" style={{ color: 'var(--text-secondary)' }}>
                      {u.theme || 'blossom'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {u.norwood_stage ? `NW${u.norwood_stage}` : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px]" style={{ color: u.onboarding_completed ? 'var(--color-primary)' : 'var(--text-tertiary)' }}>
                      {u.onboarding_completed ? '✓ Yes' : '✗ No'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{date}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {u.is_admin && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold"
                          style={{ background: 'rgba(124,58,237,0.12)', color: '#7c3aed' }}>
                          Admin
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3"
            style={{ borderTop: '1px solid var(--bg-card-border)' }}>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              Page {pageNum} of {totalPages}
            </p>
            <div className="flex gap-2">
              {pageNum > 1 && (
                <a href={`/admin/users?filter=${filter}&page=${pageNum - 1}`}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                  style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
                  ← Prev
                </a>
              )}
              {pageNum < totalPages && (
                <a href={`/admin/users?filter=${filter}&page=${pageNum + 1}`}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                  style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
                  Next →
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
