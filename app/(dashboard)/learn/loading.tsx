export default function LearnLoading() {
  return (
    <div className="space-y-4 pb-2 animate-pulse">
      <div className="pt-2">
        <div className="h-3 w-24 bg-gray-100 rounded-full mb-2" />
        <div className="h-7 w-28 bg-gray-100 rounded-full" />
      </div>
      {/* Category chips */}
      <div className="flex gap-2 overflow-hidden">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-8 w-20 rounded-full bg-gray-100 shrink-0" />
        ))}
      </div>
      {/* Featured article */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--bg-card-border)' }}>
        <div className="h-40 bg-gray-100" />
        <div className="p-4 space-y-2">
          <div className="h-2.5 bg-gray-100 rounded-full w-16" />
          <div className="h-4 bg-gray-100 rounded-full w-4/5" />
          <div className="h-3 bg-gray-100 rounded-full w-full" />
          <div className="h-3 bg-gray-100 rounded-full w-3/4" />
        </div>
      </div>
      {/* Article list */}
      {[1,2,3,4].map(i => (
        <div key={i} className="flex gap-3 rounded-2xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--bg-card-border)' }}>
          <div className="w-20 h-20 rounded-xl bg-gray-100 shrink-0" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-2.5 bg-gray-100 rounded-full w-16" />
            <div className="h-3.5 bg-gray-100 rounded-full w-full" />
            <div className="h-3 bg-gray-100 rounded-full w-5/6" />
            <div className="h-2.5 bg-gray-100 rounded-full w-12" />
          </div>
        </div>
      ))}
    </div>
  )
}
