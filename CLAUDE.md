# Ste-Marie Sports - Project Onboard

## Overview
E-commerce website for **Ste-Marie Sports** — selling vehicles (ATV, UTV, snowmobile, motorcycle, PWC, marine) and parts/accessories. Built with **Next.js 15 + Payload CMS 3.x** as a single unified application.

## Tech Stack
- **Framework**: Next.js 15 (App Router) + Payload CMS 3.x
- **Database**: MongoDB (local or Atlas)
- **Language**: TypeScript
- **Payment**: Stripe (PaymentIntent + Elements + Webhooks)
- **Styling**: Vanilla CSS with design tokens (no Tailwind)
- **i18n**: French (default) / English via `[locale]` URL sub-path routing
- **Deployment**: Static gate page on cPanel (ste-marie.clients.pasuper.xyz), full app needs Node.js server

## Project Structure
```
website/
├── payload.config.ts          # Payload CMS configuration (collections, globals, localization)
├── next.config.mjs            # Next.js config with Payload plugin
├── middleware.ts               # i18n locale detection + site password gate
├── tsconfig.json
├── .env                        # MongoDB URI, Stripe keys, Payload secret
├── public/                     # Static assets, robots.txt
├── deploy/                     # Static HTML for cPanel deployment (gate page)
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout (noindex meta)
│   │   ├── globals.css         # All CSS (~650 lines, design tokens + components)
│   │   ├── gate/page.tsx       # Password gate page ("En construction")
│   │   ├── (frontend)/
│   │   │   ├── [locale]/
│   │   │   │   ├── layout.tsx  # Main layout (Header/Footer, server-side data from Payload)
│   │   │   │   ├── page.tsx    # HomePage
│   │   │   │   ├── category/[category]/  # CategoryPage with filters
│   │   │   │   ├── product/[slug]/       # ProductPage + AddToCartButton
│   │   │   │   ├── cart/                 # CartPage (client-side)
│   │   │   │   ├── vehicules/            # VehicleListPage
│   │   │   │   ├── vehicule/[id]/        # VehicleDetailPage
│   │   │   │   ├── mon-compte/           # Account pages
│   │   │   │   ├── blog/                 # Blog list + detail
│   │   │   │   ├── contact/              # Contact page + form
│   │   │   │   ├── pieces/               # Parts landing
│   │   │   │   ├── accessoires/          # Accessories landing
│   │   │   │   ├── [slug]/               # Dynamic CMS pages (catch-all)
│   │   │   │   └── ... (24 pages total)
│   │   │   └── checkout/
│   │   │       ├── layout.tsx  # Minimal layout (no header/footer)
│   │   │       └── page.tsx    # Stripe checkout with PaymentElement
│   │   ├── (payload)/admin/    # Payload admin panel (auto-generated)
│   │   └── api/
│   │       ├── [...slug]/route.ts          # Payload REST API
│   │       ├── create-payment-intent/route.ts  # Stripe PaymentIntent creation
│   │       ├── stripe-webhook/route.ts     # Stripe webhook handler
│   │       └── gate/route.ts               # Site password validation
│   ├── payload/
│   │   ├── collections/        # 16 collections (Products, Categories, Brands, Orders, etc.)
│   │   └── globals/            # 3 globals (SiteIdentity, StoreInformation, CheckoutSettings)
│   ├── components/             # Header, Footer, ProductCard, HeroCarousel
│   ├── providers/              # AuthProvider, CartProvider, WishlistProvider (client-side)
│   ├── lib/
│   │   ├── payload.ts          # getPayload() helper for server components
│   │   ├── media.ts            # getMediaUrl() helper
│   │   └── i18n.ts             # Translation utility t(locale, key)
│   └── translations/           # fr.json, en.json
```

## Key Architectural Decisions

### Server vs Client Components
- **Server components** (default): All pages that fetch data from Payload use the Local API directly (`await payload.find(...)`) — no HTTP calls
- **Client components** (`'use client'`): Cart, Wishlist, Auth providers, interactive elements (add-to-cart, search, forms)
- **Site/Menu data**: Fetched server-side in `[locale]/layout.tsx` and passed as props to Header/Footer

### Data Fetching
- Uses Payload Local API in server components (no REST API overhead)
- REST API (`/api/...`) used only by client components for mutations (login, register, form submissions)
- ISR with `revalidate` on most pages (60s for products, 300s for vehicles, 3600s for content)

### i18n
- URL-based: `/fr/...` and `/en/...`
- `middleware.ts` auto-redirects `/` to `/fr/`
- Payload collections use `localized: true` fields
- All Payload queries include `locale` parameter

### No Hardcoded Content
- ALL text labels, form fields, and configuration come from CMS
- `CheckoutSettings` global: checkout step titles, button labels, summary labels
- `FormSubmissions` collection: stores contact forms, vehicle inquiries
- `StoreInformation` global: hours, address, policies, shipping rates, tax config
- `SiteIdentity` global: logos, SEO defaults, social links, analytics IDs

### Site Password Gate
- `middleware.ts` checks `stemarie_site_access` cookie
- Unauthenticated users → `/gate` page
- Password: validated via `/api/gate` route, sets httpOnly cookie (30 days)
- `/admin` and `/api` routes are excluded from the gate

## Commands
```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
npm run generate:types  # Generate Payload TypeScript types
```

## Environment Variables (.env)
```
MONGODB_URI=mongodb://localhost:27017/stemarie
PAYLOAD_SECRET=<change-in-production>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
STRIPE_SECRET_KEY=<stripe-secret>
STRIPE_WEBHOOK_SECRET=<stripe-webhook-secret>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<stripe-publishable>
AWS_ACCESS_KEY_ID=<optional>
AWS_SECRET_ACCESS_KEY=<optional>
AWS_REGION=us-east-1
AWS_BUCKET=stemarie-uploads
```

## Payload Admin
- URL: `http://localhost:3000/admin`
- First run: create admin user at the registration screen
- Collections are grouped: Catalog, Inventory, Commerce, Content, Users, Settings, Media

## Stripe Integration
- **Checkout flow**: Cart → Checkout page → `POST /api/create-payment-intent` → Stripe PaymentElement → confirm payment → create order
- **Webhooks**: `POST /api/stripe-webhook` handles `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
- Updates Order status and creates Transaction records automatically

## Deployment
- **Static gate page**: Deployed to cPanel via SFTP at `ste-marie.clients.pasuper.xyz`
- **Full Next.js app**: Requires Node.js server (VPS, Vercel, Railway, etc.)
- GitHub repo: https://github.com/pasuper/ste-marie-sports.git

## Old Code (to delete)
- `frontend/` — old React+Vite SPA (migrated to `src/app/`)
- `backend/` — old Payload 2.x standalone (migrated to `src/payload/` + `payload.config.ts`)
