'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Dev } from '@/types'

interface ProfileFormProps {
  dev: Dev | null
  userId: string
}

export default function ProfileForm({ dev, userId }: ProfileFormProps) {
  const router = useRouter()
  const isOnboarding = !dev

  const [username, setUsername] = useState(dev?.username ?? '')
  const [displayName, setDisplayName] = useState(dev?.display_name ?? '')
  const [bio, setBio] = useState(dev?.bio ?? '')
  const [discordUrl, setDiscordUrl] = useState(dev?.discord_invite_url ?? '')
  const [avatarUrl, setAvatarUrl] = useState(dev?.avatar_url ?? '')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)

    const supabase = createClient()

    if (isOnboarding) {
      const cleanUsername = username.trim().toLowerCase()
      if (!cleanUsername) {
        setError('El username es obligatorio.')
        setLoading(false)
        return
      }
      if (!/^[a-z0-9-]+$/.test(cleanUsername)) {
        setError('El username solo puede contener letras minúsculas, números y guiones.')
        setLoading(false)
        return
      }

      const { error } = await supabase.from('devs').insert({
        user_id: userId,
        username: cleanUsername,
        display_name: displayName.trim(),
        bio: bio.trim() || null,
        discord_invite_url: discordUrl.trim() || null,
        avatar_url: avatarUrl.trim() || null,
      })

      if (error) {
        setError(error.message.includes('unique') ? 'Ese username ya está en uso.' : error.message)
        setLoading(false)
        return
      }
    } else {
      const { error } = await supabase
        .from('devs')
        .update({
          display_name: displayName.trim(),
          bio: bio.trim() || null,
          discord_invite_url: discordUrl.trim() || null,
          avatar_url: avatarUrl.trim() || null,
        })
        .eq('user_id', userId)

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
    }

    setSuccess(true)
    setLoading(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-lg">
      {isOnboarding && (
        <div className="bg-indigo-950/50 border border-indigo-500/30 rounded-lg px-4 py-3 text-indigo-300 text-sm">
          Bienvenido. Configura tu perfil público para empezar.
        </div>
      )}

      {isOnboarding && (
        <Field label="Username (URL pública)" hint="Solo letras, números y guiones. Sin espacios.">
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
            placeholder="ej: martagarcia"
            className={inputCls}
          />
        </Field>
      )}

      <Field label="Nombre público">
        <input
          type="text"
          required
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Marta García"
          className={inputCls}
        />
      </Field>

      <Field label="Bio">
        <textarea
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Cuéntale algo a tus jugadores..."
          className={inputCls + ' resize-none'}
        />
      </Field>

      <Field label="URL de Discord">
        <input
          type="url"
          value={discordUrl}
          onChange={(e) => setDiscordUrl(e.target.value)}
          placeholder="https://discord.gg/..."
          className={inputCls}
        />
      </Field>

      <Field label="URL del avatar">
        <input
          type="url"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          placeholder="https://..."
          className={inputCls}
        />
      </Field>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      {success && <p className="text-green-400 text-sm">Guardado correctamente.</p>}

      <button
        type="submit"
        disabled={loading}
        className="self-start px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors"
      >
        {loading ? 'Guardando...' : isOnboarding ? 'Crear perfil' : 'Guardar cambios'}
      </button>
    </form>
  )
}

const inputCls =
  'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors text-sm'

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-white/70 text-sm font-medium">{label}</label>
      {hint && <span className="text-white/30 text-xs">{hint}</span>}
      {children}
    </div>
  )
}
