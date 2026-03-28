import type { GlobalConfig } from 'payload'

export const SiteIdentity: GlobalConfig = {
  slug: 'site-identity',
  admin: { group: 'Settings' },
  fields: [
    { name: 'siteName', type: 'text', required: true, defaultValue: 'Ste-Marie Sports', localized: true },
    { name: 'tagline', type: 'text', localized: true },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'logoDark', type: 'upload', relationTo: 'media', admin: { description: 'Logo for dark backgrounds' } },
    { name: 'favicon', type: 'upload', relationTo: 'media' },
    { name: 'defaultOgImage', type: 'upload', relationTo: 'media' },
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        { name: 'facebook', type: 'text' },
        { name: 'instagram', type: 'text' },
        { name: 'twitter', type: 'text' },
        { name: 'youtube', type: 'text' },
        { name: 'linkedin', type: 'text' },
        { name: 'tiktok', type: 'text' },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'defaultTitle', type: 'text', localized: true },
        { name: 'titleSuffix', type: 'text', defaultValue: ' | Ste-Marie Sports', localized: true },
        { name: 'defaultDescription', type: 'textarea', localized: true },
        { name: 'defaultKeywords', type: 'text', localized: true },
      ],
    },
    {
      name: 'analytics',
      type: 'group',
      fields: [
        { name: 'googleAnalyticsId', type: 'text' },
        { name: 'googleTagManagerId', type: 'text' },
        { name: 'facebookPixelId', type: 'text' },
      ],
    },
  ],
}
