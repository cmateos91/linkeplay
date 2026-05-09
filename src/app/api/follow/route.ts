import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { dev_id, email } = body as Record<string, unknown>

  if (!dev_id || typeof dev_id !== 'string') {
    return NextResponse.json({ error: 'dev_id requerido' }, { status: 400 })
  }
  if (!email || typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ error: 'Email no válido' }, { status: 400 })
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from('followers')
    .insert({ dev_id, email: email.trim().toLowerCase() })

  if (error) {
    // 23505 = unique_violation → ya estaba suscrito, tratamos como éxito
    if (error.code === '23505') {
      return NextResponse.json({ success: true })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
