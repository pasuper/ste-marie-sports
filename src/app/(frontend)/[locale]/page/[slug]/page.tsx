import { getPayload } from '@/lib/payload'
import { getMediaUrl } from '@/lib/media'
import Image from 'next/image'

export const revalidate = 3600

export default async function ContentPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  const payload = await getPayload()
  const data = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, locale, limit: 1, depth: 1 })
  const page = data.docs[0]
  if (!page) return <div className="container"><h1>{locale === 'fr' ? 'Page non trouvée' : 'Page not found'}</h1></div>

  return (
    <div className="container">
      <h1 className="page-title">{page.title}</h1>
      {page.featuredImage && <Image src={getMediaUrl(page.featuredImage)} alt={page.title} width={800} height={400} className="content-page__image" />}
      {page.content && <div className="rich-text" dangerouslySetInnerHTML={{ __html: typeof page.content === 'string' ? page.content : '' }} />}
    </div>
  )
}
