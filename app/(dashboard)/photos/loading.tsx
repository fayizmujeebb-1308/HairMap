export default function PhotosLoading() {
  return (
    <div className="space-y-5 pb-2">

      {/* Header */}
      <div className="flex items-start justify-between pt-2">
        <div className="space-y-2">
          <div className="skeleton h-2.5 w-16 rounded-full" />
          <div className="skeleton h-7 w-24 rounded-lg" />
        </div>
        <div className="space-y-1 text-right">
          <div className="skeleton h-7 w-10 rounded-lg ml-auto" />
          <div className="skeleton h-2.5 w-24 rounded-full ml-auto" />
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="skeleton h-2 rounded-full" />
        <div className="skeleton h-2.5 w-48 rounded-full" />
      </div>

      {/* Tip banner */}
      <div className="skeleton h-14 rounded-2xl" />

      {/* 2×3 photo grid */}
      <div className="grid grid-cols-2 gap-3">
        {[0,1,2,3,4,5].map(i => (
          <div key={i} className="skeleton aspect-[4/3] rounded-2xl" />
        ))}
      </div>

      {/* Tips card */}
      <div className="skeleton h-32 rounded-2xl" />

    </div>
  )
}
