import type { GlobalConfig } from 'payload'

export const StoreInformation: GlobalConfig = {
  slug: 'store-information',
  admin: { group: 'Settings' },
  fields: [
    { name: 'storeName', type: 'text', required: true, defaultValue: 'Ste-Marie Sports', localized: true },
    { name: 'legalName', type: 'text' },
    {
      name: 'contact',
      type: 'group',
      fields: [
        { name: 'email', type: 'email' },
        { name: 'phone', type: 'text' },
        { name: 'tollFree', type: 'text' },
        { name: 'fax', type: 'text' },
      ],
    },
    {
      name: 'address',
      type: 'group',
      fields: [
        { name: 'street', type: 'text' },
        { name: 'city', type: 'text' },
        { name: 'province', type: 'text' },
        { name: 'postalCode', type: 'text' },
        { name: 'country', type: 'text', defaultValue: 'Canada' },
      ],
    },
    {
      name: 'hours',
      type: 'array',
      fields: [
        {
          name: 'day',
          type: 'select',
          options: [
            { label: 'Monday', value: 'monday' },
            { label: 'Tuesday', value: 'tuesday' },
            { label: 'Wednesday', value: 'wednesday' },
            { label: 'Thursday', value: 'thursday' },
            { label: 'Friday', value: 'friday' },
            { label: 'Saturday', value: 'saturday' },
            { label: 'Sunday', value: 'sunday' },
          ],
        },
        { name: 'open', type: 'text' },
        { name: 'close', type: 'text' },
        { name: 'isClosed', type: 'checkbox', defaultValue: false },
      ],
    },
    {
      name: 'currency',
      type: 'group',
      fields: [
        { name: 'code', type: 'text', defaultValue: 'CAD' },
        { name: 'symbol', type: 'text', defaultValue: '$' },
      ],
    },
    {
      name: 'tax',
      type: 'group',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: true },
        { name: 'includedInPrices', type: 'checkbox', defaultValue: false },
        { name: 'defaultProvince', type: 'relationship', relationTo: 'provinces' },
        { name: 'gstNumber', type: 'text' },
        { name: 'qstNumber', type: 'text' },
      ],
    },
    {
      name: 'shipping',
      type: 'group',
      fields: [
        { name: 'freeShippingThreshold', type: 'number' },
        { name: 'defaultShippingRate', type: 'number', defaultValue: 14.99 },
        { name: 'handlingTime', type: 'text', defaultValue: '1-3 business days', localized: true },
      ],
    },
    {
      name: 'policies',
      type: 'group',
      fields: [
        { name: 'shippingPolicy', type: 'richText', localized: true },
        { name: 'returnPolicy', type: 'richText', localized: true },
        { name: 'privacyPolicy', type: 'richText', localized: true },
        { name: 'termsOfService', type: 'richText', localized: true },
      ],
    },
  ],
}
