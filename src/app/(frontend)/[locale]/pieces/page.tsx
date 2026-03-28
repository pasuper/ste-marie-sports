import { getPayload } from '@/lib/payload'
import { getMediaUrl } from '@/lib/media'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'
import Image from 'next/image'

export const revalidate = 300

export default async function PiecesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const payload = await getPayload()

  const [categories, products] = await Promise.all([
    payload.find({ collection: 'categories', where: { categoryType: { equals: 'parts' }, isActive: { equals: true } }, locale, limit: 50, sort: 'sortOrder' }),
    payload.find({ collection: 'products', where: { isActive: { equals: true }, variantType: { equals: 'parent' } }, locale, limit: 8, sort: '-createdAt', depth: 1 }),
  ])

  return (
    <div className="container">
      <h1 className="page-title">{locale === 'fr' ? 'Pièces' : 'Parts'}</h1>
      {categories.docs.length > 0 && (
        <div className="grid grid--3">
          {categories.docs.map((cat: any) => (
            <Link key={cat.id} href={`/${locale}/category/${cat.slug}`} className="category-card">
              {cat.image && <Image src={getMediaUrl(cat.image)} alt={cat.name} width={300} height={200} className="category-card__image" />}
              <h3 className="category-card__name">{cat.name}</h3>
            </Link>
          ))}
        </div>
      )}
      {products.docs.length > 0 && (
        <section className="section">
          <h2 className="section__title">{locale === 'fr' ? 'Nouveautés' : 'New Arrivals'}</h2>
          <div className="grid grid--4">
            {products.docs.map((p: any) => <ProductCard key={p.id} product={p} locale={locale} />)}
          </div>
        </section>
      )}
    </div>
  )
}
