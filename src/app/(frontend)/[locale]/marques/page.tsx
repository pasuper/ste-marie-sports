import { getPayload, asLocale } from '@/lib/payload'
import { getMediaUrl } from '@/lib/media'
import BrandsFilter from '@/components/BrandsFilter'

export const revalidate = 3600

export default async function BrandsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const loc = asLocale(locale)
  const payload = await getPayload()

  const result = await payload.find({
    collection: 'brands',
    where: { isActive: { equals: true } },
    locale: loc,
    limit: 500,
    sort: 'name',
  })

  const brands = result.docs.map((brand: any) => ({
    id: brand.id,
    name: brand.name || '',
    slug: brand.slug || '',
    logo: brand.logo ? getMediaUrl(brand.logo) : `https://placehold.co/200x100/1a1a1a/ffffff?text=${encodeURIComponent(brand.name || '')}`,
    isFeatured: brand.isFeatured || false,
  }))

  return <BrandsFilter brands={brands} locale={locale} />
}
