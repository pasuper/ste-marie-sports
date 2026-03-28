'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/providers/AuthProvider'
import { useCart } from '@/providers/CartProvider'
import { useWishlist } from '@/providers/WishlistProvider'
import { getMediaUrl } from '@/lib/media'

interface HeaderProps {
  locale: string
  siteIdentity: any
  storeInfo: any
  menus: Record<string, any>
}

export default function Header({ locale, siteIdentity, storeInfo, menus }: HeaderProps) {
  const { user, isAuthenticated, logout } = useAuth()
  const { itemCount } = useCart()
  const { itemCount: wishlistCount } = useWishlist()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const otherLocale = locale === 'fr' ? 'en' : 'fr'
  const mainNav = menus['main-navigation']
  const topbarRight = menus['topbar-right']
  const logoUrl = siteIdentity?.logoDark ? getMediaUrl(siteIdentity.logoDark) : ''

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/${locale}/category/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <header className="header">
      {/* Top Bar */}
      <div className="header__topbar">
        <div className="container">
          <div className="header__topbar-left">
            {storeInfo?.contact?.phone && (
              <a href={`tel:${storeInfo.contact.phone}`} className="header__phone">
                {storeInfo.contact.phone}
              </a>
            )}
          </div>
          <div className="header__topbar-right">
            {topbarRight?.items?.map((item: any, i: number) => (
              <Link key={i} href={item.url || `/${locale}`} className="header__topbar-link">
                {item.label}
              </Link>
            ))}
            <Link href={`/${otherLocale}`} className="header__lang-toggle">
              {otherLocale.toUpperCase()}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="header__main">
        <div className="container">
          <Link href={`/${locale}`} className="header__logo">
            {logoUrl ? (
              <Image src={logoUrl} alt={siteIdentity?.siteName || 'Ste-Marie Sports'} width={200} height={50} priority />
            ) : (
              <span className="header__logo-text">{siteIdentity?.siteName || 'Ste-Marie Sports'}</span>
            )}
          </Link>

          {/* Search */}
          <form className="header__search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder={locale === 'fr' ? 'Rechercher...' : 'Search...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="header__search-input"
            />
            <button type="submit" className="header__search-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </button>
          </form>

          {/* Icons */}
          <div className="header__icons">
            <Link href={`/${locale}/mon-compte`} className="header__icon" title={locale === 'fr' ? 'Mon compte' : 'My account'}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </Link>
            <Link href={`/${locale}/ma-liste-envies`} className="header__icon" title={locale === 'fr' ? 'Liste de souhaits' : 'Wishlist'}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
              {wishlistCount > 0 && <span className="header__badge">{wishlistCount}</span>}
            </Link>
            <Link href={`/${locale}/cart`} className="header__icon" title={locale === 'fr' ? 'Panier' : 'Cart'}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
              {itemCount > 0 && <span className="header__badge">{itemCount}</span>}
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button className="header__mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`header__nav ${mobileMenuOpen ? 'header__nav--open' : ''}`}>
        <div className="container">
          <ul className="header__nav-list">
            {mainNav?.items?.map((item: any, i: number) => (
              <li key={i} className="header__nav-item">
                <Link href={item.url || `/${locale}`} className="header__nav-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}
