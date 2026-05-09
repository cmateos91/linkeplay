'use client'

import { useState, useEffect, useRef } from 'react'
import type { Dev, Game } from '@/types'
import GameCard from './GameCard'
import GameModal from './GameModal'

interface ProfileClientProps {
  dev: Dev
  games: Game[]
}

type FollowState = 'idle' | 'open' | 'done'

export default function ProfileClient({ dev, games }: ProfileClientProps) {
  const [sessionId, setSessionId] = useState<string>('')
  const [activeGame, setActiveGame] = useState<Game | null>(null)
  const [followState, setFollowState] = useState<FollowState>('idle')
  const [followEmail, setFollowEmail] = useState('')
  const [followLoading, setFollowLoading] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const id = typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`
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

  function handleFollowOpen() {
    setFollowState('open')
    setTimeout(() => emailRef.current?.focus(), 50)
  }

  async function handleFollowSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!followEmail.trim()) return
    setFollowLoading(true)
    await new Promise((r) => setTimeout(r, 400))
    setFollowState('done')
    setFollowLoading(false)
  }

  function handleDiscordClick() {
    if (!dev.discord_invite_url) return
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dev_id: dev.id,
        game_id: null,
        event_type: 'discord_click',
        session_id: sessionId,
      }),
    }).catch(() => {})
    window.open(dev.discord_invite_url, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <div className="lp-page">
        <div
          className="mx-auto px-5 pb-16 flex flex-col gap-6"
          style={{ maxWidth: '680px', paddingTop: '36px' }}
        >
          {/* Header */}
          <header className="flex flex-col items-center text-center gap-4">
            {/* Avatar con borde de gradiente */}
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: '999px',
                background: 'conic-gradient(from 220deg at 35% 30%, #C2FF3E 0deg, #3EE0FF 90deg, #8B5CF6 180deg, #FF3EA8 240deg, #FFB03E 310deg, #C2FF3E 360deg)',
                padding: 3,
                flexShrink: 0,
              }}
            >
              {dev.avatar_url ? (
                <img
                  src={dev.avatar_url}
                  alt={dev.display_name}
                  style={{ width: '100%', height: '100%', borderRadius: '999px', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '999px',
                    background: '#14141c',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-space-grotesk)',
                    fontWeight: 700,
                    fontSize: 36,
                    color: '#f5f5f7',
                  }}
                >
                  {dev.display_name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Nombre y handle */}
            <div className="flex flex-col gap-1">
              <h1
                className="text-3xl font-bold leading-tight"
                style={{
                  color: '#f5f5f7',
                  fontFamily: 'var(--font-space-grotesk)',
                  letterSpacing: '-0.02em',
                }}
              >
                {dev.display_name}
              </h1>
              <div
                className="flex items-center justify-center gap-1.5 text-sm font-medium"
                style={{ color: '#8e8e9c' }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '999px',
                    background: '#C2FF3E',
                    boxShadow: '0 0 0 3px rgba(194,255,62,0.18)',
                    display: 'inline-block',
                    flexShrink: 0,
                  }}
                />
                @{dev.username}
              </div>
            </div>

            {/* Bio */}
            {dev.bio && (
              <p
                className="text-sm max-w-sm leading-relaxed"
                style={{ color: '#8e8e9c' }}
              >
                {dev.bio}
              </p>
            )}

            {/* Botones de acción */}
            <div className="w-full flex flex-col gap-3 mt-1">
              {/* Fila de botones: apilados en móvil, lado a lado en desktop */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Seguir */}
                {followState === 'done' ? (
                  <div
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold"
                    style={{
                      background: 'rgba(194,255,62,0.1)',
                      color: '#C2FF3E',
                      fontFamily: 'var(--font-space-grotesk)',
                      border: '1px solid rgba(194,255,62,0.2)',
                    }}
                  >
                    ✓ ¡Te avisaremos!
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleFollowOpen}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-[filter] hover:brightness-110 active:translate-y-px"
                    style={{
                      background: '#C2FF3E',
                      color: '#0a0a10',
                      fontFamily: 'var(--font-space-grotesk)',
                      touchAction: 'manipulation',
                      cursor: 'pointer',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    ♥ Seguir
                  </button>
                )}

                {/* Discord */}
                {dev.discord_invite_url && (
                  <button
                    type="button"
                    onClick={handleDiscordClick}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-opacity hover:opacity-90 active:translate-y-px"
                    style={{
                      background: '#5865F2',
                      color: '#fff',
                      fontFamily: 'var(--font-space-grotesk)',
                      touchAction: 'manipulation',
                      cursor: 'pointer',
                      letterSpacing: '-0.01em',
                      boxShadow: '0 6px 20px -8px rgba(88,101,242,0.5)',
                    }}
                  >
                    <svg width="16" height="12" viewBox="0 0 24 18" fill="white" aria-hidden="true">
                      <path d="M20.317 1.492a19.825 19.825 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.293 18.293 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 1.492a.07.07 0 0 0-.032.027C.533 6.093-.32 10.555.099 14.961a.08.08 0 0 0 .031.055 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.442a.061.061 0 0 0-.031-.03zM8.02 12.278c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                    Discord
                  </button>
                )}
              </div>

              {/* Campo de email inline */}
              {followState === 'open' && (
                <form onSubmit={handleFollowSubmit} className="flex gap-2">
                  <input
                    ref={emailRef}
                    type="email"
                    required
                    value={followEmail}
                    onChange={(e) => setFollowEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{
                      background: '#14141c',
                      border: '1px solid #2a2a36',
                      color: '#f5f5f7',
                      fontFamily: 'var(--font-inter)',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={followLoading}
                    className="px-4 py-2.5 rounded-xl text-sm font-bold shrink-0 disabled:opacity-50"
                    style={{
                      background: '#C2FF3E',
                      color: '#0a0a10',
                      fontFamily: 'var(--font-space-grotesk)',
                      cursor: 'pointer',
                      touchAction: 'manipulation',
                    }}
                  >
                    {followLoading ? '...' : 'Listo'}
                  </button>
                </form>
              )}
            </div>
          </header>

          {/* Juegos */}
          {games.length > 0 && (
            <section className="flex flex-col gap-4">
              {/* Label con línea divisora */}
              <div className="flex items-center gap-3">
                <span
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{
                    color: '#8e8e9c',
                    fontFamily: 'var(--font-space-grotesk)',
                    letterSpacing: '0.14em',
                  }}
                >
                  Juegos
                </span>
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{
                    background: '#14141c',
                    border: '1px solid #2a2a36',
                    color: '#f5f5f7',
                    fontFamily: 'var(--font-space-grotesk)',
                  }}
                >
                  {games.length}
                </span>
                <div className="flex-1 h-px" style={{ background: '#2a2a36' }} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <p
              className="text-center text-sm py-10"
              style={{ color: '#6c6c78' }}
            >
              Este dev aún no ha publicado juegos.
            </p>
          )}
        </div>
      </div>

      <GameModal game={activeGame} onClose={() => setActiveGame(null)} />
    </>
  )
}
