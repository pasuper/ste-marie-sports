import { getPayload } from '@/lib/payload'
import { Providers } from '@/providers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function FrontendLayout({ children, params }: LayoutProps) {
  const { locale } = await params
  const payload = await getPayload()

  const [siteIdentity, storeInfo, menus] = await Promise.all([
    payload.findGlobal({ slug: 'site-identity', locale }),
    payload.findGlobal({ slug: 'store-information', locale }),
    payload.find({ collection: 'menus', locale, limit: 50, depth: 2 }),
  ])

  const menusByLocation: Record<string, any> = {}
  menus.docs.forEach((menu: any) => {
    if (menu.location) menusByLocation[menu.location] = menu
  })

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
