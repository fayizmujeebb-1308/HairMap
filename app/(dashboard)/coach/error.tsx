'use client'
import ErrorScreen from '@/app/components/ErrorScreen'

export default function CoachError({ reset }: { reset: () => void }) {
  return (
    <ErrorScreen
      title="Coach unavailable"
      message="The AI coach couldn't be reached right now. Check your connection and try again."
      reset={reset}
    />
  )
}
