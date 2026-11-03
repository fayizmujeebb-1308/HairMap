'use client'

import { useEffect, useState } from 'react'

// Detect if running inside Capacitor (native Android/iOS)
export function useIsNative() {
  const [isNative, setIsNative] = useState(false)

  useEffect(() => {
    // Capacitor sets window.Capacitor when running natively
    setIsNative(
      typeof window !== 'undefined' &&
        !!(window as typeof window & { Capacitor?: { isNativePlatform?: () => boolean } })
          .Capacitor?.isNativePlatform?.()
    )
  }, [])

  return isNative
}

// Takes a photo using native camera (Capacitor) or falls back to file input
export async function takePhoto(): Promise<File | null> {
  try {
    const { Camera, CameraResultType, CameraSource } = await import(
      '@capacitor/camera'
    )

    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt, // lets user choose camera or gallery
      width: 1280,
      height: 1280,
      correctOrientation: true,
    })

    if (!image.dataUrl) return null

    // Convert dataUrl to File
    const res = await fetch(image.dataUrl)
    const blob = await res.blob()
    const ext = image.format ?? 'jpeg'
    return new File([blob], `photo.${ext}`, { type: `image/${ext}` })
  } catch (err) {
    // User cancelled or permission denied
    console.warn('Native camera cancelled or unavailable:', err)
    return null
  }
}
