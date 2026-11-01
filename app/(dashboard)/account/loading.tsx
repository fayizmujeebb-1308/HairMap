export default function AccountLoading() {
  return (
    <div className="space-y-4 pb-2">

      {/* Header */}
      <div className="pt-2 space-y-2">
        <div className="skeleton h-2.5 w-16 rounded-full" />
        <div className="skeleton h-7 w-36 rounded-lg" />
      </div>

      {/* Avatar card */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.7)' }}>
        {/* Banner */}
        <div className="skeleton h-20 rounded-none" />
        {/* Body */}
        <div className="px-5 pb-5 pt-0 space-y-3" style={{ background: 'rgba(255,255,255,0.9)' }}>
          <div className="flex items-end justify-between -mt-7 mb-1">
            <div className="skeleton w-16 h-16 rounded-2xl" />
            <div className="skeleton h-8 w-16 rounded-xl" />
          </div>
          <div className="skeleton h-4 w-36 rounded-full" />
          <div className="skeleton h-3 w-48 rounded-full" />
          <div className="skeleton h-6 w-20 rounded-full" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[0,1,2].map(i => (
          <div key={i} className="skeleton h-20 rounded-2xl" />
        ))}
      </div>

      {/* Hair profile */}
      <div className="skeleton h-32 rounded-2xl" />

      {/* Quick links */}
      <div className="skeleton h-48 rounded-2xl" />

      {/* Sign out */}
      <div className="skeleton h-14 rounded-2xl" />

    </div>
  )
}
