import type { CollectionConfig } from 'payload'

export const RentalBookings: CollectionConfig = {
  slug: 'rental-bookings',
  admin: { group: 'Location', useAsTitle: 'bookingNumber', defaultColumns: ['bookingNumber', 'customerName', 'status', 'startDate'] },
  fields: [
    { name: 'bookingNumber', type: 'text', required: true, unique: true },
    { name: 'rentalVehicle', type: 'relationship', relationTo: 'rental-vehicles', required: true },
    {
      name: 'rentalType',
      type: 'select',
      required: true,
      options: [
        { label: '4 heures', value: '4h' },
        { label: '1 jour', value: '1day' },
        { label: 'Fin de semaine', value: 'weekend' },
      ],
    },
    { name: 'startDate', type: 'date', required: true },
    { name: 'endDate', type: 'date', required: true },
    { name: 'customerName', type: 'text', required: true },
    { name: 'customerPhone', type: 'text', required: true },
    { name: 'customerEmail', type: 'email', required: true },
    { name: 'driverLicenseNumber', type: 'text', required: true },
    { name: 'depositAmount', type: 'number', defaultValue: 10000 },
    { name: 'stripePaymentIntentId', type: 'text' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'En attente', value: 'pending' },
        { label: 'Confirmée', value: 'confirmed' },
        { label: 'Complétée', value: 'completed' },
        { label: 'Annulée', value: 'cancelled' },
      ],
    },
    {
      name: 'paymentStatus',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'En attente', value: 'pending' },
        { label: 'Payé', value: 'paid' },
        { label: 'Échoué', value: 'failed' },
        { label: 'Remboursé', value: 'refunded' },
      ],
    },
    { name: 'notes', type: 'textarea' },
  ],
  access: { read: () => true, create: () => true },
}
