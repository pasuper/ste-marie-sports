import { getPayload } from '@/lib/payload'
import { notFound } from 'next/navigation'

export const revalidate = 3600

export default async function DynamicPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  const payload = await getPayload()
  const data = await payload.find({ collection: 'pages', where: { slug: { equals: slug }, isActive: { equals: true } }, locale, limit: 1, depth: 1 })
  const page = data.docs[0]
  if (!page) notFound()

  return (
    <div className="container">
      <h1 className="page-title">{page.title}</h1>
      {page.content && <div className="rich-text" dangerouslySetInnerHTML={{ __html: typeof page.content === 'string' ? page.content : '' }} />}
    </div>
  )
}
