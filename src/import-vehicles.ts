/**
 * Import vehicles from CSV files into Payload CMS.
 * Run with: npx tsx src/import-vehicles.ts
 *
 * Reads from:
 *   ../Data collection/vehicules_neufs_stemariesport.csv
 *   ../Data collection/vehicules_occasion_stemariesport.csv
 */

import { getPayload } from 'payload'
import config from '../payload.config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100)
}

function parsePrice(priceStr: string): number | null {
  if (!priceStr) return null
  const cleaned = priceStr.replace(/[$,\s]/g, '')
  const num = parseFloat(cleaned)
  return isNaN(num) ? null : num
}

function guessVehicleType(title: string, brand: string, model: string): string {
  const text = `${title} ${brand} ${model}`.toLowerCase()

  if (text.includes('motoneige') || text.includes('snowmobile') || text.includes('ski-doo') || text.includes('lynx')) return 'snowmobile'
  if (text.includes('motomarine') || text.includes('sea-doo') || text.includes('pwc') || text.includes('watercraft') || text.includes('jet ski')) return 'pwc'
  if (text.includes('spyder') || text.includes('ryker')) return 'spyder'
  if (text.includes('côte à côte') || text.includes('cote a cote') || text.includes('side by side') || text.includes('maverick') || text.includes('defender') || text.includes('commander') || text.includes('ranger') || text.includes('general') || text.includes('rzr')) return 'utv'
  if (text.includes('vtt') || text.includes('atv') || text.includes('outlander') || text.includes('renegade') || text.includes('sportsman') || text.includes('scrambler')) return 'atv'
  if (text.includes('moto') || text.includes('motorcycle') || text.includes('ninja') || text.includes('versys') || text.includes('vulcan') || text.includes('rebel') || text.includes('cbr') || text.includes('crf') || text.includes('ktm') || text.includes('husqvarna')) return 'motorcycle'
  if (text.includes('ponton') || text.includes('bateau') || text.includes('boat') || text.includes('marine') || text.includes('élevateur') || text.includes('elevateur') || text.includes('honda') && text.includes('hors-bord')) return 'marine'

  return 'other'
}

function parseCSV(content: string): Record<string, string>[] {
  const lines = content.split('\n').filter(l => l.trim())
  if (lines.length < 2) return []

  // Handle BOM
  const headerLine = lines[0].replace(/^\uFEFF/, '')

  // Simple CSV parsing (handles quoted fields with commas)
  const parseLine = (line: string): string[] => {
    const fields: string[] = []
    let current = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const c = line[i]
      if (c === '"') {
        inQuotes = !inQuotes
      } else if (c === ',' && !inQuotes) {
        fields.push(current.trim())
        current = ''
      } else {
        current += c
      }
    }
    fields.push(current.trim())
    return fields
  }

  const headers = parseLine(headerLine)
  const rows: Record<string, string>[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i])
    const row: Record<string, string> = {}
    headers.forEach((h, idx) => { row[h] = values[idx] || '' })
    rows.push(row)
  }
  return rows
}

async function main() {
  const payload = await getPayload({ config })

  // Load brand cache
  const brandsResult = await payload.find({ collection: 'brands', limit: 500 })
  const brandsByName: Record<string, string> = {}
  for (const b of brandsResult.docs) {
    brandsByName[(b as any).name.toLowerCase()] = (b as any).id
  }
  console.log(`Loaded ${Object.keys(brandsByName).length} brands from DB`)

  // Track created brands
  const createOrGetBrand = async (brandName: string): Promise<string> => {
    const key = brandName.toLowerCase()
    if (brandsByName[key]) return brandsByName[key]

    try {
      let brandSlug = slugify(brandName)
      // Check if slug exists
      const existing = await payload.find({ collection: 'brands', where: { slug: { equals: brandSlug } }, limit: 1 })
      if (existing.docs.length > 0) {
        brandsByName[key] = (existing.docs[0] as any).id
        return brandsByName[key]
      }

      const brand = await payload.create({
        collection: 'brands',
        data: {
          name: brandName,
          slug: brandSlug,
          isActive: true,
          isFeatured: false,
        },
      })
      brandsByName[key] = (brand as any).id
      console.log(`  Created brand: ${brandName}`)
      return (brand as any).id
    } catch (err: any) {
      // If slug conflict, try with suffix
      try {
        const brand = await payload.create({
          collection: 'brands',
          data: {
            name: brandName,
            slug: `${slugify(brandName)}-${Date.now()}`,
            isActive: true,
            isFeatured: false,
          },
        })
        brandsByName[key] = (brand as any).id
        return (brand as any).id
      } catch {
        console.error(`  Failed to create brand: ${brandName}`)
        return ''
      }
    }
  }

  // Process CSV files
  const dataDir = path.resolve(__dirname, '..', '..', 'Data collection')

  const files = [
    { file: 'vehicules_neufs_stemariesport.csv', condition: 'new' as const },
    { file: 'vehicules_occasion_stemariesport.csv', condition: 'used' as const },
  ]

  // Check existing vehicles count
  const existingCount = await payload.count({ collection: 'vehicles' })
  if (existingCount.totalDocs > 0) {
    console.log(`Found ${existingCount.totalDocs} existing vehicles. Deleting them first...`)
    const toDelete = await payload.find({ collection: 'vehicles', limit: 10000, select: {} })
    for (const v of toDelete.docs) {
      await payload.delete({ collection: 'vehicles', id: v.id })
    }
    console.log(`Deleted ${toDelete.docs.length} vehicles`)
  }

  let imported = 0
  let skipped = 0
  const usedSlugs = new Set<string>()

  for (const { file, condition } of files) {
    const filePath = path.join(dataDir, file)
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`)
      continue
    }

    const content = fs.readFileSync(filePath, 'utf-8')
    const rows = parseCSV(content)
    console.log(`\nProcessing ${file}: ${rows.length} rows`)

    for (const row of rows) {
      const titre = row.titre || ''
      const marque = row.marque || ''
      const modele = row.modele || ''
      const annee = parseInt(row.annee) || 0
      const prix = parsePrice(row.prix)
      const stockNumber = row.numero_stock?.replace(/\.0$/, '') || ''
      const description = row.description || ''

      // Skip invalid rows
      if (!titre || !annee || annee < 1900) {
        skipped++
        continue
      }

      // Generate unique slug
      let baseSlug = slugify(`${annee}-${marque}-${modele}`)
      if (!baseSlug) baseSlug = slugify(titre)
      let slug = baseSlug
      let suffix = 1
      while (usedSlugs.has(slug)) {
        slug = `${baseSlug}-${suffix++}`
      }
      usedSlugs.add(slug)

      const vehicleType = guessVehicleType(titre, marque, modele)
      let brandId: string | null = null
      if (marque) {
        try { brandId = await createOrGetBrand(marque) } catch { /* skip */ }
      }

      try {
        await payload.create({
          collection: 'vehicles',
          data: {
            title: titre,
            slug,
            stockNumber: stockNumber || undefined,
            condition,
            vehicleType,
            brand: brandId || undefined,
            year: annee,
            model: modele,
            price: prix || undefined,
            shortDescription: description,
            isAvailable: true,
            isFeatured: false,
          } as any,
        })
        imported++
        if (imported % 50 === 0) console.log(`  Imported ${imported} vehicles...`)
      } catch (err: any) {
        console.error(`  Error importing "${titre}": ${err.message?.substring(0, 100)}`)
        skipped++
      }
    }
  }

  console.log(`\nDone! Imported: ${imported}, Skipped: ${skipped}`)
  process.exit(0)
}

main().catch(err => {
  console.error('Import error:', err)
  process.exit(1)
})
