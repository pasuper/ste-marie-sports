import { getPayload, asLocale } from '@/lib/payload'

export const revalidate = 3600

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const loc = asLocale(locale)
  const payload = await getPayload()
  const page = await payload.find({ collection: 'pages', where: { slug: { equals: 'services' } }, locale: loc, limit: 1 })
  const content = page.docs[0]

  return (
    <div className="container">
      <h1 className="page-title">{content?.title || 'Services'}</h1>
      {content?.content && <div className="rich-text" dangerouslySetInnerHTML={{ __html: typeof content.content === 'string' ? content.content : '' }} />}
    </div>
  )
}
