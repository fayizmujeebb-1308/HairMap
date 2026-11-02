export default function AccountLoading() {
  return (
    <div className="space-y-4 pb-2 animate-pulse">
      <div className="pt-2">
        <div className="h-2.5 w-16 bg-gray-100 rounded-full mb-2" />
        <div className="h-7 w-32 bg-gray-100 rounded-full" />
      </div>

      {/* Avatar card */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--bg-card-border)' }}>
        <div className="h-20 bg-gray-100" />
        <div className="px-5 pb-5">
          <div className="flex items-end justify-between -mt-7 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gray-200 shrink-0" />
            <div className="h-8 w-16 rounded-xl bg-gray-100 mb-1" />
          </div>
          <div className="h-5 w-40 bg-gray-100 rounded-full mb-2" />
          <div className="h-3 w-52 bg-gray-100 rounded-full mb-3" />
          <div className="flex gap-2">
            <div className="h-5 w-16 bg-gray-100 rounded-full" />
            <div className="h-5 w-24 bg-gray-100 rounded-full" />
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3">
        {[1,2,3].map(i => (
          <div key={i} className="rounded-2xl px-3 py-3.5 space-y-2 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--bg-card-border)' }}>
            <div className="w-8 h-8 bg-gray-100 rounded-xl mx-auto" />
            <div className="h-5 w-8 bg-gray-100 rounded-full mx-auto" />
            <div className="h-2.5 w-12 bg-gray-100 rounded-full mx-auto" />
          </div>
        ))}
      </div>

      {/* Hair profile */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--bg-card-border)' }}>
        <div className="px-5 py-3.5 border-b border-gray-100">
          <div className="h-2.5 w-24 bg-gray-100 rounded-full" />
        </div>
        {[1,2,3].map(i => (
          <div key={i} className="flex justify-between px-5 py-3.5 border-b border-gray-50 last:border-0">
            <div className="h-3 w-32 bg-gray-100 rounded-full" />
            <div className="h-3 w-16 bg-gray-100 rounded-full" />
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--bg-card-border)' }}>
        {[1,2,3,4].map(i => (
          <div key={i} className="flex items-center gap-3 px-5 py-4 border-b border-gray-50 last:border-0">
            <div className="w-9 h-9 rounded-xl bg-gray-100 shrink-0" />
            <div className="h-3 w-36 bg-gray-100 rounded-full flex-1" />
            <div className="w-4 h-4 bg-gray-100 rounded-full shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}
