export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Whitelist: owner account bypasses rate limit
  const WHITELISTED = ['b0d806de-9c91-4a57-be07-d524afb368cc']
  const isWhitelisted = WHITELISTED.includes(user.id)

  // Rate limit: 1 analysis per 30 days for regular users
  if (!isWhitelisted) {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const { data: recentAnalysis } = await supabase
      .from('ai_analyses')
      .select('id, created_at')
      .eq('user_id', user.id)
      .gte('created_at', thirtyDaysAgo.toISOString())
      .limit(1)
      .maybeSingle()

    if (recentAnalysis) {
      const nextAvailable = new Date(recentAnalysis.created_at)
      nextAvailable.setDate(nextAvailable.getDate() + 30)
      return NextResponse.json({
        error: `Next analysis available on ${nextAvailable.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}.`,
      }, { status: 429 })
    }
  }

  // Fetch everything needed
  const [{ data: profile }, { data: photos }, { data: logs }, { data: stack }] = await Promise.all([
    supabase.from('profiles').select('first_name, norwood_stage, created_at').eq('user_id', user.id).single(),
    supabase.from('progress_photos').select('taken_at, angle, storage_path').eq('user_id', user.id).order('taken_at', { ascending: true }),
    supabase.from('treatment_logs').select('taken_at').eq('user_id', user.id).order('taken_at', { ascending: false }),
    supabase.from('treatment_stack').select('treatment_name, frequency').eq('user_id', user.id).eq('is_active', true),
  ])

  // Calculate stats
  const logDates = new Set((logs ?? []).map((l: { taken_at: string }) => l.taken_at.split('T')[0]))
  const daysTracked = Math.max(1, Math.floor((Date.now() - new Date(profile?.created_at ?? Date.now()).getTime()) / 86400000))
  const adherence = Math.min(100, Math.round((logDates.size / daysTracked) * 100))

  // Streak
  let streak = 0
  const d = new Date()
  while (logDates.has(d.toISOString().split('T')[0])) { streak++; d.setDate(d.getDate() - 1) }

  const treatments = (stack ?? []).map((s: { treatment_name: string; frequency: string }) => s.treatment_name).join(', ') || 'None logged'
  const photoCount = (photos ?? []).length
  const norwood = profile?.norwood_stage ? `Stage ${profile.norwood_stage}` : 'Not assessed'

  // Get signed URLs for up to 6 photos (spread across timeline)
  const selectedPhotos = photos && photos.length > 0
    ? photos.filter((_: unknown, i: number, arr: unknown[]) => i === 0 || i === arr.length - 1 || i % Math.max(1, Math.floor(arr.length / 4)) === 0).slice(0, 6)
    : []

  const photoUrls: string[] = []
  for (const photo of selectedPhotos) {
    const { data } = await supabase.storage.from('progress-photos').createSignedUrl(photo.storage_path, 300)
    if (data?.signedUrl) photoUrls.push(data.signedUrl)
  }

  // Build prompt
  const statsText = `
User: ${profile?.first_name ?? 'User'}
Starting Norwood stage: ${norwood}
Days tracked: ${daysTracked}
Treatment adherence: ${adherence}%
Current streak: ${streak} days
Total doses logged: ${logs?.length ?? 0}
Active treatments: ${treatments}
Progress photos taken: ${photoCount}
  `.trim()

  const messages: { role: string; content: unknown }[] = [
    {
      role: 'system',
      content: `You are a hair loss progress analyst for HairMap, a men's hair tracking app.
Your job is to give a specific, honest, useful analysis — not generic advice.
${photoUrls.length > 0 ? `You have been given progress photos. Look carefully at each one and describe what you actually see: hair density, hairline shape, crown coverage, any visible thinning patterns, scalp visibility. Be specific about what you observe in the images — do not be vague.` : ''}
Structure your response in exactly these sections with bold headers:
- **What I See** (describe specifically what the photos show OR if no photos, what the tracking data reveals about their habits)
- **Treatment Adherence** (specific comment on their ${adherence}% adherence and ${streak}-day streak — is this good or bad?)
- **What's Working** (specific positives — be honest, don't invent positives if there aren't any)
- **What to Watch** (specific concern or area to improve — no diagnoses, no medical claims)
- **Your Next 30 Days** (one concrete, specific action they should take)
Be direct and specific. No filler sentences. No "it's great that you're tracking". Under 280 words.`,
    },
    {
      role: 'user',
      content: photoUrls.length > 0
        ? [
            { type: 'text', text: `My hair loss tracking data:\n\n${statsText}\n\nAnalyse my progress based on this data and the photos below. Be specific about what you see in the photos.` },
            ...photoUrls.map(url => ({ type: 'image_url', image_url: { url } })),
          ]
        : `My hair loss tracking data:\n\n${statsText}\n\nNo photos uploaded yet. Analyse my progress based on the tracking data only and be specific about what the numbers mean.`,
    },
  ]

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL ?? 'https://hair-map.vercel.app',
      'X-Title': 'HairMap',
    },
    body: JSON.stringify({
      model: photoUrls.length > 0 ? 'openai/gpt-4o' : 'openai/gpt-4o-mini',
      messages,
      max_tokens: 600,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    console.error('OpenRouter error:', err)
    return NextResponse.json({ error: 'AI service unavailable' }, { status: 502 })
  }

  const result = await response.json()
  const analysis = result.choices?.[0]?.message?.content ?? ''

  // Save analysis to DB
  await supabase.from('ai_analyses').insert({
    user_id: user.id,
    analysis,
    adherence,
    streak,
    photo_count: photoCount,
    treatments,
  }).select()

  return NextResponse.json({ analysis, adherence, streak, daysTracked })
}
