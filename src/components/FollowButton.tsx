'use client'

import { useState, useRef } from 'react'

interface FollowButtonProps {
  devId: string
  devName: string
}

type State = 'idle' | 'open' | 'loading' | 'done' | 'error'

export default function FollowButton({ devId, devName }: FollowButtonProps) {
  const [state, setState] = useState<State>('idle')
  const [email, setEmail] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function handleOpen() {
    setState('open')
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setState('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dev_id: devId, email }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setErrorMsg(data.error ?? 'Algo salió mal. Inténtalo de nuevo.')
        setState('error')
      } else {
        setState('done')
      }
    } catch {
      setErrorMsg('Error de red. Inténtalo de nuevo.')
      setState('error')
    }
  }

  if (state === 'done') {
    return (
      <div
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold"
        style={{
          background: 'rgba(194,255,62,0.1)',
          border: '1px solid rgba(194,255,62,0.2)',
          color: '#C2FF3E',
          fontFamily: 'var(--font-space-grotesk)',
        }}
      >
        ✓ ¡Ya te avisamos cuando {devName} lance algo nuevo!
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col gap-2">
      {state === 'idle' && (
        <button
          type="button"
          onClick={handleOpen}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold hover:brightness-110 active:translate-y-px"
          style={{
            background: '#C2FF3E',
            color: '#0a0a10',
            fontFamily: 'var(--font-space-grotesk)',
            touchAction: 'manipulation',
            cursor: 'pointer',
            letterSpacing: '-0.01em',
            boxShadow: '0 6px 20px -8px rgba(194,255,62,0.55)',
            transition: 'filter 0.12s, transform 0.06s',
          }}
        >
          ♥ Seguir
        </button>
      )}

      {(state === 'open' || state === 'loading' || state === 'error') && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            disabled={state === 'loading'}
            className="px-4 py-2.5 rounded-xl text-sm font-bold shrink-0 disabled:opacity-50"
            style={{
              background: '#C2FF3E',
              color: '#0a0a10',
              fontFamily: 'var(--font-space-grotesk)',
              touchAction: 'manipulation',
              cursor: 'pointer',
              transition: 'filter 0.12s',
            }}
          >
            {state === 'loading' ? '...' : 'Confirmar'}
          </button>
        </form>
      )}

      {state === 'error' && (
        <p className="text-xs" style={{ color: '#FF2D9B' }}>{errorMsg}</p>
      )}
    </div>
  )
}
