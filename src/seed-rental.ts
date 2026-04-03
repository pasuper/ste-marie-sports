/**
 * Seeds rental vehicles and updates menus.
 * Run: npx tsx src/seed-rental.ts
 */
import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/stemarie'

async function seed() {
  const client = new MongoClient(MONGODB_URI)
  await client.connect()
  const db = client.db()

  // 1. Seed rental vehicles
  const existing = await db.collection('rental-vehicles').countDocuments()
  if (existing === 0) {
    await db.collection('rental-vehicles').insertMany([
      {
        title: { fr: 'Can-Am Spyder F3-S', en: 'Can-Am Spyder F3-S' },
        slug: 'can-am-spyder-f3-s',
        description: { fr: 'Le Spyder F3-S offre une expérience de conduite sportive à trois roues avec un moteur Rotax 1330 ACE de 115 ch. Parfait pour les passionnés de route.', en: 'The Spyder F3-S offers a sporty three-wheel riding experience with a 115 hp Rotax 1330 ACE engine. Perfect for road enthusiasts.' },
        vehicleType: 'spyder',
        pricing: { fourHours: 199, fourHoursMaxKm: 100, oneDay: 349, oneDayMaxKm: 250, weekend: 799, weekendMaxKm: 500 },
        blockedDates: [],
        isActive: true,
        sortOrder: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        title: { fr: 'Can-Am Spyder RT Limited', en: 'Can-Am Spyder RT Limited' },
        slug: 'can-am-spyder-rt-limited',
        description: { fr: 'Le Spyder RT Limited est le choix ultime pour le touring à trois roues. Confort premium, système audio intégré et espace de rangement généreux.', en: 'The Spyder RT Limited is the ultimate choice for three-wheel touring. Premium comfort, integrated audio system and generous storage.' },
        vehicleType: 'spyder',
        pricing: { fourHours: 249, fourHoursMaxKm: 100, oneDay: 449, oneDayMaxKm: 300, weekend: 999, weekendMaxKm: 600 },
        blockedDates: [],
        isActive: true,
        sortOrder: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        title: { fr: 'Can-Am Ryker 900 Rally', en: 'Can-Am Ryker 900 Rally' },
        slug: 'can-am-ryker-900-rally',
        description: { fr: 'Le Ryker 900 Rally est le véhicule à trois roues le plus accessible. Agile, fun et facile à conduire, idéal pour une première expérience.', en: 'The Ryker 900 Rally is the most accessible three-wheel vehicle. Agile, fun and easy to ride, ideal for a first experience.' },
        vehicleType: 'ryker',
        pricing: { fourHours: 149, fourHoursMaxKm: 80, oneDay: 249, oneDayMaxKm: 200, weekend: 599, weekendMaxKm: 400 },
        blockedDates: [],
        isActive: true,
        sortOrder: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        title: { fr: 'Can-Am Ryker 600', en: 'Can-Am Ryker 600' },
        slug: 'can-am-ryker-600',
        description: { fr: 'Le Ryker 600 est le modèle d\'entrée de gamme parfait. Léger, maniable et économique. La façon la plus accessible de découvrir le trois roues.', en: 'The Ryker 600 is the perfect entry-level model. Light, maneuverable and economical. The most accessible way to discover three-wheel riding.' },
        vehicleType: 'ryker',
        pricing: { fourHours: 119, fourHoursMaxKm: 80, oneDay: 199, oneDayMaxKm: 200, weekend: 499, weekendMaxKm: 400 },
        blockedDates: [],
        isActive: true,
        sortOrder: 4,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ])
    console.log('Created 4 rental vehicles')
  } else {
    console.log(`Rental vehicles already exist (${existing}), skipping`)
  }

  // 2. Update main navigation: remove Marques, add Location
  const mainNav = await db.collection('menus').findOne({ slug: 'main-navigation' })
  if (mainNav) {
    const items = mainNav.items?.fr || mainNav.items || []
    // Remove Marques item
    const filtered = items.filter((item: any) => !item.url?.includes('/marques'))
    // Add Location if not already there
    const hasLocation = filtered.some((item: any) => item.url?.includes('/location'))
    if (!hasLocation) {
      filtered.push({
        label: 'Location',
        type: 'internal',
        url: '/location',
        hasMegaMenu: false,
        openInNewTab: false,
        highlight: false,
        showBrands: false,
      })
    }
    if (mainNav.items?.fr) {
      await db.collection('menus').updateOne({ _id: mainNav._id }, { $set: { 'items.fr': filtered } })
    } else {
      await db.collection('menus').updateOne({ _id: mainNav._id }, { $set: { items: filtered } })
    }
    console.log('Updated main-navigation: removed Marques, added Location')
  }

  // 3. Add Location to footer-left (Service Client)
  const footerLeft = await db.collection('menus').findOne({ slug: 'footer-left' })
  if (footerLeft) {
    const items = footerLeft.items?.fr || footerLeft.items || []
    const hasLocation = items.some((item: any) => item.url?.includes('/location'))
    if (!hasLocation) {
      items.push({
        label: 'Location de véhicules',
        type: 'internal',
        url: '/location',
        openInNewTab: false,
        highlight: false,
      })
      if (footerLeft.items?.fr) {
        await db.collection('menus').updateOne({ _id: footerLeft._id }, { $set: { 'items.fr': items } })
      } else {
        await db.collection('menus').updateOne({ _id: footerLeft._id }, { $set: { items } })
      }
      console.log('Added Location to footer-left')
    }
  }

  console.log('\nRental seed complete!')
  await client.close()
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
