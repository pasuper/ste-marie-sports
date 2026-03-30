'use client'

import Link from 'next/link'
import { useCart } from '@/providers/CartProvider'
import { useWishlist } from '@/providers/WishlistProvider'
import { getMediaUrl } from '@/lib/media'

interface ProductCardProps {
  product: any
  locale: string
  viewMode?: 'grid' | 'list'
}

export default function ProductCard({ product, locale, viewMode = 'grid' }: ProductCardProps) {
  const { addItem } = useCart()
  const { isInWishlist, toggleItem } = useWishlist()
  const imageUrl = getMediaUrl(product.thumbnail)
  const brandName = typeof product.brand === 'object' ? (typeof product.brand?.name === 'string' ? product.brand.name : product.brand?.name?.fr || '') : undefined
  const productName = typeof product.name === 'string' ? product.name : product.name?.fr || ''
  const inStock = product.stock > 0
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price
  const discount = hasDiscount
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: product.id,
      name: productName,
      slug: product.slug,
      brand: brandName,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: imageUrl,
      sku: product.sku,
    })
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleItem({
      id: product.id,
      name: productName,
      slug: product.slug,
      brand: brandName,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: imageUrl,
      inStock,
    })
  }

  return (
    <article className="product-card">
      <Link href={`/${locale}/product/${product.slug}`} className="product-card__link">
        <div className="product-card__image">
          <img
            src={imageUrl}
            alt={productName}
            className="product-card__img"
            loading="lazy"
          />

          {hasDiscount && (
            <span className="product-card__badge product-card__badge--solde">
              -{discount}%
            </span>
          )}

          {!inStock && (
            <div className="product-card__out-of-stock">
              {locale === 'fr' ? 'Rupture de stock' : 'Out of Stock'}
            </div>
          )}

          <button
            className={`product-card__wishlist ${isInWishlist(product.id) ? 'product-card__wishlist--active' : ''}`}
            onClick={handleToggleWishlist}
            aria-label={locale === 'fr' ? 'Liste de souhaits' : 'Wishlist'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={isInWishlist(product.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
          </button>

          {inStock && (
            <button
              className="product-card__quick-add"
              onClick={handleAddToCart}
              aria-label={locale === 'fr' ? 'Ajouter au panier' : 'Add to cart'}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M6 6H18L16.5 13H7.5L6 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M6 6L5 2H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="8" cy="17" r="1.5" fill="currentColor"/>
                <circle cx="15" cy="17" r="1.5" fill="currentColor"/>
              </svg>
              <span>{locale === 'fr' ? 'Ajouter' : 'Add'}</span>
            </button>
          )}
        </div>

        <div className="product-card__content">
          {brandName && (
            <span className="product-card__brand">{brandName}</span>
          )}

          <h3 className="product-card__name">{productName}</h3>

          {viewMode === 'list' && product.sku && (
            <span className="product-card__sku">SKU: {product.sku}</span>
          )}

          <div className="product-card__price">
            <span className="product-card__price-current">
              {product.price?.toFixed(2)} $
            </span>
            {hasDiscount && (
              <span className="product-card__price-original">
                {product.compareAtPrice.toFixed(2)} $
              </span>
            )}
          </div>

          {viewMode === 'list' && inStock && (
            <button className="product-card__add-btn" onClick={handleAddToCart}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"/>
              </svg>
              {locale === 'fr' ? 'Ajouter au panier' : 'Add to Cart'}
            </button>
          )}
        </div>
      </Link>
    </article>
  )
}
