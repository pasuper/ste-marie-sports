import type { CollectionConfig } from 'payload'

export const OrderItems: CollectionConfig = {
  slug: 'order-items',
  admin: { group: 'Commerce' },
  fields: [
    { name: 'order', type: 'relationship', relationTo: 'orders' },
    { name: 'product', type: 'relationship', relationTo: 'products' },
    { name: 'productName', type: 'text', required: true },
    { name: 'sku', type: 'text' },
    { name: 'quantity', type: 'number', required: true, min: 1 },
    { name: 'price', type: 'number', required: true },
    { name: 'total', type: 'number', required: true },
    { name: 'variationType', type: 'text' },
    { name: 'variationValue', type: 'text' },
  ],
}
