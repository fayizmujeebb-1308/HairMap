'use client'
import ErrorScreen from '@/app/components/ErrorScreen'

export default function LearnError({ reset }: { reset: () => void }) {
  return (
    <ErrorScreen
      title="Couldn't load articles"
      message="We had trouble loading the education library. Try again."
      reset={reset}
    />
  )
}
