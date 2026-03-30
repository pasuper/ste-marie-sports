# Ste-Marie Sports - Project Onboard

## What This Project Is
E-commerce site for **Ste-Marie Sports** — vehicles (ATV, UTV, snowmobile, motorcycle, PWC) + parts/accessories. Built with **Next.js 15 + Payload CMS 3.x**.

## Current Status (2026-03-29)

### What Works
- Next.js + Payload 3.x project builds successfully (`npx next build`)
- 16 Payload collections + 3 globals configured
- MongoDB has 69,455 products, 540 categories, 204 brands, 13,344 YMMTs, 38,418 media, 13 provinces
- Gate page (password: `Pasuper7803!`) with logo + snowmobile background
- Stripe integration (PaymentIntent + webhook)
- i18n (fr/en) via `[locale]` URL routing
- CSS: 20K+ lines ported from old React in `public/styles.css`
- Deployed on cPanel at `ste-marie.clients.pasuper.xyz` (Node.js on port 3002, nginx reverse proxy)
- Logo: `/logoste-marie.png` used as fallback in Header and Footer
- YMMT API routes: `/api/ymmt/years`, `/api/ymmt/makes`, `/api/ymmt/models`, `/api/ymmt/submodels`

### Porting Status (2026-03-29)
All pages have been ported from the old React app with full JSX, CSS classes, and SVG icons.

| Component | Status | New Next.js File |
|-----------|--------|-----------------|
| **HeroCarousel** | DONE | `src/components/HeroCarousel.tsx` |
| **HeroTabs** | DONE | `src/components/HeroTabs.tsx` (YMMT finder, vehicle/accessory/parts tabs) |
| **Header** | DONE | `src/components/Header.tsx` |
| **Footer** | DONE | `src/components/Footer.tsx` (newsletter, features, social, payment cards) |
| **ProductCard** | DONE | `src/components/ProductCard.tsx` (discount badge, wishlist, quick-add) |
| **ProductDetail** | DONE | `src/components/ProductDetail.tsx` (gallery, tabs, specs, add-to-cart) |
| **CategoryFilters** | DONE | `src/components/CategoryFilters.tsx` (sidebar, sort, pagination, view toggle) |
| **AccountSidebar** | DONE | `src/components/AccountSidebar.tsx` |
| **VehicleDetail** | DONE | `src/components/VehicleDetail.tsx` (gallery, specs, tabs) |
| **BrandsFilter** | DONE | `src/components/BrandsFilter.tsx` (search, A-Z filter) |
| **HomePage** | DONE | `src/app/(frontend)/[locale]/page.tsx` |
| **CategoryPage** | DONE | `src/app/(frontend)/[locale]/category/[category]/page.tsx` |
| **ProductPage** | DONE | `src/app/(frontend)/[locale]/product/[slug]/page.tsx` |
| **CartPage** | DONE | `src/app/(frontend)/[locale]/cart/page.tsx` |
| **CheckoutPage** | DONE | `src/app/(frontend)/checkout/page.tsx` |
| **VehicleListPage** | DONE | `src/app/(frontend)/[locale]/vehicules/page.tsx` + `VehicleListClient.tsx` |
| **VehicleDetailPage** | DONE | `src/app/(frontend)/[locale]/vehicule/[id]/page.tsx` |
| **BlogListPage** | DONE | `src/app/(frontend)/[locale]/blog/page.tsx` |
| **BlogDetailPage** | DONE | `src/app/(frontend)/[locale]/blog/[id]/page.tsx` |
| **BrandsPage** | DONE | `src/app/(frontend)/[locale]/marques/page.tsx` |
| **ContactUsPage** | DONE | `src/app/(frontend)/[locale]/contact/page.tsx` + `ContactForm.tsx` |
| **AboutUsPage** | DONE | `src/app/(frontend)/[locale]/a-propos/page.tsx` |
| **ServicesPage** | DONE | `src/app/(frontend)/[locale]/services/page.tsx` |
| **CareersPage** | DONE | `src/app/(frontend)/[locale]/carrieres/page.tsx` |
| **PiecesPage** | DONE | `src/app/(frontend)/[locale]/pieces/page.tsx` |
| **AccessoiresPage** | DONE | `src/app/(frontend)/[locale]/accessoires/page.tsx` |
| **MyAccountPage** | DONE | `src/app/(frontend)/[locale]/mon-compte/page.tsx` |
| **MyOrdersPage** | DONE | `src/app/(frontend)/[locale]/mes-commandes/page.tsx` |
| **MyWishlistPage** | DONE | `src/app/(frontend)/[locale]/ma-liste-envies/page.tsx` |
| **MyAddressesPage** | DONE | `src/app/(frontend)/[locale]/mes-adresses/page.tsx` |
| **OrderTrackingPage** | DONE | `src/app/(frontend)/[locale]/suivi-commande/page.tsx` |
| **MegaMenuLanding** | DONE | `src/app/(frontend)/[locale]/[slug]/page.tsx` |
| **ContentPage** | DONE | `src/app/(frontend)/[locale]/page/[slug]/page.tsx` |

## Porting Rules

When porting each file:
1. **Read the full old React file** in `frontend/src/`
2. **Port ALL JSX** — every div, class, section, SVG icon. Do NOT simplify.
3. **Replace imports:**
   - `useLanguage()` → use `locale` prop/param
   - React Router `Link` → Next.js `Link` with `/${locale}/` prefix
   - `useParams()` → `params` from page props (Promise, use `await params`)
   - `useSearchParams()` → `searchParams` from page props (Promise)
   - `getMediaUrl` from `'../services/cms'` → `from '@/lib/media'`
   - `useNavigate()` → `useRouter()` from `next/navigation`
   - `useCart()` → `from '@/providers/CartProvider'`
   - `useAuth()` → `from '@/providers/AuthProvider'`
   - `useWishlist()` → `from '@/providers/WishlistProvider'`
4. **Remove CSS imports** — already in `public/styles.css`
5. **Server vs Client components:**
   - Pages with data fetching only → server component with Payload Local API
   - Pages with interactivity (forms, state) → `'use client'`
   - Split complex pages: server component for data + client child components for interactivity

### Server Component Pattern:
```tsx
import { getPayload, asLocale } from '@/lib/payload'
import { getMediaUrl } from '@/lib/media'
export const revalidate = 60
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const loc = asLocale(locale)
  const payload = await getPayload()
  // payload.find({ collection: '...', where: {...}, locale: loc })
}
```

### Client Component Pattern:
```tsx
'use client'
import { use } from 'react'
export default function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
}
```

## Project Structure
```
website/
├── payload.config.ts          # Payload CMS config
├── next.config.mjs            # Next.js config (typescript errors ignored for build)
├── middleware.ts               # i18n + gate password
├── app.cjs                    # cPanel startup file (uses local next)
├── public/
│   ├── styles.css             # ALL CSS (20K+ lines from old React)
│   ├── logo-stemarie.png      # Site logo (white on transparent)
│   ├── snowmobile-header.jpeg # Background image
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout (links styles.css)
│   │   ├── globals.css        # Minimal (just font import)
│   │   ├── gate/page.tsx      # Password gate page
│   │   ├── (frontend)/
│   │   │   ├── [locale]/
│   │   │   │   ├── layout.tsx # Main layout: fetches site data, renders Header+Footer
│   │   │   │   ├── page.tsx   # HomePage
│   │   │   │   └── ...        # All other pages
│   │   │   └── checkout/      # Checkout (no header/footer)
│   │   ├── (payload)/admin/   # Payload admin
│   │   └── api/               # REST API + Stripe + gate
│   ├── components/            # Header, Footer, ProductCard, HeroCarousel
│   ├── providers/             # Auth, Cart, Wishlist (client-side)
│   ├── lib/
│   │   ├── payload.ts         # getPayload() + asLocale() helper
│   │   ├── media.ts           # getMediaUrl()
│   │   └── i18n.ts            # t(locale, key) translation
│   ├── payload/collections/   # 16 Payload collections
│   ├── payload/globals/       # 3 globals (SiteIdentity, StoreInformation, CheckoutSettings)
│   └── translations/          # fr.json, en.json
├── frontend/                  # OLD React app (reference for porting, do NOT modify)
├── backend/                   # OLD Payload 2.x (reference, do NOT modify)
└── dbdump/                    # MongoDB export (JSON files per collection)
```

## Key Files
- **Payload helper**: `src/lib/payload.ts` — `getPayload()` and `asLocale(locale)`
- **Media helper**: `src/lib/media.ts` — `getMediaUrl(media)`
- **Translation**: `src/lib/i18n.ts` — `t(locale, key)`
- **Layout**: `src/app/(frontend)/[locale]/layout.tsx` — fetches siteIdentity, storeInfo, menus server-side

## Commands
```bash
# Development (requires MongoDB on localhost:27017)
npx next dev

# Build
npx next build

# Seed menus (main nav with mega menu, topbar, footer)
npx tsx src/seed-menus.ts

# Import vehicles from CSV (822 new + 72 used from Data collection/)
npx tsx src/import-vehicles.ts

# Deploy to server
tar czf /tmp/build.tar.gz .next/
sftp clients@54.39.165.32  # upload to /home/clients/ste-marie.clients.pasuper.xyz/
# SSH and restart: kill old process, extract, start with PORT=3002 node app.cjs
```

## Media Files
- Media images live in `backend/media/` (38K+ files)
- `public/media` is a symlink to `backend/media/` for Next.js static serving
- Media URLs in MongoDB are `/media/filename.jpg`
- If symlink breaks: `ln -s $(pwd)/backend/media $(pwd)/public/media`

## Server Details
- **Host**: 54.39.165.32
- **User**: clients (SSH key at ~/.ssh/stemarie_deploy)
- **App path**: /home/clients/ste-marie.clients.pasuper.xyz/
- **Port**: 3002 (nginx reverse proxy from HTTPS)
- **MongoDB**: localhost:27017 database `stemarie`
- **GitHub**: https://github.com/pasuper/ste-marie-sports.git

## User Preferences
- **Never use placeholders** — all content from CMS
- **Never ask permission** — execute directly
- **French is default locale**
- **Owner**: Michel Aubin (michel.aubin@pasuper.com)
