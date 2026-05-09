import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProfileForm from '@/components/admin/ProfileForm'
import type { Dev } from '@/types'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: dev } = await supabase
    .from('devs')
    .select('*')
    .eq('user_id', user.id)
    .single<Dev>()

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-6">
        {dev ? 'Mi perfil' : 'Crear perfil'}
      </h1>
      <ProfileForm dev={dev ?? null} userId={user.id} />
    </div>
  )
}
