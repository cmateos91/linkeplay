import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Dev, Game } from '@/types'
import ProfileClient from '@/components/ProfileClient'

interface PageProps {
  params: Promise<{ username: string }>
}

export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params
  const supabase = await createClient()

  const { data: dev } = await supabase
    .from('devs')
    .select('*')
    .eq('username', username)
    .single<Dev>()

if (!dev) notFound()

  const { data: games } = await supabase
    .from('games')
    .select('*')
    .eq('dev_id', dev.id)
    .eq('is_published', true)
    .order('sort_order', { ascending: true })

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#0f0f0f' }}>
      <ProfileClient dev={dev} games={(games as Game[]) ?? []} />
    </main>
  )
}
