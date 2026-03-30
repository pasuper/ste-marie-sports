import { getPayload, asLocale } from '@/lib/payload'
import { Providers } from '@/providers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { unstable_cache } from 'next/cache'

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

const getSiteData = unstable_cache(
  async (locale: string) => {
    const loc = asLocale(locale)
    const payload = await getPayload()

    const [siteIdentity, storeInfo, menus] = await Promise.all([
      payload.findGlobal({ slug: 'site-identity', locale: loc }),
      payload.findGlobal({ slug: 'store-information', locale: loc }),
      payload.find({ collection: 'menus', locale: loc, limit: 50, depth: 2, where: { isActive: { equals: true } } }),
    ])

    const menusByLocation: Record<string, any> = {}
    menus.docs.forEach((menu: any) => {
      if (menu.location) menusByLocation[menu.location] = menu
    })

    return {
      siteIdentity: JSON.parse(JSON.stringify(siteIdentity)),
      storeInfo: JSON.parse(JSON.stringify(storeInfo)),
      menusByLocation: JSON.parse(JSON.stringify(menusByLocation)),
    }
  },
  ['site-data'],
  { revalidate: 300, tags: ['site-data'] }
)

export default async function FrontendLayout({ children, params }: LayoutProps) {
  const { locale } = await params
  const { siteIdentity, storeInfo, menusByLocation } = await getSiteData(locale)

  return (
    <Providers>
      <Header
        locale={locale}
        siteIdentity={siteIdentity}
        storeInfo={storeInfo}
        menus={menusByLocation}
      />
      <main>{children}</main>
      <Footer
        locale={locale}
        siteIdentity={siteIdentity}
        storeInfo={storeInfo}
        menus={menusByLocation}
      />
    </Providers>
  )
}
