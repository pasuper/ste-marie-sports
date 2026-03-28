import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: '../public/media',
    imageSizes: [
      { name: 'thumbnail', width: 150, height: 150, position: 'centre' },
      { name: 'small', width: 300, height: 300, position: 'centre' },
      { name: 'medium', width: 600, height: undefined, position: 'centre' },
      { name: 'large', width: 1200, height: undefined, position: 'centre' },
    ],
    mimeTypes: ['image/*', 'video/*', 'application/pdf'],
  },
  admin: { group: 'Media' },
  fields: [
    { name: 'alt', type: 'text', localized: true },
    { name: 'caption', type: 'text', localized: true },
  ],
  access: { read: () => true },
}
