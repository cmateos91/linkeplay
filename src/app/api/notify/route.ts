import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'Linkeplay <noreply@linkeplay.gg>'

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { dev_id, message } = body as Record<string, unknown>

  if (!dev_id || typeof dev_id !== 'string') {
    return NextResponse.json({ error: 'dev_id requerido' }, { status: 400 })
  }
  if (!message || typeof message !== 'string' || !message.trim()) {
    return NextResponse.json({ error: 'message requerido' }, { status: 400 })
  }

  const supabase = await createClient()

  // Verificar que el usuario autenticado es el dueño del dev
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const { data: dev } = await supabase
    .from('devs')
    .select('id, display_name, username')
    .eq('id', dev_id)
    .eq('user_id', user.id)
    .single()

  if (!dev) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  // Obtener todos los seguidores
  const { data: followers, error: followersError } = await supabase
    .from('followers')
    .select('email, unsubscribe_token')
    .eq('dev_id', dev_id)

  if (followersError) {
    return NextResponse.json({ error: followersError.message }, { status: 500 })
  }

  if (!followers || followers.length === 0) {
    return NextResponse.json({ sent: 0 })
  }

  const profileUrl = `https://linkeplay.gg/${dev.username}`

  const emails = followers.map((f) => ({
    from: FROM,
    to: f.email,
    subject: `${dev.display_name} tiene novedades para ti 🎮`,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#0a0a10;color:#f5f5f7;border-radius:12px">
        <p style="font-size:18px;font-weight:700;margin:0 0 12px">${dev.display_name} tiene novedades</p>
        <p style="color:#f5f5f7;margin:0 0 24px;line-height:1.6;white-space:pre-line">${message.trim()}</p>
        <a href="${profileUrl}" style="display:inline-block;background:#C2FF3E;color:#0a0a10;font-weight:700;padding:12px 24px;border-radius:8px;text-decoration:none;margin-bottom:24px">
          Ver perfil
        </a>
        <p style="font-size:12px;color:#6c6c78;margin:0">
          <a href="https://linkeplay.gg/unsub?token=${f.unsubscribe_token}" style="color:#6c6c78">Cancelar suscripción</a>
        </p>
      </div>
    `,
  }))

  // Resend admite hasta 100 emails por batch; dividimos si hace falta
  const BATCH_SIZE = 100
  let sent = 0

  for (let i = 0; i < emails.length; i += BATCH_SIZE) {
    const batch = emails.slice(i, i + BATCH_SIZE)
    const { data, error } = await resend.batch.send(batch)
    if (error) {
      console.error('[notify] batch error:', error)
    } else {
      sent += data?.data?.length ?? batch.length
    }
  }

  return NextResponse.json({ sent })
}
