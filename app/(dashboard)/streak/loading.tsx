export default function StreakLoading() {
  return (
    <div className="space-y-4 pb-2 animate-pulse">
      <div className="flex items-center gap-3 pt-2">
        <div className="skeleton w-8 h-8 rounded-xl shrink-0" />
        <div className="space-y-1.5">
          <div className="skeleton h-2 w-16 rounded-full" />
          <div className="skeleton h-6 w-28 rounded-lg" />
        </div>
      </div>

      {/* Hero card */}
      <div className="skeleton rounded-[20px] h-44" />

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="skeleton rounded-2xl h-20" />
        ))}
      </div>

      {/* Heatmap */}
      <div className="skeleton rounded-[20px] h-48" />

      {/* Milestones */}
      <div className="skeleton rounded-[20px] h-96" />
    </div>
  )
}
