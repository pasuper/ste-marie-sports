'use client'

import { use, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useAuth } from '@/providers/AuthProvider'
import AccountSidebar from '@/components/AccountSidebar'

export default function MyAccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  const { user, isAuthenticated, isLoading, error, login, register, clearError } = useAuth()
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')

  // Login form state
  const [loginForm, setLoginForm] = useState({
    identifier: '',
    password: '',
  })

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
  })

  const [formError, setFormError] = useState<string | null>(null)

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setFormError(null)
    clearError()

    try {
      await login({
        identifier: loginForm.identifier,
        password: loginForm.password,
      })
    } catch {
      // Error is handled by AuthContext
    }
  }

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault()
    setFormError(null)
    clearError()

    if (registerForm.password !== registerForm.confirmPassword) {
      setFormError('Les mots de passe ne correspondent pas')
      return
    }

    if (registerForm.password.length < 6) {
      setFormError('Le mot de passe doit contenir au moins 6 caract\u00e8res')
      return
    }

    try {
      await register({
        username: registerForm.username || registerForm.email.split('@')[0],
        email: registerForm.email,
        password: registerForm.password,
        firstName: registerForm.firstName,
        lastName: registerForm.lastName,
        phone: registerForm.phone,
      })
    } catch {
      // Error is handled by AuthContext
    }
  }

  // Stats (will be dynamic later when we have orders API)
  const stats = {
    orders: 0,
    wishlist: 0,
    addresses: 0,
    reviews: 0,
  }

  // Show loading state
  if (isLoading && !user) {
    return (
      <div className="my-account-page">
        <div className="page-content">
          <div className="container">
            <p>Chargement...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show login/register form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="my-account-page">
        <div className="page-content">
          <div className="container">
            <div className="auth-container">
              {/* Auth Tabs */}
              <div className="auth-tabs">
                <button
                  className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('login'); clearError(); setFormError(null) }}
                >
                  Connexion
                </button>
                <button
                  className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('register'); clearError(); setFormError(null) }}
                >
                  Cr\u00e9er un compte
                </button>
              </div>

              {/* Error Messages */}
              {(error || formError) && (
                <div className="auth-error">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                  {formError || error}
                </div>
              )}

              {/* Login Form */}
              {activeTab === 'login' && (
                <form onSubmit={handleLogin} className="auth-form">
                  <div className="form-group">
                    <label htmlFor="identifier">Courriel ou nom d&apos;utilisateur</label>
                    <input
                      type="text"
                      id="identifier"
                      value={loginForm.identifier}
                      onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
                      required
                      autoComplete="username"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Mot de passe</label>
                    <input
                      type="password"
                      id="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                      autoComplete="current-password"
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn btn--primary btn--full" disabled={isLoading}>
                      {isLoading ? 'Connexion...' : 'Se connecter'}
                    </button>
                  </div>
                  <div className="form-footer">
                    <Link href={`/${locale}/mot-de-passe-oublie`}>Mot de passe oubli\u00e9?</Link>
                  </div>
                </form>
              )}

              {/* Register Form */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegister} className="auth-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName">Pr\u00e9nom *</label>
                      <input
                        type="text"
                        id="firstName"
                        value={registerForm.firstName}
                        onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastName">Nom *</label>
                      <input
                        type="text"
                        id="lastName"
                        value={registerForm.lastName}
                        onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="regEmail">Courriel *</label>
                    <input
                      type="email"
                      id="regEmail"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      required
                      autoComplete="email"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">T\u00e9l\u00e9phone</label>
                    <input
                      type="tel"
                      id="phone"
                      value={registerForm.phone}
                      onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                      placeholder="(514) 555-1234"
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="regPassword">Mot de passe *</label>
                      <input
                        type="password"
                        id="regPassword"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        required
                        minLength={6}
                        autoComplete="new-password"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="confirmPassword">Confirmer *</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                        required
                        minLength={6}
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn btn--primary btn--full" disabled={isLoading}>
                      {isLoading ? 'Cr\u00e9ation...' : 'Cr\u00e9er mon compte'}
                    </button>
                  </div>
                  <p className="form-note">
                    En cr\u00e9ant un compte, vous acceptez nos <Link href={`/${locale}/page/conditions-utilisation`}>conditions d&apos;utilisation</Link> et notre <Link href={`/${locale}/page/politique-confidentialite`}>politique de confidentialit\u00e9</Link>.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show account dashboard if authenticated
  return (
    <div className="my-account-page">
      <div className="page-content">
        <div className="container">
          <div className="account-layout">
            <AccountSidebar locale={locale} stats={stats} />

            {/* Main Content */}
            <main className="account-main">
              {/* Welcome Section */}
              <div className="welcome-card">
                <div className="welcome-card__content">
                  <h2>Bienvenue, {user?.firstName || user?.username || 'Client'}!</h2>
                  <p>Depuis votre tableau de bord, vous pouvez g\u00e9rer vos commandes, modifier vos adresses et mettre \u00e0 jour vos informations personnelles.</p>
                </div>
                <div className="welcome-card__action">
                  <Link href={`/${locale}/suivi-commande`} className="btn btn--primary">
                    Suivre ma commande
                  </Link>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="stats-grid">
                <Link href={`/${locale}/mes-commandes`} className="stat-card">
                  <div className="stat-card__icon stat-card__icon--orders">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                      <line x1="3" y1="6" x2="21" y2="6"/>
                      <path d="M16 10a4 4 0 0 1-8 0"/>
                    </svg>
                  </div>
                  <div className="stat-card__content">
                    <span className="stat-card__value">{stats.orders}</span>
                    <span className="stat-card__label">Commandes</span>
                  </div>
                </Link>
                <Link href={`/${locale}/ma-liste-envies`} className="stat-card">
                  <div className="stat-card__icon stat-card__icon--wishlist">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </div>
                  <div className="stat-card__content">
                    <span className="stat-card__value">{stats.wishlist}</span>
                    <span className="stat-card__label">Liste d&apos;envies</span>
                  </div>
                </Link>
                <Link href={`/${locale}/mes-adresses`} className="stat-card">
                  <div className="stat-card__icon stat-card__icon--addresses">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <div className="stat-card__content">
                    <span className="stat-card__value">{stats.addresses}</span>
                    <span className="stat-card__label">Adresses</span>
                  </div>
                </Link>
                <div className="stat-card">
                  <div className="stat-card__icon stat-card__icon--reviews">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  </div>
                  <div className="stat-card__content">
                    <span className="stat-card__value">{stats.reviews}</span>
                    <span className="stat-card__label">Avis laiss\u00e9s</span>
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div className="account-info">
                <div className="section-header">
                  <h3>Informations du compte</h3>
                  <button className="edit-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Modifier
                  </button>
                </div>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Nom complet</label>
                    <span>{user?.firstName} {user?.lastName}</span>
                  </div>
                  <div className="info-item">
                    <label>Courriel</label>
                    <span>{user?.email}</span>
                  </div>
                  <div className="info-item">
                    <label>T\u00e9l\u00e9phone</label>
                    <span>{user?.phone || 'Non renseign\u00e9'}</span>
                  </div>
                  <div className="info-item">
                    <label>Nom d&apos;utilisateur</label>
                    <span>{user?.username}</span>
                  </div>
                </div>
              </div>

            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
