/**
 * Download brand logos from Clearbit Logo API and save as brand-{slug}.png
 * Run with: npx tsx src/download-brand-logos.ts
 *
 * Uses Clearbit's free logo API: https://logo.clearbit.com/{domain}
 */

import { MongoClient } from 'mongodb'
import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const MEDIA_DIR = path.resolve(__dirname, '..', 'public', 'media')

// Known domain mappings for each brand slug
const BRAND_DOMAINS: Record<string, string> = {
  'alpinestars': 'alpinestars.com',
  'dainese': 'dainese.com',
  'shoei': 'shoei-helmets.com',
  'arai': 'araiamericas.com',
  'revit': 'revitsport.com',
  'agv': 'agv.com',
  'bell': 'bellhelmets.com',
  'hjc': 'hjchelmets.com',
  'fox-racing': 'foxracing.com',
  'thor': 'thormx.com',
  'klim': 'klim.com',
  'fxr': 'fxrracing.com',
  'sea-doo': 'sea-doo.com',
  'ski-doo': 'ski-doo.com',
  'can-am': 'can-am.brp.com',
  'polaris': 'polaris.com',
  'yamaha': 'yamaha-motor.com',
  'honda': 'honda.com',
  'kawasaki': 'kawasaki.com',
  'suzuki': 'suzuki.com',
  'ktm': 'ktm.com',
  'husqvarna': 'husqvarna-motorcycles.com',
  'triumph': 'triumphmotorcycles.com',
  'indian': 'indianmotorcycle.com',
  'harley-davidson': 'harley-davidson.com',
  'bmw': 'bmwmotorrad.com',
  'ducati': 'ducati.com',
  'aprilia': 'aprilia.com',
  'moto-guzzi': 'motoguzzi.com',
  'royal-enfield': 'royalenfield.com',
  'cfmoto': 'cfmoto.com',
  'arctic-cat': 'arcticcat.com',
  'lynx': 'lynxsnowmobiles.com',
  'brp': 'brp.com',
  'acerbis': 'acerbis.com',
  'leatt': 'leatt.com',
  'forma': 'formaboots.com',
  'fly-racing': 'flyracing.com',
  'answer': 'answersports.com',
  'gaerne': 'gaerne.com',
  'sidi': 'sidi.com',
  'tcx': 'tcxboots.com',
  'oxtar': 'oxtarboots.com',
  'givi': 'givi.it',
  'sw-motech': 'sw-motech.com',
  'oxford': 'oxfordproducts.com',
  'street-and-steel': 'streetandsteel.com',
  'icon': 'rideicon.com',
  'scorpion': 'scorpionusa.com',
  'ls2': 'ls2helmets.com',
  'nolan': 'nolan.it',
  'caberg': 'caberg.it',
  'shark': 'shark-helmets.com',
  'abus': 'abus.com',
  'michelin': 'michelin.com',
  'pirelli': 'pirelli.com',
  'dunlop': 'dunloptires.com',
  'bridgestone': 'bridgestone.com',
  'continental': 'continental-tires.com',
  'metzeler': 'metzeler.com',
  'ngk': 'ngksparkplugs.com',
  'motul': 'motul.com',
  'castrol': 'castrol.com',
  'amsoil': 'amsoil.com',
  'bel-ray': 'belray.com',
  'maxima': 'maximausa.com',
  'yuasa': 'yuasabatteries.com',
  'antigravity': 'antigravitybatteries.com',
  'trail-tech': 'trailtech.net',
  'dynojet': 'dynojet.com',
  'power-commander': 'dynojet.com',
  'cobra': 'cobrausa.com',
  'vance-hines': 'vanceandhines.com',
  'akrapovic': 'akrapovic.com',
  'yoshimura': 'yoshimura-rd.com',
  'two-brothers': 'twobros.com',
  'wiseco': 'wiseco.com',
  'vertex': 'vertexpistons.com',
  'hot-rods': 'hotrodsproducts.com',
  'kibblewhite': 'kibblewhiteprecision.com',
  'cometic': 'cometic.com',
  'athena': 'athena-it.com',
  'boyesen': 'boyesen.com',
  'moose-racing': 'mooseracing.com',
  'polisport': 'polisport.com',
  'cycra': 'cycra.com',
  'devol': 'devol.com',
  'scar': 'scarracing.com',
  'pivot-works': 'pivotworks.com',
  'all-balls': 'allballsracing.com',
  'james': 'jamesgaskets.com',
  'niche': 'nichewheels.com',
}

function downloadFile(url: string, dest: string): Promise<boolean> {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'image/*',
      }
    }, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve)
      }
      if (!res.statusCode || res.statusCode !== 200) { resolve(false); return }
      const contentType = res.headers['content-type'] || ''
      if (!contentType.includes('image')) { resolve(false); return }

      const file = fs.createWriteStream(dest)
      res.pipe(file)
      file.on('finish', () => { file.close(); resolve(true) })
      file.on('error', () => resolve(false))
    })
    req.on('error', () => resolve(false))
    req.setTimeout(10000, () => { req.destroy(); resolve(false) })
  })
}

async function main() {
  const client = new MongoClient('mongodb://localhost:27017')
  await client.connect()
  const db = client.db('stemarie')

  const brands = await db.collection('brands').find({}).toArray()
  console.log(`Found ${brands.length} brands`)

  let downloaded = 0
  let skipped = 0
  let failed = 0

  for (const brand of brands) {
    const slug = brand.slug as string
    const destPath = path.join(MEDIA_DIR, `brand-${slug}.png`)

    // Skip if already downloaded
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 500) {
      skipped++
      continue
    }

    const domain = BRAND_DOMAINS[slug]
    if (!domain) {
      // Try Clearbit with slug-based guessing
      const guessedDomain = `${slug.replace(/-/g, '')}.com`
      const url = `https://logo.clearbit.com/${guessedDomain}?size=200`
      const ok = await downloadFile(url, destPath)
      if (ok && fs.existsSync(destPath) && fs.statSync(destPath).size > 500) {
        downloaded++
        // Create/update media doc and link to brand
        const mediaDoc = await db.collection('media').insertOne({
          filename: `brand-${slug}.png`,
          mimeType: 'image/png',
          filesize: fs.statSync(destPath).size,
          url: `/media/brand-${slug}.png`,
          alt: brand.name?.fr || brand.name || slug,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        await db.collection('brands').updateOne({ _id: brand._id }, {
          $set: { logo: mediaDoc.insertedId }
        })
      } else {
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath)
        failed++
      }
      continue
    }

    const url = `https://logo.clearbit.com/${domain}?size=200`
    const ok = await downloadFile(url, destPath)

    if (ok && fs.existsSync(destPath) && fs.statSync(destPath).size > 500) {
      downloaded++
      const mediaDoc = await db.collection('media').insertOne({
        filename: `brand-${slug}.png`,
        mimeType: 'image/png',
        filesize: fs.statSync(destPath).size,
        url: `/media/brand-${slug}.png`,
        alt: brand.name?.fr || brand.name || slug,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      await db.collection('brands').updateOne({ _id: brand._id }, {
        $set: { logo: mediaDoc.insertedId }
      })
      console.log(`  ✓ ${slug}`)
    } else {
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath)
      failed++
    }

    // Small delay to be polite to Clearbit
    await new Promise(r => setTimeout(r, 200))
  }

  console.log(`\nDone! Downloaded: ${downloaded}, Skipped: ${skipped}, Failed: ${failed}`)
  await client.close()
}

main().catch(err => {
  console.error('Error:', err)
  process.exit(1)
})
