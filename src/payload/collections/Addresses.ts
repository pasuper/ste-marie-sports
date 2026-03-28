import type { CollectionConfig } from 'payload'

export const Addresses: CollectionConfig = {
  slug: 'addresses',
  admin: { group: 'Users' },
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'users', required: true },
    { name: 'firstName', type: 'text', required: true },
    { name: 'lastName', type: 'text', required: true },
    { name: 'company', type: 'text' },
    { name: 'address1', type: 'text', required: true },
    { name: 'address2', type: 'text' },
    { name: 'city', type: 'text', required: true },
    { name: 'province', type: 'relationship', relationTo: 'provinces' },
    { name: 'postalCode', type: 'text', required: true },
    { name: 'country', type: 'text', defaultValue: 'CA' },
    { name: 'phone', type: 'text' },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Billing', value: 'billing' },
        { label: 'Shipping', value: 'shipping' },
        { label: 'Both', value: 'both' },
      ],
      defaultValue: 'both',
    },
    { name: 'isDefault', type: 'checkbox', defaultValue: false },
  ],
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin') return true
      return { user: { equals: req.user?.id } }
    },
  },
}
