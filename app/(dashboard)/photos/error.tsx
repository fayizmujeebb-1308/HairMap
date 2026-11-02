'use client'
import ErrorScreen from '@/app/components/ErrorScreen'

export default function PhotosError({ reset }: { reset: () => void }) {
  return (
    <ErrorScreen
      title="Couldn't load photos"
      message="We had trouble fetching your progress photos. Try again."
      reset={reset}
    />
  )
}
