export default function ProgressLoading() {
  return (
    <div className="space-y-4 pb-2">

      {/* Header */}
      <div className="pt-2 space-y-2">
        <div className="skeleton h-2.5 w-16 rounded-full" />
        <div className="skeleton h-7 w-28 rounded-lg" />
      </div>

      {/* AI analysis card */}
      <div className="skeleton h-32 rounded-2xl" />

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[0,1,2].map(i => (
          <div key={i} className="skeleton h-20 rounded-2xl" />
        ))}
      </div>

      {/* Adherence ring + heatmap */}
      <div className="grid grid-cols-2 gap-3">
        <div className="skeleton h-36 rounded-2xl" />
        <div className="skeleton h-36 rounded-2xl" />
      </div>

      {/* Weekly chart */}
      <div className="skeleton h-48 rounded-2xl" />

      {/* Milestones */}
      <div className="skeleton h-3 w-24 rounded-full mx-1" />
      {[0,1,2,3,4].map(i => (
        <div key={i} className="skeleton h-14 rounded-2xl" />
      ))}

    </div>
  )
}
