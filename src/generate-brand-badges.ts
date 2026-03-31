/**
 * Generate SVG badge images for brands without logos.
 * Creates /media/brand-{slug}.png (as SVG) for every brand in DB.
 * Run with: npx tsx src/generate-brand-badges.ts
 */

import { MongoClient } from 'mongodb'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const MEDIA_DIR = path.resolve(__dirname, '..', 'public', 'media')

function makeSvgBadge(name: string): string {
  // Truncate long names
  const display = name.length > 16 ? name.substring(0, 14) + '…' : name
  const fontSize = display.length > 12 ? 14 : display.length > 8 ? 16 : 18

  return `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="80" viewBox="0 0 200 80">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="200" height="80" rx="8" fill="url(#bg)"/>
  <text x="100" y="${40 + fontSize / 3}"
    font-family="'Arial', 'Helvetica', sans-serif"
    font-size="${fontSize}"
    font-weight="700"
    fill="white"
    text-anchor="middle"
    letter-spacing="1"
    text-transform="uppercase">${display.toUpperCase()}</text>
</svg>`
}

async function main() {
  const client = new MongoClient('mongodb://localhost:27017')
  await client.connect()
  const db = client.db('stemarie')

  const brands = await db.collection('brands').find({}).toArray()
  console.log(`Found ${brands.length} brands`)

  let created = 0
  let skipped = 0

  for (const brand of brands) {
    const slug = brand.slug as string
    const name = typeof brand.name === 'object' ? (brand.name?.fr || brand.name?.en || slug) : (brand.name || slug)
    const destSvg = path.join(MEDIA_DIR, `brand-${slug}.svg`)
    const destPng = path.join(MEDIA_DIR, `brand-${slug}.png`)

    // Skip if a real PNG logo already exists (>5KB = likely real image, not favicon ICO)
    if (fs.existsSync(destPng)) {
      const size = fs.statSync(destPng).size
      // Check it's not an HTML file
      const head = fs.readFileSync(destPng, { encoding: 'utf8', flag: 'r' }).substring(0, 20)
      if (size > 5000 && !head.includes('<') && !head.includes('html')) {
        skipped++
        continue
      }
      // Remove bad file
      fs.unlinkSync(destPng)
    }

    // Write SVG badge
    const svg = makeSvgBadge(name)
    fs.writeFileSync(destSvg, svg, 'utf8')

    // Update media doc and brand
    await db.collection('media').deleteOne({ filename: `brand-${slug}.svg` })
    await db.collection('media').deleteOne({ filename: `brand-${slug}.png` })

    const mediaDoc = await db.collection('media').insertOne({
      filename: `brand-${slug}.svg`,
      mimeType: 'image/svg+xml',
      filesize: svg.length,
      url: `/media/brand-${slug}.svg`,
      alt: name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    await db.collection('brands').updateOne({ _id: brand._id }, {
      $set: { logo: mediaDoc.insertedId }
    })
    created++
  }

  console.log(`Done! Created: ${created} SVG badges, Skipped: ${skipped} (had real logos)`)
  await client.close()
}

main().catch(console.error)
