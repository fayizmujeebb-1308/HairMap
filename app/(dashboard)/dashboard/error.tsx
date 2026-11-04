'use client'
import ErrorScreen from '@/app/components/ErrorScreen'

export default function DashboardError({ reset }: { reset: () => void }) {
  return (
    <ErrorScreen
      title="Couldn't load dashboard"
      message="We had trouble fetching your data. Check your connection and try again."
      reset={reset}
    />
  )
}
