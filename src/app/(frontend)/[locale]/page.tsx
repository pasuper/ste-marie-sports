import { getPayload, asLocale } from '@/lib/payload'
import { getMediaUrl } from '@/lib/media'
import HeroCarousel from '@/components/HeroCarousel'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'
import Image from 'next/image'

export const revalidate = 60

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const loc = asLocale(locale)
  const payload = await getPayload()

  // Hero sections
  const heroData = await payload.find({ collection: 'hero-sections', where: { isActive: { equals: true } }, locale: loc, limit: 1, depth: 1 })

  // Brands - try featured first, fallback to all active
  let brands = await payload.find({ collection: 'brands', where: { isFeatured: { equals: true } }, locale: loc, limit: 12, sort: 'sortOrder' })
  if (brands.docs.length === 0) {
    brands = await payload.find({ collection: 'brands', where: { isActive: { equals: true } }, locale: loc, limit: 12, sort: 'sortOrder' })
  }

  // Categories - try featured first, fallback to root categories
  let categories = await payload.find({ collection: 'categories', where: { isFeatured: { equals: true } }, locale: loc, limit: 8, sort: 'sortOrder' })
  if (categories.docs.length === 0) {
    categories = await payload.find({ collection: 'categories', where: { isActive: { equals: true } }, locale: loc, limit: 8, sort: 'sortOrder' })
  }

  // Products - try featured, fallback to recent with thumbnails
  let products = await payload.find({ collection: 'products', where: { isFeatured: { equals: true }, isActive: { equals: true }, variantType: { equals: 'parent' } }, locale: loc, limit: 8, depth: 1 })
  if (products.docs.length === 0) {
    products = await payload.find({ collection: 'products', where: { isActive: { equals: true }, variantType: { equals: 'parent' }, thumbnail: { exists: true } }, locale: loc, limit: 8, sort: '-createdAt', depth: 1 })
  }
  if (products.docs.length === 0) {
    products = await payload.find({ collection: 'products', where: { isActive: { equals: true } }, locale: loc, limit: 8, sort: '-createdAt', depth: 1 })
  }

  const hero = heroData.docs[0]

  return (
    <div className="home-page">
      {hero?.slides && <HeroCarousel slides={hero.slides} autoPlay={hero.autoPlay} autoPlayDelay={hero.autoPlayDelay} locale={locale} />}

      {/* Categories */}
      {categories.docs.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="section__title">{locale === 'fr' ? 'Catégories' : 'Categories'}</h2>
            <div className="grid grid--3">
              {categories.docs.map((cat: any) => (
                <Link key={cat.id} href={`/${locale}/category/${cat.slug}`} className="category-card">
                  {cat.image && <Image src={getMediaUrl(cat.image)} alt={cat.name} width={400} height={300} className="category-card__image" />}
                  <h3 className="category-card__name">{cat.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products */}
      {products.docs.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="section__title">{locale === 'fr' ? 'Produits vedettes' : 'Featured Products'}</h2>
            <div className="grid grid--4">
              {products.docs.map((product: any) => (
                <ProductCard key={product.id} product={product} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brands */}
      {brands.docs.length > 0 && (
        <section className="section section--gray">
          <div className="container">
            <h2 className="section__title">{locale === 'fr' ? 'Nos marques' : 'Our Brands'}</h2>
            <div className="brands-grid">
              {brands.docs.map((brand: any) => (
                <Link key={brand.id} href={`/${locale}/marques`} className="brand-logo">
                  {brand.logo ? (
                    <Image src={getMediaUrl(brand.logo)} alt={brand.name} width={150} height={80} className="brand-logo__image" />
                  ) : (
                    <span className="brand-logo__name">{brand.name}</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
