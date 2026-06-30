import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const secret = process.env.PADDLE_WEBHOOK_SECRET
  if (!secret) return NextResponse.json({ error: 'Misconfigured' }, { status: 500 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  // Verify Paddle signature
  const signature = req.headers.get('paddle-signature') ?? ''
  const body = await req.text()

  const valid = await verifyPaddleSignature(body, signature, secret)
  if (!valid) return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })

  const event = JSON.parse(body)
  const type: string = event.event_type ?? ''
  const data = event.data ?? {}

  // Extract customer email from subscription or transaction
  const email: string =
    data.customer?.email ??
    data.billing_details?.email ??
    ''

  if (!email) return NextResponse.json({ ok: true })

  // Map Paddle event → subscription_status
  let status: string | null = null

  if (type === 'subscription.activated' || type === 'subscription.updated') {
    const paddleStatus: string = data.status ?? ''
    if (paddleStatus === 'active') status = 'pro'
    else if (paddleStatus === 'trialing') status = 'trialing'
    else if (paddleStatus === 'past_due') status = 'past_due'
  } else if (type === 'subscription.canceled' || type === 'subscription.paused') {
    status = 'free'
  } else if (type === 'transaction.completed') {
    status = 'pro'
  }

  if (status) {
    await supabase
      .from('profiles')
      .update({
        subscription_status: status,
        paddle_subscription_id: data.id ?? null,
      })
      .eq('email', email)
  }

  return NextResponse.json({ ok: true })
}

async function verifyPaddleSignature(body: string, signature: string, secret: string): Promise<boolean> {
  try {
    // Paddle signature format: ts=TIMESTAMP;h1=HASH
    const parts: Record<string, string> = {}
    for (const part of signature.split(';')) {
      const [k, v] = part.split('=')
      parts[k] = v
    }
    const ts = parts['ts']
    const h1 = parts['h1']
    if (!ts || !h1) return false

    const payload = `${ts}:${body}`
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    )
    const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
    const hex = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')
    return hex === h1
  } catch {
    return false
  }
}
