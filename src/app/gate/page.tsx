import { getPayload } from '@/lib/payload'
import { getMediaUrl } from '@/lib/media'
import GateForm from './GateForm'
import Image from 'next/image'

export default async function GatePage() {
  let logoUrl = '/logo-stemarie.png'
  let contactEmail = 'michel.aubin@pasuper.com'

  try {
    const payload = await getPayload()
    const siteIdentity = await payload.findGlobal({ slug: 'site-identity' })
    if (siteIdentity?.logoDark) {
      logoUrl = getMediaUrl(siteIdentity.logoDark)
    } else if (siteIdentity?.logo) {
      logoUrl = getMediaUrl(siteIdentity.logo)
    }
    const storeInfo = await payload.findGlobal({ slug: 'store-information' })
    if (storeInfo?.contact?.email) {
      contactEmail = storeInfo.contact.email
    }
  } catch {
    // CMS not available, use fallback values
  }

  return (
    <div className="gate-page">
      <div className="gate-page__bg" />
      <div className="gate-page__overlay" />

      <div className="gate-page__card">
        <div className="gate-page__logo">
          <Image src={logoUrl} alt="Ste-Marie Sports" width={280} height={80} priority />
        </div>
        <h1 className="gate-page__title">En construction</h1>
        <p className="gate-page__subtitle">
          Ce site est actuellement en développement.<br />
          Entrez le mot de passe pour accéder au site.
        </p>
        <GateForm />
        <p className="gate-page__contact">
          Contactez-nous: <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
        </p>
      </div>
    </div>
  )
}
