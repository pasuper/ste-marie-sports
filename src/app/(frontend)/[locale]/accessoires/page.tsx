import Link from 'next/link'
import { getPayload, asLocale } from '@/lib/payload'
import { getMediaUrl } from '@/lib/media'
import ProductCard from '@/components/ProductCard'

export const revalidate = 60

export default async function AccessoiresPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const loc = asLocale(locale)
  const payload = await getPayload()

  // Fetch categories
  const catResult = await payload.find({
    collection: 'categories',
    locale: loc,
    limit: 6,
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
    <div className="accessoires-page">
      {/* Hero Section */}
      <section className="accessoires-hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <span className="hero-badge">Collection 2025</span>
            <h1>{loc === 'fr' ? 'Accessoires & V\u00eatements' : 'Accessories & Apparel'}</h1>
            <p>{loc === 'fr'
              ? '\u00c9quipez-vous avec les meilleures marques de l\'industrie. Protection, style et performance.'
              : 'Gear up with the best brands in the industry. Protection, style and performance.'
            }</p>

            <nav className="hero-breadcrumb" aria-label="Fil d'Ariane">
              <Link href={`/${locale}`}>{loc === 'fr' ? 'Accueil' : 'Home'}</Link>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18L15 12L9 6"/>
              </svg>
              <span>{loc === 'fr' ? 'Accessoires & V\u00eatements' : 'Accessories & Apparel'}</span>
            </nav>

            {/* Hero Features */}
            <div className="hero-features">
              <div className="hero-feature">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span>{loc === 'fr' ? 'Certifi\u00e9 CE' : 'CE Certified'}</span>
              </div>
              <div className="hero-feature">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="3" width="15" height="13"/>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/>
                  <circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
                <span>{loc === 'fr' ? 'Livraison gratuite 100$+' : 'Free shipping $100+'}</span>
              </div>
              <div className="hero-feature">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
                <span>{loc === 'fr' ? 'Retours 30 jours' : '30-day returns'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      {categories.length > 0 && (
        <section className="accessoires-categories">
          <div className="container">
            <div className="section-header section-header--center">
              <h2>{loc === 'fr' ? 'Magasinez par cat\u00e9gorie' : 'Shop by category'}</h2>
              <p>{loc === 'fr'
                ? 'Trouvez l\'\u00e9quipement parfait pour votre style de conduite'
                : 'Find the perfect gear for your riding style'
              }</p>
            </div>

            <div className="categories-showcase">
              {categories.map((category: any, index: number) => (
                <Link
                  key={category.id}
                  href={`/${locale}/category/${category.slug}`}
                  className={`category-showcase-card ${index === 0 || index === 5 ? 'category-showcase-card--large' : ''}`}
                >
                  <div className="category-showcase-card__bg">
                    <img
                      src={category.image ? getMediaUrl(category.image) : `https://placehold.co/600x400/1a1a1a/ffffff?text=${encodeURIComponent(category.name)}`}
                      alt={category.name}
                    />
                  </div>
                  <div className="category-showcase-card__content">
                    <h3>{category.name}</h3>
                    {category.description && <p>{category.description}</p>}
                    <span className="shop-link">
                      {loc === 'fr' ? 'Magasiner' : 'Shop Now'}
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="accessoires-featured">
          <div className="container">
            <div className="section-header">
              <div>
                <h2>{loc === 'fr' ? 'Produits vedettes' : 'Featured Products'}</h2>
                <p>{loc === 'fr' ? 'Les favoris de nos clients' : 'Customer favorites'}</p>
              </div>
              <Link href={`/${locale}/category/accessoires`} className="view-all-btn">
                {loc === 'fr' ? 'Voir tout' : 'View all'}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>

            <div className="products-grid">
              {featuredProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brands */}
      {brands.length > 0 && (
        <section className="accessoires-brands">
          <div className="container">
            <div className="section-header section-header--center">
              <h2>{loc === 'fr' ? 'Nos marques partenaires' : 'Our partner brands'}</h2>
              <p>{loc === 'fr'
                ? 'Nous collaborons avec les leaders de l\'industrie'
                : 'We collaborate with industry leaders'
              }</p>
            </div>

            <div className="brands-carousel">
              {brands.map((brand: any) => (
                <Link key={brand.id} href={`/${locale}/marque/${brand.slug}`} className="brand-item">
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

      {/* Info Section */}
      <section className="accessoires-info">
        <div className="container">
          <div className="info-cards">
            <div className="info-card">
              <div className="info-card__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
              </div>
              <h3>{loc === 'fr' ? 'Protection certifi\u00e9e' : 'Certified Protection'}</h3>
              <p>{loc === 'fr'
                ? 'Tous nos \u00e9quipements respectent les normes de s\u00e9curit\u00e9 CE et DOT.'
                : 'All our equipment meets CE and DOT safety standards.'
              }</p>
            </div>
            <div className="info-card">
              <div className="info-card__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <h3>{loc === 'fr' ? 'Conseils experts' : 'Expert Advice'}</h3>
              <p>{loc === 'fr'
                ? 'Notre \u00e9quipe vous aide \u00e0 trouver l\'\u00e9quipement adapt\u00e9 \u00e0 vos besoins.'
                : 'Our team helps you find the right equipment for your needs.'
              }</p>
            </div>
            <div className="info-card">
              <div className="info-card__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <h3>{loc === 'fr' ? 'Service apr\u00e8s-vente' : 'After-sales Service'}</h3>
              <p>{loc === 'fr'
                ? 'Garantie fabricant et support technique pour tous vos achats.'
                : 'Manufacturer warranty and technical support for all your purchases.'
              }</p>
            </div>
            <div className="info-card">
              <div className="info-card__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <h3>{loc === 'fr' ? 'Programme fid\u00e9lit\u00e9' : 'Loyalty Program'}</h3>
              <p>{loc === 'fr'
                ? 'Accumulez des points et profitez d\'offres exclusives.'
                : 'Accumulate points and enjoy exclusive offers.'
              }</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
