import type { CollectionConfig } from 'payload'

export const Menus: CollectionConfig = {
  slug: 'menus',
  admin: { group: 'Content', useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true },
    {
      name: 'location',
      type: 'select',
      required: true,
      options: [
        { label: 'Topbar Right', value: 'topbar-right' },
        { label: 'Main Navigation', value: 'main-navigation' },
        { label: 'Footer Left', value: 'footer-left' },
        { label: 'Footer Center', value: 'footer-center' },
        { label: 'Footer Right', value: 'footer-right' },
        { label: 'Footer Bottom', value: 'footer-bottom' },
        { label: 'Mobile Main', value: 'mobile-main' },
        { label: 'Mobile Secondary', value: 'mobile-secondary' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      localized: true,
      fields: [
        { name: 'label', type: 'text', required: true },
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Internal Link', value: 'internal' },
            { label: 'External Link', value: 'external' },
            { label: 'Category', value: 'category' },
            { label: 'Page', value: 'page' },
            { label: 'Mega Menu', value: 'megamenu' },
          ],
        },
        { name: 'url', type: 'text' },
        { name: 'page', type: 'relationship', relationTo: 'pages' },
        { name: 'category', type: 'relationship', relationTo: 'categories' },
        { name: 'openInNewTab', type: 'checkbox', defaultValue: false },
        { name: 'highlight', type: 'checkbox', defaultValue: false },
        { name: 'icon', type: 'upload', relationTo: 'media' },
      ],
    },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
  access: { read: () => true },
}
