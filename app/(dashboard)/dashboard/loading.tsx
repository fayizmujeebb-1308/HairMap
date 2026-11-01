export default function DashboardLoading() {
  return (
    <div className="space-y-4 pb-2">

      {/* Header */}
      <div className="flex items-start justify-between pt-2">
        <div className="space-y-2">
          <div className="skeleton h-2.5 w-16 rounded-full" />
          <div className="skeleton h-7 w-36 rounded-lg" />
        </div>
        <div className="skeleton h-7 w-20 rounded-full" />
      </div>

      {/* Nudge card */}
      <div className="skeleton h-16 rounded-2xl" />

      {/* Treatment card */}
      <div className="skeleton h-28 rounded-2xl" />

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3">
        {[0,1,2].map(i => (
          <div key={i} className="skeleton h-20 rounded-2xl" />
        ))}
      </div>

      {/* Photo log */}
      <div className="rounded-2xl p-5 space-y-3" style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.7)' }}>
        <div className="skeleton h-3 w-24 rounded-full" />
        <div className="grid grid-cols-4 gap-2">
          {[0,1,2,3].map(i => (
            <div key={i} className="skeleton aspect-square rounded-xl" />
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3">
        <div className="skeleton h-20 rounded-2xl" />
        <div className="skeleton h-20 rounded-2xl" />
      </div>

      {/* AI coach */}
      <div className="skeleton h-24 rounded-2xl" />

    </div>
  )
}
