'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'

const SITE_PASSWORD = 'Pasuper7803!'
const AUTH_COOKIE = 'stemarie_site_access'

export default function GateForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const searchParams = useSearchParams()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (password === SITE_PASSWORD) {
      document.cookie = `${AUTH_COOKIE}=granted; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`
      const next = searchParams.get('next') || '/gate'
      window.location.href = next
    } else {
      setError(true)
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
      <button type="submit" className="gate-page__button" disabled={!password}>
        Accéder au site
      </button>
    </form>
  )
}
