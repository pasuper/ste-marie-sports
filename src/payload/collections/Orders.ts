import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: { group: 'Commerce', useAsTitle: 'orderNumber' },
  fields: [
    { name: 'orderNumber', type: 'text', required: true, unique: true },
    { name: 'customer', type: 'relationship', relationTo: 'users' },
    { name: 'email', type: 'email', required: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Refunded', value: 'refunded' },
      ],
    },
    {
      name: 'paymentStatus',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Failed', value: 'failed' },
        { label: 'Refunded', value: 'refunded' },
      ],
    },
    { name: 'stripePaymentIntentId', type: 'text' },
    { name: 'subtotal', type: 'number', required: true },
    { name: 'taxAmount', type: 'number', required: true },
    { name: 'shippingAmount', type: 'number', required: true },
    { name: 'discountAmount', type: 'number', defaultValue: 0 },
    { name: 'total', type: 'number', required: true },
    { name: 'items', type: 'relationship', relationTo: 'order-items', hasMany: true },
    {
      name: 'shippingAddress',
      type: 'group',
      fields: [
        { name: 'firstName', type: 'text' },
        { name: 'lastName', type: 'text' },
        { name: 'address1', type: 'text' },
        { name: 'address2', type: 'text' },
        { name: 'city', type: 'text' },
        { name: 'province', type: 'text' },
        { name: 'postalCode', type: 'text' },
        { name: 'country', type: 'text', defaultValue: 'CA' },
      ],
    },
    {
      name: 'billingAddress',
      type: 'group',
      fields: [
        { name: 'firstName', type: 'text' },
        { name: 'lastName', type: 'text' },
        { name: 'address1', type: 'text' },
        { name: 'address2', type: 'text' },
        { name: 'city', type: 'text' },
        { name: 'province', type: 'text' },
        { name: 'postalCode', type: 'text' },
        { name: 'country', type: 'text', defaultValue: 'CA' },
      ],
    },
    { name: 'shippingMethod', type: 'text' },
    { name: 'trackingNumber', type: 'text' },
    { name: 'notes', type: 'textarea' },
  ],
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin') return true
      return { customer: { equals: req.user?.id } }
    },
  },
}
