import { getPayload, asLocale } from '@/lib/payload'
import { getMediaUrl } from '@/lib/media'
import Image from 'next/image'
import Link from 'next/link'

export const revalidate = 60

export default async function VehicleDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params
  const loc = asLocale(locale)
  const payload = await getPayload()

  const data = await payload.find({ collection: 'vehicles', where: { slug: { equals: id } }, locale: loc, limit: 1, depth: 2 })
  const vehicle = data.docs[0]
  if (!vehicle) return <div className="container"><h1>{locale === 'fr' ? 'Véhicule non trouvé' : 'Vehicle not found'}</h1></div>

  const images = vehicle.images?.map((img: any) => getMediaUrl(img.image)) || []
  if (vehicle.thumbnail) images.unshift(getMediaUrl(vehicle.thumbnail))

  return (
    <div className="vehicle-detail-page">
      <div className="container">
        <div className="vehicle-detail-page__layout">
          <div className="vehicle-detail-page__gallery">
            {images.map((url: string, i: number) => (
              <Image key={i} src={url} alt={`${vehicle.title} ${i + 1}`} width={800} height={600} className="vehicle-detail-page__image" priority={i === 0} />
            ))}
          </div>
          <div className="vehicle-detail-page__info">
            <span className="vehicle-detail-page__condition">{vehicle.condition === 'new' ? (locale === 'fr' ? 'Neuf' : 'New') : (locale === 'fr' ? 'Usagé' : 'Used')}</span>
            <h1>{vehicle.title}</h1>
            {vehicle.year && <p>{locale === 'fr' ? 'Année' : 'Year'}: {vehicle.year}</p>}
            {vehicle.model && <p>{locale === 'fr' ? 'Modèle' : 'Model'}: {vehicle.model}</p>}
            {vehicle.mileage !== undefined && <p>{locale === 'fr' ? 'Kilométrage' : 'Mileage'}: {vehicle.mileage.toLocaleString()} km</p>}
            {vehicle.stockNumber && <p>Stock #: {vehicle.stockNumber}</p>}
            {vehicle.price && <p className="vehicle-detail-page__price">${vehicle.price.toLocaleString()}</p>}
            <Link href={`/${locale}/contact?subject=vehicle&ref=${vehicle.slug}`} className="btn btn--primary">
              {locale === 'fr' ? "Demander plus d'infos" : 'Request Info'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
