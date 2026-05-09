import { createClient } from '@/lib/supabase/server'
import type { EventType } from '@/types'

const VALID_EVENT_TYPES: EventType[] = ['page_view', 'game_start', 'discord_click']

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { dev_id, game_id, event_type, session_id } = body

    if (!dev_id || !session_id) {
      return Response.json({ error: 'dev_id and session_id are required' }, { status: 400 })
    }

    if (!VALID_EVENT_TYPES.includes(event_type)) {
      return Response.json({ error: 'Invalid event_type' }, { status: 400 })
    }

    const supabase = await createClient()
    const { error } = await supabase.from('events').insert({
      dev_id,
      game_id: game_id ?? null,
      event_type,
      session_id,
    })

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return Response.json({ error: message }, { status: 500 })
  }
}
