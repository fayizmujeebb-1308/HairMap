'use client'

import { useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { uploadPhoto } from '@/app/actions/photos'

interface Props {
  angle:     string
  label:     string
  desc:      string
  photoUrl:  string | null
  photoId:   string | null
}

export default function PhotoSlot({ angle, label, desc, photoUrl: initialUrl }: Props) {
  const [url, setUrl]         = useState(initialUrl)
  const [pending, start]      = useTransition()
  const [error, setError]     = useState('')
  const [preview, setPreview] = useState(false)
  const inputRef              = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    setError('')
    if (file.size > 15 * 1024 * 1024) { setError('Max 15 MB'); return }

    // Optimistic preview
    const objectUrl = URL.createObjectURL(file)
    setUrl(objectUrl)

    const fd = new FormData()
    fd.set('file', file)
    fd.set('angle', angle)

    start(async () => {
      const res = await uploadPhoto(fd)
      if (res?.error) {
        setError(res.error)
        setUrl(initialUrl)
      } else if (res?.url) {
        URL.revokeObjectURL(objectUrl)
        setUrl(res.url)
      }
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) handleFile(file)
  }

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => !pending && inputRef.current?.click()}
        onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        className={`relative rounded-2xl border overflow-hidden aspect-[4/5] flex flex-col cursor-pointer select-none
          active:scale-[0.98] transition-transform
          ${url ? 'border-primary/20' : 'border-gray-100 bg-white'}`}
        style={{ borderWidth: '0.5px' }}
      >
        {/* Photo / placeholder area */}
        <div className="flex-1 relative overflow-hidden bg-gray-50">
          {url ? (
            <Image src={url} alt={label} fill className="object-cover" sizes="50vw" unoptimized />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-[10px] text-gray-300 font-medium">Tap to add</p>
            </div>
          )}

          {/* Loading overlay */}
          {pending && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <svg className="w-7 h-7 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            </div>
          )}

          {/* Uploaded — view full button */}
          {url && !pending && (
            <button
              onClick={e => { e.stopPropagation(); setPreview(true) }}
              className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/40 flex items-center justify-center active:scale-90 transition-transform"
            >
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </button>
          )}
        </div>

        {/* Label bar */}
        <div className="px-3 py-2.5 bg-white" style={{ borderTop: '0.5px solid #f3f4f6' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-800">{label}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{desc}</p>
            </div>
            {url
              ? <span className="text-[10px] text-primary font-semibold">✓ Done</span>
              : <span className="text-[10px] text-gray-300">+ Add</span>
            }
          </div>
          {error === 'UPGRADE_REQUIRED' ? (
            <p className="text-[10px] text-amber-600 mt-1">
              Photo limit reached.{' '}
              <Link href="/pricing" className="underline font-semibold" onClick={e => e.stopPropagation()}>Upgrade to Pro</Link>
            </p>
          ) : error ? (
            <p className="text-[10px] text-red-500 mt-1">{error}</p>
          ) : null}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleChange}
      />

      {/* Lightbox preview */}
      {preview && url && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setPreview(false)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90 transition-transform"
            onClick={() => setPreview(false)}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <Image src={url} alt={label} fill className="object-cover" sizes="90vw" unoptimized />
          </div>
          <p className="absolute bottom-10 left-0 right-0 text-center text-white/60 text-xs font-medium">{label} · tap outside to close</p>
        </div>
      )}
    </>
  )
}
