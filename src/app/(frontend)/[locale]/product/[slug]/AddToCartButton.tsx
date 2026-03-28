'use client'

import { useState } from 'react'
import { useCart } from '@/providers/CartProvider'
import { getMediaUrl } from '@/lib/media'

export default function AddToCartButton({ product, locale }: { product: any; locale: string }) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      brand: typeof product.brand === 'object' ? product.brand.name : undefined,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: getMediaUrl(product.thumbnail),
      sku: product.sku,
    }, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="add-to-cart">
      <div className="add-to-cart__quantity">
        <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
        <span>{quantity}</span>
        <button onClick={() => setQuantity(q => q + 1)}>+</button>
      </div>
      <button className="add-to-cart__button" onClick={handleAdd} disabled={product.stock === 0}>
        {added ? (locale === 'fr' ? 'Ajouté!' : 'Added!') : (locale === 'fr' ? 'Ajouter au panier' : 'Add to Cart')}
      </button>
    </div>
  )
}
