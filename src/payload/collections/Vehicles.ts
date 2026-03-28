import type { CollectionConfig } from 'payload'

export const Vehicles: CollectionConfig = {
  slug: 'vehicles',
  admin: { group: 'Inventory', useAsTitle: 'title' },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'stockNumber', type: 'text' },
    {
      name: 'condition',
      type: 'select',
      required: true,
      options: [
        { label: 'New', value: 'new' },
        { label: 'Used', value: 'used' },
        { label: 'Certified', value: 'certified' },
      ],
    },
    {
      name: 'vehicleType',
      type: 'select',
      required: true,
      options: [
        { label: 'ATV', value: 'atv' },
        { label: 'UTV', value: 'utv' },
        { label: 'Snowmobile', value: 'snowmobile' },
        { label: 'Motorcycle', value: 'motorcycle' },
        { label: 'PWC', value: 'watercraft' },
        { label: 'Spyder', value: 'spyder' },
      ],
    },
    { name: 'brand', type: 'relationship', relationTo: 'brands' },
    { name: 'year', type: 'number' },
    { name: 'model', type: 'text' },
    { name: 'trim', type: 'text' },
    { name: 'mileage', type: 'number' },
    { name: 'description', type: 'richText', localized: true },
    { name: 'price', type: 'number' },
    { name: 'thumbnail', type: 'upload', relationTo: 'media' },
    {
      name: 'images',
      type: 'array',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media' }],
    },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
    { name: 'isFeatured', type: 'checkbox', defaultValue: false },
  ],
  access: { read: () => true },
}
