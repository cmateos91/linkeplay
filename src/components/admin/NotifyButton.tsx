'use client'

import { useState } from 'react'

interface NotifyButtonProps {
  devId: string
  followerCount: number
}

type State = 'idle' | 'open' | 'sending' | 'done' | 'error'

export default function NotifyButton({ devId, followerCount }: NotifyButtonProps) {
  const [state, setState] = useState<State>('idle')
  const [message, setMessage] = useState('')
  const [sentCount, setSentCount] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')

  if (followerCount === 0) {
    return (
      <span className="text-white/30 text-xs font-medium">Sin seguidores aún</span>
    )
  }

  async function handleSend() {
    if (!message.trim()) return
    setState('sending')
    setErrorMsg('')

    try {
      const res = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dev_id: devId, message }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error ?? 'Error al enviar')
        setState('error')
      } else {
        setSentCount(data.sent)
        setState('done')
      }
    } catch {
      setErrorMsg('Error de red')
      setState('error')
    }
  }

  if (state === 'done') {
    return (
      <span className="text-green-400 text-xs font-medium">
        ✓ Enviado a {sentCount} seguidores
      </span>
    )
  }

  if (state === 'idle') {
    return (
      <button
        onClick={() => setState('open')}
        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
      >
        Notificar seguidores
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-2 mt-2">
      <textarea
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="ej: ¡Acabo de lanzar mi nuevo juego!"
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-white/30 resize-none"
        autoFocus
      />
      {state === 'error' && (
        <p className="text-red-400 text-xs">{errorMsg}</p>
      )}
      <div className="flex gap-2">
        <button
          onClick={handleSend}
          disabled={state === 'sending' || !message.trim()}
          className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold transition-colors"
        >
          {state === 'sending' ? 'Enviando...' : `Enviar a ${followerCount} seguidores`}
        </button>
        <button
          onClick={() => { setState('idle'); setMessage('') }}
          className="px-4 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 text-xs font-semibold transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
