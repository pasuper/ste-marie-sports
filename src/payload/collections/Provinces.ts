import type { CollectionConfig } from 'payload'

export const Provinces: CollectionConfig = {
  slug: 'provinces',
  admin: { group: 'Settings' },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    { name: 'code', type: 'text', required: true, unique: true },
    { name: 'country', type: 'text', defaultValue: 'CA' },
    { name: 'taxRate', type: 'number' },
    { name: 'gstRate', type: 'number', defaultValue: 0 },
    { name: 'pstRate', type: 'number', defaultValue: 0 },
    { name: 'hstRate', type: 'number', defaultValue: 0 },
    { name: 'qstRate', type: 'number', defaultValue: 0 },
    { name: 'shippingZone', type: 'text' },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
  access: { read: () => true },
}
