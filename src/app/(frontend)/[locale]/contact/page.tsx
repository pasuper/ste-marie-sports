import { getPayload } from '@/lib/payload'
import ContactForm from './ContactForm'

export const revalidate = 3600

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const payload = await getPayload()
  const storeInfo = await payload.findGlobal({ slug: 'store-information', locale })

  return (
    <div className="container">
      <h1 className="page-title">{locale === 'fr' ? 'Contactez-nous' : 'Contact Us'}</h1>
      <div className="contact-page__layout">
        <div className="contact-page__form">
          <ContactForm locale={locale} />
        </div>
        <div className="contact-page__info">
          {storeInfo?.contact?.phone && <p><strong>{locale === 'fr' ? 'Téléphone' : 'Phone'}:</strong> {storeInfo.contact.phone}</p>}
          {storeInfo?.contact?.email && <p><strong>{locale === 'fr' ? 'Courriel' : 'Email'}:</strong> {storeInfo.contact.email}</p>}
          {storeInfo?.address && (
            <div>
              <strong>{locale === 'fr' ? 'Adresse' : 'Address'}:</strong>
              <p>{storeInfo.address.street}<br />{storeInfo.address.city}, {storeInfo.address.province} {storeInfo.address.postalCode}</p>
            </div>
          )}
          {storeInfo?.hours && storeInfo.hours.length > 0 && (
            <div>
              <strong>{locale === 'fr' ? 'Heures' : 'Hours'}:</strong>
              {storeInfo.hours.map((h: any, i: number) => (
                <p key={i}>{h.day}: {h.isClosed ? (locale === 'fr' ? 'Fermé' : 'Closed') : `${h.open} - ${h.close}`}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
