export default function LearnLoading() {
  return (
    <div className="space-y-5 pb-2">

      {/* Header */}
      <div className="pt-2 space-y-2">
        <div className="skeleton h-2.5 w-16 rounded-full" />
        <div className="skeleton h-7 w-20 rounded-lg" />
        <div className="skeleton h-3 w-56 rounded-full" />
      </div>

      {/* Section label */}
      <div className="space-y-2.5">
        <div className="skeleton h-2.5 w-36 rounded-full" />
        {/* Recommended cards */}
        {[0,1].map(i => (
          <div key={i} className="flex items-start gap-4 px-4 py-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.7)' }}>
            <div className="skeleton w-10 h-10 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-3 w-16 rounded-full" />
              <div className="skeleton h-4 w-full rounded-full" />
              <div className="skeleton h-3 w-4/5 rounded-full" />
              <div className="skeleton h-3 w-3/5 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      {/* All articles */}
      <div className="space-y-2.5">
        <div className="skeleton h-2.5 w-24 rounded-full" />
        {[0,1,2,3].map(i => (
          <div key={i} className="flex items-start gap-4 px-4 py-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.7)' }}>
            <div className="skeleton w-10 h-10 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-3 w-20 rounded-full" />
              <div className="skeleton h-4 w-5/6 rounded-full" />
              <div className="skeleton h-3 w-2/3 rounded-full" />
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
