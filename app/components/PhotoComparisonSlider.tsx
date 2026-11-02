'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import Image from 'next/image'

interface Props {
  beforeSrc: string
  afterSrc: string
  angle: string
  beforeLabel?: string
  afterLabel?: string
}

export default function PhotoComparisonSlider({
  beforeSrc,
  afterSrc,
  angle,
  beforeLabel = 'First',
  afterLabel = 'Latest',
}: Props) {
  const [position, setPosition] = useState(50)
  const [dragging, setDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    setPosition((x / rect.width) * 100)
  }, [])

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setDragging(true)
    updatePosition(e.clientX)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    setDragging(true)
    updatePosition(e.touches[0].clientX)
  }

  useEffect(() => {
    if (!dragging) return
    const onMove = (e: MouseEvent) => updatePosition(e.clientX)
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      updatePosition(e.touches[0].clientX)
    }
    const onUp = () => setDragging(false)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onUp)
    }
  }, [dragging, updatePosition])

  return (
    <div className="space-y-2">
      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold capitalize">{angle}</p>
      <div
        ref={containerRef}
        className="relative aspect-square rounded-2xl overflow-hidden select-none touch-none"
        style={{ cursor: dragging ? 'col-resize' : 'ew-resize', background: '#f3f4f6' }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        {/* After (Latest) — full width base */}
        <div className="absolute inset-0">
          <Image
            src={afterSrc}
            alt={`${angle} latest`}
            fill
            className="object-cover"
            sizes="85vw"
            unoptimized
          />
        </div>

        {/* Before (First) — clipped to left of slider */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${position}%` }}
        >
          <div className="absolute inset-0" style={{ width: `${100 / (position / 100)}%` }}>
            <Image
              src={beforeSrc}
              alt={`${angle} first`}
              fill
              className="object-cover"
              sizes="85vw"
              unoptimized
            />
          </div>
        </div>

        {/* Divider line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 z-10"
          style={{
            left: `${position}%`,
            background: 'white',
            boxShadow: '0 0 8px rgba(0,0,0,0.4)',
            transform: 'translateX(-50%)',
          }}
        />

        {/* Handle */}
        <div
          className="absolute top-1/2 z-20 flex items-center justify-center"
          style={{
            left: `${position}%`,
            transform: 'translate(-50%, -50%)',
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'white',
            boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M5 4L2 8L5 12M11 4L14 8L11 12" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Labels */}
        <div className="absolute bottom-2 left-2 z-10">
          <span className="text-[9px] text-white font-semibold px-1.5 py-0.5 rounded"
            style={{ background: 'rgba(0,0,0,0.55)' }}>{beforeLabel}</span>
        </div>
        <div className="absolute bottom-2 right-2 z-10">
          <span className="text-[9px] text-white font-semibold px-1.5 py-0.5 rounded"
            style={{ background: 'rgba(16,185,129,0.75)' }}>{afterLabel}</span>
        </div>
      </div>

      {/* Hint */}
      <p className="text-[10px] text-gray-400 text-center">← drag to compare →</p>
    </div>
  )
}
