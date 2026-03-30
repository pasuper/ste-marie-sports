'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/providers/AuthProvider'
import AccountSidebar from '@/components/AccountSidebar'

interface OrderItem {
  id: number
  name: string
  image: string
  price: number
  quantity: number
}

interface Order {
  id: string
  date: string
  status: 'processing' | 'shipped' | 'in-transit' | 'delivered' | 'cancelled'
  total: number
  items: OrderItem[]
  tracking?: {
    carrier: string
    number: string
  }
}

export default function MyOrdersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  const { isAuthenticated, isLoading } = useAuth()
  const [activeFilter, setActiveFilter] = useState<string>('all')

  // Orders should come from user authentication context - start empty
  const orders: Order[] = []

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'processing': return 'En traitement'
      case 'shipped': return 'Exp\u00e9di\u00e9'
      case 'in-transit': return 'En transit'
      case 'delivered': return 'Livr\u00e9'
      case 'cancelled': return 'Annul\u00e9e'
      default: return status
    }
  }

  const filteredOrders = activeFilter === 'all'
    ? orders
    : orders.filter(order => order.status === activeFilter)

  const filterCounts = {
    all: orders.length,
    'in-transit': orders.filter(o => o.status === 'in-transit' || o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  }

  if (isLoading) {
    return (
      <div className="my-orders-page">
        <div className="page-content">
          <div className="container">
            <p>Chargement...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="my-orders-page">
        <div className="page-content">
          <div className="container">
            <p>Veuillez vous connecter.</p>
            <Link href={`/${locale}/mon-compte`} className="btn btn--primary">Se connecter</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="my-orders-page">
      <div className="page-content">
        <div className="container">
          <div className="account-layout">
            <AccountSidebar locale={locale} stats={{ orders: orders.length }} />

            <main className="account-main">
              {/* Filters */}
              <div className="orders-filters">
                <button
                  className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('all')}
                >
                  Toutes ({filterCounts.all})
                </button>
                <button
                  className={`filter-btn ${activeFilter === 'in-transit' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('in-transit')}
                >
                  En cours ({filterCounts['in-transit']})
                </button>
                <button
                  className={`filter-btn ${activeFilter === 'delivered' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('delivered')}
                >
                  Livr\u00e9es ({filterCounts.delivered})
                </button>
                <button
                  className={`filter-btn ${activeFilter === 'cancelled' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('cancelled')}
                >
                  Annul\u00e9es ({filterCounts.cancelled})
                </button>
              </div>

              {/* Orders List */}
              <div className="orders-list">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <div key={order.id} className="order-card">
                      <div className="order-card__header">
                        <div className="order-card__info">
                          <h3>{order.id}</h3>
                          <span className="order-date">Command\u00e9 le {order.date}</span>
                        </div>
                        <div className="order-card__status-wrapper">
                          <span className={`order-status order-status--${order.status}`}>
                            {getStatusLabel(order.status)}
                          </span>
                          {order.tracking && (
                            <span className="tracking-info">
                              {order.tracking.carrier}: {order.tracking.number}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="order-card__items">
                        {order.items.map((item) => (
                          <div key={item.id} className="order-item">
                            <img src={item.image} alt={item.name} />
                            <div className="order-item__details">
                              <span className="order-item__name">{item.name}</span>
                              <span className="order-item__meta">
                                Quantit\u00e9: {item.quantity} &times; {item.price.toFixed(2)} $
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="order-card__footer">
                        <div className="order-total">
                          <span>Total</span>
                          <strong>{order.total.toFixed(2)} $</strong>
                        </div>
                        <div className="order-actions">
                          {(order.status === 'in-transit' || order.status === 'shipped') && (
                            <Link href={`/${locale}/suivi-commande`} className="btn btn--primary">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="1" y="3" width="15" height="13"/>
                                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                                <circle cx="5.5" cy="18.5" r="2.5"/>
                                <circle cx="18.5" cy="18.5" r="2.5"/>
                              </svg>
                              Suivre
                            </Link>
                          )}
                          <button className="btn btn--outline">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                              <polyline points="14 2 14 8 20 8"/>
                              <line x1="16" y1="13" x2="8" y2="13"/>
                              <line x1="16" y1="17" x2="8" y2="17"/>
                            </svg>
                            Facture
                          </button>
                          {order.status === 'delivered' && (
                            <button className="btn btn--outline">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                              </svg>
                              Avis
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-orders">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                      <line x1="3" y1="6" x2="21" y2="6"/>
                      <path d="M16 10a4 4 0 0 1-8 0"/>
                    </svg>
                    <h3>Aucune commande trouv\u00e9e</h3>
                    <p>Vous n&apos;avez pas encore de commandes dans cette cat\u00e9gorie.</p>
                    <Link href={`/${locale}/vehicules`} className="btn btn--primary">
                      D\u00e9couvrir nos produits
                    </Link>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
