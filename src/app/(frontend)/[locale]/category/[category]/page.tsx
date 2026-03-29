import { getPayload, asLocale } from '@/lib/payload'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

export const revalidate = 60

interface Props { params: Promise<{ locale: string; category: string }>; searchParams: Promise<{ page?: string; sort?: string; brand?: string }> }

export default async function CategoryPage({ params, searchParams }: Props) {
  const { locale, category: categorySlug } = await params
  const loc = asLocale(locale)
  const { page: pageStr = '1', sort = '-createdAt', brand } = await searchParams
  const page = parseInt(pageStr, 10)
  const payload = await getPayload()

  const categoryData = await payload.find({ collection: 'categories', where: { slug: { equals: categorySlug } }, locale: loc, limit: 1, depth: 1 })
  const category = categoryData.docs[0]
  if (!category) return <div className="container"><h1>{locale === 'fr' ? 'Catégorie non trouvée' : 'Category not found'}</h1></div>

  // Get child categories
  const children = await payload.find({ collection: 'categories', where: { parent: { equals: category.id } }, locale: loc, limit: 100 })
  const categoryIds = [category.id, ...children.docs.map((c: any) => c.id)]

  const where: any = { category: { in: categoryIds }, isActive: { equals: true }, variantType: { equals: 'parent' } }
  if (brand) {
    const brandData = await payload.find({ collection: 'brands', where: { slug: { equals: brand } }, limit: 1 })
    if (brandData.docs[0]) where.brand = { equals: brandData.docs[0].id }
  }

  const products = await payload.find({ collection: 'products', where, locale: loc, page, limit: 24, sort, depth: 1 })
  const brands = await payload.find({ collection: 'brands', where: { isActive: { equals: true } }, locale: loc, limit: 100, sort: 'name' })

  return (
    <div className="category-page">
      <div className="container">
        <h1 className="page-title">{category.displayName || category.name}</h1>
        {category.shortDescription && <p className="page-subtitle">{category.shortDescription}</p>}

        {children.docs.length > 0 && (
          <div className="subcategories">
            {children.docs.map((sub: any) => (
              <Link key={sub.id} href={`/${locale}/category/${categorySlug}/${sub.slug}`} className="subcategory-chip">{sub.name}</Link>
            ))}
          </div>
        )}

        <div className="category-page__layout">
          <aside className="category-page__sidebar">
            <h3>{locale === 'fr' ? 'Marques' : 'Brands'}</h3>
            <ul className="filter-list">
              {brands.docs.map((b: any) => (
                <li key={b.id}>
                  <Link href={`/${locale}/category/${categorySlug}?brand=${b.slug}`} className={`filter-link ${brand === b.slug ? 'filter-link--active' : ''}`}>
                    {b.name}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

          <div className="category-page__products">
            <div className="category-page__toolbar">
              <span>{products.totalDocs} {locale === 'fr' ? 'produits' : 'products'}</span>
            </div>
            <div className="grid grid--3">
              {products.docs.map((product: any) => (
                <ProductCard key={product.id} product={product} locale={locale} />
              ))}
            </div>
            {products.totalPages > 1 && (
              <div className="pagination">
                {Array.from({ length: products.totalPages }, (_, i) => (
                  <Link key={i} href={`/${locale}/category/${categorySlug}?page=${i + 1}${sort !== '-createdAt' ? `&sort=${sort}` : ''}${brand ? `&brand=${brand}` : ''}`} className={`pagination__link ${page === i + 1 ? 'pagination__link--active' : ''}`}>
                    {i + 1}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
