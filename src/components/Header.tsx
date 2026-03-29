'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/providers/AuthProvider'
import { useCart } from '@/providers/CartProvider'
import { useWishlist } from '@/providers/WishlistProvider'
import { getMediaUrl } from '@/lib/media'
import { t } from '@/lib/i18n'

interface HeaderProps {
  locale: string
  siteIdentity: any
  storeInfo: any
  menus: Record<string, any>
}

export default function Header({ locale, siteIdentity, storeInfo, menus }: HeaderProps) {
  const { user, isAuthenticated } = useAuth()
  const { itemCount: cartCount } = useCart()
  const { itemCount: wishlistCount } = useWishlist()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
  const pathname = usePathname()
  const dropdownRef = useRef<HTMLElement>(null)

  const otherLocale = locale === 'fr' ? 'en' : 'fr'
  const topbarMenu = menus['topbar-right']
  const mainMenu = menus['main-navigation']
  const mobileMenu = menus['mobile-main']
  const logoDarkUrl = siteIdentity?.logoDark ? getMediaUrl(siteIdentity.logoDark) : ''
  const redElementUrl = siteIdentity?.redelement ? getMediaUrl(siteIdentity.redelement) : ''
  const loc = locale as 'fr' | 'en'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
    setActiveDropdown(null)
  }, [pathname])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleDropdownClick = (index: number, e: React.MouseEvent) => {
    e.preventDefault()
    setActiveDropdown(activeDropdown === index ? null : index)
  }

  const getItemUrl = (item: any): string => {
    if (item.url) return item.url.startsWith('/') ? `/${locale}${item.url}` : item.url
    if (item.page?.slug) return `/${locale}/${item.page.slug}`
    return '#'
  }

  const renderMenuIcon = (icon?: any, className = 'ps-header__menu-icon') => {
    if (!icon?.url) return null
    return <img src={getMediaUrl(icon)} alt="" className={className} />
  }

  const renderMegaLink = (link: any) => (
    <Link
      key={link.id}
      href={getItemUrl(link)}
      className={`ps-header__mega-link ${link.highlight ? 'ps-header__mega-link--all' : ''}`}
      target={link.openInNewTab ? '_blank' : undefined}
    >
      {redElementUrl && <img src={redElementUrl} alt="" className="ps-header__mega-bullet" />}
      <span>{link.label}</span>
    </Link>
  )

  const renderClassicItem = (item: any, index: number) => {
    const isActive = activeDropdown === index
    const itemUrl = getItemUrl(item)
    const hasMega = item.hasMegaMenu !== false

    if (!hasMega) {
      return (
        <li key={item.id} className="ps-header__nav-item">
          <Link href={itemUrl} className="ps-header__nav-link" target={item.openInNewTab ? '_blank' : undefined}>
            {renderMenuIcon(item.icon)}
            <span>{item.label}</span>
          </Link>
        </li>
      )
    }

    return (
      <li key={item.id} className={`ps-header__nav-item ${isActive ? 'ps-header__nav-item--active' : ''}`}>
        <button className="ps-header__nav-link" onClick={(e) => handleDropdownClick(index, e)}>
          {renderMenuIcon(item.icon)}
          <span>{item.label}</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 4.5L6 7.5L9 4.5"/></svg>
        </button>
        <div className={`ps-header__mega ${isActive ? 'ps-header__mega--open' : ''}`}>
          <div className="ps-header__mega-container">
            <div className="ps-header__mega-col">
              <h4 className="ps-header__mega-title">{locale === 'fr' ? 'Véhicules' : 'Vehicles'}</h4>
              {item.vehicleImage && (
                <div className="ps-header__mega-vehicle-box">
                  <img src={getMediaUrl(item.vehicleImage)} alt={item.label} />
                </div>
              )}
              <div className="ps-header__mega-links">
                {item.vehicleLinks && item.vehicleLinks.length > 0 ? (
                  item.vehicleLinks.map(renderMegaLink)
                ) : (
                  <>
                    <Link href={`${itemUrl}?condition=new`} className="ps-header__mega-link">
                      {redElementUrl && <img src={redElementUrl} alt="" className="ps-header__mega-bullet" />}
                      <span>{locale === 'fr' ? 'Véhicules neufs' : 'New Vehicles'}</span>
                    </Link>
                    <Link href={`${itemUrl}?condition=used`} className="ps-header__mega-link">
                      {redElementUrl && <img src={redElementUrl} alt="" className="ps-header__mega-bullet" />}
                      <span>{locale === 'fr' ? 'Véhicules usagés' : 'Used Vehicles'}</span>
                    </Link>
                    <Link href={itemUrl} className="ps-header__mega-link ps-header__mega-link--all">{locale === 'fr' ? 'Tous les véhicules →' : 'All Vehicles →'}</Link>
                  </>
                )}
              </div>
            </div>
            <div className="ps-header__mega-col">
              <h4 className="ps-header__mega-title">{item.partsTitle || (locale === 'fr' ? 'Pièces' : 'Parts')}</h4>
              <div className="ps-header__mega-links">
                {item.partsLinks && item.partsLinks.length > 0 ? item.partsLinks.map(renderMegaLink) : <span className="ps-header__mega-empty">{locale === 'fr' ? 'Aucun lien configuré' : 'No links configured'}</span>}
              </div>
            </div>
            <div className="ps-header__mega-col">
              <h4 className="ps-header__mega-title">{item.accessoriesTitle || (locale === 'fr' ? 'Accessoires' : 'Accessories')}</h4>
              <div className="ps-header__mega-links">
                {item.accessoriesLinks && item.accessoriesLinks.length > 0 ? item.accessoriesLinks.map(renderMegaLink) : <span className="ps-header__mega-empty">{locale === 'fr' ? 'Aucun lien configuré' : 'No links configured'}</span>}
              </div>
            </div>
          </div>
          {item.showBrands && item.brands && item.brands.length > 0 && (
            <div className="ps-header__mega-brands">
              {item.brands.map((brand: any) => (
                <Link key={brand.id} href={`/${locale}/marques`} className="ps-header__mega-brand">
                  {brand.logo ? <img src={getMediaUrl(brand.logo)} alt={brand.name} /> : <span>{brand.name}</span>}
                </Link>
              ))}
              <Link href={`/${locale}/marques`} className="ps-header__mega-brands-link">{locale === 'fr' ? 'Voir toutes les marques →' : 'See all brands →'}</Link>
            </div>
          )}
        </div>
      </li>
    )
  }

  return (
    <header className={`ps-header ${scrolled ? 'ps-header--scrolled' : ''}`}>
      {/* Top Bar */}
      <div className="ps-header__topbar">
        <div className="ps-header__container">
          <div className="ps-header__topbar-left">
            <span className="ps-header__shipping">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13" rx="1"/>
                <path d="M16 8H20L23 11V16H16V8Z"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
              {t(loc, 'header.freeShipping')}
            </span>
          </div>
          <div className="ps-header__topbar-right">
            {topbarMenu?.items?.map((item: any, i: number) => (
              <Link key={i} href={getItemUrl(item)} target={item.openInNewTab ? '_blank' : undefined} className="ps-header__topbar-link">
                {renderMenuIcon(item.icon, 'ps-header__topbar-icon')}
                <span>{item.label}</span>
              </Link>
            ))}
            <div className="ps-header__lang">
              <Link href={`/fr${pathname?.replace(/^\/(fr|en)/, '') || ''}`} className={`ps-header__lang-btn ${locale === 'fr' ? 'active' : ''}`}>FR</Link>
              <span>|</span>
              <Link href={`/en${pathname?.replace(/^\/(fr|en)/, '') || ''}`} className={`ps-header__lang-btn ${locale === 'en' ? 'active' : ''}`}>EN</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="ps-header__main">
        <div className="ps-header__container">
          <button className="ps-header__mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">
            <span className={`ps-hamburger ${mobileMenuOpen ? 'ps-hamburger--open' : ''}`}>
              <span></span><span></span><span></span>
            </span>
          </button>

          <Link href={`/${locale}`} className="ps-header__logo">
            {logoDarkUrl ? (
              <img src={logoDarkUrl} alt={siteIdentity?.siteName || 'Logo'} className="ps-header__logo-img" />
            ) : (
              <div className="ps-logo">
                <span className="ps-logo__icon">
                  <svg viewBox="0 0 32 32" fill="none">
                    <path d="M16 2L4 8v16l12 6 12-6V8L16 2z" fill="url(#logoGradient)"/>
                    <path d="M16 6l8 4v12l-8 4-8-4V10l8-4z" fill="#fff" fillOpacity="0.2"/>
                    <path d="M16 10l4 2v6l-4 2-4-2v-6l4-2z" fill="#fff"/>
                    <defs><linearGradient id="logoGradient" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse"><stop stopColor="#e61e25"/><stop offset="1" stopColor="#7c1215"/></linearGradient></defs>
                  </svg>
                </span>
                <span className="ps-logo__text">STE-MARIE SPORTS</span>
              </div>
            )}
          </Link>

          <div className={`ps-header__search ${searchOpen ? 'ps-header__search--open' : ''}`}>
            <form className="ps-header__search-form" action={`/${locale}/category/search`}>
              <input type="search" name="q" placeholder={t(loc, 'header.searchPlaceholder')} className="ps-header__search-input" />
              <button type="submit" className="ps-header__search-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21L16.65 16.65"/></svg>
              </button>
            </form>
          </div>

          <div className="ps-header__actions">
            <button className="ps-header__action ps-header__action--search-mobile" onClick={() => setSearchOpen(!searchOpen)} aria-label="Rechercher">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21L16.65 16.65"/></svg>
            </button>

            <Link href={`/${locale}/mon-compte`} className="ps-header__action" aria-label={t(loc, 'header.account')}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span className="ps-header__action-label">
                {isAuthenticated && user?.firstName ? user.firstName : t(loc, 'header.account')}
              </span>
            </Link>

            <Link href={`/${locale}/ma-liste-envies`} className="ps-header__action" aria-label={t(loc, 'header.favorites')}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22249 22.4518 8.5C22.4518 7.77751 22.3095 7.0621 22.0329 6.39464C21.7563 5.72718 21.351 5.12075 20.84 4.61Z"/>
              </svg>
              {wishlistCount > 0 && <span className="ps-header__cart-count">{wishlistCount}</span>}
              <span className="ps-header__action-label">{t(loc, 'header.favorites')}</span>
            </Link>

            <Link href={`/${locale}/cart`} className="ps-header__action ps-header__cart" aria-label={t(loc, 'header.cart')}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"/>
              </svg>
              {cartCount > 0 && <span className="ps-header__cart-count">{cartCount}</span>}
              <span className="ps-header__action-label">{t(loc, 'header.cart')}</span>
            </Link>

            {storeInfo?.contact?.phone && (
              <a href={`tel:${storeInfo.contact.phone.replace(/\D/g, '')}`} className="ps-header__phone" aria-label="Appelez-nous">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <div className="ps-header__phone-info">
                  <span className="ps-header__phone-text">{locale === 'fr' ? 'Appelez-nous' : 'Call us'}</span>
                  <span className="ps-header__phone-number">{storeInfo.contact.phone}</span>
                </div>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="ps-header__nav" ref={dropdownRef}>
        <div className="ps-header__container">
          <ul className="ps-header__nav-list">
            {mainMenu?.items?.map((item: any, index: number) => renderClassicItem(item, index))}
          </ul>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`ps-header__mobile-menu ${mobileMenuOpen ? 'ps-header__mobile-menu--open' : ''}`}>
        <div className="ps-header__mobile-menu-inner">
          {(mobileMenu || mainMenu)?.items?.map((item: any) => (
            <div key={item.id || item.label} className="ps-header__mobile-category">
              <Link href={getItemUrl(item)} className="ps-header__mobile-link">
                {renderMenuIcon(item.icon, 'ps-header__mobile-icon')}
                <span>{item.label}</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </header>
  )
}
