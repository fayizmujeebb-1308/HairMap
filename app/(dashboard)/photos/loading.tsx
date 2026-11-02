export default function PhotosLoading() {
  return (
    <div className="space-y-4 pb-2 animate-pulse">
      <div className="pt-2">
        <div className="h-3 w-24 bg-gray-100 rounded-full mb-2" />
        <div className="h-7 w-28 bg-gray-100 rounded-full" />
      </div>
      {/* Upload button skeleton */}
      <div className="h-12 w-full rounded-2xl bg-gray-100" />
      {/* Angle tabs */}
      <div className="flex gap-2 overflow-hidden">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-8 w-20 rounded-full bg-gray-100 shrink-0" />
        ))}
      </div>
      {/* Photo grid */}
      <div className="grid grid-cols-2 gap-3">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="aspect-square rounded-2xl bg-gray-100" />
        ))}
      </div>
    </div>
  )
}
