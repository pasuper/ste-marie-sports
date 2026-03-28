import type { CollectionConfig } from 'payload'

export const Transactions: CollectionConfig = {
  slug: 'transactions',
  admin: { group: 'Commerce' },
  fields: [
    { name: 'transactionId', type: 'text', unique: true },
    { name: 'order', type: 'relationship', relationTo: 'orders' },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Payment', value: 'payment' },
        { label: 'Refund', value: 'refund' },
        { label: 'Authorization', value: 'authorization' },
        { label: 'Capture', value: 'capture' },
        { label: 'Void', value: 'void' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Completed', value: 'completed' },
        { label: 'Failed', value: 'failed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    { name: 'amount', type: 'number', required: true },
    { name: 'currency', type: 'text', defaultValue: 'CAD' },
    {
      name: 'provider',
      type: 'select',
      options: [
        { label: 'Stripe', value: 'stripe' },
        { label: 'PayPal', value: 'paypal' },
        { label: 'Cash', value: 'cash' },
        { label: 'Other', value: 'other' },
      ],
    },
    { name: 'providerTransactionId', type: 'text' },
    { name: 'metadata', type: 'json' },
  ],
}
