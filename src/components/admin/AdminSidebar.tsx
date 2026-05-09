'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const NAV = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/profile', label: 'Mi perfil' },
  { href: '/admin/games', label: 'Mis juegos' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="w-52 shrink-0 bg-neutral-900 border-r border-white/10 flex flex-col">
      <div className="px-4 py-5 border-b border-white/10">
        <span className="text-white font-bold text-sm">Linkeplay</span>
      </div>

      <nav className="flex-1 py-4 flex flex-col gap-1 px-2">
        {NAV.map(({ href, label }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-white/10 text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-2 pb-4">
        <button
          onClick={handleLogout}
          className="w-full px-3 py-2 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 text-left transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
