'use client'
import { use, useState } from 'react'

export default function OrderTrackingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  const [orderNumber, setOrderNumber] = useState('')

  return (
    <div className="container">
      <h1 className="page-title">{locale === 'fr' ? 'Suivi de commande' : 'Order Tracking'}</h1>
      <form className="tracking-form" onSubmit={e => { e.preventDefault() }}>
        <input type="text" placeholder={locale === 'fr' ? 'Numéro de commande' : 'Order number'} value={orderNumber} onChange={e => setOrderNumber(e.target.value)} className="input" />
        <button type="submit" className="btn btn--primary">{locale === 'fr' ? 'Suivre' : 'Track'}</button>
      </form>
    </div>
  )
}
