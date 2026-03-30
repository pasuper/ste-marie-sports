/**
 * Seed script to populate menus in Payload CMS.
 * Run with: npx tsx src/seed-menus.ts
 *
 * Creates: main-navigation, topbar-right, footer-left, footer-center, footer-right, footer-bottom
 */

import { getPayload } from 'payload'
import config from '../payload.config'

async function seed() {
  const payload = await getPayload({ config })

  // Delete existing menus
  const existing = await payload.find({ collection: 'menus', limit: 100 })
  for (const menu of existing.docs) {
    await payload.delete({ collection: 'menus', id: menu.id })
  }
  console.log(`Deleted ${existing.docs.length} existing menus`)

  // 1. Main Navigation with mega menu items
  await payload.create({
    collection: 'menus',
    data: {
      name: 'Navigation principale',
      slug: 'main-navigation',
      location: 'main-navigation',
      isActive: true,
      sortOrder: 0,
      items: [
        {
          label: 'Motoneiges',
          type: 'page',
          url: '/motoneiges',
          hasMegaMenu: true,
          vehicleLinks: [
            { label: 'Motoneiges neuves', url: '/vehicules?type=snowmobile&condition=new', highlight: false },
            { label: 'Motoneiges usagées', url: '/vehicules?type=snowmobile&condition=used', highlight: false },
            { label: 'Toutes les motoneiges →', url: '/vehicules?type=snowmobile', highlight: true },
          ],
          partsTitle: 'Pièces motoneige',
          partsLinks: [
            { label: 'Pièces OEM', url: '/pieces?type=oem', highlight: false },
            { label: 'Chenilles', url: '/category/chenilles', highlight: false },
            { label: 'Carburation', url: '/category/carburation', highlight: false },
            { label: 'Toutes les pièces →', url: '/pieces', highlight: true },
          ],
          accessoriesTitle: 'Accessoires motoneige',
          accessoriesLinks: [
            { label: 'Casques', url: '/category/casques', highlight: false },
            { label: 'Vêtements hiver', url: '/category/vetements-hiver', highlight: false },
            { label: 'Bagagerie', url: '/category/bagagerie', highlight: false },
            { label: 'Tous les accessoires →', url: '/accessoires', highlight: true },
          ],
          showBrands: false,
        },
        {
          label: 'VTT & Côte à Côte',
          type: 'page',
          url: '/vtt-vcc',
          hasMegaMenu: true,
          vehicleLinks: [
            { label: 'VTT neufs', url: '/vehicules?type=atv&condition=new', highlight: false },
            { label: 'Côte à côte neufs', url: '/vehicules?type=utv&condition=new', highlight: false },
            { label: 'VTT usagés', url: '/vehicules?type=atv&condition=used', highlight: false },
            { label: 'Tous les VTT & VCC →', url: '/vehicules?type=atv', highlight: true },
          ],
          partsTitle: 'Pièces VTT',
          partsLinks: [
            { label: 'Pièces OEM', url: '/pieces?type=oem', highlight: false },
            { label: 'Pneus', url: '/category/pneus', highlight: false },
            { label: 'Toutes les pièces →', url: '/pieces', highlight: true },
          ],
          accessoriesTitle: 'Accessoires',
          accessoriesLinks: [
            { label: 'Casques', url: '/category/casques', highlight: false },
            { label: 'Protection', url: '/category/protection', highlight: false },
            { label: 'Tous les accessoires →', url: '/accessoires', highlight: true },
          ],
          showBrands: false,
        },
        {
          label: 'Motos',
          type: 'page',
          url: '/moto',
          hasMegaMenu: true,
          vehicleLinks: [
            { label: 'Motos neuves', url: '/vehicules?type=motorcycle&condition=new', highlight: false },
            { label: 'Motos usagées', url: '/vehicules?type=motorcycle&condition=used', highlight: false },
            { label: 'Toutes les motos →', url: '/vehicules?type=motorcycle', highlight: true },
          ],
          partsTitle: 'Pièces moto',
          partsLinks: [
            { label: 'Pièces OEM', url: '/pieces?type=oem', highlight: false },
            { label: 'Toutes les pièces →', url: '/pieces', highlight: true },
          ],
          accessoriesTitle: 'Équipement moto',
          accessoriesLinks: [
            { label: 'Casques', url: '/category/casques', highlight: false },
            { label: 'Vestes', url: '/category/vestes', highlight: false },
            { label: 'Gants', url: '/category/gants', highlight: false },
            { label: 'Tout l\'équipement →', url: '/accessoires', highlight: true },
          ],
          showBrands: false,
        },
        {
          label: 'Marine',
          type: 'page',
          url: '/marine',
          hasMegaMenu: true,
          vehicleLinks: [
            { label: 'Motomarines neuves', url: '/vehicules?type=pwc&condition=new', highlight: false },
            { label: 'Motomarines usagées', url: '/vehicules?type=pwc&condition=used', highlight: false },
            { label: 'Toutes les motomarines →', url: '/vehicules?type=pwc', highlight: true },
          ],
          partsTitle: 'Pièces marine',
          partsLinks: [
            { label: 'Pièces OEM', url: '/pieces?type=oem', highlight: false },
            { label: 'Toutes les pièces →', url: '/pieces', highlight: true },
          ],
          accessoriesTitle: 'Accessoires nautiques',
          accessoriesLinks: [
            { label: 'Vestes de flottaison', url: '/category/flottaison', highlight: false },
            { label: 'Tous les accessoires →', url: '/accessoires', highlight: true },
          ],
          showBrands: false,
        },
        {
          label: 'Pièces',
          type: 'internal',
          url: '/pieces',
          hasMegaMenu: false,
        },
        {
          label: 'Accessoires',
          type: 'internal',
          url: '/accessoires',
          hasMegaMenu: false,
        },
        {
          label: 'Marques',
          type: 'internal',
          url: '/marques',
          hasMegaMenu: false,
        },
      ],
    },
  })
  console.log('Created: main-navigation')

  // 2. Topbar Right
  await payload.create({
    collection: 'menus',
    data: {
      name: 'Topbar',
      slug: 'topbar-right',
      location: 'topbar-right',
      isActive: true,
      sortOrder: 0,
      items: [
        { label: 'Aide', type: 'internal', url: '/contact' },
        { label: 'Suivi de commande', type: 'internal', url: '/suivi-commande' },
      ],
    },
  })
  console.log('Created: topbar-right')

  // 3. Footer Left
  await payload.create({
    collection: 'menus',
    data: {
      name: 'Service client',
      slug: 'footer-left',
      location: 'footer-left',
      isActive: true,
      sortOrder: 0,
      items: [
        { label: 'Contactez-nous', type: 'internal', url: '/contact' },
        { label: 'Suivi de commande', type: 'internal', url: '/suivi-commande' },
        { label: 'Livraison & Retours', type: 'internal', url: '/page/livraison-retours' },
        { label: 'FAQ', type: 'internal', url: '/page/faq' },
      ],
    },
  })
  console.log('Created: footer-left')

  // 4. Footer Center
  await payload.create({
    collection: 'menus',
    data: {
      name: 'À propos',
      slug: 'footer-center',
      location: 'footer-center',
      isActive: true,
      sortOrder: 1,
      items: [
        { label: 'Notre histoire', type: 'internal', url: '/a-propos' },
        { label: 'Services', type: 'internal', url: '/services' },
        { label: 'Carrières', type: 'internal', url: '/carrieres' },
        { label: 'Blog', type: 'internal', url: '/blog' },
      ],
    },
  })
  console.log('Created: footer-center')

  // 5. Footer Right
  await payload.create({
    collection: 'menus',
    data: {
      name: 'Magasiner',
      slug: 'footer-right',
      location: 'footer-right',
      isActive: true,
      sortOrder: 2,
      items: [
        { label: 'Véhicules', type: 'internal', url: '/vehicules' },
        { label: 'Pièces', type: 'internal', url: '/pieces' },
        { label: 'Accessoires', type: 'internal', url: '/accessoires' },
        { label: 'Marques', type: 'internal', url: '/marques' },
      ],
    },
  })
  console.log('Created: footer-right')

  // 6. Footer Bottom (legal)
  await payload.create({
    collection: 'menus',
    data: {
      name: 'Légal',
      slug: 'footer-bottom',
      location: 'footer-bottom',
      isActive: true,
      sortOrder: 0,
      items: [
        { label: 'Politique de confidentialité', type: 'internal', url: '/page/confidentialite' },
        { label: 'Conditions d\'utilisation', type: 'internal', url: '/page/conditions' },
        { label: 'Politique de retour', type: 'internal', url: '/page/politique-retour' },
      ],
    },
  })
  console.log('Created: footer-bottom')

  console.log('\nAll menus seeded successfully!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed error:', err)
  process.exit(1)
})
