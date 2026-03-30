'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/providers/CartProvider'
import { useWishlist } from '@/providers/WishlistProvider'
import { getMediaUrl } from '@/lib/media'

interface ProductDetailProps {
  product: any
  relatedProducts: any[]
  locale: string
  galleryImages: string[]
  attributes: { name: string; value: string }[]
  descriptionHtml: string
}

export default function ProductDetail({
  product,
  relatedProducts,
  locale,
  galleryImages,
  attributes,
  descriptionHtml,
}: ProductDetailProps) {
  const { addItem } = useCart()
  const { isInWishlist, toggleItem } = useWishlist()

  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [activeImage, setActiveImage] = useState(0)

  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round((1 - product.price / product.compareAtPrice) * 100)
      : 0

  const brandName = typeof product.brand === 'object' ? product.brand?.name : undefined
  const brandSlug = typeof product.brand === 'object' ? product.brand?.slug : undefined
  const categoryName =
    typeof product.category === 'object'
      ? product.category?.displayName || product.category?.name
      : undefined
  const categorySlug = typeof product.category === 'object' ? product.category?.slug : undefined

  const getProductImage = (prod: any): string => {
    if (!prod) return 'https://placehold.co/800x800/f3f4f6/9ca3af?text=No+Image'
    if (prod.thumbnail) return getMediaUrl(prod.thumbnail)
    if (prod.images && prod.images.length > 0) return getMediaUrl(prod.images[0].image)
    return 'https://placehold.co/800x800/f3f4f6/9ca3af?text=No+Image'
  }

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        brand: brandName,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        image: galleryImages[0] || getMediaUrl(product.thumbnail),
        sku: product.sku,
      },
      quantity,
    )
  }

  const handleToggleWishlist = () => {
    toggleItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      brand: brandName,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: galleryImages[0] || getMediaUrl(product.thumbnail),
      inStock: (product.stock || 0) > 0,
    })
  }

  const wishlisted = isInWishlist(product.id)

  return (
    <div className="product-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="container">
          <Link href={`/${locale}/`}>Accueil</Link>
          <span>/</span>
          {categorySlug && (
            <>
              <Link href={`/${locale}/category/${categorySlug}`}>
                {categoryName}
              </Link>
              <span>/</span>
            </>
          )}
          <span>{product.name}</span>
        </div>
      </div>

      {/* Main Product Section */}
      <section className="product-main">
        <div className="container">
          <div className="product-layout">
            {/* Product Gallery */}
            <div className="product-gallery">
              <div className="product-gallery__main">
                <img src={galleryImages[activeImage] || 'https://placehold.co/800x800/f3f4f6/9ca3af?text=No+Image'} alt={product.name} />
                {discount > 0 && (
                  <span className="product-discount">-{discount}%</span>
                )}
              </div>
              {galleryImages.length > 1 && (
                <div className="product-gallery__thumbs">
                  {galleryImages.map((img, index) => (
                    <button
                      key={index}
                      className={`product-gallery__thumb ${activeImage === index ? 'active' : ''}`}
                      onClick={() => setActiveImage(index)}
                    >
                      <img src={img} alt={`${product.name} vue ${index + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="product-info">
              <div className="product-info__header">
                {brandSlug && (
                  <Link href={`/${locale}/brands/${brandSlug}`} className="product-brand">
                    {brandName}
                  </Link>
                )}
                <h1 className="product-title">{product.name}</h1>
                <div className="product-meta">
                  <span className="product-sku">SKU: {product.sku}</span>
                </div>
              </div>

              <div className="product-price-block">
                <span className="product-price">{product.price.toFixed(2)} $</span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <>
                    <span className="product-price-original">{product.compareAtPrice.toFixed(2)} $</span>
                    <span className="product-savings">
                      Économisez {(product.compareAtPrice - product.price).toFixed(2)} $
                    </span>
                  </>
                )}
              </div>

              <div className="product-stock">
                {(product.stock || 0) > 0 ? (
                  <span className="stock-available">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" />
                      <path d="M22 4L12 14.01L9 11.01" />
                    </svg>
                    En stock ({product.stock} disponibles)
                  </span>
                ) : (
                  <span className="stock-unavailable">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                    Rupture de stock
                  </span>
                )}
              </div>

              {/* Quantity */}
              <div className="product-option">
                <label>Quantité:</label>
                <div className="quantity-selector">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                  />
                  <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
              </div>

              {/* Actions */}
              <div className="product-actions">
                <button
                  className="btn btn--primary btn--lg btn--full"
                  disabled={(product.stock || 0) <= 0}
                  onClick={handleAddToCart}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" />
                  </svg>
                  Ajouter au panier
                </button>
                <button
                  className={`btn btn--outline btn--lg${wishlisted ? ' active' : ''}`}
                  onClick={handleToggleWishlist}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22249 22.4518 8.5C22.4518 7.77751 22.3095 7.0621 22.0329 6.39464C21.7563 5.72718 21.351 5.12075 20.84 4.61Z" />
                  </svg>
                </button>
              </div>

              {/* Shipping Info */}
              <div className="product-shipping">
                <div className="shipping-item">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="1" y="3" width="15" height="13" rx="1" />
                    <path d="M16 8H20L23 11V16H16V8Z" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                  <div>
                    <strong>Livraison gratuite</strong>
                    <span>Sur les commandes de 99$+</span>
                  </div>
                </div>
                <div className="shipping-item">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
                    <path d="M12 6V12L16 14" />
                  </svg>
                  <div>
                    <strong>Retours sous 30 jours</strong>
                    <span>Retours gratuits et faciles</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Tabs Section */}
      <section className="product-tabs-section">
        <div className="container">
          <div className="product-tabs">
            <div className="product-tabs__nav">
              <button
                className={activeTab === 'description' ? 'active' : ''}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              {attributes.length > 0 && (
                <button
                  className={activeTab === 'specs' ? 'active' : ''}
                  onClick={() => setActiveTab('specs')}
                >
                  Spécifications
                </button>
              )}
            </div>
            <div className="product-tabs__content">
              {activeTab === 'description' && (
                <div className="tab-content">
                  {descriptionHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
                  ) : (
                    <p>{product.shortDescription || 'Aucune description disponible.'}</p>
                  )}
                </div>
              )}
              {activeTab === 'specs' && attributes.length > 0 && (
                <div className="tab-content">
                  <table className="specs-table">
                    <tbody>
                      {attributes.map((attr, index) => (
                        <tr key={index}>
                          <th>{attr.name}</th>
                          <td>{attr.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="related-products">
          <div className="container">
            <h2>Produits similaires</h2>
            <div className="products-grid">
              {relatedProducts.map((prod) => (
                <Link key={prod.id} href={`/${locale}/product/${prod.slug}`} className="product-card">
                  <div className="product-card__image">
                    <img src={getProductImage(prod)} alt={prod.name} />
                  </div>
                  <div className="product-card__content">
                    {typeof prod.brand === 'object' && prod.brand?.name && (
                      <span className="product-card__brand">{prod.brand.name}</span>
                    )}
                    <h3 className="product-card__name">{prod.name}</h3>
                    <div className="product-card__price">
                      <span className="product-card__price-current">{prod.price.toFixed(2)} $</span>
                      {prod.compareAtPrice && prod.compareAtPrice > prod.price && (
                        <span className="product-card__price-original">{prod.compareAtPrice.toFixed(2)} $</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
