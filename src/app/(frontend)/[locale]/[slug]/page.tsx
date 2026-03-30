import { getPayload, asLocale } from '@/lib/payload'
import { getMediaUrl } from '@/lib/media'
import { t } from '@/lib/i18n'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'

export const revalidate = 3600

// Category configs for mega menu landing pages
const categoryConfigs: Record<string, { title: string; titleEn: string; subtitle: string; subtitleEn: string; vehicleTypes: string[]; accentColor: string; features: string[] }> = {
  motoneiges: {
    title: 'Motoneiges', titleEn: 'Snowmobiles',
    subtitle: 'Dominez les sentiers enneigés', subtitleEn: 'Dominate the snowy trails',
    vehicleTypes: ['snowmobile'], accentColor: '#00bcd4',
    features: ['Ski-Doo', 'Lynx', 'Pièces OEM', 'Vêtements hiver'],
  },
  'spyder-ryker': {
    title: 'Spyder & Ryker', titleEn: 'Spyder & Ryker',
    subtitle: "L'expérience trois roues ultime", subtitleEn: 'The ultimate three-wheel experience',
    vehicleTypes: ['spyder'], accentColor: '#ff5722',
    features: ['Can-Am Spyder', 'Can-Am Ryker', 'Accessoires', 'Équipement'],
  },
  moto: {
    title: 'Motocyclettes', titleEn: 'Motorcycles',
    subtitle: 'Liberté sur deux roues', subtitleEn: 'Freedom on two wheels',
    vehicleTypes: ['motorcycle'], accentColor: '#e91e63',
    features: ['Sport', 'Touring', 'Cruiser', 'Casques'],
  },
  marine: {
    title: 'Marine & Nautique', titleEn: 'Marine & Watercraft',
    subtitle: 'Maîtrisez les vagues', subtitleEn: 'Master the waves',
    vehicleTypes: ['pwc', 'marine'], accentColor: '#2196f3',
    features: ['Sea-Doo', 'Pontons', 'Bateaux', 'Équipement nautique'],
  },
  'vtt-vcc': {
    title: 'VTT & Côte à Côte', titleEn: 'ATV & Side by Side',
    subtitle: 'Conquérez tous les terrains', subtitleEn: 'Conquer all terrain',
    vehicleTypes: ['atv', 'utv'], accentColor: '#4caf50',
    features: ['Outlander', 'Maverick', 'Defender', 'Accessoires trail'],
  },
}

export default async function DynamicPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  const loc = asLocale(locale)
  const payload = await getPayload()

  // Try to find a CMS page with this slug
  const data = await payload.find({ collection: 'pages', where: { slug: { equals: slug }, isActive: { equals: true } }, locale: loc, limit: 1, depth: 2 })
  const page = data.docs[0] as any

  // Check if this is a mega menu landing page (either by template or by matching config)
  const config = categoryConfigs[slug]
  const isMegaLanding = page?.template === 'mega-menu-item-landing' || config

  if (isMegaLanding && config) {
    return <MegaMenuLanding locale={locale} loc={loc} slug={slug} config={config} page={page} payload={payload} />
  }

  // Vehicles new/used template redirects
  if (page?.template === 'vehicles-new') {
    const { redirect } = await import('next/navigation')
    redirect(`/${locale}/vehicules?condition=new`)
  }
  if (page?.template === 'vehicles-used') {
    const { redirect } = await import('next/navigation')
    redirect(`/${locale}/vehicules?condition=used`)
  }

  // Generic CMS page
  if (!page) notFound()

  // Render rich text content
  let contentHtml = ''
  if (typeof page.content === 'string') {
    contentHtml = page.content
  } else if (page.content?.root?.children) {
    contentHtml = page.content.root.children.map((node: any) => {
      if (node.children) return `<p>${node.children.map((c: any) => c.text || '').join('')}</p>`
      return ''
    }).join('')
  }

  return (
    <div className="content-page">
      <div className="page-header">
        <div className="container">
          <h1>{page.title}</h1>
          <nav className="header-breadcrumb">
            <Link href={`/${locale}`}>{locale === 'fr' ? 'Accueil' : 'Home'}</Link>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18L15 12L9 6"/></svg>
            <span>{page.title}</span>
          </nav>
        </div>
      </div>
      <div className="page-content">
        <div className="container">
          {page.featuredImage && (
            <div className="page-featured-image">
              <img src={getMediaUrl(page.featuredImage)} alt={page.title} />
            </div>
          )}
          {contentHtml && <div className="rich-text" dangerouslySetInnerHTML={{ __html: contentHtml }} />}
        </div>
      </div>
    </div>
  )
}

async function MegaMenuLanding({ locale, loc, slug, config, page, payload }: { locale: string; loc: any; slug: string; config: any; page: any; payload: any }) {
  // Fetch vehicles for this category
  const vehicleWhere: any = { isActive: { not_equals: false } }
  if (config.vehicleTypes.length > 0) {
    vehicleWhere.vehicleType = { in: config.vehicleTypes }
  }

  const [newVehicles, usedVehicles, brands, featuredProducts] = await Promise.all([
    payload.find({ collection: 'vehicles', where: { ...vehicleWhere, condition: { equals: 'new' } }, locale: loc, limit: 6, depth: 1, sort: '-isFeatured,-createdAt' }).catch(() => ({ docs: [] })),
    payload.find({ collection: 'vehicles', where: { ...vehicleWhere, condition: { equals: 'used' } }, locale: loc, limit: 6, depth: 1, sort: '-isFeatured,-createdAt' }).catch(() => ({ docs: [] })),
    payload.find({ collection: 'brands', where: { isActive: { equals: true }, isFeatured: { equals: true } }, locale: loc, limit: 12, sort: 'sortOrder' }).catch(() => ({ docs: [] })),
    payload.find({ collection: 'products', where: { isActive: { equals: true }, isFeatured: { equals: true }, variantType: { equals: 'parent' } }, locale: loc, limit: 8, depth: 1, sort: '-createdAt' }).catch(() => ({ docs: [] })),
  ])

  const title = locale === 'fr' ? config.title : config.titleEn
  const subtitle = locale === 'fr' ? config.subtitle : config.subtitleEn

  return (
    <div className="mega-landing">
      {/* Hero Section */}
      <section className="mega-landing__hero" style={{ '--accent-color': config.accentColor } as any}>
        <div className="mega-landing__hero-overlay"></div>
        <div className="mega-landing__hero-content">
          <div className="container">
            <h1 className="mega-landing__title">{page?.title || title}</h1>
            <p className="mega-landing__subtitle">{page?.excerpt || subtitle}</p>
            <div className="mega-landing__features">
              {config.features.map((feature: string, i: number) => (
                <span key={i} className="mega-landing__feature-tag">{feature}</span>
              ))}
            </div>
            <div className="mega-landing__actions">
              <Link href={`/${locale}/vehicules?type=${config.vehicleTypes[0]}`} className="btn btn--primary btn--lg">
                {locale === 'fr' ? 'Voir les véhicules' : 'View Vehicles'}
              </Link>
              <Link href={`/${locale}/pieces`} className="btn btn--outline-bold btn--lg">
                {locale === 'fr' ? 'Magasiner les pièces' : 'Shop Parts'}
              </Link>
            </div>
            <nav className="header-breadcrumb">
              <Link href={`/${locale}`}>{locale === 'fr' ? 'Accueil' : 'Home'}</Link>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18L15 12L9 6"/></svg>
              <span>{title}</span>
            </nav>
          </div>
        </div>
      </section>

      {/* Quick Categories */}
      <section className="mega-landing__categories">
        <div className="container">
          <div className="mega-landing__categories-grid">
            <Link href={`/${locale}/vehicules?type=${config.vehicleTypes[0]}&condition=new`} className="mega-landing__quick-card">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              <span>{locale === 'fr' ? 'Véhicules neufs' : 'New Vehicles'}</span>
            </Link>
            <Link href={`/${locale}/vehicules?type=${config.vehicleTypes[0]}&condition=used`} className="mega-landing__quick-card">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01 9 11.01"/></svg>
              <span>{locale === 'fr' ? 'Véhicules usagés' : 'Used Vehicles'}</span>
            </Link>
            <Link href={`/${locale}/pieces`} className="mega-landing__quick-card">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 1v4m0 14v4m11-11h-4M5 12H1m18.07-7.07l-2.83 2.83M8.76 15.24l-2.83 2.83m12.14 0l-2.83-2.83M8.76 8.76L5.93 5.93"/></svg>
              <span>{locale === 'fr' ? 'Pièces' : 'Parts'}</span>
            </Link>
            <Link href={`/${locale}/accessoires`} className="mega-landing__quick-card">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18"/><path d="M16 10a4 4 0 01-8 0"/></svg>
              <span>{locale === 'fr' ? 'Accessoires' : 'Accessories'}</span>
            </Link>
            <Link href={`/${locale}/category/vetements`} className="mega-landing__quick-card">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.38 3.46L16 2 12 5 8 2 3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z"/></svg>
              <span>{locale === 'fr' ? 'Vêtements' : 'Clothing'}</span>
            </Link>
            <Link href={`/${locale}/category/casques`} className="mega-landing__quick-card">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2a9 9 0 00-9 9v4a2 2 0 002 2h2v-7a5 5 0 0110 0v7h2a2 2 0 002-2v-4a9 9 0 00-9-9z"/><path d="M7 17v2a5 5 0 0010 0v-2"/></svg>
              <span>{locale === 'fr' ? 'Casques' : 'Helmets'}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* New Vehicles */}
      {newVehicles.docs.length > 0 && (
        <section className="mega-landing__vehicles">
          <div className="container">
            <div className="section-header">
              <h2>
                <span className="section-badge" style={{ backgroundColor: config.accentColor }}>{locale === 'fr' ? 'Nouveautés' : 'New'}</span>
                {locale === 'fr' ? `${title} neufs` : `New ${title}`}
              </h2>
              <Link href={`/${locale}/vehicules?type=${config.vehicleTypes[0]}&condition=new`} className="section-link">
                {locale === 'fr' ? 'Voir tout' : 'View all'} →
              </Link>
            </div>
            <div className="vehicles-grid vehicles-grid--grid">
              {newVehicles.docs.map((v: any) => (
                <Link key={v.id} href={`/${locale}/vehicule/${v.slug}`} className="vehicle-card">
                  <div className="vehicle-card__image">
                    <img src={getMediaUrl(v.thumbnail)} alt={v.title} loading="lazy" />
                    <span className="vehicle-card__condition vehicle-card__condition--new">{locale === 'fr' ? 'Neuf' : 'New'}</span>
                  </div>
                  <div className="vehicle-card__content">
                    <div className="vehicle-card__header">
                      <span className="vehicle-card__year">{v.year}</span>
                      <span className="vehicle-card__make">{typeof v.make === 'object' ? v.make?.name : ''}</span>
                    </div>
                    <h3 className="vehicle-card__title">{v.title}</h3>
                    <div className="vehicle-card__price-section">
                      {v.price ? (
                        <span className="vehicle-card__price-current">{v.price.toLocaleString()} $</span>
                      ) : (
                        <span className="vehicle-card__price-current">{locale === 'fr' ? 'Contactez-nous' : 'Contact us'}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Used Vehicles */}
      {usedVehicles.docs.length > 0 && (
        <section className="mega-landing__vehicles mega-landing__vehicles--used">
          <div className="container">
            <div className="section-header">
              <h2>
                <span className="section-badge">{locale === 'fr' ? 'Certifiés' : 'Certified'}</span>
                {locale === 'fr' ? `${title} usagés` : `Used ${title}`}
              </h2>
              <Link href={`/${locale}/vehicules?type=${config.vehicleTypes[0]}&condition=used`} className="section-link">
                {locale === 'fr' ? 'Voir tout' : 'View all'} →
              </Link>
            </div>
            <div className="vehicles-grid vehicles-grid--grid">
              {usedVehicles.docs.map((v: any) => (
                <Link key={v.id} href={`/${locale}/vehicule/${v.slug}`} className="vehicle-card">
                  <div className="vehicle-card__image">
                    <img src={getMediaUrl(v.thumbnail)} alt={v.title} loading="lazy" />
                    <span className="vehicle-card__condition vehicle-card__condition--used">{locale === 'fr' ? 'Usagé' : 'Used'}</span>
                  </div>
                  <div className="vehicle-card__content">
                    <div className="vehicle-card__header">
                      <span className="vehicle-card__year">{v.year}</span>
                      <span className="vehicle-card__make">{typeof v.make === 'object' ? v.make?.name : ''}</span>
                    </div>
                    <h3 className="vehicle-card__title">{v.title}</h3>
                    <div className="vehicle-card__price-section">
                      {v.price ? (
                        <span className="vehicle-card__price-current">{v.price.toLocaleString()} $</span>
                      ) : (
                        <span className="vehicle-card__price-current">{locale === 'fr' ? 'Contactez-nous' : 'Contact us'}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.docs.length > 0 && (
        <section className="mega-landing__products">
          <div className="container">
            <div className="section-header">
              <h2>{locale === 'fr' ? 'Produits populaires' : 'Popular Products'}</h2>
              <Link href={`/${locale}/pieces`} className="section-link">{locale === 'fr' ? 'Voir tout' : 'View all'} →</Link>
            </div>
            <div className="products-grid">
              {featuredProducts.docs.map((product: any) => (
                <ProductCard key={product.id} product={product} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brands */}
      {brands.docs.length > 0 && (
        <section className="mega-landing__brands">
          <div className="container">
            <div className="section-header">
              <h2>{locale === 'fr' ? 'Nos marques' : 'Our Brands'}</h2>
              <Link href={`/${locale}/marques`} className="section-link">{locale === 'fr' ? 'Toutes les marques' : 'All brands'} →</Link>
            </div>
            <div className="brands__grid">
              {brands.docs.map((brand: any) => (
                <Link key={brand.id} href={`/${locale}/marques`} className="brand-card">
                  {brand.logo ? (
                    <img src={getMediaUrl(brand.logo)} alt={brand.name} loading="lazy" />
                  ) : (
                    <span>{brand.name}</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CMS Content (if any) */}
      {page?.content && typeof page.content === 'string' && page.content.trim() && (
        <section className="mega-landing__content">
          <div className="container">
            <div className="rich-text" dangerouslySetInnerHTML={{ __html: page.content }} />
          </div>
        </section>
      )}
    </div>
  )
}
