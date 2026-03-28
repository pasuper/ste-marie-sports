export function getMediaUrl(media: any): string {
  if (!media) return '/placeholder-product.png'
  if (typeof media === 'string') {
    return media.startsWith('http') ? media : media
  }
  if (media.url) {
    return media.url
  }
  return '/placeholder-product.png'
}

export function getMediaSize(media: any, size: 'thumbnail' | 'small' | 'medium' | 'large'): string {
  if (!media) return '/placeholder-product.png'
  if (media.sizes?.[size]?.url) return media.sizes[size].url
  return getMediaUrl(media)
}
