import { getPayload } from '@/lib/payload'
import ProductCard from '@/components/ProductCard'

export const revalidate = 60

interface Props { params: Promise<{ locale: string; category: string; subcategory: string }>; searchParams: Promise<{ page?: string }> }

export default async function SubcategoryPage({ params, searchParams }: Props) {
  const { locale, subcategory: subSlug } = await params
  const { page: pageStr = '1' } = await searchParams
  const page = parseInt(pageStr, 10)
  const payload = await getPayload()

  const catData = await payload.find({ collection: 'categories', where: { slug: { equals: subSlug } }, locale, limit: 1 })
  const category = catData.docs[0]
  if (!category) return <div className="container"><h1>{locale === 'fr' ? 'Sous-catégorie non trouvée' : 'Subcategory not found'}</h1></div>

  const products = await payload.find({ collection: 'products', where: { category: { equals: category.id }, isActive: { equals: true }, variantType: { equals: 'parent' } }, locale, page, limit: 24, depth: 1 })

  return (
    <div className="category-page">
      <div className="container">
        <h1 className="page-title">{category.displayName || category.name}</h1>
        <div className="grid grid--3">
          {products.docs.map((product: any) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      </div>
    </div>
  )
}
