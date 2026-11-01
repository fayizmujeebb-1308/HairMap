export default function CoachLoading() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">

      {/* Header */}
      <div className="flex items-center justify-between pt-2 pb-4 shrink-0">
        <div className="space-y-2">
          <div className="skeleton h-2.5 w-8 rounded-full" />
          <div className="skeleton h-7 w-28 rounded-lg" />
        </div>
        <div className="skeleton h-7 w-24 rounded-xl" />
      </div>

      {/* Chat area — bubbles */}
      <div className="flex-1 space-y-4 overflow-hidden">
        {/* AI bubble */}
        <div className="flex gap-3">
          <div className="skeleton w-8 h-8 rounded-xl shrink-0" />
          <div className="skeleton h-20 w-64 rounded-2xl rounded-tl-sm" />
        </div>
        {/* User bubble */}
        <div className="flex justify-end">
          <div className="skeleton h-12 w-48 rounded-2xl rounded-tr-sm" />
        </div>
        {/* AI bubble */}
        <div className="flex gap-3">
          <div className="skeleton w-8 h-8 rounded-xl shrink-0" />
          <div className="skeleton h-28 w-72 rounded-2xl rounded-tl-sm" />
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 pt-3">
        <div className="skeleton h-12 rounded-2xl" />
      </div>

    </div>
  )
}
