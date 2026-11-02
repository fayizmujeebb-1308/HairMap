export default function DashboardSkeleton() {
  return (
    <div className="space-y-4 pb-2 animate-pulse">
      {/* Header */}
      <div className="pt-2">
        <div className="h-3 w-24 bg-gray-100 rounded-full mb-2" />
        <div className="h-7 w-40 bg-gray-100 rounded-full" />
      </div>

      {/* Streak card */}
      <div className="rounded-2xl px-5 py-5" style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.7)' }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-100 rounded-full w-3/4" />
            <div className="h-3 bg-gray-100 rounded-full w-1/2" />
          </div>
        </div>
      </div>

      {/* Treatments card */}
      <div className="rounded-2xl px-5 py-5 space-y-3" style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.7)' }}>
        <div className="h-3 w-32 bg-gray-100 rounded-full" />
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gray-100 shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 bg-gray-100 rounded-full w-2/3" />
              <div className="h-2 bg-gray-100 rounded-full w-1/3" />
            </div>
            <div className="w-8 h-8 rounded-xl bg-gray-100 shrink-0" />
          </div>
        ))}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="rounded-2xl px-3 py-4 space-y-2" style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.7)' }}>
            <div className="w-8 h-8 rounded-xl bg-gray-100 mx-auto" />
            <div className="h-4 bg-gray-100 rounded-full w-10 mx-auto" />
            <div className="h-2 bg-gray-100 rounded-full w-14 mx-auto" />
          </div>
        ))}
      </div>

      {/* Photo grid placeholder */}
      <div className="rounded-2xl px-5 py-4" style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.7)' }}>
        <div className="h-3 w-28 bg-gray-100 rounded-full mb-3" />
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="aspect-square rounded-xl bg-gray-100" />
          ))}
        </div>
      </div>
    </div>
  )
}
