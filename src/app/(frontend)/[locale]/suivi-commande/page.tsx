'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import AccountSidebar from '@/components/AccountSidebar'

interface OrderStatus {
  id: string
  date: string
  status: 'processing' | 'shipped' | 'in-transit' | 'delivered'
  estimatedDelivery: string
  items: {
    name: string
    quantity: number
    image: string
  }[]
  tracking: {
    carrier: string
    number: string
  }
  timeline: {
    status: string
    date: string
    time: string
    location?: string
    completed: boolean
    current?: boolean
  }[]
}

export default function OrderTrackingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  const [orderNumber, setOrderNumber] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [orderResult, setOrderResult] = useState<OrderStatus | null>(null)
  const [error, setError] = useState<string>('')

  // Mock order data for demo
  const mockOrder: OrderStatus = {
    id: 'ORD-2024-78542',
    date: '15 d\u00e9cembre 2024',
    status: 'in-transit',
    estimatedDelivery: '22 d\u00e9cembre 2024',
    items: [
      { name: 'Casque Shoei RF-1400', quantity: 1, image: 'https://placehold.co/80x80/1a1a1a/ffffff?text=Casque' },
      { name: 'Gants Alpinestars SP-8 V3', quantity: 1, image: 'https://placehold.co/80x80/1a1a1a/ffffff?text=Gants' },
    ],
    tracking: {
      carrier: 'Purolator',
      number: 'PUR123456789CA',
    },
    timeline: [
      { status: 'Commande confirm\u00e9e', date: '15 d\u00e9c. 2024', time: '14:32', completed: true },
      { status: 'En pr\u00e9paration', date: '15 d\u00e9c. 2024', time: '16:45', completed: true },
      { status: 'Exp\u00e9di\u00e9', date: '16 d\u00e9c. 2024', time: '09:15', location: 'Montr\u00e9al, QC', completed: true },
      { status: 'En transit', date: '18 d\u00e9c. 2024', time: '11:30', location: 'Toronto, ON', completed: true, current: true },
      { status: 'Livr\u00e9', date: '22 d\u00e9c. 2024', time: '--:--', completed: false },
    ],
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSearching(true)

    // Simulate API call
    setTimeout(() => {
      if (orderNumber.toUpperCase() === 'ORD-2024-78542' || orderNumber === '78542') {
        setOrderResult(mockOrder)
      } else {
        setError('Aucune commande trouv\u00e9e avec ce num\u00e9ro. Veuillez v\u00e9rifier et r\u00e9essayer.')
        setOrderResult(null)
      }
      setIsSearching(false)
    }, 1000)
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'processing': return 'En traitement'
      case 'shipped': return 'Exp\u00e9di\u00e9'
      case 'in-transit': return 'En transit'
      case 'delivered': return 'Livr\u00e9'
      default: return status
    }
  }

  return (
    <div className="order-tracking-page">
      <div className="page-content">
        <div className="container">
          <div className="account-layout">
            <AccountSidebar locale={locale} />

            <main className="account-main">
              {/* Search Form */}
              <div className="tracking-search">
                <form onSubmit={handleSubmit} className="tracking-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="orderNumber">Num\u00e9ro de commande</label>
                      <input
                        type="text"
                        id="orderNumber"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        placeholder="Ex: ORD-2024-78542"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Courriel (optionnel)</label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@courriel.com"
                      />
                    </div>
                    <button type="submit" className="btn btn--primary" disabled={isSearching}>
                      {isSearching ? (
                        <>
                          <span className="spinner"></span>
                          Recherche...
                        </>
                      ) : (
                        <>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"/>
                            <path d="M21 21L16.65 16.65"/>
                          </svg>
                          Suivre
                        </>
                      )}
                    </button>
                  </div>
                  {error && <p className="form-error">{error}</p>}
                  <p className="form-hint">
                    Astuce: Essayez le num\u00e9ro <strong>ORD-2024-78542</strong> pour voir un exemple
                  </p>
                </form>
              </div>

              {/* Order Result */}
              {orderResult && (
                <div className="tracking-result">
                  {/* Order Summary */}
                  <div className="order-summary">
                    <div className="order-summary__header">
                      <div>
                        <h2>Commande {orderResult.id}</h2>
                        <p>Pass\u00e9e le {orderResult.date}</p>
                      </div>
                      <span className={`order-status order-status--${orderResult.status}`}>
                        {getStatusLabel(orderResult.status)}
                      </span>
                    </div>

                    <div className="order-summary__delivery">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="3" width="15" height="13"/>
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                        <circle cx="5.5" cy="18.5" r="2.5"/>
                        <circle cx="18.5" cy="18.5" r="2.5"/>
                      </svg>
                      <div>
                        <span>Livraison estim\u00e9e</span>
                        <strong>{orderResult.estimatedDelivery}</strong>
                      </div>
                    </div>

                    <div className="order-summary__tracking">
                      <span>Transporteur: <strong>{orderResult.tracking.carrier}</strong></span>
                      <span>Num\u00e9ro de suivi: <strong>{orderResult.tracking.number}</strong></span>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="tracking-timeline">
                    <h3>Historique de suivi</h3>
                    <div className="timeline">
                      {orderResult.timeline.map((step, index) => (
                        <div
                          key={index}
                          className={`timeline-step ${step.completed ? 'completed' : ''} ${step.current ? 'current' : ''}`}
                        >
                          <div className="timeline-step__marker">
                            {step.completed && !step.current ? (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            ) : step.current ? (
                              <span className="pulse"></span>
                            ) : null}
                          </div>
                          <div className="timeline-step__content">
                            <strong>{step.status}</strong>
                            <span>{step.date} \u00e0 {step.time}</span>
                            {step.location && <span className="location">{step.location}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="order-items">
                    <h3>Articles command\u00e9s</h3>
                    <div className="items-list">
                      {orderResult.items.map((item, index) => (
                        <div key={index} className="order-item">
                          <img src={item.image} alt={item.name} />
                          <div className="order-item__info">
                            <span className="order-item__name">{item.name}</span>
                            <span className="order-item__qty">Quantit\u00e9: {item.quantity}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Help Section */}
                  <div className="tracking-help">
                    <h3>Besoin d&apos;aide?</h3>
                    <p>Si vous avez des questions concernant votre commande, n&apos;h\u00e9sitez pas \u00e0 nous contacter.</p>
                    <div className="help-actions">
                      <Link href={`/${locale}/contact`} className="btn btn--outline">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                        </svg>
                        Nous contacter
                      </Link>
                      <a href="tel:+15141234567" className="btn btn--outline">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                        (514) 123-4567
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
