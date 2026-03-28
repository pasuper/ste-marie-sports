'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/providers/CartProvider'
import { useWishlist } from '@/providers/WishlistProvider'
import { getMediaUrl } from '@/lib/media'

interface ProductCardProps {
  product: any
  locale: string
}

export default function ProductCard({ product, locale }: ProductCardProps) {
  const { addItem } = useCart()
  const { isInWishlist, toggleItem } = useWishlist()
  const imageUrl = getMediaUrl(product.thumbnail)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      brand: typeof product.brand === 'object' ? product.brand.name : undefined,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: imageUrl,
      sku: product.sku,
    })
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    toggleItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      brand: typeof product.brand === 'object' ? product.brand.name : undefined,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: imageUrl,
      inStock: product.stock > 0,
    })
  }

  return (
    <div className="product-card">
      <Link href={`/${locale}/product/${product.slug}`} className="product-card__link">
        <div className="product-card__image-wrapper">
          <Image src={imageUrl} alt={product.name} width={300} height={300} className="product-card__image" />
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="product-card__badge product-card__badge--sale">
              {locale === 'fr' ? 'Solde' : 'Sale'}
            </span>
          )}
          <button className={`product-card__wishlist ${isInWishlist(product.id) ? 'product-card__wishlist--active' : ''}`} onClick={handleToggleWishlist}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill={isInWishlist(product.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
          </button>
        </div>
        <div className="product-card__info">
          {typeof product.brand === 'object' && product.brand?.name && (
            <span className="product-card__brand">{product.brand.name}</span>
          )}
          <h3 className="product-card__name">{product.name}</h3>
          <div className="product-card__pricing">
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="product-card__compare-price">${product.compareAtPrice.toFixed(2)}</span>
            )}
            <span className="product-card__price">${product.price.toFixed(2)}</span>
          </div>
        </div>
      </Link>
      <button className="product-card__add-to-cart" onClick={handleAddToCart}>
        {locale === 'fr' ? 'Ajouter au panier' : 'Add to Cart'}
      </button>
    </div>
  )
}
