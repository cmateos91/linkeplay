'use client'

import type { Game } from '@/types'

interface GameCardProps {
  game: Game
  onPlay: (game: Game) => void
  devId: string
  sessionId: string
}

export default function GameCard({ game, onPlay, devId, sessionId }: GameCardProps) {
  async function handlePlay() {
    try {
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dev_id: devId,
          game_id: game.id,
          event_type: 'game_start',
          session_id: sessionId,
        }),
      })
    } catch {}
    onPlay(game)
  }

  return (
    <div className="flex flex-col rounded-xl overflow-hidden bg-white/5 border border-white/10">
      <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
        {game.thumbnail_url ? (
          <img
            src={game.thumbnail_url}
            alt={game.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
            <span className="text-white/40 text-sm font-medium text-center px-3">{game.title}</span>
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3 className="text-white font-semibold text-base leading-tight">{game.title}</h3>
        {game.description && (
          <p className="text-white/50 text-sm leading-snug line-clamp-2">{game.description}</p>
        )}
        <div className="mt-auto pt-3">
          <button
            onClick={handlePlay}
            className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-sm transition-colors"
          >
            Jugar
          </button>
        </div>
      </div>
    </div>
  )
}
