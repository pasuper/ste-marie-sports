'use client'

import { useCart } from '@/providers/CartProvider'
import Link from 'next/link'
import Image from 'next/image'
import { use } from 'react'

export default function CartPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  const { items, itemCount, subtotal, shipping, taxes, total, removeItem, updateQuantity, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <h1 className="page-title">{locale === 'fr' ? 'Panier' : 'Cart'}</h1>
          <div className="cart-page__empty">
            <p>{locale === 'fr' ? 'Votre panier est vide.' : 'Your cart is empty.'}</p>
            <Link href={`/${locale}`} className="btn btn--primary">{locale === 'fr' ? 'Continuer les achats' : 'Continue Shopping'}</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">{locale === 'fr' ? 'Panier' : 'Cart'} ({itemCount})</h1>
        <div className="cart-page__layout">
          <div className="cart-page__items">
            {items.map(item => (
              <div key={item.id} className="cart-item">
                {item.image && <Image src={item.image} alt={item.name} width={100} height={100} className="cart-item__image" />}
                <div className="cart-item__info">
                  <h3>{item.name}</h3>
                  {item.brand && <span className="cart-item__brand">{item.brand}</span>}
                  {item.sku && <span className="cart-item__sku">SKU: {item.sku}</span>}
                </div>
                <div className="cart-item__quantity">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <div className="cart-item__price">${(item.price * item.quantity).toFixed(2)}</div>
                <button className="cart-item__remove" onClick={() => removeItem(item.id)}>&times;</button>
              </div>
            ))}
            <button className="btn btn--text" onClick={clearCart}>{locale === 'fr' ? 'Vider le panier' : 'Clear Cart'}</button>
          </div>
          <div className="cart-page__summary">
            <h3>{locale === 'fr' ? 'Résumé' : 'Summary'}</h3>
            <div className="summary-line"><span>{locale === 'fr' ? 'Sous-total' : 'Subtotal'}</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="summary-line"><span>{locale === 'fr' ? 'Livraison' : 'Shipping'}</span><span>{shipping === 0 ? (locale === 'fr' ? 'Gratuit' : 'Free') : `$${shipping.toFixed(2)}`}</span></div>
            <div className="summary-line"><span>{locale === 'fr' ? 'Taxes' : 'Taxes'}</span><span>${taxes.toFixed(2)}</span></div>
            <div className="summary-line summary-line--total"><span>Total</span><span>${total.toFixed(2)}</span></div>
            <Link href={`/${locale}/checkout`} className="btn btn--primary btn--full">{locale === 'fr' ? 'Passer à la caisse' : 'Proceed to Checkout'}</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
