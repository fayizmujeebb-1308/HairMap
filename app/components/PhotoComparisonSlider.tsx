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
  const [hinted, setHinted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const x = Math.max(2, Math.min(clientX - rect.left, rect.width - 2))
    setPosition((x / rect.width) * 100)
    setHinted(true)
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
      <p className="text-[10px] uppercase tracking-widest font-semibold capitalize"
        style={{ color: 'var(--text-tertiary)' }}>{angle}</p>

      <div
        ref={containerRef}
        className="relative aspect-square rounded-2xl overflow-hidden select-none touch-none"
        style={{
          cursor: dragging ? 'col-resize' : 'ew-resize',
          background: 'var(--bg-card)',
        }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        {/* After (Latest) — full base layer */}
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

        {/* Before (First) — clipped with clip-path for perfectly smooth slide */}
        <div
          className="absolute inset-0"
          style={{
            clipPath: `inset(0 ${100 - position}% 0 0)`,
            willChange: 'clip-path',
          }}
        >
          <Image
            src={beforeSrc}
            alt={`${angle} first`}
            fill
            className="object-cover"
            sizes="85vw"
            unoptimized
          />
        </div>

        {/* Divider line — glows green */}
        <div
          className="absolute top-0 bottom-0 z-10 pointer-events-none"
          style={{
            left: `${position}%`,
            width: 2,
            transform: 'translateX(-50%)',
            background: 'linear-gradient(to bottom, rgba(16,185,129,0.6), white, rgba(16,185,129,0.6))',
            boxShadow: '0 0 12px rgba(16,185,129,0.5), 0 0 4px rgba(255,255,255,0.8)',
          }}
        />

        {/* Glass handle */}
        <div
          className="absolute top-1/2 z-20 flex items-center justify-center"
          style={{
            left: `${position}%`,
            transform: 'translate(-50%, -50%)',
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(12px) saturate(1.8)',
            WebkitBackdropFilter: 'blur(12px) saturate(1.8)',
            border: '1.5px solid rgba(16,185,129,0.4)',
            boxShadow: '0 2px 16px rgba(16,185,129,0.25), 0 1px 4px rgba(0,0,0,0.15)',
            willChange: 'transform',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M5 4L2 8L5 12M11 4L14 8L11 12"
              stroke="var(--color-primary)" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Labels */}
        <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
          <span className="text-[9px] text-white font-semibold px-1.5 py-0.5 rounded-md"
            style={{ background: 'rgba(0,0,0,0.50)' }}>{beforeLabel}</span>
        </div>
        <div className="absolute bottom-2 right-2 z-10 pointer-events-none">
          <span className="text-[9px] text-white font-semibold px-1.5 py-0.5 rounded-md"
            style={{ background: 'rgba(16,185,129,0.80)' }}>{afterLabel}</span>
        </div>
      </div>

      {/* Hint — fades out after first drag */}
      <p className="text-[10px] text-center transition-opacity duration-500"
        style={{ color: 'var(--text-tertiary)', opacity: hinted ? 0 : 1 }}>
        ← drag to compare →
      </p>
    </div>
  )
}
