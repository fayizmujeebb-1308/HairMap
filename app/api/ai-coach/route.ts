export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { message, history } = await req.json()
  if (!message?.trim()) return NextResponse.json({ error: 'No message' }, { status: 400 })

  // Fetch user context
  const [{ data: profile }, { data: stack }, { data: logs }, { data: photos }] = await Promise.all([
    supabase.from('profiles').select('first_name, norwood_stage, created_at, subscription_status').eq('user_id', user.id).single(),
    supabase.from('treatment_stack').select('treatment_name, dose, frequency').eq('user_id', user.id).eq('is_active', true),
    supabase.from('treatment_logs').select('taken_at').eq('user_id', user.id).order('taken_at', { ascending: false }).limit(90),
    supabase.from('progress_photos').select('angle').eq('user_id', user.id),
  ])

  const logDates = new Set((logs ?? []).map((l: { taken_at: string }) => l.taken_at.split('T')[0]))
  const daysTracked = Math.max(1, Math.floor((Date.now() - new Date(profile?.created_at ?? Date.now()).getTime()) / 86400000))
  const adherence = Math.min(100, Math.round((logDates.size / Math.min(daysTracked, 90)) * 100))
  let streak = 0
  const d = new Date()
  while (logDates.has(d.toISOString().split('T')[0])) { streak++; d.setDate(d.getDate() - 1) }

  const treatments = (stack ?? []).map(s => `${s.treatment_name}${s.dose ? ` ${s.dose}` : ''} (${s.frequency})`).join(', ') || 'none'
  const photoAngles = new Set((photos ?? []).map(p => p.angle)).size

  const systemPrompt = `You are HairMap's AI hair coach — a knowledgeable, direct, and supportive advisor for men managing hair loss.

User profile:
- Name: ${profile?.first_name ?? 'User'}
- Norwood stage: ${profile?.norwood_stage ? `NW${profile.norwood_stage}` : 'not assessed'}
- Active treatments: ${treatments}
- Days on treatment: ${daysTracked}
- Current streak: ${streak} days
- Treatment adherence: ${adherence}%
- Progress photos: ${photoAngles}/6 angles captured

Your role:
- Answer questions about hair loss, treatments (finasteride, minoxidil, ketoconazole, PRP, DHT blockers, supplements, etc.), and general scalp health
- Be specific and reference the user's actual data when relevant
- Be honest — if something is not proven to work, say so
- Never diagnose or prescribe — encourage consulting a dermatologist or trichologist for medical decisions
- Keep responses concise and readable on mobile — use short paragraphs, bullet points where helpful
- Do not repeat yourself across the conversation`

  const messages = [
    { role: 'system', content: systemPrompt },
    ...(history ?? []),
    { role: 'user', content: message },
  ]

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL ?? 'https://hair-map.vercel.app',
      'X-Title': 'HairMap Coach',
    },
    body: JSON.stringify({
      model: 'openai/gpt-4o-mini',
      messages,
      max_tokens: 500,
      stream: true,
    }),
  })

  if (!response.ok || !response.body) {
    return NextResponse.json({ error: 'AI service unavailable' }, { status: 502 })
  }

  // Stream response back to client
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) { controller.close(); break }
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '))
        for (const line of lines) {
          const data = line.slice(6)
          if (data === '[DONE]') { controller.close(); return }
          try {
            const json = JSON.parse(data)
            const token = json.choices?.[0]?.delta?.content ?? ''
            if (token) controller.enqueue(encoder.encode(token))
          } catch {}
        }
      }
    },
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff' },
  })
}
