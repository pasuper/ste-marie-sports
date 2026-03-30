/**
 * Scrape vehicle images from dealer website and attach to Payload vehicles.
 * Run with: npx tsx src/scrape-vehicle-images.ts
 *
 * For each vehicle with a sourceUrl but no thumbnail:
 * 1. Fetch the dealer page HTML
 * 2. Extract og:image or first large image URL
 * 3. Download the image to backend/media/
 * 4. Create a media doc in MongoDB
 * 5. Update the vehicle with the thumbnail reference
 */

import { MongoClient, ObjectId } from 'mongodb'
import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const MEDIA_DIR = path.resolve(__dirname, '..', 'public', 'media')
const DELAY_MS = 300

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function fetchUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http
    const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject)
      }
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => resolve(data))
    })
    req.on('error', reject)
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('timeout')) })
  })
}

function downloadFile(url: string, dest: string): Promise<boolean> {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http
    const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve)
      }
      if (res.statusCode !== 200) { resolve(false); return }
      const file = fs.createWriteStream(dest)
      res.pipe(file)
      file.on('finish', () => { file.close(); resolve(true) })
      file.on('error', () => resolve(false))
    })
    req.on('error', () => resolve(false))
    req.setTimeout(15000, () => { req.destroy(); resolve(false) })
  })
}

function extractImageUrl(html: string): string | null {
  // Try og:image first
  const ogMatch = html.match(/<meta\s+(?:property|name)="og:image"\s+content="([^"]+)"/i)
    || html.match(/content="([^"]+)"\s+(?:property|name)="og:image"/i)
  if (ogMatch) return ogMatch[1]

  // Try large image from cdn-convertus (dealer CDN)
  const cdnMatch = html.match(/https?:\/\/[^"'\s]*cdn-convertus[^"'\s]*/i)
  if (cdnMatch) return cdnMatch[0]

  // Try first large img src
  const imgMatches = html.matchAll(/<img[^>]+src="(https?:\/\/[^"]+\.(jpg|jpeg|png|webp))"/gi)
  for (const m of imgMatches) {
    const src = m[1]
    if (src.includes('logo') || src.includes('icon') || src.includes('favicon') || src.includes('pixel')) continue
    return src
  }

  return null
}

async function main() {
  const client = new MongoClient('mongodb://localhost:27017')
  await client.connect()
  const db = client.db('stemarie')

  // Find vehicles without thumbnails that have sourceUrl
  const vehicles = await db.collection('vehicles').find({
    $or: [{ thumbnail: null }, { thumbnail: { $exists: false } }],
    sourceUrl: { $exists: true, $ne: '' },
  }).toArray()

  console.log(`Found ${vehicles.length} vehicles without images`)

  let scraped = 0
  let failed = 0
  let skippedExisting = 0

  for (let i = 0; i < vehicles.length; i++) {
    const v = vehicles[i]
    const stockNum = v.stockNumber || ''
    const title = typeof v.title === 'string' ? v.title : v.title?.fr || ''

    // Check if image already exists in backend/media by stock number
    const existingFile = [
      `${stockNum}.jpg`, `${stockNum}.jpeg`, `${stockNum}.png`, `${stockNum}.webp`,
    ].find(f => fs.existsSync(path.join(MEDIA_DIR, f)))

    if (existingFile) {
      // Create media doc and link
      const mediaDoc = await db.collection('media').insertOne({
        _id: new ObjectId(),
        filename: existingFile,
        mimeType: 'image/jpeg',
        url: `/media/${existingFile}`,
        alt: title,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      await db.collection('vehicles').updateOne({ _id: v._id }, { $set: { thumbnail: mediaDoc.insertedId } })
      skippedExisting++
      continue
    }

    // Scrape from dealer website
    const url = v.sourceUrl
    if (!url || !url.startsWith('http')) { failed++; continue }

    try {
      const html = await fetchUrl(url)
      const imageUrl = extractImageUrl(html)

      if (!imageUrl) {
        failed++
        if (i < 5) console.log(`  No image found: ${title.substring(0, 50)}`)
        await sleep(DELAY_MS)
        continue
      }

      // Download image
      const ext = imageUrl.match(/\.(jpg|jpeg|png|webp)/i)?.[1] || 'jpg'
      const filename = `vehicle-${stockNum || v._id}.${ext}`
      const destPath = path.join(MEDIA_DIR, filename)

      const ok = await downloadFile(imageUrl, destPath)
      if (!ok || !fs.existsSync(destPath) || fs.statSync(destPath).size < 1000) {
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath)
        failed++
        await sleep(DELAY_MS)
        continue
      }

      // Create media doc
      const mediaDoc = await db.collection('media').insertOne({
        _id: new ObjectId(),
        filename,
        mimeType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
        filesize: fs.statSync(destPath).size,
        url: `/media/${filename}`,
        alt: title,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      // Update vehicle
      await db.collection('vehicles').updateOne({ _id: v._id }, { $set: { thumbnail: mediaDoc.insertedId } })
      scraped++

      if ((scraped + skippedExisting) % 25 === 0) {
        console.log(`  Progress: ${scraped} scraped, ${skippedExisting} existing, ${failed} failed / ${vehicles.length}`)
      }
    } catch (err: any) {
      failed++
      if (i < 5) console.log(`  Error: ${title.substring(0, 40)} — ${err.message?.substring(0, 60)}`)
    }

    await sleep(DELAY_MS)
  }

  console.log(`\nDone! Scraped: ${scraped}, Existing: ${skippedExisting}, Failed: ${failed} / ${vehicles.length}`)

  // Final count
  const withThumb = await db.collection('vehicles').countDocuments({ thumbnail: { $exists: true, $ne: null } })
  const total = await db.collection('vehicles').countDocuments()
  console.log(`Vehicles with images: ${withThumb} / ${total}`)

  await client.close()
}

main().catch(err => {
  console.error('Scraper error:', err)
  process.exit(1)
})
