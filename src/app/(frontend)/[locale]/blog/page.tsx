import { getPayload, asLocale } from '@/lib/payload'
import { getMediaUrl } from '@/lib/media'
import Link from 'next/link'
import Image from 'next/image'

export const revalidate = 3600

export default async function BlogListPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const loc = asLocale(locale)
  const payload = await getPayload()
  const pages = await payload.find({ collection: 'pages', where: { template: { equals: 'blog' }, isActive: { equals: true } }, locale: loc, sort: '-createdAt', depth: 1 })

  return (
    <div className="container">
      <h1 className="page-title">Blog</h1>
      <div className="grid grid--3">
        {pages.docs.map((post: any) => (
          <Link key={post.id} href={`/${locale}/blog/${post.slug}`} className="blog-card">
            {post.featuredImage && <Image src={getMediaUrl(post.featuredImage)} alt={post.title} width={400} height={250} className="blog-card__image" />}
            <h3 className="blog-card__title">{post.title}</h3>
            {post.excerpt && <p className="blog-card__excerpt">{post.excerpt}</p>}
          </Link>
        ))}
      </div>
    </div>
  )
}
