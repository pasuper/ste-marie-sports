'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export interface CartItem {
  id: string
  name: string
  slug: string
  brand?: string
  price: number
  compareAtPrice?: number
  quantity: number
  image?: string
  sku?: string
  size?: string
  color?: string
}

interface CartContextType {
  items: CartItem[]
  itemCount: number
  subtotal: number
  shipping: number
  taxes: number
  total: number
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  isInCart: (id: string) => boolean
  getItemQuantity: (id: string) => number
}

const CartContext = createContext<CartContextType | null>(null)

const CART_STORAGE_KEY = 'stemarie_cart'
const TAX_RATE = 0.14975
const FREE_SHIPPING_THRESHOLD = 99
const SHIPPING_COST = 14.99

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      if (saved) setItems(JSON.parse(saved))
    } catch {}
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      try { localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items)) } catch {}
    }
  }, [items, mounted])

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const taxes = (subtotal + shipping) * TAX_RATE
  const total = subtotal + shipping + taxes

  const addItem = (newItem: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setItems(current => {
      const idx = current.findIndex(item => item.id === newItem.id)
      if (idx >= 0) {
        const updated = [...current]
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + quantity }
        return updated
      }
      return [...current, { ...newItem, quantity }]
    })
  }

  const removeItem = (id: string) => setItems(c => c.filter(item => item.id !== id))

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) { removeItem(id); return }
    setItems(c => c.map(item => item.id === id ? { ...item, quantity } : item))
  }

  const clearCart = () => setItems([])
  const isInCart = (id: string) => items.some(item => item.id === id)
  const getItemQuantity = (id: string) => items.find(item => item.id === id)?.quantity || 0

  return (
    <CartContext.Provider value={{ items, itemCount, subtotal, shipping, taxes, total, addItem, removeItem, updateQuantity, clearCart, isInCart, getItemQuantity }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
