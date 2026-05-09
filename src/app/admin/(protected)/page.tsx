import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Dev } from '@/types'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: dev } = await supabase
    .from('devs')
    .select('id')
    .eq('user_id', user.id)
    .single<Pick<Dev, 'id'>>()

  if (!dev) {
    return (
      <div>
        <h1 className="text-xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-white/50 text-sm">
          Aún no tienes perfil. Ve a{' '}
          <a href="/admin/profile" className="text-indigo-400 underline">Mi perfil</a>{' '}
          para crearlo.
        </p>
      </div>
    )
  }

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const [
    { count: pageViews },
    { count: discordClicks },
    { data: gameStartEvents },
  ] = await Promise.all([
    supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
      .eq('dev_id', dev.id)
      .eq('event_type', 'page_view')
      .gte('created_at', sevenDaysAgo),
    supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
      .eq('dev_id', dev.id)
      .eq('event_type', 'discord_click')
      .gte('created_at', sevenDaysAgo),
    supabase
      .from('events')
      .select('game_id')
      .eq('dev_id', dev.id)
      .eq('event_type', 'game_start')
      .gte('created_at', sevenDaysAgo)
      .not('game_id', 'is', null),
  ])

  const gameStarts = gameStartEvents?.length ?? 0

  const gameCounts = (gameStartEvents ?? []).reduce<Record<string, number>>(
    (acc, e) => { acc[e.game_id] = (acc[e.game_id] || 0) + 1; return acc },
    {}
  )
  const topGameId = Object.entries(gameCounts).sort(([, a], [, b]) => b - a)[0]?.[0]
  let topGameTitle: string | null = null
  if (topGameId) {
    const { data: game } = await supabase
      .from('games')
      .select('title')
      .eq('id', topGameId)
      .single()
    topGameTitle = game?.title ?? null
  }

  const stats = [
    { label: 'Visitas (7 días)', value: pageViews ?? 0 },
    { label: 'Partidas iniciadas', value: gameStarts },
    { label: 'Clicks en Discord', value: discordClicks ?? 0 },
    { label: 'Juego más jugado', value: topGameTitle ?? '—' },
  ]

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col gap-2"
          >
            <span className="text-white/40 text-xs font-medium uppercase tracking-wide">
              {label}
            </span>
            <span className="text-white text-3xl font-bold leading-none">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
