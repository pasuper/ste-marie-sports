'use client'
import { use } from 'react'
import { useAuth } from '@/providers/AuthProvider'

export default function MyOrdersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <div className="container"><p>{locale === 'fr' ? 'Chargement...' : 'Loading...'}</p></div>
  if (!isAuthenticated) return <div className="container"><p>{locale === 'fr' ? 'Veuillez vous connecter.' : 'Please log in.'}</p></div>

  return (
    <div className="container">
      <h1 className="page-title">{locale === 'fr' ? 'Mes commandes' : 'My Orders'}</h1>
      <p>{locale === 'fr' ? 'Aucune commande pour le moment.' : 'No orders yet.'}</p>
    </div>
  )
}
