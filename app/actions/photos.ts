'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function uploadPhoto(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const file  = formData.get('file') as File
  const angle = formData.get('angle') as string
  const notes = formData.get('notes') as string | null

  if (!file || !file.size) return { error: 'No file provided' }
  if (file.size > 15 * 1024 * 1024) return { error: 'File too large (max 15 MB)' }

  const ext  = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const path = `${user.id}/${angle}/${Date.now()}.${ext}`

  const { error: upErr } = await supabase.storage
    .from('progress-photos')
    .upload(path, file, { upsert: false, contentType: file.type })

  if (upErr) return { error: upErr.message }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage.from('progress-photos').getPublicUrl(path)

  // Upsert DB row — one row per angle (latest wins)
  const existing = await supabase
    .from('progress_photos')
    .select('id')
    .eq('user_id', user.id)
    .eq('angle', angle)
    .order('taken_at', { ascending: false })
    .limit(1)
    .single()

  if (existing.data) {
    await supabase
      .from('progress_photos')
      .insert({
        user_id:      user.id,
        angle,
        storage_path: path,
        thumb_path:   publicUrl,
        notes:        notes ?? null,
        taken_at:     new Date().toISOString(),
      })
  } else {
    await supabase
      .from('progress_photos')
      .insert({
        user_id:      user.id,
        angle,
        storage_path: path,
        thumb_path:   publicUrl,
        notes:        notes ?? null,
        taken_at:     new Date().toISOString(),
      })
  }

  revalidatePath('/photos')
  return { success: true, url: publicUrl }
}

export async function deletePhoto(photoId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: photo } = await supabase
    .from('progress_photos')
    .select('storage_path')
    .eq('id', photoId)
    .eq('user_id', user.id)
    .single()

  if (!photo) return { error: 'Photo not found' }

  await supabase.storage.from('progress-photos').remove([photo.storage_path])
  await supabase.from('progress_photos').delete().eq('id', photoId).eq('user_id', user.id)

  revalidatePath('/photos')
  return { success: true }
}
