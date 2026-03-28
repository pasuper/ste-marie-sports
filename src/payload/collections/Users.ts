import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { group: 'Users', useAsTitle: 'email' },
  fields: [
    { name: 'firstName', type: 'text' },
    { name: 'lastName', type: 'text' },
    { name: 'phone', type: 'text' },
    {
      name: 'customerType',
      type: 'select',
      defaultValue: 'individual',
      options: [
        { label: 'Individual', value: 'individual' },
        { label: 'Business', value: 'business' },
        { label: 'Dealer', value: 'dealer' },
      ],
    },
    { name: 'companyName', type: 'text' },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'customer',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Customer', value: 'customer' },
      ],
      access: { update: ({ req }) => req.user?.role === 'admin' },
    },
    { name: 'marketingOptIn', type: 'checkbox', defaultValue: false },
  ],
}
