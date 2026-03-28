import { getPayload } from '@/lib/payload'
import { getMediaUrl } from '@/lib/media'
import Image from 'next/image'

export const revalidate = 3600

export default async function BrandsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const payload = await getPayload()
  const brands = await payload.find({ collection: 'brands', where: { isActive: { equals: true } }, locale, limit: 200, sort: 'sortOrder' })

  return (
    <div className="container">
      <h1 className="page-title">{locale === 'fr' ? 'Nos marques' : 'Our Brands'}</h1>
      <div className="brands-grid brands-grid--large">
        {brands.docs.map((brand: any) => (
          <div key={brand.id} className="brand-card">
            {brand.logo ? <Image src={getMediaUrl(brand.logo)} alt={brand.name} width={200} height={100} /> : <span>{brand.name}</span>}
            <h3>{brand.name}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}
