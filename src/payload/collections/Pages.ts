import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: { group: 'Content', useAsTitle: 'title' },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    {
      name: 'template',
      type: 'select',
      options: [
        { label: 'Custom', value: 'custom' },
        { label: 'Home', value: 'home' },
        { label: 'About', value: 'about' },
        { label: 'Contact', value: 'contact' },
        { label: 'Service', value: 'service' },
        { label: 'Blog', value: 'blog' },
        { label: 'Legal', value: 'legal' },
        { label: 'Mega Menu Landing', value: 'mega-menu-item-landing' },
        { label: 'Vehicles New', value: 'vehicles-new' },
        { label: 'Vehicles Used', value: 'vehicles-used' },
      ],
    },
    { name: 'content', type: 'richText', localized: true },
    { name: 'excerpt', type: 'textarea', localized: true },
    { name: 'featuredImage', type: 'upload', relationTo: 'media' },
    { name: 'seoTitle', type: 'text', localized: true },
    { name: 'seoDescription', type: 'textarea', localized: true },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
  ],
  access: { read: () => true },
}
