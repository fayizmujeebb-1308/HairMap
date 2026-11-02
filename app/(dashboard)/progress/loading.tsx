export default function ProgressLoading() {
  return (
    <div className="space-y-4 pb-2 animate-pulse">
      <div className="pt-2">
        <div className="h-3 w-24 bg-gray-100 rounded-full mb-2" />
        <div className="h-7 w-32 bg-gray-100 rounded-full" />
      </div>
      {/* Adherence ring card */}
      <div className="rounded-2xl px-5 py-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--bg-card-border)' }}>
        <div className="flex items-center gap-5">
          <div className="w-[110px] h-[110px] rounded-full bg-gray-100 shrink-0" />
          <div className="flex-1 space-y-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="flex justify-between">
                <div className="h-2.5 bg-gray-100 rounded-full w-24" />
                <div className="h-2.5 bg-gray-100 rounded-full w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Heatmap */}
      <div className="rounded-2xl px-5 py-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--bg-card-border)' }}>
        <div className="h-3 w-24 bg-gray-100 rounded-full mb-3" />
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({length: 28}).map((_, i) => (
            <div key={i} className="aspect-square rounded-lg bg-gray-100" />
          ))}
        </div>
      </div>
      {/* Bar chart */}
      <div className="rounded-2xl px-5 py-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--bg-card-border)' }}>
        <div className="h-3 w-32 bg-gray-100 rounded-full mb-4" />
        <div className="flex items-end gap-1.5 h-24">
          {Array.from({length: 8}).map((_, i) => (
            <div key={i} className="flex-1 bg-gray-100 rounded-t-lg" style={{ height: `${30 + Math.random() * 60}%` }} />
          ))}
        </div>
      </div>
    </div>
  )
}
