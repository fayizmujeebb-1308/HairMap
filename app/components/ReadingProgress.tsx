'use client'
import { useEffect, useState } from 'react'

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-0.5 pointer-events-none"
      style={{ background: 'rgba(229,231,235,0.3)' }}
    >
      <div
        className="h-full transition-all duration-75"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #059669, #10b981)',
        }}
      />
    </div>
  )
}
