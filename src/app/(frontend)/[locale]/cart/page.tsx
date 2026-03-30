'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/providers/CartProvider'

export default function CartPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  const {
    items: cartItems,
    itemCount,
    subtotal,
    shipping,
    taxes,
    total,
    updateQuantity,
    removeItem,
    clearCart
  } = useCart()

  const [promoCode, setPromoCode] = useState<string>('')
  const [promoApplied, setPromoApplied] = useState<boolean>(false)
  const [discount, setDiscount] = useState<number>(0)

  const applyPromo = (e: React.FormEvent): void => {
    e.preventDefault()
    if (promoCode.toUpperCase() === 'SAVE10') {
      setPromoApplied(true)
      setDiscount(subtotal * 0.1)
    }
  }

  const finalTotal = total - discount

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-empty">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"/>
            </svg>
            <h1>{locale === 'fr' ? 'Votre panier est vide' : 'Your cart is empty'}</h1>
            <p>{locale === 'fr'
              ? 'D\u00e9couvrez nos produits et ajoutez-les \u00e0 votre panier.'
              : 'Discover our products and add them to your cart.'
            }</p>
            <Link href={`/${locale}`} className="btn btn--primary">
              {locale === 'fr' ? 'Continuer le magasinage' : 'Continue Shopping'}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>{locale === 'fr' ? `Panier (${itemCount} articles)` : `Cart (${itemCount} items)`}</h1>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            <div className="cart-header">
              <span>{locale === 'fr' ? 'Produit' : 'Product'}</span>
              <span>{locale === 'fr' ? 'Prix' : 'Price'}</span>
              <span>{locale === 'fr' ? 'Quantit\u00e9' : 'Quantity'}</span>
              <span>Total</span>
              <span></span>
            </div>

            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item__product">
                  <Link href={`/${locale}/product/${item.slug}`} className="cart-item__image">
                    <img
                      src={item.image || `https://placehold.co/200x200/1a1a1a/ffffff?text=${encodeURIComponent(item.name)}`}
                      alt={item.name}
                    />
                  </Link>
                  <div className="cart-item__details">
                    {item.brand && <span className="cart-item__brand">{item.brand}</span>}
                    <Link href={`/${locale}/product/${item.slug}`} className="cart-item__name">{item.name}</Link>
                    <div className="cart-item__options">
                      {item.sku && <span>SKU: {item.sku}</span>}
                      {item.size && <span>{locale === 'fr' ? 'Taille' : 'Size'}: {item.size}</span>}
                      {item.color && <span>{locale === 'fr' ? 'Couleur' : 'Color'}: {item.color}</span>}
                    </div>
                  </div>
                </div>

                <div className="cart-item__price">
                  <span className="price-current">{item.price.toFixed(2)} $</span>
                  {item.compareAtPrice && item.compareAtPrice > item.price && (
                    <span className="price-original">{item.compareAtPrice.toFixed(2)} $</span>
                  )}
                </div>

                <div className="cart-item__quantity">
                  <div className="quantity-selector">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                      min="1"
                    />
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>

                <div className="cart-item__total">
                  {(item.price * item.quantity).toFixed(2)} $
                </div>

                <button className="cart-item__remove" onClick={() => removeItem(item.id)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6H5H21"/>
                    <path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6"/>
                  </svg>
                </button>
              </div>
            ))}

            <div className="cart-actions">
              <Link href={`/${locale}`} className="btn btn--outline">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5"/>
                  <path d="M12 19L5 12L12 5"/>
                </svg>
                {locale === 'fr' ? 'Continuer le magasinage' : 'Continue Shopping'}
              </Link>
              <button className="btn btn--outline" onClick={clearCart}>
                {locale === 'fr' ? 'Vider le panier' : 'Clear Cart'}
              </button>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="cart-summary">
            <h2>{locale === 'fr' ? 'R\u00e9sum\u00e9 de la commande' : 'Order Summary'}</h2>

            <form className="promo-form" onSubmit={applyPromo}>
              <input
                type="text"
                placeholder={locale === 'fr' ? 'Code promo' : 'Promo code'}
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button type="submit" className="btn btn--outline">
                {locale === 'fr' ? 'Appliquer' : 'Apply'}
              </button>
            </form>
            {promoApplied && (
              <div className="promo-applied">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999"/>
                  <path d="M22 4L12 14.01L9 11.01"/>
                </svg>
                {locale === 'fr' ? 'Code SAVE10 appliqu\u00e9 - 10% de rabais!' : 'Code SAVE10 applied - 10% off!'}
              </div>
            )}

            <div className="summary-lines">
              <div className="summary-line">
                <span>{locale === 'fr' ? 'Sous-total' : 'Subtotal'}</span>
                <span>{subtotal.toFixed(2)} $</span>
              </div>
              {promoApplied && (
                <div className="summary-line summary-line--discount">
                  <span>{locale === 'fr' ? 'Rabais (10%)' : 'Discount (10%)'}</span>
                  <span>-{discount.toFixed(2)} $</span>
                </div>
              )}
              <div className="summary-line">
                <span>{locale === 'fr' ? 'Livraison' : 'Shipping'}</span>
                <span>{shipping === 0 ? (locale === 'fr' ? 'GRATUIT' : 'FREE') : `${shipping.toFixed(2)} $`}</span>
              </div>
              <div className="summary-line">
                <span>{locale === 'fr' ? 'Taxes estim\u00e9es' : 'Estimated Taxes'}</span>
                <span>{taxes.toFixed(2)} $</span>
              </div>
              <div className="summary-line summary-line--total">
                <span>Total</span>
                <span>{finalTotal.toFixed(2)} $</span>
              </div>
            </div>

            <Link href={`/${locale}/checkout`} className="btn btn--primary btn--lg btn--full">
              {locale === 'fr' ? 'Passer \u00e0 la caisse' : 'Proceed to Checkout'}
            </Link>

            <div className="cart-features">
              <div className="cart-feature">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="1" y="3" width="15" height="13" rx="1"/>
                  <path d="M16 8H20L23 11V16H16V8Z"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/>
                  <circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
                <span>{locale === 'fr' ? 'Livraison gratuite 99$+' : 'Free shipping $99+'}</span>
              </div>
              <div className="cart-feature">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"/>
                  <path d="M12 6V12L16 14"/>
                </svg>
                <span>{locale === 'fr' ? 'Retours sous 30 jours' : '30-day returns'}</span>
              </div>
              <div className="cart-feature">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11"/>
                </svg>
                <span>{locale === 'fr' ? 'Paiement s\u00e9curis\u00e9' : 'Secure payment'}</span>
              </div>
            </div>

            <div className="payment-methods">
              <svg width="50" height="30" viewBox="0 0 50 30" fill="none">
                <rect width="50" height="30" rx="4" fill="#1A1F71"/>
                <text x="25" y="19" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">VISA</text>
              </svg>
              <svg width="50" height="30" viewBox="0 0 50 30" fill="none">
                <rect width="50" height="30" rx="4" fill="#EB001B"/>
                <circle cx="20" cy="15" r="10" fill="#EB001B"/>
                <circle cx="30" cy="15" r="10" fill="#F79E1B"/>
                <path d="M25 7.5a10 10 0 010 15 10 10 0 000-15z" fill="#FF5F00"/>
              </svg>
              <svg width="50" height="30" viewBox="0 0 50 30" fill="none">
                <rect width="50" height="30" rx="4" fill="#2E77BC"/>
                <text x="25" y="19" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">AMEX</text>
              </svg>
              <svg width="50" height="30" viewBox="0 0 50 30" fill="none">
                <rect width="50" height="30" rx="4" fill="#003087"/>
                <text x="25" y="19" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">PayPal</text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
