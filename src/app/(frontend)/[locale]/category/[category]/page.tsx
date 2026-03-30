import { getPayload, asLocale } from '@/lib/payload'
import CategoryFilters from '@/components/CategoryFilters'

export const revalidate = 60

interface Props {
  params: Promise<{ locale: string; category: string }>
  searchParams: Promise<Record<string, string>>
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { locale, category: categorySlug } = await params
  const search = await searchParams
  const loc = asLocale(locale)
  const payload = await getPayload()

  const pageSize = 24
  const currentPage = parseInt(search.page || '1', 10)
  const sortBy = search.sort || 'name:asc'
  const selectedBrands = search.brands?.split(',').filter(Boolean) || []
  const minPrice = parseInt(search.minPrice || '0', 10)
  const maxPrice = parseInt(search.maxPrice || '10000', 10)

  const payloadSort = sortBy.includes(':desc')
    ? `-${sortBy.replace(':desc', '')}`
    : sortBy.replace(':asc', '')

  // Parallel fetch: category + all categories + brands
  // depth: 1 needed for categories (parent population) and brands (logo)
  const [categoryData, allCategoriesData, brandsData] = await Promise.all([
    payload.find({ collection: 'categories', where: { slug: { equals: categorySlug } }, locale: loc, limit: 1, depth: 1 }),
    payload.find({ collection: 'categories', where: { isActive: { equals: true } }, locale: loc, limit: 500, sort: 'name', depth: 1 }),
    payload.find({ collection: 'brands', where: { isActive: { equals: true } }, locale: loc, limit: 100, sort: 'name', depth: 0 }),
  ])

  const currentCategory = categoryData.docs[0] || null

  // Build product query
  const where: Record<string, any> = {
    isActive: { equals: true },
    variantType: { equals: 'parent' },
  }

  if (currentCategory) {
    const childCats = await payload.find({ collection: 'categories', where: { parent: { equals: currentCategory.id } }, locale: loc, limit: 100, depth: 0 })
    const categoryIds = [currentCategory.id, ...childCats.docs.map((c: any) => c.id)]
    where.category = { in: categoryIds }
  }

  if (selectedBrands.length > 0) {
    const brandDocs = await payload.find({ collection: 'brands', where: { slug: { in: selectedBrands } }, limit: 50, depth: 0 })
    if (brandDocs.docs.length > 0) {
      where.brand = { in: brandDocs.docs.map((b: any) => b.id) }
    }
  }

  const productsData = await payload.find({
    collection: 'products',
    where,
    locale: loc,
    page: currentPage,
    limit: pageSize,
    sort: payloadSort,
    depth: 1,
  })

  return (
    <CategoryFilters
      locale={locale}
      categorySlug={categorySlug}
      currentCategory={currentCategory ? JSON.parse(JSON.stringify(currentCategory)) : null}
      allCategories={JSON.parse(JSON.stringify(allCategoriesData.docs))}
      brands={JSON.parse(JSON.stringify(brandsData.docs))}
      products={JSON.parse(JSON.stringify(productsData.docs))}
      totalProducts={productsData.totalDocs}
      totalPages={productsData.totalPages}
      currentPage={currentPage}
      sortBy={sortBy}
      selectedBrands={selectedBrands}
      minPrice={minPrice}
      maxPrice={maxPrice}
    />
  )
}
