import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import GamesClient from '@/components/admin/GamesClient'
import type { Dev, Game } from '@/types'

export default async function GamesPage() {
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
        <h1 className="text-xl font-bold text-white mb-2">Mis juegos</h1>
        <p className="text-white/50 text-sm">
          Primero crea tu perfil en{' '}
          <a href="/admin/profile" className="text-indigo-400 underline">Mi perfil</a>.
        </p>
      </div>
    )
  }

  const { data: games } = await supabase
    .from('games')
    .select('*')
    .eq('dev_id', dev.id)
    .order('sort_order', { ascending: true })

  return <GamesClient initialGames={(games as Game[]) ?? []} devId={dev.id} />
}
