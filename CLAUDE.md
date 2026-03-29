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

### What Needs Work (PRIORITY)
**All pages need their JSX ported from the old React app.** The old React files are in `frontend/src/` and have the complete design. The new Next.js files in `src/` are minimal stubs. The CSS is already ported — just the JSX/components need to match.

#### Porting Status:
| Component | Status | Old React File | New Next.js File |
|-----------|--------|---------------|-----------------|
| **HeroCarousel** | DONE | `frontend/src/components/Hero/HeroCarousel.tsx` | `src/components/HeroCarousel.tsx` |
| **Header** | DONE | `frontend/src/layouts/Header.tsx` | `src/components/Header.tsx` |
| **Footer** | TODO | `frontend/src/layouts/Footer.tsx` | `src/components/Footer.tsx` |
| **ProductCard** | TODO | `frontend/src/components/ProductCard/ProductCard.tsx` | `src/components/ProductCard.tsx` |
| **AccountSidebar** | TODO | `frontend/src/components/AccountSidebar.tsx` | `src/components/AccountSidebar.tsx` (create) |
| **HomePage** | TODO | `frontend/src/pages/HomePage.tsx` | `src/app/(frontend)/[locale]/page.tsx` |
| **CategoryPage** | TODO | `frontend/src/pages/CategoryPage.tsx` | `src/app/(frontend)/[locale]/category/[category]/page.tsx` |
| **ProductPage** | TODO | `frontend/src/pages/ProductPage.tsx` | `src/app/(frontend)/[locale]/product/[slug]/page.tsx` |
| **CartPage** | TODO | `frontend/src/pages/CartPage.tsx` | `src/app/(frontend)/[locale]/cart/page.tsx` |
| **CheckoutPage** | TODO | `frontend/src/pages/CheckoutPage.tsx` | `src/app/(frontend)/checkout/page.tsx` |
| **VehicleListPage** | TODO | `frontend/src/pages/VehicleListPage.tsx` | `src/app/(frontend)/[locale]/vehicules/page.tsx` |
| **VehicleDetailPage** | TODO | `frontend/src/pages/VehicleDetailPage.tsx` | `src/app/(frontend)/[locale]/vehicule/[id]/page.tsx` |
| **BlogListPage** | TODO | `frontend/src/pages/BlogListPage.tsx` | `src/app/(frontend)/[locale]/blog/page.tsx` |
| **BlogDetailPage** | TODO | `frontend/src/pages/BlogDetailPage.tsx` | `src/app/(frontend)/[locale]/blog/[id]/page.tsx` |
| **BrandsPage** | TODO | `frontend/src/pages/BrandsPage.tsx` | `src/app/(frontend)/[locale]/marques/page.tsx` |
| **ContactUsPage** | TODO | `frontend/src/pages/ContactUsPage.tsx` | `src/app/(frontend)/[locale]/contact/page.tsx` |
| **AboutUsPage** | TODO | `frontend/src/pages/AboutUsPage.tsx` | `src/app/(frontend)/[locale]/a-propos/page.tsx` |
| **ServicesPage** | TODO | `frontend/src/pages/ServicesPage.tsx` | `src/app/(frontend)/[locale]/services/page.tsx` |
| **CareersPage** | TODO | `frontend/src/pages/CareersPage.tsx` | `src/app/(frontend)/[locale]/carrieres/page.tsx` |
| **PiecesPage** | TODO | `frontend/src/pages/PiecesPage.tsx` | `src/app/(frontend)/[locale]/pieces/page.tsx` |
| **AccessoiresPage** | TODO | `frontend/src/pages/AccessoiresPage.tsx` | `src/app/(frontend)/[locale]/accessoires/page.tsx` |
| **MyAccountPage** | TODO | `frontend/src/pages/MyAccountPage.tsx` | `src/app/(frontend)/[locale]/mon-compte/page.tsx` |
| **MyOrdersPage** | TODO | `frontend/src/pages/MyOrdersPage.tsx` | `src/app/(frontend)/[locale]/mes-commandes/page.tsx` |
| **MyWishlistPage** | TODO | `frontend/src/pages/MyWishlistPage.tsx` | `src/app/(frontend)/[locale]/ma-liste-envies/page.tsx` |
| **MyAddressesPage** | TODO | `frontend/src/pages/MyAddressesPage.tsx` | `src/app/(frontend)/[locale]/mes-adresses/page.tsx` |
| **OrderTrackingPage** | TODO | `frontend/src/pages/OrderTrackingPage.tsx` | `src/app/(frontend)/[locale]/suivi-commande/page.tsx` |
| **MegaMenuLanding** | TODO | `frontend/src/pages/MegaMenuItemLandingPage.tsx` | `src/app/(frontend)/[locale]/[slug]/page.tsx` |
| **ContentPage** | TODO | `frontend/src/pages/ContentPage.tsx` | `src/app/(frontend)/[locale]/page/[slug]/page.tsx` |

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

# Deploy to server
tar czf /tmp/build.tar.gz .next/
sftp clients@54.39.165.32  # upload to /home/clients/ste-marie.clients.pasuper.xyz/
# SSH and restart: kill old process, extract, start with PORT=3002 node app.cjs
```

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
