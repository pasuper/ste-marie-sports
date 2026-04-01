import { getPayload, asLocale } from '@/lib/payload'
import { getMediaUrl } from '@/lib/media'
import Link from 'next/link'

export const revalidate = 3600

export default async function ContentPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  const loc = asLocale(locale)
  const payload = await getPayload()
  const data = await payload.find({ collection: 'pages', where: { slug: { equals: slug }, isActive: { equals: true } }, locale: loc, limit: 1, depth: 1 })
  const page = data.docs[0]

  if (!page) {
    return (
      <div className="content-page">
        <div className="page-header">
          <div className="container">
            <h1>{locale === 'fr' ? 'Page non trouvée' : 'Page not found'}</h1>
          </div>
        </div>
      </div>
    )
  }

  const sections = (page as any).sections || []

  return (
    <div className="content-page">
      <div className="page-header">
        <div className="container">
          <div className="header-breadcrumb">
            <Link href={`/${locale}`}>{locale === 'fr' ? 'Accueil' : 'Home'}</Link>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            <span>{page.title as string}</span>
          </div>
          <h1>{page.title as string}</h1>
          {(page as any).excerpt && <p>{(page as any).excerpt as string}</p>}
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          {page.featuredImage && (
            <img src={getMediaUrl(page.featuredImage)} alt={page.title as string} className="content-page__featured-image" />
          )}

          {sections.length > 0 && (
            <div className="legal-sections">
              {sections.map((section: any, i: number) => (
                <div key={i} className="legal-section">
                  {section.heading && <h2>{section.heading}</h2>}
                  {section.body && section.body.split('\n').map((line: string, j: number) =>
                    line.trim() ? <p key={j}>{line}</p> : null
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
