'use client'
import ErrorScreen from '@/app/components/ErrorScreen'

export default function AccountError({ reset }: { reset: () => void }) {
  return (
    <ErrorScreen
      title="Couldn't load account"
      message="We had trouble fetching your account details. Try again."
      reset={reset}
    />
  )
}
