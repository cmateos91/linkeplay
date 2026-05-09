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
      className="fixed inset-0 z-50 flex flex-col bg-black"
      role="dialog"
      aria-modal="true"
      aria-label={game.title}
    >
      <div className="flex items-center justify-between px-4 py-2 bg-black/80 shrink-0">
        <span className="text-white font-semibold text-sm truncate">{game.title}</span>
        <button
          onClick={onClose}
          className="ml-4 shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Cerrar"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.293 2.293a1 1 0 0 1 1.414 0L8 6.586l4.293-4.293a1 1 0 1 1 1.414 1.414L9.414 8l4.293 4.293a1 1 0 0 1-1.414 1.414L8 9.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L6.586 8 2.293 3.707a1 1 0 0 1 0-1.414z"/>
          </svg>
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
