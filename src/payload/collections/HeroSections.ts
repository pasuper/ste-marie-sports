import type { CollectionConfig } from 'payload'

export const HeroSections: CollectionConfig = {
  slug: 'hero-sections',
  admin: { group: 'Content', useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'location',
      type: 'select',
      options: [
        { label: 'Homepage', value: 'homepage' },
        { label: 'Category', value: 'category' },
        { label: 'Promotion', value: 'promotion' },
        { label: 'Seasonal', value: 'seasonal' },
      ],
    },
    { name: 'pageSlug', type: 'text' },
    {
      name: 'slides',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', localized: true },
        { name: 'subtitle', type: 'text', localized: true },
        { name: 'buttonText', type: 'text', localized: true },
        { name: 'buttonLink', type: 'text' },
        { name: 'backgroundImage', type: 'upload', relationTo: 'media', required: true },
        { name: 'overlayOpacity', type: 'number', min: 0, max: 100, defaultValue: 30 },
        {
          name: 'textAlignment',
          type: 'select',
          defaultValue: 'left',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ],
        },
      ],
    },
    { name: 'autoPlay', type: 'checkbox', defaultValue: true },
    { name: 'autoPlayDelay', type: 'number', defaultValue: 5000 },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
    { name: 'startDate', type: 'date' },
    { name: 'endDate', type: 'date' },
  ],
  access: { read: () => true },
}
