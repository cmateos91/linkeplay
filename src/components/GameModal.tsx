'use client'

import { useEffect } from 'react'
import type { Game } from '@/types'

interface GameModalProps {
  game: Game | null
  onClose: () => void
}

export default function GameModal({ game, onClose }: GameModalProps) {
  useEffect(() => {
    if (!game) return

    document.body.style.overflow = 'hidden'

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [game, onClose])

  if (!game) return null

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: '#000' }}
      role="dialog"
      aria-modal="true"
      aria-label={game.title}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{
          background: '#111118',
          borderBottom: '1px solid #2a2a36',
        }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '999px',
              background: '#C2FF3E',
              boxShadow: '0 0 0 3px rgba(194,255,62,0.2)',
              flexShrink: 0,
            }}
          />
          <span
            className="font-semibold text-sm truncate"
            style={{
              color: '#f5f5f7',
              fontFamily: 'var(--font-space-grotesk)',
              letterSpacing: '-0.01em',
            }}
          >
            {game.title}
          </span>
        </div>

        <button
          onClick={onClose}
          className="ml-4 shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
          style={{
            background: '#1a1a24',
            border: '1px solid #2a2a36',
            color: '#f5f5f7',
            fontFamily: 'var(--font-space-grotesk)',
            cursor: 'pointer',
          }}
          aria-label="Cerrar"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M3 3l10 10M13 3L3 13" />
          </svg>
          Cerrar
        </button>
      </div>

      <iframe
        src={game.game_url}
        title={game.title}
        width="100%"
        height="100%"
        className="flex-1 border-0"
        allow="fullscreen"
      />
    </div>
  )
}
