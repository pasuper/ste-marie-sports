import { getPayload, asLocale } from '@/lib/payload'
import { t } from '@/lib/i18n'
import Link from 'next/link'
import ContactForm from './ContactForm'

export const revalidate = 3600

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const loc = asLocale(locale)
  const payload = await getPayload()
  const storeInfo = await payload.findGlobal({ slug: 'store-information', locale: loc })

  const getAddressLines = () => {
    if (!storeInfo?.address) return ['Adresse non disponible']
    const addr = storeInfo.address as any
    const lines: string[] = []
    if (addr.streetAddress || addr.street) lines.push(addr.streetAddress || addr.street)
    if (addr.city && (addr.province) && (addr.postalCode)) {
      lines.push(`${addr.city}, ${addr.province} ${addr.postalCode}`)
    }
    if (addr.country) lines.push(addr.country)
    return lines.length > 0 ? lines : ['Adresse non disponible']
  }

  const phone = (storeInfo as any)?.phone || (storeInfo as any)?.contact?.phone || null
  const email = (storeInfo as any)?.email || (storeInfo as any)?.contact?.email || null
  const businessHours = (storeInfo as any)?.businessHours || (storeInfo as any)?.hours || []

  const contactInfo = [
    {
      iconType: 'location' as const,
      title: locale === 'fr' ? 'Adresse' : 'Address',
      lines: getAddressLines(),
    },
    {
      iconType: 'phone' as const,
      title: locale === 'fr' ? 'Telephone' : 'Phone',
      lines: phone ? [phone] : ['Non disponible'],
    },
    {
      iconType: 'email' as const,
      title: locale === 'fr' ? 'Courriel' : 'Email',
      lines: email ? [email] : ['Non disponible'],
    },
    {
      iconType: 'hours' as const,
      title: locale === 'fr' ? "Heures d'ouverture" : 'Business Hours',
      lines: businessHours.length > 0
        ? businessHours.map((h: any) => `${h.day}: ${h.closed || h.isClosed ? 'Ferme' : `${h.open} - ${h.close}`}`)
        : ['Lun-Ven: 9h - 18h', 'Sam: 10h - 17h', 'Dim: Ferme'],
    },
  ]

  const addressStr = storeInfo?.address as any

  return (
    <div className="contact-us-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <h1>{locale === 'fr' ? 'Contactez-nous' : 'Contact Us'}</h1>
          <p>{locale === 'fr' ? 'Notre equipe est la pour vous aider' : 'Our team is here to help'}</p>
          <nav className="header-breadcrumb" aria-label="Fil d'Ariane">
            <Link href={`/${locale}`}>{locale === 'fr' ? 'Accueil' : 'Home'}</Link>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18L15 12L9 6"/>
            </svg>
            <span>Contact</span>
          </nav>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          {/* Contact Info Cards */}
          <div className="contact-info-grid">
            {contactInfo.map((info, index) => (
              <div key={index} className="contact-info-card">
                <div className="contact-info-icon">
                  {info.iconType === 'location' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  )}
                  {info.iconType === 'phone' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  )}
                  {info.iconType === 'email' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  )}
                  {info.iconType === 'hours' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                  )}
                </div>
                <h3>{info.title}</h3>
                {info.lines.map((line: string, i: number) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            ))}
          </div>

          <div className="contact-layout">
            {/* Contact Form */}
            <div className="contact-form-wrapper">
              <h2>{locale === 'fr' ? 'Envoyez-nous un message' : 'Send us a message'}</h2>
              <p>{locale === 'fr' ? 'Remplissez le formulaire ci-dessous et nous vous repondrons dans les plus brefs delais.' : 'Fill out the form below and we will get back to you as soon as possible.'}</p>

              <ContactForm locale={locale} />
            </div>

            {/* Map & FAQ */}
            <div className="contact-sidebar">
              {/* Map */}
              <div className="map-container">
                <div className="map-placeholder">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <p>{locale === 'fr' ? 'Carte Google Maps' : 'Google Maps'}</p>
                  <span>{addressStr?.streetAddress || addressStr?.street || 'Adresse'}, {addressStr?.city || 'Ville'}</span>
                </div>
              </div>

              {/* FAQ */}
              <div className="contact-faq">
                <h3>{locale === 'fr' ? 'Questions frequentes' : 'Frequently Asked Questions'}</h3>
                <div className="faq-list">
                  <details className="faq-item">
                    <summary>{locale === 'fr' ? 'Comment puis-je suivre ma commande?' : 'How can I track my order?'}</summary>
                    <p>{locale === 'fr' ? (
                      <>Vous pouvez suivre votre commande en utilisant notre <Link href={`/${locale}/suivi-commande`}>page de suivi</Link> ou en vous connectant a votre compte.</>
                    ) : (
                      <>You can track your order using our <Link href={`/${locale}/suivi-commande`}>tracking page</Link> or by logging into your account.</>
                    )}</p>
                  </details>
                  <details className="faq-item">
                    <summary>{locale === 'fr' ? 'Quels sont les delais de livraison?' : 'What are the delivery times?'}</summary>
                    <p>{locale === 'fr' ? 'Les delais varient selon l\'option choisie: Standard (5-7 jours), Express (2-3 jours), Prioritaire (1-2 jours).' : 'Delivery times vary by option: Standard (5-7 days), Express (2-3 days), Priority (1-2 days).'}</p>
                  </details>
                  <details className="faq-item">
                    <summary>{locale === 'fr' ? 'Comment retourner un article?' : 'How to return an item?'}</summary>
                    <p>{locale === 'fr' ? (
                      <>Consultez notre <Link href={`/${locale}/page/politique-retour`}>politique de retour</Link> pour les instructions completes.</>
                    ) : (
                      <>See our <Link href={`/${locale}/page/politique-retour`}>return policy</Link> for full instructions.</>
                    )}</p>
                  </details>
                </div>
                <Link href={`/${locale}/faq`} className="view-all-faq">
                  {locale === 'fr' ? 'Voir toutes les FAQ' : 'View all FAQ'}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14"/>
                    <path d="M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
