/**
 * Fix all data quality issues: featured items, category images, globals.
 * Run with: npx tsx src/fix-data.ts
 */
import { MongoClient, ObjectId } from 'mongodb'

async function go() {
  const client = new MongoClient('mongodb://localhost:27017')
  await client.connect()
  const db = client.db('stemarie')

  // 1. Featured products
  console.log('=== Setting featured products ===')
  await db.collection('products').updateMany({ isFeatured: true }, { $set: { isFeatured: false } })
  const topProducts = await db.collection('products').find({
    thumbnail: { $exists: true, $ne: null },
    isActive: true,
    price: { $gt: 10 },
    variantType: 'parent',
  }).sort({ price: -1 }).limit(16).toArray()
  await db.collection('products').updateMany(
    { _id: { $in: topProducts.map(p => p._id) } },
    { $set: { isFeatured: true } }
  )
  console.log('Featured products:', topProducts.length)

  // 2. Featured categories
  console.log('\n=== Setting featured categories ===')
  await db.collection('categories').updateMany({ isFeatured: true }, { $set: { isFeatured: false } })
  const rootCats = await db.collection('categories').find({
    parent: { $in: [null, undefined] },
    isActive: true,
  }).sort({ sortOrder: 1 }).toArray()

  let featCatCount = 0
  for (const cat of rootCats) {
    if (featCatCount >= 6) break
    const prodCount = await db.collection('products').countDocuments({ category: cat._id, isActive: true })
    if (prodCount > 0) {
      await db.collection('categories').updateOne({ _id: cat._id }, { $set: { isFeatured: true } })
      const name = typeof cat.name === 'string' ? cat.name : cat.name?.fr
      console.log('  +', name, '(' + prodCount + ' products)')
      featCatCount++
    }
  }

  // 3. Featured brands
  console.log('\n=== Setting featured brands ===')
  const knownBrands = ['Can-Am', 'Ski-Doo', 'Sea-Doo', 'Honda', 'Kawasaki', 'Yamaha', 'Polaris', 'BRP', 'Suzuki', 'KTM', 'Lynx', 'Indian']
  for (const name of knownBrands) {
    const brand = await db.collection('brands').findOne({
      $or: [{ name }, { 'name.fr': name }, { name: { $regex: `^${name}$`, $options: 'i' } }]
    })
    if (brand) {
      await db.collection('brands').updateOne({ _id: brand._id }, { $set: { isFeatured: true } })
    }
  }
  const featBrands = await db.collection('brands').countDocuments({ isFeatured: true })
  console.log('Featured brands:', featBrands)

  // 4. Fill category images
  console.log('\n=== Filling category images ===')
  let filled = 0
  for (let round = 0; round < 5; round++) {
    const empty = await db.collection('categories').find({ $or: [{ image: null }, { image: { $exists: false } }] }).toArray()
    if (empty.length === 0) break
    for (const cat of empty) {
      // child with image
      const child = await db.collection('categories').findOne({ parent: cat._id, image: { $exists: true, $ne: null } })
      if (child?.image) {
        await db.collection('categories').updateOne({ _id: cat._id }, { $set: { image: child.image } })
        filled++
        continue
      }
      // product in this cat
      const prod = await db.collection('products').findOne({ category: cat._id, thumbnail: { $exists: true, $ne: null } })
      if (prod?.thumbnail) {
        await db.collection('categories').updateOne({ _id: cat._id }, { $set: { image: prod.thumbnail } })
        filled++
        continue
      }
      // product in child cat
      const children = await db.collection('categories').find({ parent: cat._id }).toArray()
      for (const ch of children) {
        const p = await db.collection('products').findOne({ category: ch._id, thumbnail: { $exists: true, $ne: null } })
        if (p?.thumbnail) {
          await db.collection('categories').updateOne({ _id: cat._id }, { $set: { image: p.thumbnail } })
          filled++
          break
        }
      }
    }
  }
  console.log('Images filled:', filled)

  // 5. Update globals
  console.log('\n=== Updating globals ===')
  await db.collection('globals').updateOne(
    { globalType: 'site-identity' },
    { $set: {
      socialLinks: {
        facebook: 'https://www.facebook.com/stemariesport',
        instagram: 'https://www.instagram.com/stemariesport',
        youtube: 'https://www.youtube.com/@stemariesport',
      },
    }}
  )

  await db.collection('globals').updateOne(
    { globalType: 'store-information' },
    { $set: {
      storeName: { fr: 'Claude Ste-Marie Sport', en: 'Claude Ste-Marie Sport' },
      storeDescription: {
        fr: 'Votre destination pour les véhicules récréatifs, pièces et accessoires depuis 2003.',
        en: 'Your destination for recreational vehicles, parts and accessories since 2003.',
      },
      phone: '(450) 656-7803',
      email: 'info@stemariesport.com',
      address: {
        street: '5000 boul. Cousineau',
        city: 'Saint-Hubert',
        province: 'QC',
        postalCode: 'J3Y 3X3',
        country: 'Canada',
      },
      businessHours: [
        { day: { fr: 'Lundi', en: 'Monday' }, open: '9:00', close: '18:00' },
        { day: { fr: 'Mardi', en: 'Tuesday' }, open: '9:00', close: '18:00' },
        { day: { fr: 'Mercredi', en: 'Wednesday' }, open: '9:00', close: '18:00' },
        { day: { fr: 'Jeudi', en: 'Thursday' }, open: '9:00', close: '21:00' },
        { day: { fr: 'Vendredi', en: 'Friday' }, open: '9:00', close: '21:00' },
        { day: { fr: 'Samedi', en: 'Saturday' }, open: '9:00', close: '17:00' },
        { day: { fr: 'Dimanche', en: 'Sunday' }, isClosed: true },
      ],
    }}
  )
  console.log('Globals updated')

  // Final audit
  console.log('\n=== FINAL AUDIT ===')
  const s = {
    products: await db.collection('products').countDocuments(),
    featuredProducts: await db.collection('products').countDocuments({ isFeatured: true }),
    categories: await db.collection('categories').countDocuments(),
    featuredCategories: await db.collection('categories').countDocuments({ isFeatured: true }),
    catsWithImage: await db.collection('categories').countDocuments({ image: { $exists: true, $ne: null } }),
    brands: await db.collection('brands').countDocuments(),
    featuredBrands: await db.collection('brands').countDocuments({ isFeatured: true }),
    brandsWithLogo: await db.collection('brands').countDocuments({ logo: { $exists: true, $ne: null } }),
    vehicles: await db.collection('vehicles').countDocuments(),
    media: await db.collection('media').countDocuments(),
    menus: await db.collection('menus').countDocuments(),
    pages: await db.collection('pages').countDocuments(),
    heroSections: await db.collection('hero-sections').countDocuments(),
  }
  console.log(JSON.stringify(s, null, 2))

  await client.close()
  console.log('\nDone!')
}

go().catch(console.error)
