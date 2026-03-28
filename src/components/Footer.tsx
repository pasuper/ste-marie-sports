import Link from 'next/link'

interface FooterProps {
  locale: string
  siteIdentity: any
  storeInfo: any
  menus: Record<string, any>
}

export default function Footer({ locale, siteIdentity, storeInfo, menus }: FooterProps) {
  const footerLeft = menus['footer-left']
  const footerCenter = menus['footer-center']
  const footerRight = menus['footer-right']
  const footerBottom = menus['footer-bottom']

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Store Info */}
          <div className="footer__col">
            <h3 className="footer__title">{siteIdentity?.siteName || 'Ste-Marie Sports'}</h3>
            {storeInfo?.address && (
              <address className="footer__address">
                {storeInfo.address.street && <p>{storeInfo.address.street}</p>}
                {storeInfo.address.city && <p>{storeInfo.address.city}, {storeInfo.address.province} {storeInfo.address.postalCode}</p>}
              </address>
            )}
            {storeInfo?.contact?.phone && (
              <p><a href={`tel:${storeInfo.contact.phone}`}>{storeInfo.contact.phone}</a></p>
            )}
            {storeInfo?.contact?.email && (
              <p><a href={`mailto:${storeInfo.contact.email}`}>{storeInfo.contact.email}</a></p>
            )}
          </div>

          {/* Footer Menus */}
          {footerLeft && (
            <div className="footer__col">
              <h3 className="footer__title">{footerLeft.name}</h3>
              <ul className="footer__links">
                {footerLeft.items?.map((item: any, i: number) => (
                  <li key={i}><Link href={item.url || `/${locale}`}>{item.label}</Link></li>
                ))}
              </ul>
            </div>
          )}

          {footerCenter && (
            <div className="footer__col">
              <h3 className="footer__title">{footerCenter.name}</h3>
              <ul className="footer__links">
                {footerCenter.items?.map((item: any, i: number) => (
                  <li key={i}><Link href={item.url || `/${locale}`}>{item.label}</Link></li>
                ))}
              </ul>
            </div>
          )}

          {footerRight && (
            <div className="footer__col">
              <h3 className="footer__title">{footerRight.name}</h3>
              <ul className="footer__links">
                {footerRight.items?.map((item: any, i: number) => (
                  <li key={i}><Link href={item.url || `/${locale}`}>{item.label}</Link></li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Social Links */}
        {siteIdentity?.socialLinks && (
          <div className="footer__social">
            {siteIdentity.socialLinks.facebook && <a href={siteIdentity.socialLinks.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>}
            {siteIdentity.socialLinks.instagram && <a href={siteIdentity.socialLinks.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>}
            {siteIdentity.socialLinks.youtube && <a href={siteIdentity.socialLinks.youtube} target="_blank" rel="noopener noreferrer">YouTube</a>}
            {siteIdentity.socialLinks.tiktok && <a href={siteIdentity.socialLinks.tiktok} target="_blank" rel="noopener noreferrer">TikTok</a>}
          </div>
        )}

        {/* Bottom Bar */}
        <div className="footer__bottom">
          <p>&copy; {new Date().getFullYear()} {siteIdentity?.siteName || 'Ste-Marie Sports'}. {locale === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}</p>
          {footerBottom && (
            <ul className="footer__bottom-links">
              {footerBottom.items?.map((item: any, i: number) => (
                <li key={i}><Link href={item.url || `/${locale}`}>{item.label}</Link></li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  )
}
