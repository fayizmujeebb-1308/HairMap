'use client'

import { useRef, useState, useCallback, useEffect } from 'react'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS   = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'))
const CY     = new Date().getFullYear()
const YEARS  = Array.from({ length: 81 }, (_, i) => String(CY - i))
const ITEM_H = 46

/* ── Very subtle soft tick ── */
let sharedCtx: AudioContext | null = null
function getAC() {
  if (!sharedCtx || sharedCtx.state === 'closed') sharedCtx = new AudioContext()
  if (sharedCtx.state === 'suspended') sharedCtx.resume()
  return sharedCtx
}
function playTick() {
  try {
    const ac  = getAC()
    const now = ac.currentTime
    const osc = ac.createOscillator()
    const g   = ac.createGain()
    osc.type  = 'sine'
    osc.frequency.value = 900
    g.gain.setValueAtTime(0.06, now)
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.018)
    osc.connect(g)
    g.connect(ac.destination)
    osc.start(now)
    osc.stop(now + 0.02)
  } catch (_) {}
}

/* ── Column ── */
interface ColProps { items: string[]; selected: number; onChange: (i: number) => void; label: string }

function Column({ items, selected, onChange, label }: ColProps) {
  const offsetRef   = useRef(selected * ITEM_H)
  const rafRef      = useRef<number | null>(null)
  const lastTick    = useRef(selected)
  const ptrY        = useRef(0)
  const dragging    = useRef(false)
  const wheelTimer  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [off, setOff]         = useState(selected * ITEM_H)
  const [hovered, setHovered] = useState<number | null>(null)

  const clamp = (v: number) => Math.max(0, Math.min((items.length - 1) * ITEM_H, v))

  const checkCross = (newOff: number) => {
    const idx = Math.max(0, Math.min(items.length - 1, Math.round(newOff / ITEM_H)))
    if (idx !== lastTick.current) { lastTick.current = idx; playTick(); onChange(idx) }
  }

  /* Spring-snap to a target offset — no flywheel momentum */
  const springTo = useCallback((target: number) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    const step = () => {
      const dist = target - offsetRef.current
      if (Math.abs(dist) < 0.4) {
        offsetRef.current = target
        setOff(target)
        const finalIdx = Math.round(target / ITEM_H)
        if (finalIdx !== lastTick.current) { lastTick.current = finalIdx; onChange(finalIdx) }
        rafRef.current = null
        return
      }
      offsetRef.current += dist * 0.22
      setOff(offsetRef.current)
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
  }, [onChange])

  useEffect(() => {
    if (!dragging.current) {
      offsetRef.current = selected * ITEM_H
      lastTick.current  = selected
      setOff(selected * ITEM_H)
    }
  }, [selected])

  /* Pointer drag — stops the moment finger/mouse lifts or leaves */
  const onPointerDown = (e: React.PointerEvent) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    dragging.current = true
    ptrY.current = e.clientY
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return
    const dy = ptrY.current - e.clientY
    offsetRef.current = clamp(offsetRef.current + dy)
    setOff(offsetRef.current)
    checkCross(offsetRef.current)
    ptrY.current = e.clientY
  }

  const stopDrag = () => {
    if (!dragging.current) return
    dragging.current = false
    // Snap to nearest — no coasting
    springTo(Math.round(offsetRef.current / ITEM_H) * ITEM_H)
  }

  /* Wheel — discrete step per event; debounce-snap so trackpad inertia doesn't overshoot */
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    if (wheelTimer.current) clearTimeout(wheelTimer.current)

    // Normalise delta to "lines" regardless of deltaMode
    const lines = e.deltaMode === 1 ? e.deltaY
                : e.deltaMode === 2 ? e.deltaY * 3
                : e.deltaY / 40

    // Move offset proportionally but gently
    const newOff = clamp(offsetRef.current + lines * ITEM_H * 0.18)
    offsetRef.current = newOff
    setOff(newOff)
    checkCross(newOff)

    // After trackpad inertia dies down, snap to nearest
    wheelTimer.current = setTimeout(() => {
      springTo(Math.round(offsetRef.current / ITEM_H) * ITEM_H)
    }, 120)
  }

  const curIdx = Math.max(0, Math.min(items.length - 1, Math.round(off / ITEM_H)))
  const ty     = ITEM_H - off

  return (
    <div className="flex-1 flex flex-col items-center min-w-0">
      <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase py-2 select-none">{label}</p>

      <div
        className="relative w-full overflow-hidden select-none"
        style={{ height: ITEM_H * 3 }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stopDrag}
        onPointerLeave={stopDrag}
        onWheel={onWheel}
      >
        {/* top fade */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10"
          style={{ height: ITEM_H * 1.2, background: 'linear-gradient(to bottom,white 20%,transparent)' }} />
        {/* bottom fade */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10"
          style={{ height: ITEM_H * 1.2, background: 'linear-gradient(to top,white 20%,transparent)' }} />

        {/* selection band */}
        <div className="pointer-events-none absolute inset-x-1.5 z-0 rounded-xl"
          style={{
            top: ITEM_H, height: ITEM_H,
            background: 'linear-gradient(135deg,rgba(29,158,117,.07),rgba(29,158,117,.13))',
            border: '0.5px solid rgba(29,158,117,.22)',
          }} />

        <div style={{ transform: `translateY(${ty}px)`, willChange: 'transform' }}>
          {items.map((item, i) => {
            const dist  = Math.abs(i - curIdx)
            const isSel = i === curIdx
            const isHov = hovered === i && !dragging.current
            return (
              <div
                key={item}
                style={{ height: ITEM_H, opacity: isSel ? 1 : dist === 1 ? 0.4 : dist === 2 ? 0.14 : 0.05,
                  transition: 'opacity 0.12s ease' }}
                className="flex items-center justify-center"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => springTo(i * ITEM_H)}
              >
                <span style={{
                  fontSize: isSel ? 16 : dist === 1 ? 13 : 11,
                  color: isSel ? '#1D9E75' : '#6b7280',
                  fontWeight: isSel ? 600 : 400,
                  display: 'inline-block',
                  transform: isHov ? 'scale(1.11)' : isSel ? 'scale(1.04)' : 'scale(1)',
                  transition: 'transform 0.14s cubic-bezier(.34,1.56,.64,1), font-size 0.12s ease, color 0.12s ease',
                  letterSpacing: isSel ? '0.02em' : '0',
                  cursor: 'pointer',
                }}>
                  {item}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ── Public component ── */
interface DateScrollPickerProps { value: string; onChange: (v: string) => void }

export default function DateScrollPicker({ value, onChange }: DateScrollPickerProps) {
  const parsed = value ? new Date(value + 'T12:00:00') : null
  const [month, setMonth] = useState(parsed ? parsed.getMonth() : 0)
  const [day,   setDay]   = useState(parsed ? parsed.getDate() - 1 : 0)
  const [year,  setYear]  = useState(() => {
    if (!parsed) return 25
    const i = YEARS.indexOf(String(parsed.getFullYear()))
    return i >= 0 ? i : 25
  })
  const [manual,    setManual]    = useState(false)
  const [manualVal, setManualVal] = useState(
    parsed
      ? `${String(parsed.getMonth()+1).padStart(2,'0')}/${String(parsed.getDate()).padStart(2,'0')}/${parsed.getFullYear()}`
      : ''
  )

  const emit = useCallback((m: number, d: number, y: number) => {
    onChange(`${YEARS[y]}-${String(m+1).padStart(2,'0')}-${String(d+1).padStart(2,'0')}`)
  }, [onChange])

  const hM = (i: number) => { setMonth(i); emit(i, day, year) }
  const hD = (i: number) => { setDay(i);   emit(month, i, year) }
  const hY = (i: number) => { setYear(i);  emit(month, day, i) }

  const onManualKey = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/[^\d/]/g, '')
    if (v.length === 2 && !v.includes('/')) v += '/'
    if (v.length === 5 && v.split('/').length === 2) v += '/'
    v = v.slice(0, 10)
    setManualVal(v)
    const m = v.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
    if (m) {
      const mo = parseInt(m[1]) - 1, dy = parseInt(m[2]) - 1, yr = YEARS.indexOf(m[3])
      if (mo >= 0 && mo < 12 && dy >= 0 && dy < 31 && yr >= 0) {
        setMonth(mo); setDay(dy); setYear(yr); emit(mo, dy, yr)
      }
    }
  }

  const displayDate = `${MONTHS[month]} ${String(day+1).padStart(2,'0')}, ${YEARS[year]}`

  return (
    <div className="rounded-2xl bg-white overflow-hidden"
      style={{ border: '0.5px solid #e5e7eb', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>

      <div className="flex divide-x divide-gray-100">
        <Column items={MONTHS} selected={month} onChange={hM} label="Month" />
        <Column items={DAYS}   selected={day}   onChange={hD} label="Day"   />
        <Column items={YEARS}  selected={year}  onChange={hY} label="Year"  />
      </div>

      <div className="flex items-center justify-between px-4 py-2"
        style={{ borderTop: '0.5px solid #f3f4f6' }}>
        <span className="text-xs text-gray-400 font-medium tracking-wide">{displayDate}</span>
        <button type="button" onClick={() => setManual(m => !m)}
          className="text-[11px] text-primary hover:text-primary-dark transition-colors font-medium">
          {manual ? 'Use scroll' : 'Type manually'}
        </button>
      </div>

      {manual && (
        <div className="px-4 pb-4">
          <input
            type="text" value={manualVal} onChange={onManualKey}
            placeholder="MM/DD/YYYY" maxLength={10}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-center font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            style={{ borderWidth: '0.5px', letterSpacing: '0.1em' }}
          />
          <p className="text-[10px] text-gray-400 text-center mt-1.5">MM/DD/YYYY</p>
        </div>
      )}
    </div>
  )
}
