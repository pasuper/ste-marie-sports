'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function GatePage() {
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
    <div className="gate">
      <div className="gate__card">
        <div className="gate__logo">STE-MARIE SPORTS</div>
        <h1 className="gate__title">En construction</h1>
        <p className="gate__subtitle">
          Ce site est actuellement en développement.<br />
          Entrez le mot de passe pour accéder au site.
        </p>
        <form onSubmit={handleSubmit} className="gate__form">
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false) }}
            placeholder="Mot de passe"
            className={`gate__input ${error ? 'gate__input--error' : ''}`}
            autoFocus
          />
          {error && (
            <p className="gate__error">Mot de passe incorrect</p>
          )}
          <button type="submit" className="gate__button" disabled={loading || !password}>
            {loading ? 'Vérification...' : 'Accéder au site'}
          </button>
        </form>
      </div>

      <style jsx>{`
        .gate {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #e61e25 0%, #7c1215 100%);
          padding: 24px;
        }

        .gate__card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 24px;
          padding: 60px 48px;
          max-width: 480px;
          width: 100%;
          text-align: center;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
        }

        .gate__logo {
          font-family: 'Arial Black', 'Impact', sans-serif;
          font-size: 14px;
          font-weight: 900;
          letter-spacing: 6px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 32px;
          text-transform: uppercase;
        }

        .gate__title {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 48px;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 16px;
          line-height: 1.1;
        }

        .gate__subtitle {
          color: rgba(255, 255, 255, 0.8);
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 40px;
        }

        .gate__form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .gate__input {
          width: 100%;
          padding: 16px 20px;
          font-size: 16px;
          font-family: 'Inter', system-ui, sans-serif;
          background: rgba(255, 255, 255, 0.15);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          color: #ffffff;
          outline: none;
          transition: all 0.2s ease;
          text-align: center;
          letter-spacing: 2px;
        }

        .gate__input::placeholder {
          color: rgba(255, 255, 255, 0.5);
          letter-spacing: 1px;
        }

        .gate__input:focus {
          border-color: rgba(255, 255, 255, 0.6);
          background: rgba(255, 255, 255, 0.2);
          box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.1);
        }

        .gate__input--error {
          border-color: #ff6b6b;
          background: rgba(255, 107, 107, 0.15);
          animation: shake 0.4s ease;
        }

        .gate__error {
          color: #ffcccc;
          font-size: 14px;
          margin: -4px 0 0;
        }

        .gate__button {
          width: 100%;
          padding: 16px;
          font-size: 16px;
          font-weight: 700;
          font-family: 'Inter', system-ui, sans-serif;
          background: #ffffff;
          color: #7c1215;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .gate__button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }

        .gate__button:active:not(:disabled) {
          transform: translateY(0);
        }

        .gate__button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }

        @media (max-width: 480px) {
          .gate__card {
            padding: 40px 24px;
          }
          .gate__title {
            font-size: 36px;
          }
        }
      `}</style>
    </div>
  )
}
