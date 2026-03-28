'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export interface WishlistItem {
  id: string
  name: string
  slug: string
  brand?: string
  price: number
  compareAtPrice?: number
  image?: string
  inStock: boolean
  addedAt: string
}

interface WishlistContextType {
  items: WishlistItem[]
  itemCount: number
  addItem: (item: Omit<WishlistItem, 'addedAt'>) => void
  removeItem: (id: string) => void
  clearWishlist: () => void
  isInWishlist: (id: string) => boolean
  toggleItem: (item: Omit<WishlistItem, 'addedAt'>) => void
}

const WishlistContext = createContext<WishlistContextType | null>(null)

const WISHLIST_STORAGE_KEY = 'stemarie_wishlist'

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY)
      if (saved) setItems(JSON.parse(saved))
    } catch {}
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      try { localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items)) } catch {}
    }
  }, [items, mounted])

  const addItem = (newItem: Omit<WishlistItem, 'addedAt'>) => {
    setItems(current => {
      if (current.some(item => item.id === newItem.id)) return current
      return [...current, { ...newItem, addedAt: new Date().toISOString() }]
    })
  }

  const removeItem = (id: string) => setItems(c => c.filter(item => item.id !== id))
  const clearWishlist = () => setItems([])
  const isInWishlist = (id: string) => items.some(item => item.id === id)
  const toggleItem = (item: Omit<WishlistItem, 'addedAt'>) => {
    isInWishlist(item.id) ? removeItem(item.id) : addItem(item)
  }

  return (
    <WishlistContext.Provider value={{ items, itemCount: items.length, addItem, removeItem, clearWishlist, isInWishlist, toggleItem }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) throw new Error('useWishlist must be used within WishlistProvider')
  return context
}
