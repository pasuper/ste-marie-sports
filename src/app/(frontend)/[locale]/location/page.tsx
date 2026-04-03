import { getPayload, asLocale } from '@/lib/payload'
import { getMediaUrl } from '@/lib/media'
import RentalPageClient from './RentalPageClient'

export const revalidate = 300

export default async function RentalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const loc = asLocale(locale)
  const payload = await getPayload()

  const data = await payload.find({
    collection: 'rental-vehicles',
    where: { isActive: { equals: true } },
    sort: 'sortOrder',
    locale: loc,
    limit: 20,
    depth: 1,
  })

  const vehicles = data.docs.map((v: any) => ({
    id: v.id,
    title: typeof v.title === 'string' ? v.title : v.title?.fr || '',
    description: typeof v.description === 'string' ? v.description : v.description?.fr || '',
    vehicleType: v.vehicleType || '',
    thumbnail: v.thumbnail ? getMediaUrl(v.thumbnail) : null,
    pricing: {
      fourHours: v.pricing?.fourHours || 0,
      fourHoursMaxKm: v.pricing?.fourHoursMaxKm || 0,
      oneDay: v.pricing?.oneDay || 0,
      oneDayMaxKm: v.pricing?.oneDayMaxKm || 0,
      weekend: v.pricing?.weekend || 0,
      weekendMaxKm: v.pricing?.weekendMaxKm || 0,
    },
    blockedDates: (v.blockedDates || []).map((d: any) => d.date?.split('T')[0]).filter(Boolean),
  }))

  return <RentalPageClient vehicles={vehicles} locale={locale} />
}
