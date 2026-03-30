import { getPayload, asLocale } from '@/lib/payload'
import { getMediaUrl } from '@/lib/media'
import { t } from '@/lib/i18n'
import Link from 'next/link'
import VehicleListClient from './VehicleListClient'

export const revalidate = 300

interface Props {
  params: Promise<{ locale: string }>
  searchParams: Promise<Record<string, string>>
}

export default async function VehicleListPage({ params, searchParams }: Props) {
  const { locale } = await params
  const search = await searchParams
  const loc = asLocale(locale)
  const payload = await getPayload()

  const condition = search.condition || undefined
  const vehicleType = search.type || undefined
  const page = parseInt(search.page || '1', 10)
  const sortBy = search.sort || 'featured'
  const brandSlug = search.brand || undefined
  const minPrice = search.minPrice ? parseInt(search.minPrice) : undefined
  const maxPrice = search.maxPrice ? parseInt(search.maxPrice) : undefined
  const minYear = search.minYear ? parseInt(search.minYear) : undefined
  const maxYear = search.maxYear ? parseInt(search.maxYear) : undefined
  const searchQuery = search.search || undefined

  // Build where clause
  const where: any = {}
  if (condition) where.condition = { equals: condition }
  if (vehicleType) where.vehicleType = { equals: vehicleType }
  if (brandSlug) where['brand.slug'] = { equals: brandSlug }
  if (minPrice || maxPrice) {
    where.price = {}
    if (minPrice) where.price.greater_than_equal = minPrice
    if (maxPrice) where.price.less_than_equal = maxPrice
  }
  if (minYear || maxYear) {
    where.year = {}
    if (minYear) where.year.greater_than_equal = minYear
    if (maxYear) where.year.less_than_equal = maxYear
  }
  if (searchQuery) where.title = { contains: searchQuery }

  // Build sort
  let sort: string
  switch (sortBy) {
    case 'price-low': sort = 'price'; break
    case 'price-high': sort = '-price'; break
    case 'year-new': sort = '-year'; break
    case 'year-old': sort = 'year'; break
    case 'mileage-low': sort = 'mileage'; break
    default: sort = '-isFeatured,-createdAt'; break
  }

  const [vehiclesResult, brandsResult] = await Promise.all([
    payload.find({ collection: 'vehicles', where, locale: loc, page, limit: 24, depth: 1, sort }),
    payload.find({ collection: 'brands', where: { isActive: { equals: true } }, locale: loc, limit: 200, sort: 'name' }),
  ])

  // Serialize data for client component
  const vehicles = vehiclesResult.docs.map((v: any) => {
    const title = typeof v.title === 'string' ? v.title : v.title?.fr || v.title?.en || ''
    const brandObj = typeof v.brand === 'object' && v.brand ? v.brand : null
    const brandName = brandObj ? (typeof brandObj.name === 'string' ? brandObj.name : brandObj.name?.fr || brandObj.name?.en || '') : ''
    const specs = v.specifications || {}
    return {
      id: v.id,
      documentId: v.id,
      title,
      slug: v.slug,
      condition: v.condition,
      vehicleType: v.vehicleType,
      year: v.year,
      brand: brandObj ? { id: brandObj.id, name: brandName, slug: brandObj.slug } : null,
      model: v.model || '',
      mileage: specs.mileage || v.mileage || 0,
      mileageUnit: specs.mileageUnit || 'km',
      price: v.price,
      msrp: v.msrp,
      thumbnail: v.thumbnail ? { url: getMediaUrl(v.thumbnail) } : null,
      images: v.images?.map((img: any) => ({ url: getMediaUrl(img.image || img) })) || [],
      stock: v.stock,
      stockNumber: v.stockNumber || '',
      vin: specs.vin || '',
      isFeatured: v.isFeatured,
      isAvailable: v.isAvailable !== false,
      transmission: specs.transmission || '',
      fuelType: specs.fuelType || '',
      driveType: specs.driveType || '',
      exteriorColor: specs.exteriorColor || '',
    }
  })

  const brands = brandsResult.docs.map((b: any) => ({
    id: b.id,
    documentId: b.id,
    name: b.name,
    slug: b.slug,
  }))

  return (
    <VehicleListClient
      locale={locale}
      vehicles={vehicles}
      brands={brands}
      totalCount={vehiclesResult.totalDocs}
      totalPages={vehiclesResult.totalPages}
      currentPage={page}
      initialCondition={condition}
      initialVehicleType={vehicleType}
      initialSortBy={sortBy}
      initialBrandSlug={brandSlug}
      initialMinPrice={minPrice}
      initialMaxPrice={maxPrice}
      initialMinYear={minYear}
      initialMaxYear={maxYear}
      initialSearch={searchQuery}
    />
  )
}
