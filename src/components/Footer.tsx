'use client'

import { useState, type FormEvent, type ChangeEvent } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getMediaUrl } from '@/lib/media'
import { t } from '@/lib/i18n'

interface FooterProps {
  locale: string
  siteIdentity: any
  storeInfo: any
  menus: Record<string, any>
}

export default function Footer({ locale, siteIdentity, storeInfo, menus }: FooterProps) {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const loc = locale as 'fr' | 'en'
  const footerLeft = menus['footer-left']
  const footerCenter = menus['footer-center']
  const footerRight = menus['footer-right']
  const footerBottom = menus['footer-bottom']

  const logoUrl = siteIdentity?.logoDark ? getMediaUrl(siteIdentity.logoDark) : '/logoste-marie.png'

  const getItemUrl = (item: any): string => {
    if (item.url) return item.url.startsWith('/') ? `/${locale}${item.url}` : item.url
    if (item.page?.slug) return `/${locale}/${item.page.slug}`
    return '#'
  }

  const handleNewsletterSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubscribed(true)
    setEmail('')
    setTimeout(() => setSubscribed(false), 3000)
  }

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const renderMenuColumn = (menu: any) => {
    if (!menu?.isActive && menu?.isActive !== undefined) return null
    if (!menu?.items?.length) return null

    return (
      <div className="ps-footer__col">
        <h4>{menu.name}</h4>
        <ul>
          {menu.items.map((item: any, index: number) => {
            const url = getItemUrl(item)
            const isExternal = url.startsWith('http')

            return (
              <li key={index}>
                {isExternal ? (
                  <a
                    href={url}
                    target={item.openInNewTab ? '_blank' : undefined}
                    rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link href={url}>{item.label}</Link>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  return (
    <footer className="ps-footer">
      {/* Newsletter Section */}
      <div className="ps-footer__newsletter">
        <div className="ps-footer__container">
          <div className="ps-footer__newsletter-content">
            <div className="ps-footer__newsletter-text">
              <h3>{t(loc, 'footer.newsletter')}</h3>
              <p>{locale === 'fr' ? 'Recevez nos offres exclusives et nouveautés directement dans votre boîte courriel.' : 'Receive our exclusive offers and new arrivals directly in your inbox.'}</p>
            </div>
            <form className="ps-footer__newsletter-form" onSubmit={handleNewsletterSubmit}>
              <div className="ps-footer__newsletter-input-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"/>
                  <path d="M22 6L12 13L2 6"/>
                </svg>
                <input
                  type="email"
                  placeholder={t(loc, 'footer.newsletterPlaceholder')}
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
              </div>
              <button type="submit" className={subscribed ? 'subscribed' : ''}>
                {subscribed ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M20 6L9 17L4 12"/>
                    </svg>
                    {locale === 'fr' ? 'Inscrit!' : 'Subscribed!'}
                  </>
                ) : t(loc, 'footer.subscribe')}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="ps-footer__features">
        <div className="ps-footer__container">
          <div className="ps-footer__features-grid">
            <div className="ps-footer__feature">
              <div className="ps-footer__feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="1" y="3" width="15" height="13" rx="1"/>
                  <path d="M16 8H20L23 11V16H16V8Z"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/>
                  <circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
              </div>
              <div>
                <h4>{locale === 'fr' ? 'Livraison gratuite' : 'Free Shipping'}</h4>
                <p>{locale === 'fr' ? 'Sur commandes de 99$+' : 'On orders $99+'}</p>
              </div>
            </div>
            <div className="ps-footer__feature">
              <div className="ps-footer__feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div>
                <h4>{locale === 'fr' ? 'Basé au Canada' : 'Based in Canada'}</h4>
                <p>{storeInfo?.address?.city && storeInfo?.address?.province ? `${storeInfo.address.city}, ${storeInfo.address.province}` : (locale === 'fr' ? 'Québec, Canada' : 'Quebec, Canada')}</p>
              </div>
            </div>
            <div className="ps-footer__feature">
              <div className="ps-footer__feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"/>
                  <path d="M12 6V12L16 14"/>
                </svg>
              </div>
              <div>
                <h4>{locale === 'fr' ? 'Retours faciles' : 'Easy Returns'}</h4>
                <p>{locale === 'fr' ? '30 jours pour retourner' : '30 days to return'}</p>
              </div>
            </div>
            <div className="ps-footer__feature">
              <div className="ps-footer__feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999"/>
                  <path d="M22 4L12 14.01L9 11.01"/>
                </svg>
              </div>
              <div>
                <h4>{locale === 'fr' ? 'Qualité garantie' : 'Quality Guaranteed'}</h4>
                <p>{locale === 'fr' ? 'Produits authentiques' : 'Authentic products'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="ps-footer__main">
        <div className="ps-footer__container">
          <div className="ps-footer__grid">
            {/* About */}
            <div className="ps-footer__col ps-footer__col--about">
              <Link href={`/${locale}`} className="ps-footer__logo">
                <img
                  src={logoUrl}
                  alt={siteIdentity?.siteName || 'Ste-Marie Sports'}
                  className="ps-footer__logo-img"
                />
              </Link>
              <p className="ps-footer__about">
                {storeInfo?.storeDescription || (locale === 'fr'
                  ? 'Votre destination pour les véhicules récréatifs, pièces et accessoires au Québec.'
                  : 'Your destination for recreational vehicles, parts and accessories in Quebec.')}
              </p>
              <div className="ps-footer__social">
                {siteIdentity?.socialLinks?.facebook && (
                  <a href={siteIdentity.socialLinks.facebook} aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z"/>
                    </svg>
                  </a>
                )}
                {siteIdentity?.socialLinks?.instagram && (
                  <a href={siteIdentity.socialLinks.instagram} aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="2" width="20" height="20" rx="5"/>
                      <circle cx="12" cy="12" r="4"/>
                      <circle cx="18" cy="6" r="1" fill="currentColor"/>
                    </svg>
                  </a>
                )}
                {siteIdentity?.socialLinks?.youtube && (
                  <a href={siteIdentity.socialLinks.youtube} aria-label="YouTube" target="_blank" rel="noopener noreferrer">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.54 6.42C22.4212 5.94541 22.1792 5.51057 21.8386 5.15941C21.498 4.80824 21.0707 4.55318 20.6 4.42C18.88 4 12 4 12 4C12 4 5.12 4 3.4 4.46C2.92925 4.59318 2.50198 4.84824 2.16137 5.19941C1.82076 5.55057 1.57876 5.98541 1.46 6.46C1.14521 8.20556 0.991228 9.97631 1 11.75C0.988687 13.537 1.14266 15.3213 1.46 17.08C1.59097 17.5398 1.83827 17.9581 2.17814 18.2945C2.51801 18.6308 2.93948 18.8738 3.4 19C5.12 19.46 12 19.46 12 19.46C12 19.46 18.88 19.46 20.6 19C21.0707 18.8668 21.498 18.6118 21.8386 18.2606C22.1792 17.9094 22.4212 17.4746 22.54 17C22.8524 15.2676 23.0063 13.5103 23 11.75C23.0113 9.96295 22.8573 8.1787 22.54 6.42Z"/>
                      <path d="M9.75 15.02L15.5 11.75L9.75 8.48V15.02Z" fill="white"/>
                    </svg>
                  </a>
                )}
                {siteIdentity?.socialLinks?.twitter && (
                  <a href={siteIdentity.socialLinks.twitter} aria-label="X / Twitter" target="_blank" rel="noopener noreferrer">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                )}
                {siteIdentity?.socialLinks?.tiktok && (
                  <a href={siteIdentity.socialLinks.tiktok} aria-label="TikTok" target="_blank" rel="noopener noreferrer">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.79a8.23 8.23 0 0 0 4.76 1.52V6.86a4.87 4.87 0 0 1-1-.17z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {/* Dynamic Footer Menus from CMS */}
            {renderMenuColumn(footerLeft)}
            {renderMenuColumn(footerCenter)}
            {renderMenuColumn(footerRight)}
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="ps-footer__bottom">
        <div className="ps-footer__container">
          <div className="ps-footer__bottom-content">
            <p>&copy; {new Date().getFullYear()} {siteIdentity?.siteName || 'Ste-Marie Sports'}. {t(loc, 'footer.allRightsReserved')}</p>
            {footerBottom?.items?.length > 0 && (
              <div className="ps-footer__legal">
                {footerBottom.items.map((item: any, index: number) => {
                  const url = getItemUrl(item)
                  const isExternal = url.startsWith('http')
                  return isExternal ? (
                    <a key={index} href={url} target={item.openInNewTab ? '_blank' : undefined} rel={item.openInNewTab ? 'noopener noreferrer' : undefined}>{item.label}</a>
                  ) : (
                    <Link key={index} href={url}>{item.label}</Link>
                  )
                })}
              </div>
            )}
            <div className="ps-footer__payments">
              <div className="ps-footer__payment-card">
                <svg viewBox="0 0 38 24" fill="none"><rect width="38" height="24" rx="3" fill="#1434CB"/><path d="M15.1 16.5L16.9 7.5H19.4L17.6 16.5H15.1Z" fill="white"/><path d="M26.2 7.7C25.7 7.5 24.9 7.3 23.9 7.3C21.4 7.3 19.6 8.6 19.6 10.5C19.6 11.9 20.9 12.7 21.9 13.2C22.9 13.7 23.2 14 23.2 14.5C23.2 15.2 22.4 15.5 21.6 15.5C20.5 15.5 19.9 15.3 19 14.9L18.6 14.7L18.2 17.2C18.9 17.5 20.1 17.8 21.4 17.8C24.1 17.8 25.8 16.5 25.8 14.5C25.8 13.4 25.1 12.5 23.6 11.8C22.7 11.3 22.2 11 22.2 10.5C22.2 10 22.8 9.5 23.9 9.5C24.8 9.5 25.5 9.7 26 9.9L26.3 10L26.7 7.7H26.2Z" fill="white"/><path d="M30.6 7.5C30.1 7.5 29.7 7.7 29.5 8.2L25.6 16.5H28.3L28.8 15H32L32.3 16.5H34.7L32.6 7.5H30.6ZM29.5 13C29.7 12.5 30.7 9.9 30.7 9.9C30.7 9.9 30.9 9.3 31 9L31.2 9.8C31.2 9.8 31.8 12.4 31.9 13H29.5Z" fill="white"/><path d="M12.7 7.5L10.2 13.5L9.9 12.1C9.4 10.4 7.8 8.6 6 7.7L8.3 16.5H11L15.4 7.5H12.7Z" fill="white"/><path d="M8 7.5H3.9L3.9 7.7C7.1 8.5 9.2 10.4 10 12.1L9.1 8.2C9 7.7 8.6 7.5 8 7.5Z" fill="#F9A533"/></svg>
              </div>
              <div className="ps-footer__payment-card">
                <svg viewBox="0 0 38 24" fill="none"><rect width="38" height="24" rx="3" fill="#000"/><circle cx="15" cy="12" r="7" fill="#EB001B"/><circle cx="23" cy="12" r="7" fill="#F79E1B"/><path fillRule="evenodd" clipRule="evenodd" d="M19 17.3C20.4 16.1 21.3 14.2 21.3 12C21.3 9.8 20.4 7.9 19 6.7C17.6 7.9 16.7 9.8 16.7 12C16.7 14.2 17.6 16.1 19 17.3Z" fill="#FF5F00"/></svg>
              </div>
              <div className="ps-footer__payment-card">
                <svg viewBox="0 0 38 24" fill="none"><rect width="38" height="24" rx="3" fill="#016FD0"/><path d="M18 7L14 17H16.5L17.1 15.5H20.9L21.5 17H24L20 7H18ZM17.7 13.5L19 10L20.3 13.5H17.7Z" fill="white"/><path d="M7 7V17H12V15H9.5V13H12V11H9.5V9H12V7H7Z" fill="white"/><path d="M26 7V17H28.5V13.5L31 17H34L31 13L34 9H31L28.5 12.5V7H26Z" fill="white"/></svg>
              </div>
              <div className="ps-footer__payment-card">
                <svg viewBox="0 0 38 24" fill="none"><rect width="38" height="24" rx="3" fill="#003087"/><path d="M14 9H11.5C11.2 9 11 9.2 11 9.5L10 15.5C10 15.7 10.1 15.9 10.4 15.9H11.6C11.9 15.9 12.1 15.7 12.1 15.4L12.4 13.7C12.4 13.4 12.6 13.2 12.9 13.2H14.1C16.2 13.2 17.4 12.2 17.7 10.2C17.8 9.3 17.7 8.6 17.3 8.1C16.9 7.6 16.1 7.3 15 7.3C14.8 7.3 14.5 7.3 14.2 7.4C14.1 8 14 9 14 9Z" fill="white"/><path d="M27.6 9.2C27.3 9.2 27.1 9.4 27.1 9.7L26.1 15.4C26.1 15.6 26.2 15.8 26.5 15.8H27.8C28.1 15.8 28.3 15.6 28.3 15.3L28.6 13.6C28.6 13.3 28.8 13.1 29.1 13.1H30.3C32.4 13.1 33.6 12.1 33.9 10.1C34 9.2 33.9 8.5 33.5 8C33.1 7.5 32.3 7.2 31.2 7.2H28.4C28.1 7.2 27.9 7.4 27.8 7.7L27.6 9.2Z" fill="white"/><path d="M21 10.5L20.7 12.1C20.7 12.3 20.5 12.4 20.3 12.4H19.3C18.9 12.4 18.7 12.7 18.7 12.7L18.7 12.7C18.6 13.1 18.9 13.4 19.3 13.4H20.2C20.5 13.4 20.7 13.6 20.7 13.9L20.4 15.4C20.4 15.7 20.2 15.9 19.9 15.9H18.6C17.5 15.9 16.5 15.2 16.3 14.1L15.8 11.3C15.6 10 16.4 8.8 17.7 8.5C17.9 8.5 18.1 8.4 18.4 8.4H20.5C21.2 8.4 21.7 8.9 21.7 9.6C21.7 9.9 21.4 10.2 21 10.5Z" fill="#009CDE"/></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
