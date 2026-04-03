import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

import { Users } from './src/payload/collections/Users'
import { Media } from './src/payload/collections/Media'
import { Products } from './src/payload/collections/Products'
import { Categories } from './src/payload/collections/Categories'
import { Brands } from './src/payload/collections/Brands'
import { YMMTs } from './src/payload/collections/YMMTs'
import { Vehicles } from './src/payload/collections/Vehicles'
import { Orders } from './src/payload/collections/Orders'
import { OrderItems } from './src/payload/collections/OrderItems'
import { Transactions } from './src/payload/collections/Transactions'
import { Addresses } from './src/payload/collections/Addresses'
import { Provinces } from './src/payload/collections/Provinces'
import { Pages } from './src/payload/collections/Pages'
import { Menus } from './src/payload/collections/Menus'
import { HeroSections } from './src/payload/collections/HeroSections'
import { FormSubmissions } from './src/payload/collections/FormSubmissions'
import { RentalVehicles } from './src/payload/collections/RentalVehicles'
import { RentalBookings } from './src/payload/collections/RentalBookings'
import { SiteIdentity } from './src/payload/globals/SiteIdentity'
import { StoreInformation } from './src/payload/globals/StoreInformation'
import { CheckoutSettings } from './src/payload/globals/CheckoutSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- Ste-Marie Sports Admin',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  editor: lexicalEditor(),
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/stemarie',
  }),
  collections: [
    Users,
    Media,
    Products,
    Categories,
    Brands,
    YMMTs,
    Vehicles,
    Orders,
    OrderItems,
    Transactions,
    Addresses,
    Provinces,
    Pages,
    Menus,
    HeroSections,
    FormSubmissions,
    RentalVehicles,
    RentalBookings,
  ],
  globals: [
    SiteIdentity,
    StoreInformation,
    CheckoutSettings,
  ],
  localization: {
    locales: [
      { label: 'Fran\u00e7ais', code: 'fr' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'fr',
    fallback: true,
  },
  typescript: {
    outputFile: path.resolve(dirname, 'src/payload-types.ts'),
  },
  secret: process.env.PAYLOAD_SECRET || 'stemarie-secret',
  sharp: undefined,
  cors: ['http://localhost:3000'],
  upload: {
    limits: {
      fileSize: 10000000,
    },
  },
})
