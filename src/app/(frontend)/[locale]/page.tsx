import { getPayload, asLocale } from '@/lib/payload'
import { getMediaUrl } from '@/lib/media'
import { t } from '@/lib/i18n'
import HeroCarousel from '@/components/HeroCarousel'
import HeroTabs from '@/components/HeroTabs'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

export const revalidate = 60

// Maps HeroTabs vehicleType IDs to Payload vehicleType slugs
const HEROTABS_TO_PAYLOAD: Record<string, string> = {
  sxs:        'utv',
  atv:        'atv',
  snowmobile: 'snowmobile',
  motorcycle: 'motorcycle',
  dirtbike:   'motorcycle',
  pwc:        'pwc',
}

const GEAR_CATEGORIES = [
  { slug: 'casques-et-vetements-casques',         fr: 'Casques',       en: 'Helmets',     image: '/media/750242311.jpg' },
  { slug: 'casques-et-vetements-manteaux',         fr: 'Manteaux',      en: 'Jackets',     image: '/media/1654605.jpg' },
  { slug: 'casques-et-vetements-bottes-et-souliers', fr: 'Bottes',     en: 'Boots',       image: '/media/1884500G.jpg' },
  { slug: 'casques-et-vetements-gants',            fr: 'Gants',         en: 'Gloves',      image: '/media/652512.jpg' },
  { slug: 'casques-et-vetements-protections',      fr: 'Protections',   en: 'Protective',  image: '/media/1876221.jpg' },
  { slug: 'casques-et-vetements-lunettes',         fr: 'Lunettes',      en: 'Goggles',     image: '/media/6571008.jpg' },
]

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const loc = asLocale(locale)
  const payload = await getPayload()

  const [heroData, brandsData, productsData] = await Promise.all([
    payload.find({ collection: 'hero-sections', where: { isActive: { equals: true } }, locale: loc, limit: 1, depth: 1 }),
    payload.find({ collection: 'brands', where: { isFeatured: { equals: true }, isActive: { equals: true } }, locale: loc, limit: 16, sort: 'sortOrder', depth: 1 }),
    payload.find({ collection: 'products', where: { isFeatured: { equals: true }, isActive: { equals: true }, variantType: { equals: 'parent' } }, locale: loc, limit: 8, depth: 1 }),
  ])

  // Fetch one vehicle photo per type for HeroTabs
  const vehicleImages: Record<string, string> = {}
  await Promise.all(
    Object.entries(HEROTABS_TO_PAYLOAD).map(async ([tabId, payloadType]) => {
      if (vehicleImages[tabId]) return // already fetched (e.g. dirtbike shares motorcycle)
      const res = await payload.find({
        collection: 'vehicles',
        where: { vehicleType: { equals: payloadType }, thumbnail: { exists: true } },
        sort: '-year',
        limit: 1,
        depth: 1,
      })
      const doc = res.docs[0]
      if (doc?.thumbnail) vehicleImages[tabId] = getMediaUrl(doc.thumbnail)
    })
  )

  // Featured vehicles (mix of types, with thumbnail)
  const featuredVehiclesData = await payload.find({
    collection: 'vehicles',
    where: { thumbnail: { exists: true }, price: { exists: true } },
    sort: '-year',
    limit: 6,
    depth: 1,
  })

  let brands = brandsData
  if (brands.docs.length === 0) {
    brands = await payload.find({ collection: 'brands', where: { isActive: { equals: true } }, locale: loc, limit: 16, sort: 'sortOrder', depth: 0 })
  }

  let products = productsData
  if (products.docs.length === 0) {
    products = await payload.find({ collection: 'products', where: { isActive: { equals: true }, variantType: { equals: 'parent' }, thumbnail: { exists: true } }, locale: loc, limit: 8, sort: '-createdAt', depth: 1 })
  }

  const hero = heroData.docs[0]
  const featuredVehicles = featuredVehiclesData.docs

  return (
    <div className="home-page">

      {/* ── HERO ── */}
      <section className="hero">
        {hero?.slides ? (
          <HeroCarousel heroSection={hero} locale={locale} />
        ) : (
          <div className="hero__slider">
            <div className="hero__slide hero__slide--active">
              <div className="hero__bg">
                <img src="/snowmobile-header.jpeg" alt="Ste-Marie Sports" />
              </div>
              <div className="hero__flair"></div>
              <div className="hero__content">
                <h1 className="hero__title">
                  {locale === 'fr' ? (
                    <>VIS<br/><span className="hero__title-accent">L&apos;AVENTURE</span></>
                  ) : (
                    <>LIVE THE<br/><span className="hero__title-accent">ADVENTURE</span></>
                  )}
                </h1>
                <p className="hero__subtitle">
                  {locale === 'fr'
                    ? 'Équipement premium pour passionnés exigeants.'
                    : 'Premium gear for demanding enthusiasts.'}
                </p>
                <div className="hero__buttons">
                  <Link href={`/${locale}/vehicules`} className="btn btn--fire btn--lg">
                    <span>{locale === 'fr' ? 'EXPLORER' : 'EXPLORE'}</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 12h14m-7-7l7 7-7 7"/>
                    </svg>
                  </Link>
                  <Link href={`/${locale}/accessoires`} className="btn btn--outline-bold btn--lg">
                    {locale === 'fr' ? 'ACCESSOIRES' : 'ACCESSORIES'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
        <HeroTabs locale={locale} vehicleImages={vehicleImages} />
      </section>

      {/* ── FEATURED VEHICLES ── */}
      {featuredVehicles.length > 0 && (
        <section className="featured-vehicles-section">
          <div className="container">
            <div className="section-header">
              <div>
                <span className="section-eyebrow">{locale === 'fr' ? 'SÉLECTION' : 'SELECTION'}</span>
                <h2>{locale === 'fr' ? 'Véhicules en vedette' : 'Featured vehicles'}</h2>
              </div>
              <Link href={`/${locale}/vehicules`} className="section-link">{locale === 'fr' ? 'Voir tout l\'inventaire' : 'View full inventory'} →</Link>
            </div>
            <div className="featured-vehicles-grid">
              {featuredVehicles.slice(0, 4).map((vehicle: any) => {
                const titleStr = typeof vehicle.title === 'string' ? vehicle.title : vehicle.title?.fr || vehicle.title?.en || ''
                const thumbUrl = vehicle.thumbnail ? getMediaUrl(vehicle.thumbnail) : null
                const brandObj = typeof vehicle.brand === 'object' && vehicle.brand ? vehicle.brand as any : null
                const brandName = brandObj?.name ? (typeof brandObj.name === 'object' ? brandObj.name?.fr || brandObj.name?.en : brandObj.name) : ''
                return (
                  <Link key={vehicle.id} href={`/${locale}/vehicule/${vehicle.slug}`} className="featured-vehicle-card">
                    <div className="featured-vehicle-card__image">
                      {thumbUrl ? (
                        <img src={thumbUrl} alt={titleStr} />
                      ) : (
                        <div className="featured-vehicle-card__placeholder" />
                      )}
                      {vehicle.condition === 'used' && (
                        <span className="featured-vehicle-card__badge featured-vehicle-card__badge--used">
                          {locale === 'fr' ? 'Usagé' : 'Used'}
                        </span>
                      )}
                      {vehicle.condition === 'new' && (
                        <span className="featured-vehicle-card__badge featured-vehicle-card__badge--new">
                          {locale === 'fr' ? 'Neuf' : 'New'}
                        </span>
                      )}
                    </div>
                    <div className="featured-vehicle-card__info">
                      {brandName && <span className="featured-vehicle-card__brand">{brandName}</span>}
                      <h3>{titleStr}</h3>
                      {vehicle.price ? (
                        <div className="featured-vehicle-card__price">
                          <span>{vehicle.price.toLocaleString('fr-CA')} $</span>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14m-7-7l7 7-7 7"/></svg>
                        </div>
                      ) : (
                        <div className="featured-vehicle-card__price">
                          <span>{locale === 'fr' ? 'Nous contacter' : 'Contact us'}</span>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14m-7-7l7 7-7 7"/></svg>
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── GEAR CATEGORIES ── */}
      <section className="gear-section">
        <div className="container">
          <div className="section-header section-header--centered">
            <div>
              <span className="section-eyebrow">{locale === 'fr' ? 'ÉQUIPEMENT' : 'GEAR'}</span>
              <h2>{locale === 'fr' ? 'Habillez-vous pour l\'aventure' : 'Gear up for adventure'}</h2>
            </div>
            <Link href={`/${locale}/accessoires`} className="section-link">{locale === 'fr' ? 'Tout l\'équipement' : 'All gear'} →</Link>
          </div>
          <div className="gear-grid">
            {/* Big featured tile — Casques */}
            <Link href={`/${locale}/category/casques-et-vetements-casques`} className="gear-card gear-card--featured">
              <div className="gear-card__bg">
                <img src="/media/750242311.jpg" alt="Casques" />
                <div className="gear-card__overlay" />
              </div>
              <div className="gear-card__content">
                <span className="gear-card__label">{locale === 'fr' ? 'Casques' : 'Helmets'}</span>
                <span className="gear-card__sub">{locale === 'fr' ? 'Intégral, modulable, cross…' : 'Full face, modular, off-road…'}</span>
                <span className="gear-card__cta">{locale === 'fr' ? 'Magasiner →' : 'Shop →'}</span>
              </div>
            </Link>

            {/* Small tiles */}
            {GEAR_CATEGORIES.slice(1).map((cat) => (
              <Link key={cat.slug} href={`/${locale}/category/${cat.slug}`} className="gear-card">
                <div className="gear-card__bg">
                  <img src={cat.image} alt={locale === 'fr' ? cat.fr : cat.en} />
                  <div className="gear-card__overlay" />
                </div>
                <div className="gear-card__content">
                  <span className="gear-card__label">{locale === 'fr' ? cat.fr : cat.en}</span>
                  <span className="gear-card__cta">{locale === 'fr' ? 'Voir →' : 'View →'}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      {products.docs.length > 0 && (
        <section className="featured-products">
          <div className="container">
            <div className="section-header">
              <div>
                <span className="section-eyebrow">{locale === 'fr' ? 'POPULAIRE' : 'POPULAR'}</span>
                <h2>{t(loc, 'featuredProducts.title')}</h2>
              </div>
              <Link href={`/${locale}/category/all`} className="section-link">{t(loc, 'featuredProducts.viewAll')} →</Link>
            </div>
            <div className="products-grid">
              {products.docs.map((product: any) => (
                <ProductCard key={product.id} product={product} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SALE BANNER ── */}
      <section className="sale-banner">
        <div className="container">
          <div className="sale-banner__content">
            <div className="sale-banner__text">
              <span className="sale-banner__tag">{t(loc, 'saleBanner.tag')}</span>
              <h2>{t(loc, 'saleBanner.title')}</h2>
              <p>{t(loc, 'saleBanner.description')}</p>
              <Link href={`/${locale}/category/all`} className="btn btn--primary btn--lg">{t(loc, 'saleBanner.cta')}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── BRANDS ── */}
      {brands.docs.length > 0 && (
        <section className="brands">
          <div className="container">
            <div className="section-header section-header--centered">
              <div>
                <span className="section-eyebrow">{locale === 'fr' ? 'NOS PARTENAIRES' : 'OUR PARTNERS'}</span>
                <h2>{t(loc, 'brands.title')}</h2>
              </div>
              <Link href={`/${locale}/marques`} className="section-link">{t(loc, 'brands.viewAll')} →</Link>
            </div>
            <div className="brands__grid">
              {brands.docs.map((brand: any) => (
                <Link key={brand.id} href={`/${locale}/marques?brand=${brand.slug}`} className="brand-card">
                  <img
                    src={brand.logo ? getMediaUrl(brand.logo) : `/media/brand-${brand.slug}.svg`}
                    alt={brand.name}
                    loading="lazy"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── TRUST BAR ── */}
      <section className="trust-bar">
        <div className="container">
          <div className="trust-bar__grid">
            <div className="trust-bar__item">
              <div className="trust-bar__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8H20L23 11V16H16V8Z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              </div>
              <div>
                <strong>{locale === 'fr' ? 'Livraison gratuite' : 'Free shipping'}</strong>
                <span>{locale === 'fr' ? 'Sur les commandes 99$+' : 'On orders over $99'}</span>
              </div>
            </div>
            <div className="trust-bar__item">
              <div className="trust-bar__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"/><path d="M9 12l2 2 4-4"/></svg>
              </div>
              <div>
                <strong>{locale === 'fr' ? 'Retours 30 jours' : '30-day returns'}</strong>
                <span>{locale === 'fr' ? 'Satisfait ou remboursé' : 'Satisfaction guaranteed'}</span>
              </div>
            </div>
            <div className="trust-bar__item">
              <div className="trust-bar__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              </div>
              <div>
                <strong>{locale === 'fr' ? 'Paiement sécurisé' : 'Secure payment'}</strong>
                <span>{locale === 'fr' ? 'Cryptage SSL 256-bit' : '256-bit SSL encryption'}</span>
              </div>
            </div>
            <div className="trust-bar__item">
              <div className="trust-bar__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
              </div>
              <div>
                <strong>{locale === 'fr' ? '+ de 70 000 produits' : '70,000+ products'}</strong>
                <span>{locale === 'fr' ? 'Pour tous vos besoins' : 'For all your needs'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
