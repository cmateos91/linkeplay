import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'Linkeplay <noreply@linkeplay.gg>'
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

  const normalizedEmail = email.trim().toLowerCase()
  const supabase = await createClient()

  const { error: insertError } = await supabase
    .from('followers')
    .insert({ dev_id, email: normalizedEmail })

  if (insertError) {
    if (insertError.code === '23505') {
      return NextResponse.json({ success: true })
    }
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  // Obtener token y datos del dev para el email de confirmación
  const [{ data: follower }, { data: dev }] = await Promise.all([
    supabase
      .from('followers')
      .select('unsubscribe_token')
      .eq('dev_id', dev_id)
      .eq('email', normalizedEmail)
      .single(),
    supabase
      .from('devs')
      .select('display_name, username')
      .eq('id', dev_id)
      .single(),
  ])

  if (dev && follower) {
    const unsubUrl = `https://linkeplay.gg/unsub?token=${follower.unsubscribe_token}`
    const profileUrl = `https://linkeplay.gg/${dev.username}`

    resend.emails.send({
      from: FROM,
      to: normalizedEmail,
      subject: `Ya sigues a ${dev.display_name} en Linkeplay 🎮`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#0a0a10;color:#f5f5f7;border-radius:12px">
          <p style="font-size:18px;font-weight:700;margin:0 0 12px">¡Suscripción confirmada!</p>
          <p style="color:#8e8e9c;margin:0 0 24px">
            Recibirás un aviso cuando <strong style="color:#f5f5f7">${dev.display_name}</strong> lance su próximo juego.
          </p>
          <a href="${profileUrl}" style="display:inline-block;background:#C2FF3E;color:#0a0a10;font-weight:700;padding:12px 24px;border-radius:8px;text-decoration:none;margin-bottom:24px">
            Ver perfil de ${dev.display_name}
          </a>
          <p style="font-size:12px;color:#6c6c78;margin:0">
            <a href="${unsubUrl}" style="color:#6c6c78">Cancelar suscripción</a>
          </p>
        </div>
      `,
    }).catch((err) => console.error('[follow] email error:', err))
  }

  return NextResponse.json({ success: true })
}
