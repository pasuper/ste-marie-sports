import { notFound } from 'next/navigation'
import { getPayload, asLocale } from '@/lib/payload'
import { getMediaUrl } from '@/lib/media'
import VehicleDetail from '@/components/VehicleDetail'

export const revalidate = 60

export default async function VehicleDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params
  const loc = asLocale(locale)
  const payload = await getPayload()

  const result = await payload.find({
    collection: 'vehicles',
    where: { slug: { equals: id } },
    depth: 2,
    locale: loc,
    limit: 1,
  })

  const vehicle = result.docs[0]
  if (!vehicle) notFound()

  // Build gallery images array from thumbnail + images
  const images: string[] = []
  if (vehicle.thumbnail) {
    const url = getMediaUrl(vehicle.thumbnail)
    if (url !== '/placeholder-product.png') images.push(url)
  }
  if (vehicle.images && Array.isArray(vehicle.images)) {
    for (const img of vehicle.images) {
      const imgObj = typeof img === 'object' && img !== null && 'image' in img ? img.image : img
      const url = getMediaUrl(imgObj)
      if (!images.includes(url) && url !== '/placeholder-product.png') {
        images.push(url)
      }
    }
  }
  if (images.length === 0) {
    images.push('https://placehold.co/1200x800/1a365d/ffffff?text=Pas+d%27image')
  }

  // Serialize vehicle data for client component
  const specs = (vehicle as any).specifications || {}
  const brandObj = typeof vehicle.brand === 'object' && vehicle.brand ? vehicle.brand as any : null
  const brandName = brandObj ? (typeof brandObj.name === 'string' ? brandObj.name : brandObj.name?.fr || brandObj.name?.en || '') : ''
  const vehicleData = {
    title: typeof vehicle.title === 'string' ? vehicle.title : (vehicle.title as any)?.fr || (vehicle.title as any)?.en || '',
    slug: vehicle.slug || '',
    condition: vehicle.condition || 'used',
    vehicleType: vehicle.vehicleType || 'other',
    year: vehicle.year || 0,
    brand: brandObj ? { name: brandName } : null,
    model: vehicle.model || '',
    trim: (vehicle as any).submodel || (vehicle as any).trim || '',
    mileage: specs.mileage || 0,
    mileageUnit: specs.mileageUnit || 'km',
    price: vehicle.price || 0,
    msrp: vehicle.msrp || 0,
    description: vehicle.description || '',
    shortDescription: (vehicle as any).shortDescription || '',
    stockNumber: (vehicle as any).stockNumber || '',
    vin: specs.vin || '',
    exteriorColor: specs.exteriorColor || '',
    transmission: specs.transmission || '',
    fuelType: specs.fuelType || '',
    driveType: specs.driveType || '',
    engineSize: specs.engineSize || '',
    engineType: specs.engineType || '',
    horsepower: specs.horsepower ? String(specs.horsepower) : '',
    isAvailable: vehicle.isAvailable !== false,
    isFeatured: vehicle.isFeatured || false,
  }

  return <VehicleDetail vehicle={vehicleData} images={images} locale={locale} />
}
