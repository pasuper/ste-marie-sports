import { getPayload, asLocale } from '@/lib/payload'
import { getMediaUrl } from '@/lib/media'
import Link from 'next/link'
import Image from 'next/image'

export const revalidate = 300

interface Props { params: Promise<{ locale: string }>; searchParams: Promise<{ page?: string; condition?: string; type?: string }> }

export default async function VehicleListPage({ params, searchParams }: Props) {
  const { locale } = await params
  const loc = asLocale(locale)
  const { page: pageStr = '1', condition, type } = await searchParams
  const page = parseInt(pageStr, 10)
  const payload = await getPayload()

  const where: any = { isActive: { equals: true } }
  if (condition) where.condition = { equals: condition }
  if (type) where.vehicleType = { equals: type }

  const vehicles = await payload.find({ collection: 'vehicles', where, locale: loc, page, limit: 24, depth: 1, sort: '-createdAt' })

  const title = locale === 'fr' ? 'Véhicules' : 'Vehicles'

  return (
    <div className="vehicle-list-page">
      <div className="container">
        <h1 className="page-title">{title}</h1>
        <div className="vehicle-list-page__filters">
          <Link href={`/${locale}/vehicules`} className={`filter-chip ${!condition && !type ? 'filter-chip--active' : ''}`}>{locale === 'fr' ? 'Tous' : 'All'}</Link>
          <Link href={`/${locale}/vehicules?condition=new`} className={`filter-chip ${condition === 'new' ? 'filter-chip--active' : ''}`}>{locale === 'fr' ? 'Neufs' : 'New'}</Link>
          <Link href={`/${locale}/vehicules?condition=used`} className={`filter-chip ${condition === 'used' ? 'filter-chip--active' : ''}`}>{locale === 'fr' ? 'Usagés' : 'Used'}</Link>
        </div>
        <div className="grid grid--3">
          {vehicles.docs.map((vehicle: any) => (
            <Link key={vehicle.id} href={`/${locale}/vehicule/${vehicle.slug}`} className="vehicle-card">
              <Image src={getMediaUrl(vehicle.thumbnail)} alt={vehicle.title} width={400} height={300} className="vehicle-card__image" />
              <div className="vehicle-card__info">
                <span className="vehicle-card__condition">{vehicle.condition === 'new' ? (locale === 'fr' ? 'Neuf' : 'New') : (locale === 'fr' ? 'Usagé' : 'Used')}</span>
                <h3 className="vehicle-card__title">{vehicle.title}</h3>
                {vehicle.year && <span className="vehicle-card__year">{vehicle.year}</span>}
                {vehicle.price && <span className="vehicle-card__price">${vehicle.price.toLocaleString()}</span>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
