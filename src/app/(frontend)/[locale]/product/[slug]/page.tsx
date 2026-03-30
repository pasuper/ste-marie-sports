import { notFound } from 'next/navigation'
import { getPayload, asLocale } from '@/lib/payload'
import { getMediaUrl } from '@/lib/media'
import ProductDetail from '@/components/ProductDetail'

export const revalidate = 60

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const loc = asLocale(locale)
  const payload = await getPayload()

  const data = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    locale: loc,
    limit: 1,
    depth: 2,
  })
  const product = data.docs[0]
  if (!product) return notFound()

  // Fetch related products from same category
  const categoryId =
    typeof product.category === 'object' ? product.category?.id : product.category
  const related = categoryId
    ? await payload.find({
        collection: 'products',
        where: {
          category: { equals: categoryId },
          id: { not_equals: product.id },
          isActive: { equals: true },
          variantType: { equals: 'parent' },
        },
        locale: loc,
        limit: 4,
        depth: 1,
      })
    : { docs: [] }

  // Build gallery images array
  const galleryImages: string[] = []
  if (product.thumbnail) {
    galleryImages.push(getMediaUrl(product.thumbnail))
  }
  if (product.images) {
    for (const img of product.images) {
      galleryImages.push(getMediaUrl((img as any).image))
    }
  }
  if (galleryImages.length === 0) {
    galleryImages.push('https://placehold.co/800x800/f3f4f6/9ca3af?text=No+Image')
  }

  // Collect attributes
  const attributes: { name: string; value: string }[] = []
  for (let i = 1; i <= 10; i++) {
    const name = (product as any)[`attribute${i}Name`]
    const value = (product as any)[`attribute${i}Value`]
    if (name && value) attributes.push({ name, value })
  }

  // Convert description to HTML string
  let descriptionHtml = ''
  if (typeof product.description === 'string') {
    descriptionHtml = product.description
  } else if (product.description && typeof product.description === 'object') {
    // Lexical rich text - try dynamic import for HTML conversion
    try {
      const lexical = await import('@payloadcms/richtext-lexical')
      if (lexical.convertLexicalToHTML && lexical.consolidateHTMLConverters && lexical.defaultEditorConfig && lexical.defaultEditorFeatures) {
        const editorConfig = lexical.defaultEditorConfig
        editorConfig.features = [...lexical.defaultEditorFeatures]
        const converters = lexical.consolidateHTMLConverters({ editorConfig })
        descriptionHtml = await lexical.convertLexicalToHTML({ converters, data: product.description })
      }
    } catch {
      // Fallback: serialize Lexical root text content
      try {
        const root = product.description?.root
        if (root?.children) {
          descriptionHtml = root.children.map((node: any) => {
            if (node.children) return `<p>${node.children.map((c: any) => c.text || '').join('')}</p>`
            return ''
          }).join('')
        }
      } catch { /* ignore */ }
    }
  }

  return (
    <ProductDetail
      product={JSON.parse(JSON.stringify(product))}
      relatedProducts={JSON.parse(JSON.stringify(related.docs))}
      locale={locale}
      galleryImages={galleryImages}
      attributes={attributes}
      descriptionHtml={descriptionHtml}
    />
  )
}
