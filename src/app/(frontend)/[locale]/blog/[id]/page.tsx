import { getPayload, asLocale } from '@/lib/payload'
import { getMediaUrl } from '@/lib/media'
import Image from 'next/image'

export const revalidate = 3600

export default async function BlogDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params
  const loc = asLocale(locale)
  const payload = await getPayload()
  const data = await payload.find({ collection: 'pages', where: { slug: { equals: id } }, locale: loc, limit: 1, depth: 1 })
  const post = data.docs[0]
  if (!post) return <div className="container"><h1>{locale === 'fr' ? 'Article non trouvé' : 'Post not found'}</h1></div>

  return (
    <article className="container blog-detail">
      <h1 className="page-title">{post.title}</h1>
      {post.featuredImage && <Image src={getMediaUrl(post.featuredImage)} alt={post.title} width={800} height={400} className="blog-detail__image" />}
      {post.content && <div className="blog-detail__content rich-text" dangerouslySetInnerHTML={{ __html: typeof post.content === 'string' ? post.content : '' }} />}
    </article>
  )
}
