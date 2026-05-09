'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Game } from '@/types'

interface GamesClientProps {
  initialGames: Game[]
  devId: string
}

const emptyForm = {
  title: '',
  description: '',
  thumbnail_url: '',
  game_url: '',
}

type FormData = typeof emptyForm

export default function GamesClient({ initialGames, devId }: GamesClientProps) {
  const router = useRouter()
  const [games, setGames] = useState<Game[]>(initialGames)
  const [showForm, setShowForm] = useState(false)
  const [editingGame, setEditingGame] = useState<Game | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  function openAdd() {
    setEditingGame(null)
    setForm(emptyForm)
    setFormError(null)
    setShowForm(true)
  }

  function openEdit(game: Game) {
    setEditingGame(game)
    setForm({
      title: game.title,
      description: game.description ?? '',
      thumbnail_url: game.thumbnail_url ?? '',
      game_url: game.game_url,
    })
    setFormError(null)
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditingGame(null)
    setForm(emptyForm)
    setFormError(null)
  }

  function setField(key: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim() || !form.game_url.trim()) {
      setFormError('Título y URL del juego son obligatorios.')
      return
    }
    setFormError(null)
    setFormLoading(true)

    const supabase = createClient()
    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      thumbnail_url: form.thumbnail_url.trim() || null,
      game_url: form.game_url.trim(),
    }

    if (editingGame) {
      const { error } = await supabase
        .from('games')
        .update(payload)
        .eq('id', editingGame.id)

      if (error) { setFormError(error.message); setFormLoading(false); return }

      setGames((prev) =>
        prev.map((g) => g.id === editingGame.id ? { ...g, ...payload } : g)
      )
    } else {
      const maxOrder = games.reduce((m, g) => Math.max(m, g.sort_order), -1)
      const { data, error } = await supabase
        .from('games')
        .insert({ ...payload, dev_id: devId, sort_order: maxOrder + 1 })
        .select()
        .single<Game>()

      if (error) { setFormError(error.message); setFormLoading(false); return }
      if (data) setGames((prev) => [...prev, data])
    }

    setFormLoading(false)
    closeForm()
    router.refresh()
  }

  async function handleTogglePublish(game: Game) {
    const supabase = createClient()
    const { error } = await supabase
      .from('games')
      .update({ is_published: !game.is_published })
      .eq('id', game.id)

    if (!error) {
      setGames((prev) =>
        prev.map((g) => g.id === game.id ? { ...g, is_published: !g.is_published } : g)
      )
    }
  }

  async function handleDelete(game: Game) {
    if (!confirm(`¿Eliminar "${game.title}"? Esta acción no se puede deshacer.`)) return
    setDeletingId(game.id)

    const supabase = createClient()
    const { error } = await supabase.from('games').delete().eq('id', game.id)

    if (!error) {
      setGames((prev) => prev.filter((g) => g.id !== game.id))
    }
    setDeletingId(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Mis juegos</h1>
        {!showForm && (
          <button
            onClick={openAdd}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
          >
            + Añadir juego
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col gap-4"
        >
          <h2 className="text-white font-semibold text-base">
            {editingGame ? 'Editar juego' : 'Nuevo juego'}
          </h2>

          <Field label="Título *">
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setField('title', e.target.value)}
              className={inputCls}
              placeholder="Mi juego"
            />
          </Field>

          <Field label="Descripción">
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              className={inputCls + ' resize-none'}
              placeholder="Descripción breve..."
            />
          </Field>

          <Field label="URL de thumbnail">
            <input
              type="url"
              value={form.thumbnail_url}
              onChange={(e) => setField('thumbnail_url', e.target.value)}
              className={inputCls}
              placeholder="https://..."
            />
          </Field>

          <Field label="URL del juego *">
            <input
              type="url"
              required
              value={form.game_url}
              onChange={(e) => setField('game_url', e.target.value)}
              className={inputCls}
              placeholder="https://..."
            />
          </Field>

          {formError && <p className="text-red-400 text-sm">{formError}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={formLoading}
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
            >
              {formLoading ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="px-5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 text-sm font-semibold transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {games.length === 0 && !showForm && (
        <p className="text-white/30 text-sm">Aún no tienes juegos. Añade el primero.</p>
      )}

      <div className="flex flex-col gap-3">
        {games.map((game) => (
          <div
            key={game.id}
            className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4"
          >
            <div className="w-20 h-12 rounded-lg overflow-hidden shrink-0 bg-neutral-800">
              {game.thumbnail_url ? (
                <img
                  src={game.thumbnail_url}
                  alt={game.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-white/20 text-xs">Sin imagen</span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{game.title}</p>
              {game.description && (
                <p className="text-white/40 text-xs truncate mt-0.5">{game.description}</p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleTogglePublish(game)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  game.is_published
                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                    : 'bg-white/10 text-white/40 hover:bg-white/20'
                }`}
              >
                {game.is_published ? 'Publicado' : 'Borrador'}
              </button>

              <button
                onClick={() => openEdit(game)}
                className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 text-xs font-semibold transition-colors"
              >
                Editar
              </button>

              <button
                onClick={() => handleDelete(game)}
                disabled={deletingId === game.id}
                className="px-3 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold disabled:opacity-50 transition-colors"
              >
                {deletingId === game.id ? '...' : 'Eliminar'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const inputCls =
  'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors text-sm'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-white/70 text-sm font-medium">{label}</label>
      {children}
    </div>
  )
}
