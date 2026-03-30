import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: { group: 'Catalog', useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    { name: 'displayName', type: 'text', localized: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'description', type: 'richText', localized: true },
    { name: 'shortDescription', type: 'textarea', localized: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'icon', type: 'text', admin: { description: 'CSS icon class name' } },
    { name: 'color', type: 'text', admin: { description: 'Hex color code' } },
    {
      name: 'categoryType',
      type: 'select',
      required: true,
      options: [
        { label: 'Product', value: 'product' },
        { label: 'Parts', value: 'parts' },
        { label: 'Accessories', value: 'accessories' },
        { label: 'Clothing', value: 'clothing' },
        { label: 'Helmets', value: 'helmets' },
        { label: 'Blog', value: 'blog' },
      ],
    },
    { name: 'parent', type: 'relationship', relationTo: 'categories', index: true },
    {
      name: 'vehicleTypes',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'ATV', value: 'atv' },
        { label: 'UTV', value: 'utv' },
        { label: 'Snowmobile', value: 'snowmobile' },
        { label: 'Motorcycle', value: 'motorcycle' },
        { label: 'PWC', value: 'watercraft' },
        { label: 'Marine', value: 'marine' },
      ],
    },
    { name: 'isActive', type: 'checkbox', defaultValue: true, index: true },
    { name: 'isFeatured', type: 'checkbox', defaultValue: false, index: true },
    { name: 'sortOrder', type: 'number', defaultValue: 0, index: true },
  ],
  access: { read: () => true },
}
