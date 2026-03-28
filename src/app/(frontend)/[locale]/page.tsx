import { getPayload } from '@/lib/payload'
import { getMediaUrl } from '@/lib/media'
import HeroCarousel from '@/components/HeroCarousel'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'
import Image from 'next/image'

export const revalidate = 60

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const payload = await getPayload()

  const [heroData, brands, categories, products] = await Promise.all([
    payload.find({ collection: 'hero-sections', where: { pageSlug: { equals: 'home' }, isActive: { equals: true } }, locale, limit: 1, depth: 1 }),
    payload.find({ collection: 'brands', where: { isFeatured: { equals: true } }, locale, limit: 8, sort: 'sortOrder' }),
    payload.find({ collection: 'categories', where: { isFeatured: { equals: true } }, locale, limit: 6, sort: 'sortOrder' }),
    payload.find({ collection: 'products', where: { isFeatured: { equals: true }, isActive: { equals: true }, variantType: { equals: 'parent' } }, locale, limit: 8, depth: 1 }),
  ])

  const hero = heroData.docs[0]

  return (
    <div className="home-page">
      {hero?.slides && <HeroCarousel slides={hero.slides} autoPlay={hero.autoPlay} autoPlayDelay={hero.autoPlayDelay} locale={locale} />}

      {/* Featured Categories */}
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

      {/* Featured Products */}
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

      {/* Featured Brands */}
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
