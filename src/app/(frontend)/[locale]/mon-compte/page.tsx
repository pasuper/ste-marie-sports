'use client'
import { use } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import Link from 'next/link'

export default function MyAccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  const { user, isAuthenticated, isLoading, logout } = useAuth()

  if (isLoading) return <div className="container"><p>{locale === 'fr' ? 'Chargement...' : 'Loading...'}</p></div>
  if (!isAuthenticated) return (
    <div className="container">
      <h1 className="page-title">{locale === 'fr' ? 'Connexion' : 'Login'}</h1>
      <p>{locale === 'fr' ? 'Veuillez vous connecter.' : 'Please log in.'}</p>
    </div>
  )

  return (
    <div className="account-page">
      <div className="container">
        <h1 className="page-title">{locale === 'fr' ? 'Mon compte' : 'My Account'}</h1>
        <p>{locale === 'fr' ? 'Bienvenue' : 'Welcome'}, {user?.firstName || user?.email}</p>
        <nav className="account-nav">
          <Link href={`/${locale}/mes-commandes`}>{locale === 'fr' ? 'Mes commandes' : 'My Orders'}</Link>
          <Link href={`/${locale}/mes-adresses`}>{locale === 'fr' ? 'Mes adresses' : 'My Addresses'}</Link>
          <Link href={`/${locale}/ma-liste-envies`}>{locale === 'fr' ? 'Ma liste de souhaits' : 'My Wishlist'}</Link>
          <button onClick={logout}>{locale === 'fr' ? 'Déconnexion' : 'Logout'}</button>
        </nav>
      </div>
    </div>
  )
}
