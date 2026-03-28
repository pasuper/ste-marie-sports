'use client'
import { use } from 'react'
import { useWishlist } from '@/providers/WishlistProvider'
import Link from 'next/link'
import Image from 'next/image'

export default function MyWishlistPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  const { items, removeItem } = useWishlist()

  return (
    <div className="container">
      <h1 className="page-title">{locale === 'fr' ? 'Ma liste de souhaits' : 'My Wishlist'}</h1>
      {items.length === 0 ? (
        <p>{locale === 'fr' ? 'Votre liste est vide.' : 'Your wishlist is empty.'}</p>
      ) : (
        <div className="grid grid--4">
          {items.map(item => (
            <div key={item.id} className="wishlist-item">
              {item.image && <Image src={item.image} alt={item.name} width={200} height={200} />}
              <h3><Link href={`/${locale}/product/${item.slug}`}>{item.name}</Link></h3>
              <p>${item.price.toFixed(2)}</p>
              <button onClick={() => removeItem(item.id)}>{locale === 'fr' ? 'Retirer' : 'Remove'}</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
