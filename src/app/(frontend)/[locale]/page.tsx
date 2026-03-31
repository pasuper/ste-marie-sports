import { getPayload, asLocale } from '@/lib/payload'
import { getMediaUrl } from '@/lib/media'
import { t } from '@/lib/i18n'
import HeroCarousel from '@/components/HeroCarousel'
import HeroTabs from '@/components/HeroTabs'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

export const revalidate = 60

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const loc = asLocale(locale)
  const payload = await getPayload()

  // Parallel fetch for speed
  const [heroData, brandsData, categoriesData, productsData] = await Promise.all([
    payload.find({ collection: 'hero-sections', where: { isActive: { equals: true } }, locale: loc, limit: 1, depth: 1 }),
    payload.find({ collection: 'brands', where: { isFeatured: { equals: true }, isActive: { equals: true } }, locale: loc, limit: 12, sort: 'sortOrder', depth: 1 }),
    payload.find({ collection: 'categories', where: { isFeatured: { equals: true }, isActive: { equals: true } }, locale: loc, limit: 6, sort: 'sortOrder', depth: 1 }),
    payload.find({ collection: 'products', where: { isFeatured: { equals: true }, isActive: { equals: true }, variantType: { equals: 'parent' } }, locale: loc, limit: 8, depth: 1 }),
  ])

  // Fallbacks only if needed (sequential is fine for fallbacks — they rarely trigger)
  let brands = brandsData
  if (brands.docs.length === 0) {
    brands = await payload.find({ collection: 'brands', where: { isActive: { equals: true } }, locale: loc, limit: 12, sort: 'sortOrder', depth: 0 })
  }

  let categories = categoriesData
  if (categories.docs.length === 0) {
    categories = await payload.find({ collection: 'categories', where: { isActive: { equals: true } }, locale: loc, limit: 6, sort: 'sortOrder', depth: 0 })
  }

  let products = productsData
  if (products.docs.length === 0) {
    products = await payload.find({ collection: 'products', where: { isActive: { equals: true }, variantType: { equals: 'parent' }, thumbnail: { exists: true } }, locale: loc, limit: 8, sort: '-createdAt', depth: 1 })
  }

  const hero = heroData.docs[0]

  return (
    <div className="home-page">
      {/* Hero Section */}
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

        <HeroTabs locale={locale} />
      </section>

      {/* Categories */}
      {categories.docs.length > 0 && (
        <section className="categories">
          <div className="container">
            <div className="section-header">
              <h2>{t(loc, 'categories.title')}</h2>
              <Link href={`/${locale}/category/all`} className="section-link">{t(loc, 'categories.viewAll')} →</Link>
            </div>
            <div className="categories__grid">
              {categories.docs.map((cat: any) => (
                <Link key={cat.id} href={`/${locale}/category/${cat.slug}`} className="category-card">
                  <div className="category-card__image">
                    {cat.image && (
                      <img src={getMediaUrl(cat.image)} alt={cat.name} loading="lazy" />
                    )}
                  </div>
                  <div className="category-card__content">
                    <h3>{cat.name}</h3>
                    {cat.description && <span>{cat.description}</span>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {products.docs.length > 0 && (
        <section className="featured-products">
          <div className="container">
            <div className="section-header">
              <h2>{t(loc, 'featuredProducts.title')}</h2>
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

      {/* Sale Banner */}
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

      {/* Brands */}
      {brands.docs.length > 0 && (
        <section className="brands">
          <div className="container">
            <div className="section-header">
              <h2>{t(loc, 'brands.title')}</h2>
              <Link href={`/${locale}/marques`} className="section-link">{t(loc, 'brands.viewAll')} →</Link>
            </div>
            <div className="brands__grid">
              {brands.docs.map((brand: any) => (
                <Link key={brand.id} href={`/${locale}/marques?brand=${brand.slug}`} className="brand-card">
                  <img
                    src={brand.logo ? getMediaUrl(brand.logo) : `/media/brand-${brand.slug}.svg`}
                    alt={brand.name}
                    loading="lazy"
                    onError={(e: any) => { e.target.src = `/media/brand-${brand.slug}.png`; e.target.onerror = null }}
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog Section */}
      <section className="blog-section">
        <div className="container">
          <div className="section-header">
            <h2>{t(loc, 'blog.title')}</h2>
            <Link href={`/${locale}/blog`} className="section-link">{t(loc, 'blog.viewAll')} →</Link>
          </div>
          <div className="blog-grid">
            <article className="blog-card blog-card--large">
              <div className="blog-card__content">
                <span className="blog-card__category">{t(loc, 'blog.buyingGuide')}</span>
                <h3>{locale === 'fr' ? 'Comment choisir son véhicule récréatif' : 'How to choose your recreational vehicle'}</h3>
                <p>{locale === 'fr' ? 'Tout ce que vous devez savoir pour trouver le véhicule parfait selon vos besoins.' : 'Everything you need to know to find the perfect vehicle for your needs.'}</p>
              </div>
            </article>
            <article className="blog-card">
              <div className="blog-card__content">
                <span className="blog-card__category">{t(loc, 'blog.tips')}</span>
                <h3>{locale === 'fr' ? 'Entretenir son véhicule en hiver' : 'Winter vehicle maintenance'}</h3>
              </div>
            </article>
            <article className="blog-card">
              <div className="blog-card__content">
                <span className="blog-card__category">{t(loc, 'blog.top10')}</span>
                <h3>{locale === 'fr' ? 'Les meilleurs accessoires 2025' : 'Best accessories 2025'}</h3>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  )
}
