import type { CollectionConfig } from 'payload'

export const YMMTs: CollectionConfig = {
  slug: 'ymmts',
  admin: { group: 'Catalog', useAsTitle: 'displayName' },
  fields: [
    { name: 'year', type: 'number', required: true },
    { name: 'make', type: 'relationship', relationTo: 'brands', required: true },
    { name: 'model', type: 'text', required: true },
    { name: 'submodel', type: 'text' },
    { name: 'trim', type: 'text' },
    { name: 'engineCode', type: 'text' },
    {
      name: 'vehicleType',
      type: 'select',
      required: true,
      options: [
        { label: 'ATV', value: 'atv' },
        { label: 'UTV', value: 'utv' },
        { label: 'Snowmobile', value: 'snowmobile' },
        { label: 'Motorcycle', value: 'motorcycle' },
        { label: 'PWC', value: 'pwc' },
        { label: 'Marine', value: 'marine' },
      ],
    },
    { name: 'displayName', type: 'text' },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
  ],
  access: { read: () => true },
}
