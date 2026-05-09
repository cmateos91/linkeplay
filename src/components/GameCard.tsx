'use client'

import type { Game } from '@/types'

interface GameCardProps {
  game: Game
  onPlay: (game: Game) => void
  devId: string
  sessionId: string
}

const BADGE_DAYS = 14

function autoBadge(game: Game): 'NUEVO' | null {
  const daysOld = (Date.now() - new Date(game.created_at).getTime()) / 86_400_000
  return daysOld <= BADGE_DAYS ? 'NUEVO' : null
}

const BADGE_STYLES: Record<string, React.CSSProperties> = {
  NUEVO:       { background: '#C2FF3E', color: '#0a0a10' },
  POPULAR:     { background: '#FF2D9B', color: '#fff' },
  ACTUALIZADO: { background: '#00D4FF', color: '#0a0a10' },
}

export default function GameCard({ game, onPlay, devId, sessionId }: GameCardProps) {
  const badge = autoBadge(game)

  function handlePlay() {
    onPlay(game)
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dev_id: devId,
        game_id: game.id,
        event_type: 'game_start',
        session_id: sessionId,
      }),
    }).catch(() => {})
  }

  return (
    <article
      className="flex flex-col transition-transform hover:-translate-y-px"
      style={{ background: '#111118', borderRadius: '16px' }}
    >
      {/* Thumbnail — overflow-hidden sólo aquí, no en el article */}
      <div
        className="relative w-full rounded-t-2xl overflow-hidden"
        style={{ aspectRatio: '16 / 9', containerType: 'inline-size' }}
      >
        {game.thumbnail_url ? (
          <>
            <img
              src={game.thumbnail_url}
              alt={game.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)' }}
            />
          </>
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `repeating-linear-gradient(135deg, rgba(255,255,255,0.025) 0 14px, transparent 14px 28px),
                linear-gradient(180deg, #191923, #21212d)`,
            }}
          />
        )}

        {/* Título centrado sobre la imagen */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span
            className="font-bold text-white text-center px-4 leading-tight"
            style={{
              fontSize: 'clamp(16px, 7cqi, 28px)',
              textShadow: '0 2px 14px rgba(0,0,0,0.75)',
              fontFamily: 'var(--font-space-grotesk)',
              letterSpacing: '-0.02em',
            }}
          >
            {game.title}
          </span>
        </div>

        {/* Badge */}
        {badge && (
          <span
            className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase"
            style={{
              ...BADGE_STYLES[badge],
              fontFamily: 'var(--font-space-grotesk)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            }}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3">
        <div>
          <h3
            className="font-bold text-lg leading-tight"
            style={{
              color: '#f5f5f7',
              fontFamily: 'var(--font-space-grotesk)',
              letterSpacing: '-0.015em',
            }}
          >
            {game.title}
          </h3>
          {game.description && (
            <p
              className="text-sm mt-1 line-clamp-2"
              style={{ color: '#8e8e9c', lineHeight: '1.4' }}
            >
              {game.description}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handlePlay}
          onTouchEnd={(e) => { e.preventDefault(); handlePlay() }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm hover:brightness-110 active:translate-y-px"
          style={{
            background: '#C2FF3E',
            color: '#0a0a10',
            fontFamily: 'var(--font-space-grotesk)',
            touchAction: 'manipulation',
            cursor: 'pointer',
            boxShadow: '0 6px 20px -8px rgba(194,255,62,0.55)',
            letterSpacing: '-0.01em',
            transition: 'filter 0.12s, transform 0.06s',
          }}
        >
          <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true" fill="currentColor">
            <path d="M3 1.5v9l8-4.5L3 1.5Z" />
          </svg>
          Jugar
        </button>
      </div>
    </article>
  )
}
