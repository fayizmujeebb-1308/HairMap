export default function CoachLoading() {
  return (
    <div className="space-y-4 pb-2 animate-pulse">
      <div className="pt-2">
        <div className="h-3 w-24 bg-gray-100 rounded-full mb-2" />
        <div className="h-7 w-36 bg-gray-100 rounded-full" />
      </div>
      {/* Chat messages */}
      <div className="space-y-3">
        {/* AI message */}
        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 rounded-full bg-gray-100 shrink-0" />
          <div className="flex-1 space-y-2 max-w-[80%]">
            <div className="h-3 bg-gray-100 rounded-full w-full" />
            <div className="h-3 bg-gray-100 rounded-full w-5/6" />
            <div className="h-3 bg-gray-100 rounded-full w-3/4" />
          </div>
        </div>
        {/* User message */}
        <div className="flex justify-end">
          <div className="max-w-[70%] space-y-2">
            <div className="h-8 bg-gray-100 rounded-2xl w-40" />
          </div>
        </div>
        {/* AI message */}
        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 rounded-full bg-gray-100 shrink-0" />
          <div className="flex-1 space-y-2 max-w-[80%]">
            <div className="h-3 bg-gray-100 rounded-full w-full" />
            <div className="h-3 bg-gray-100 rounded-full w-4/5" />
          </div>
        </div>
      </div>
      {/* Input box */}
      <div className="fixed bottom-20 left-4 right-4">
        <div className="h-12 rounded-2xl bg-gray-100" />
      </div>
    </div>
  )
}
