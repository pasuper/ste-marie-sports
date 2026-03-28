import { getPayload } from '@/lib/payload'
import { getMediaUrl } from '@/lib/media'
import ProductCard from '@/components/ProductCard'
import AddToCartButton from './AddToCartButton'
import Image from 'next/image'

export const revalidate = 60

export default async function ProductPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  const payload = await getPayload()

  const data = await payload.find({ collection: 'products', where: { slug: { equals: slug } }, locale, limit: 1, depth: 2 })
  const product = data.docs[0]
  if (!product) return <div className="container"><h1>{locale === 'fr' ? 'Produit non trouvé' : 'Product not found'}</h1></div>

  // Related products
  const related = product.category ? await payload.find({ collection: 'products', where: { category: { equals: typeof product.category === 'object' ? product.category.id : product.category }, id: { not_equals: product.id }, isActive: { equals: true }, variantType: { equals: 'parent' } }, locale, limit: 4, depth: 1 }) : { docs: [] }

  const images = product.images?.map((img: any) => getMediaUrl(img.image)) || []
  if (product.thumbnail) images.unshift(getMediaUrl(product.thumbnail))

  // Collect attributes
  const attributes: { name: string; value: string }[] = []
  for (let i = 1; i <= 10; i++) {
    const name = (product as any)[`attribute${i}Name`]
    const value = (product as any)[`attribute${i}Value`]
    if (name && value) attributes.push({ name, value })
  }

  return (
    <div className="product-page">
      <div className="container">
        <div className="product-page__layout">
          <div className="product-page__gallery">
            {images.length > 0 ? (
              images.map((url: string, i: number) => (
                <Image key={i} src={url} alt={`${product.name} ${i + 1}`} width={600} height={600} className="product-page__image" priority={i === 0} />
              ))
            ) : (
              <Image src="/placeholder-product.png" alt={product.name} width={600} height={600} className="product-page__image" />
            )}
          </div>
          <div className="product-page__info">
            {typeof product.brand === 'object' && product.brand?.name && (
              <span className="product-page__brand">{product.brand.name}</span>
            )}
            <h1 className="product-page__title">{product.name}</h1>
            {product.sku && <p className="product-page__sku">SKU: {product.sku}</p>}
            <div className="product-page__pricing">
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="product-page__compare-price">${product.compareAtPrice.toFixed(2)}</span>
              )}
              <span className="product-page__price">${product.price.toFixed(2)}</span>
            </div>
            {product.shortDescription && <p className="product-page__description">{product.shortDescription}</p>}

            <AddToCartButton product={product} locale={locale} />

            {product.stock !== undefined && (
              <p className={`product-page__stock ${product.stock > 0 ? 'product-page__stock--in' : 'product-page__stock--out'}`}>
                {product.stock > 0 ? (locale === 'fr' ? 'En stock' : 'In Stock') : (locale === 'fr' ? 'Rupture de stock' : 'Out of Stock')}
              </p>
            )}

            {attributes.length > 0 && (
              <div className="product-page__attributes">
                <h3>{locale === 'fr' ? 'Caractéristiques' : 'Specifications'}</h3>
                <table className="attributes-table">
                  <tbody>
                    {attributes.map((attr, i) => (
                      <tr key={i}><td>{attr.name}</td><td>{attr.value}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {related.docs.length > 0 && (
          <section className="section">
            <h2 className="section__title">{locale === 'fr' ? 'Produits similaires' : 'Related Products'}</h2>
            <div className="grid grid--4">
              {related.docs.map((p: any) => <ProductCard key={p.id} product={p} locale={locale} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
