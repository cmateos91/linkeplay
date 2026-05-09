'use client'

import { useState, useEffect } from 'react'
import type { Dev, Game } from '@/types'
import DiscordButton from './DiscordButton'
import GameCard from './GameCard'
import GameModal from './GameModal'

interface ProfileClientProps {
  dev: Dev
  games: Game[]
}

export default function ProfileClient({ dev, games }: ProfileClientProps) {
  const [sessionId, setSessionId] = useState<string>('')
  const [activeGame, setActiveGame] = useState<Game | null>(null)

  useEffect(() => {
    const id = crypto.randomUUID()
    setSessionId(id)

    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dev_id: dev.id,
        game_id: null,
        event_type: 'page_view',
        session_id: id,
      }),
    }).catch(() => {})
  }, [dev.id])

  return (
    <>
      <div className="max-w-3xl mx-auto px-4 py-10 flex flex-col gap-8">
        {/* Perfil */}
        <div className="flex flex-col items-center gap-4 text-center">
          {dev.avatar_url ? (
            <img
              src={dev.avatar_url}
              alt={dev.display_name}
              className="w-24 h-24 rounded-full object-cover ring-2 ring-white/10"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-neutral-700 flex items-center justify-center text-white/40 text-3xl font-bold">
              {dev.display_name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-white text-2xl font-bold">{dev.display_name}</h1>
            <p className="text-white/40 text-sm mt-0.5">@{dev.username}</p>
          </div>
          {dev.bio && (
            <p className="text-white/60 text-sm max-w-md leading-relaxed">{dev.bio}</p>
          )}
        </div>

        {/* Discord */}
        {dev.discord_invite_url && sessionId && (
          <DiscordButton
            discordUrl={dev.discord_invite_url}
            devId={dev.id}
            sessionId={sessionId}
          />
        )}

        {/* Juegos */}
        {games.length > 0 && (
          <section>
            <h2 className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-4">
              Juegos
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {games.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onPlay={setActiveGame}
                  devId={dev.id}
                  sessionId={sessionId}
                />
              ))}
            </div>
          </section>
        )}

        {games.length === 0 && (
          <p className="text-center text-white/30 text-sm py-10">
            Este dev aún no ha publicado juegos.
          </p>
        )}
      </div>

      <GameModal game={activeGame} onClose={() => setActiveGame(null)} />
    </>
  )
}
