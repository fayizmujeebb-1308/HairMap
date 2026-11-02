'use client'
import ErrorScreen from '@/app/components/ErrorScreen'

export default function StreakError({ reset }: { reset: () => void }) {
  return (
    <ErrorScreen
      title="Couldn't load streak"
      message="We had trouble fetching your streak data. Try again."
      reset={reset}
    />
  )
}
