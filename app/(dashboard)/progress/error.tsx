'use client'
import ErrorScreen from '@/app/components/ErrorScreen'

export default function ProgressError({ reset }: { reset: () => void }) {
  return (
    <ErrorScreen
      title="Couldn't load progress"
      message="We had trouble fetching your progress data. Try again."
      reset={reset}
    />
  )
}
