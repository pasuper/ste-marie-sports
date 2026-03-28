'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function GateForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(false)

    const res = await fetch('/api/gate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      const next = searchParams.get('next') || '/'
      window.location.href = next
    } else {
      setError(true)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="gate-page__form">
      <input
        type="password"
        value={password}
        onChange={(e) => { setPassword(e.target.value); setError(false) }}
        placeholder="Mot de passe"
        className={`gate-page__input ${error ? 'gate-page__input--error' : ''}`}
        autoFocus
      />
      {error && <p className="gate-page__error">Mot de passe incorrect</p>}
      <button type="submit" className="gate-page__button" disabled={loading || !password}>
        {loading ? 'Vérification...' : 'Accéder au site'}
      </button>
    </form>
  )
}
