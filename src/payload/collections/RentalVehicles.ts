import type { CollectionConfig } from 'payload'

export const RentalVehicles: CollectionConfig = {
  slug: 'rental-vehicles',
  admin: { group: 'Location', useAsTitle: 'title', defaultColumns: ['title', 'vehicleType', 'isActive'] },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'description', type: 'textarea', localized: true },
    {
      name: 'vehicleType',
      type: 'select',
      options: [
        { label: 'Spyder', value: 'spyder' },
        { label: 'Ryker', value: 'ryker' },
      ],
    },
    { name: 'thumbnail', type: 'upload', relationTo: 'media' },
    {
      name: 'images',
      type: 'array',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media' }],
    },
    {
      name: 'pricing',
      type: 'group',
      fields: [
        { name: 'fourHours', type: 'number', label: 'Prix 4 heures ($)' },
        { name: 'fourHoursMaxKm', type: 'number', label: 'Km max (4h)' },
        { name: 'oneDay', type: 'number', label: 'Prix 1 jour ($)' },
        { name: 'oneDayMaxKm', type: 'number', label: 'Km max (1 jour)' },
        { name: 'weekend', type: 'number', label: 'Prix fin de semaine ($)' },
        { name: 'weekendMaxKm', type: 'number', label: 'Km max (weekend)' },
      ],
    },
    {
      name: 'blockedDates',
      type: 'array',
      fields: [{ name: 'date', type: 'date', required: true }],
    },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
  access: { read: () => true },
}
