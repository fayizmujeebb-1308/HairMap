export default function LogLoading() {
  return (
    <div className="space-y-4 pb-2">

      {/* Header */}
      <div className="flex items-start justify-between pt-2">
        <div className="space-y-2">
          <div className="skeleton h-2.5 w-20 rounded-full" />
          <div className="skeleton h-7 w-40 rounded-lg" />
        </div>
        <div className="skeleton h-8 w-24 rounded-xl" />
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3">
        {[0,1,2].map(i => (
          <div key={i} className="skeleton h-20 rounded-2xl" />
        ))}
      </div>

      {/* Week view */}
      <div className="skeleton h-24 rounded-2xl" />

      {/* Section label */}
      <div className="skeleton h-3 w-20 rounded-full mx-1" />

      {/* Treatment rows */}
      {[0,1,2].map(i => (
        <div key={i} className="skeleton h-[72px] rounded-[18px]" />
      ))}

      {/* Second section */}
      <div className="skeleton h-3 w-16 rounded-full mx-1 mt-2" />
      {[0,1].map(i => (
        <div key={i} className="skeleton h-[72px] rounded-[18px]" />
      ))}

    </div>
  )
}
