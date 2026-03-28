import type { CollectionConfig } from 'payload'

export const Brands: CollectionConfig = {
  slug: 'brands',
  admin: { group: 'Catalog', useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'description', type: 'textarea', localized: true },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'website', type: 'text' },
    {
      name: 'brandType',
      type: 'select',
      options: [
        { label: 'Vehicle', value: 'vehicle' },
        { label: 'Parts', value: 'parts' },
        { label: 'Both', value: 'both' },
      ],
    },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
    { name: 'isFeatured', type: 'checkbox', defaultValue: false },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
  access: { read: () => true },
}
