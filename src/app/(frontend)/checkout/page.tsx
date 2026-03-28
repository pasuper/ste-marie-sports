'use client'
import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useCart } from '@/providers/CartProvider'
import Link from 'next/link'
import Image from 'next/image'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const { items, subtotal, shipping, taxes, total, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    email: '', firstName: '', lastName: '', phone: '',
    address1: '', address2: '', city: '', province: 'QC', postalCode: '', country: 'CA',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setIsProcessing(true); setError(null)
    try {
      const { error: submitError } = await elements.submit()
      if (submitError) { setError(submitError.message || 'Payment error'); setIsProcessing(false); return }

      const { paymentIntent, error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: `${window.location.origin}/fr/suivi-commande` },
        redirect: 'if_required',
      })

      if (confirmError) { setError(confirmError.message || 'Payment failed'); setIsProcessing(false); return }

      if (paymentIntent?.status === 'succeeded') {
        // Create order
        await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderNumber: `SM-${Date.now()}`,
            email: form.email,
            status: 'processing',
            paymentStatus: 'paid',
            stripePaymentIntentId: paymentIntent.id,
            subtotal, taxAmount: taxes, shippingAmount: shipping, total,
            shippingAddress: form,
            billingAddress: form,
          }),
        })
        clearCart()
        window.location.href = '/fr/suivi-commande'
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment error')
    }
    setIsProcessing(false)
  }

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <h2>Informations</h2>
      <div className="form__row">
        <input type="text" placeholder="Prénom" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} required className="input" />
        <input type="text" placeholder="Nom" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} required className="input" />
      </div>
      <input type="email" placeholder="Courriel" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required className="input" />
      <input type="tel" placeholder="Téléphone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="input" />

      <h2>Adresse de livraison</h2>
      <input type="text" placeholder="Adresse" value={form.address1} onChange={e => setForm(f => ({ ...f, address1: e.target.value }))} required className="input" />
      <input type="text" placeholder="Appartement, suite (optionnel)" value={form.address2} onChange={e => setForm(f => ({ ...f, address2: e.target.value }))} className="input" />
      <div className="form__row">
        <input type="text" placeholder="Ville" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} required className="input" />
        <input type="text" placeholder="Province" value={form.province} onChange={e => setForm(f => ({ ...f, province: e.target.value }))} required className="input" />
        <input type="text" placeholder="Code postal" value={form.postalCode} onChange={e => setForm(f => ({ ...f, postalCode: e.target.value }))} required className="input" />
      </div>

      <h2>Paiement</h2>
      <PaymentElement />

      {error && <p className="alert alert--error">{error}</p>}
      <button type="submit" className="btn btn--primary btn--full" disabled={isProcessing || !stripe}>
        {isProcessing ? 'Traitement...' : `Payer $${total.toFixed(2)}`}
      </button>
    </form>
  )
}

export default function CheckoutPage() {
  const { items, subtotal, shipping, taxes, total } = useCart()
  const [clientSecret, setClientSecret] = useState('')

  useEffect(() => {
    if (items.length === 0) return
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Math.round(total * 100), currency: 'cad' }),
    })
      .then(res => res.json())
      .then(data => setClientSecret(data.clientSecret))
      .catch(console.error)
  }, [items, total])

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <h1>Panier vide</h1>
          <p>Votre panier est vide.</p>
          <Link href="/fr" className="btn btn--primary">Continuer les achats</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-page__header">
          <Link href="/fr" className="checkout-page__logo">Ste-Marie Sports</Link>
        </div>
        <div className="checkout-page__layout">
          <div className="checkout-page__form">
            {clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                <CheckoutForm />
              </Elements>
            ) : (
              <p>Chargement du paiement...</p>
            )}
          </div>
          <div className="checkout-page__summary">
            <h3>Résumé de la commande</h3>
            {items.map(item => (
              <div key={item.id} className="checkout-item">
                {item.image && <Image src={item.image} alt={item.name} width={60} height={60} />}
                <div>
                  <p>{item.name}</p>
                  <p>Qté: {item.quantity}</p>
                </div>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="summary-line"><span>Sous-total</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="summary-line"><span>Livraison</span><span>{shipping === 0 ? 'Gratuit' : `$${shipping.toFixed(2)}`}</span></div>
            <div className="summary-line"><span>Taxes</span><span>${taxes.toFixed(2)}</span></div>
            <div className="summary-line summary-line--total"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
