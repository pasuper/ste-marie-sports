import type { CollectionConfig } from 'payload'

export const Vehicles: CollectionConfig = {
  slug: 'vehicles',
  admin: {
    useAsTitle: 'title',
    group: 'Inventory',
    defaultColumns: ['title', 'condition', 'vehicleType', 'year', 'price', 'isAvailable'],
  },
  fields: [
    // Basic Info
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'stockNumber', type: 'text', unique: true, index: true },

    // Classification
    {
      name: 'condition',
      type: 'select',
      required: true,
      index: true,
      options: [
        { label: 'New', value: 'new' },
        { label: 'Used', value: 'used' },
        { label: 'Demo', value: 'demo' },
        { label: 'Certified Pre-Owned', value: 'certified' },
      ],
    },
    {
      name: 'vehicleType',
      type: 'select',
      required: true,
      index: true,
      options: [
        { label: 'ATV', value: 'atv' },
        { label: 'UTV / Side-by-Side', value: 'utv' },
        { label: 'Snowmobile', value: 'snowmobile' },
        { label: 'Motorcycle', value: 'motorcycle' },
        { label: 'PWC / Watercraft', value: 'pwc' },
        { label: 'Spyder / Ryker', value: 'spyder' },
        { label: 'Marine', value: 'marine' },
        { label: 'Other', value: 'other' },
      ],
    },
    { name: 'brand', type: 'relationship', relationTo: 'brands', required: true },
    { name: 'year', type: 'number', required: true, min: 1900, max: 2100 },
    { name: 'model', type: 'text', required: true },
    { name: 'trim', type: 'text' },
    { name: 'submodel', type: 'text' },

    // Pricing
    { name: 'price', type: 'number' },
    { name: 'msrp', type: 'number' },
    { name: 'salePrice', type: 'number' },

    // Specifications
    {
      name: 'specifications',
      type: 'group',
      fields: [
        { name: 'engineType', type: 'text' },
        { name: 'engineSize', type: 'text' },
        { name: 'horsepower', type: 'number' },
        { name: 'torque', type: 'number' },
        { name: 'transmission', type: 'select', options: [
          { label: 'Automatic', value: 'automatic' },
          { label: 'Manual', value: 'manual' },
          { label: 'CVT', value: 'cvt' },
          { label: 'Semi-Automatic', value: 'semi-automatic' },
        ]},
        { name: 'driveType', type: 'select', options: [
          { label: '2WD', value: '2wd' },
          { label: '4WD', value: '4wd' },
          { label: 'AWD', value: 'awd' },
        ]},
        { name: 'fuelType', type: 'select', options: [
          { label: 'Gasoline', value: 'gasoline' },
          { label: 'Diesel', value: 'diesel' },
          { label: 'Electric', value: 'electric' },
          { label: 'Hybrid', value: 'hybrid' },
        ]},
        { name: 'fuelCapacity', type: 'number' },
        { name: 'mileage', type: 'number' },
        { name: 'mileageUnit', type: 'select', defaultValue: 'km', options: [
          { label: 'km', value: 'km' },
          { label: 'mi', value: 'mi' },
          { label: 'hrs', value: 'hrs' },
        ]},
        { name: 'hours', type: 'number' },
        { name: 'exteriorColor', type: 'text' },
        { name: 'vin', type: 'text' },
      ],
    },

    // Media
    { name: 'thumbnail', type: 'upload', relationTo: 'media' },
    {
      name: 'images',
      type: 'array',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media' }],
    },
    {
      name: 'videos',
      type: 'array',
      fields: [
        { name: 'url', type: 'text' },
        { name: 'title', type: 'text' },
      ],
    },

    // Description
    { name: 'shortDescription', type: 'textarea', localized: true },
    { name: 'sourceUrl', type: 'text', admin: { description: 'Original dealer website URL' } },
    { name: 'description', type: 'richText', localized: true },
    {
      name: 'features',
      type: 'array',
      fields: [{ name: 'feature', type: 'text', localized: true }],
    },

    // Status
    { name: 'isAvailable', type: 'checkbox', defaultValue: true, index: true },
    { name: 'isFeatured', type: 'checkbox', defaultValue: false },
    { name: 'isOnSale', type: 'checkbox', defaultValue: false },
    { name: 'soldDate', type: 'date' },
  ],
  access: { read: () => true },
}
