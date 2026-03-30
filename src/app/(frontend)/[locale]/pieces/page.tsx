import Link from 'next/link'
import { getPayload, asLocale } from '@/lib/payload'
import { getMediaUrl } from '@/lib/media'
import ProductCard from '@/components/ProductCard'

export const revalidate = 60

export default async function PiecesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const loc = asLocale(locale)
  const payload = await getPayload()

  // Fetch categories
  const catResult = await payload.find({
    collection: 'categories',
    locale: loc,
    limit: 8,
    sort: 'name',
  })
  const categories = catResult.docs

  // Fetch featured products
  let featuredProducts: any[] = []
  try {
    const prodResult = await payload.find({
      collection: 'products',
      locale: loc,
      where: { isFeatured: { equals: true } },
      limit: 8,
      depth: 1,
    })
    featuredProducts = prodResult.docs
    if (featuredProducts.length === 0) {
      const fallback = await payload.find({
        collection: 'products',
        locale: loc,
        limit: 8,
        depth: 1,
      })
      featuredProducts = fallback.docs
    }
  } catch { /* ignore */ }

  // Fetch brands
  let brands: any[] = []
  try {
    const brandResult = await payload.find({
      collection: 'brands',
      locale: loc,
      where: { isFeatured: { equals: true } },
      limit: 8,
      depth: 1,
    })
    brands = brandResult.docs
    if (brands.length === 0) {
      const fallback = await payload.find({
        collection: 'brands',
        locale: loc,
        limit: 8,
        depth: 1,
      })
      brands = fallback.docs
    }
  } catch { /* ignore */ }

  return (
    <div className="pieces-page">
      {/* Hero Section */}
      <section className="pieces-hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <span className="hero-badge">{loc === 'fr' ? 'Plus de 50,000 pi\u00e8ces en inventaire' : 'Over 50,000 parts in stock'}</span>
            <h1>{loc === 'fr' ? 'Pi\u00e8ces & Composantes' : 'Parts & Components'}</h1>
            <p>{loc === 'fr'
              ? 'Trouvez les pi\u00e8ces exactes pour votre v\u00e9hicule avec notre syst\u00e8me de recherche YMMT'
              : 'Find the exact parts for your vehicle with our YMMT search system'
            }</p>

            <nav className="hero-breadcrumb" aria-label="Breadcrumb">
              <Link href={`/${locale}`}>{loc === 'fr' ? 'Accueil' : 'Home'}</Link>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18L15 12L9 6"/>
              </svg>
              <span>{loc === 'fr' ? 'Pi\u00e8ces & Composantes' : 'Parts & Components'}</span>
            </nav>

            {/* Quick Stats */}
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="stat-value">50,000+</span>
                <span className="stat-label">{loc === 'fr' ? 'Pi\u00e8ces disponibles' : 'Parts available'}</span>
              </div>
              <div className="hero-stat">
                <span className="stat-value">200+</span>
                <span className="stat-label">{loc === 'fr' ? 'Marques' : 'Brands'}</span>
              </div>
              <div className="hero-stat">
                <span className="stat-value">24h</span>
                <span className="stat-label">{loc === 'fr' ? 'Exp\u00e9dition rapide' : 'Fast shipping'}</span>
              </div>
              <div className="hero-stat">
                <span className="stat-value">100%</span>
                <span className="stat-label">{loc === 'fr' ? 'Garantie fit' : 'Fit guarantee'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="pieces-categories">
          <div className="container">
            <div className="section-header">
              <h2>{loc === 'fr' ? 'Cat\u00e9gories de pi\u00e8ces' : 'Parts Categories'}</h2>
              <p>{loc === 'fr' ? 'Explorez notre vaste s\u00e9lection de pi\u00e8ces par cat\u00e9gorie' : 'Explore our vast selection of parts by category'}</p>
            </div>

            <div className="categories-grid">
              {categories.map((category: any) => (
                <Link key={category.id} href={`/${locale}/category/${category.slug}`} className="category-card">
                  <div className="category-card__image">
                    <img
                      src={category.image ? getMediaUrl(category.image) : `https://placehold.co/400x300/1a1a1a/ffffff?text=${encodeURIComponent(category.name)}`}
                      alt={category.name}
                    />
                  </div>
                  <div className="category-card__content">
                    <h3>{category.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Parts */}
      {featuredProducts.length > 0 && (
        <section className="pieces-featured">
          <div className="container">
            <div className="section-header">
              <div>
                <h2>{loc === 'fr' ? 'Pi\u00e8ces populaires' : 'Popular Parts'}</h2>
                <p>{loc === 'fr' ? 'Les pi\u00e8ces les plus vendues par nos clients' : 'Best-selling parts by our customers'}</p>
              </div>
              <Link href={`/${locale}/category/pieces`} className="view-all-btn">
                {loc === 'fr' ? 'Voir tout' : 'View all'}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>

            <div className="products-slider">
              {featuredProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brands Section */}
      {brands.length > 0 && (
        <section className="pieces-brands">
          <div className="container">
            <div className="section-header section-header--center">
              <h2>{loc === 'fr' ? 'Marques de confiance' : 'Trusted Brands'}</h2>
              <p>{loc === 'fr' ? 'Nous travaillons avec les meilleures marques de l\'industrie' : 'We work with the best brands in the industry'}</p>
            </div>

            <div className="brands-grid">
              {brands.map((brand: any) => (
                <Link key={brand.id} href={`/${locale}/marque/${brand.slug}`} className="brand-card">
                  <img
                    src={brand.logo ? getMediaUrl(brand.logo) : `https://placehold.co/180x80/ffffff/1a1a1a?text=${encodeURIComponent(brand.name)}`}
                    alt={brand.name}
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Info Banner */}
      <section className="pieces-info">
        <div className="container">
          <div className="info-grid">
            <div className="info-card">
              <div className="info-card__icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
              </div>
              <h3>{loc === 'fr' ? 'Garantie de compatibilit\u00e9' : 'Compatibility Guarantee'}</h3>
              <p>{loc === 'fr'
                ? 'Toutes nos pi\u00e8ces sont garanties compatibles avec votre v\u00e9hicule ou remboursement complet.'
                : 'All our parts are guaranteed compatible with your vehicle or full refund.'
              }</p>
            </div>
            <div className="info-card">
              <div className="info-card__icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="1" y="3" width="15" height="13"/>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/>
                  <circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
              </div>
              <h3>{loc === 'fr' ? 'Exp\u00e9dition rapide' : 'Fast Shipping'}</h3>
              <p>{loc === 'fr'
                ? 'Commandez avant 14h et recevez votre commande le lendemain.'
                : 'Order before 2pm and receive your order the next day.'
              }</p>
            </div>
            <div className="info-card">
              <div className="info-card__icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
              </div>
              <h3>{loc === 'fr' ? 'Support expert' : 'Expert Support'}</h3>
              <p>{loc === 'fr'
                ? 'Notre \u00e9quipe de techniciens certifi\u00e9s est l\u00e0 pour vous aider \u00e0 trouver la bonne pi\u00e8ce.'
                : 'Our team of certified technicians is here to help you find the right part.'
              }</p>
            </div>
            <div className="info-card">
              <div className="info-card__icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
              </div>
              <h3>{loc === 'fr' ? 'Retours faciles' : 'Easy Returns'}</h3>
              <p>{loc === 'fr'
                ? '30 jours pour retourner vos pi\u00e8ces non install\u00e9es dans leur emballage d\'origine.'
                : '30 days to return uninstalled parts in their original packaging.'
              }</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pieces-cta">
        <div className="container">
          <div className="cta-content">
            <h2>{loc === 'fr' ? 'Vous ne trouvez pas votre pi\u00e8ce?' : 'Can\'t find your part?'}</h2>
            <p>{loc === 'fr'
              ? 'Notre \u00e9quipe peut sourcer n\'importe quelle pi\u00e8ce pour vous. Contactez-nous!'
              : 'Our team can source any part for you. Contact us!'
            }</p>
            <div className="cta-actions">
              <Link href={`/${locale}/contact`} className="btn btn--primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
                {loc === 'fr' ? 'Nous contacter' : 'Contact us'}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
