// Rewrite Payload 3.x API paths to static paths
function fixUrl(url: string): string {
  if (url.startsWith('/api/media/file/')) {
    return '/media/' + url.slice('/api/media/file/'.length)
  }
  return url
}

export function getMediaUrl(media: any): string {
  if (!media) return '/placeholder-product.png'

  // Already a usable URL string
  if (typeof media === 'string') {
    if (/^[a-f0-9]{24}$/.test(media)) return '/placeholder-product.png'
    if (media.startsWith('http') || media.startsWith('/')) return fixUrl(media)
    return `/media/${media}`
  }

  // Populated media object from Payload
  if (typeof media === 'object') {
    // Prefer filename (always correct path)
    if (media.filename) {
      return `/media/${media.filename}`
    }
    if (media.url) {
      return fixUrl(media.url.startsWith('/') || media.url.startsWith('http') ? media.url : `/${media.url}`)
    }
    // Nested media (e.g. { image: { url: '...' } })
    if (media.image) return getMediaUrl(media.image)
  }

  return '/placeholder-product.png'
}

export function getMediaSize(media: any, size: 'thumbnail' | 'small' | 'medium' | 'large'): string {
  if (!media) return '/placeholder-product.png'
  if (media.sizes?.[size]?.filename) return `/media/${media.sizes[size].filename}`
  if (media.sizes?.[size]?.url) return fixUrl(media.sizes[size].url)
  return getMediaUrl(media)
}
