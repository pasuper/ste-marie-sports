'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
/* eslint-disable @next/next/no-img-element */

const SITE_PASSWORD = 'Pasuper7803!'
const AUTH_COOKIE = 'stemarie_site_access'

function GateContent() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    if (document.cookie.indexOf(AUTH_COOKIE + '=granted') !== -1) {
      window.location.replace('/fr')
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === SITE_PASSWORD) {
      document.cookie = `${AUTH_COOKIE}=granted; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`
      window.location.href = '/fr'
    } else {
      setError(true)
    }
  }

  return (
    <div className="gate-page">
      <div className="gate-page__bg" />
      <div className="gate-page__overlay" />
      <div className="gate-page__card">
        <div className="gate-page__logo">
          <img src="/logo-stemarie.png" alt="Ste-Marie Sports" />
        </div>
        <h1 className="gate-page__title">En construction</h1>
        <p className="gate-page__subtitle">
          Ce site est actuellement en développement.<br />
          Entrez le mot de passe pour accéder au site.
        </p>
        <form onSubmit={handleSubmit} className="gate-page__form">
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false) }}
            placeholder="Mot de passe"
            className={`gate-page__input ${error ? 'gate-page__input--error' : ''}`}
            autoFocus
            autoComplete="new-password"
          />
          {error && <p className="gate-page__error">Mot de passe incorrect</p>}
          <button type="submit" className="gate-page__button" disabled={!password}>
            Accéder au site
          </button>
        </form>
        <p className="gate-page__contact">
          Contactez-nous: <a href="mailto:michel.aubin@pasuper.com">michel.aubin@pasuper.com</a>
        </p>
      </div>
    </div>
  )
}

export default function GatePage() {
  return (
    <Suspense>
      <GateContent />
    </Suspense>
  )
}
