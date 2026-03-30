import { NextRequest, NextResponse } from 'next/server'

const locales = ['fr', 'en']
const defaultLocale = 'fr'

const SITE_PASSWORD = 'Pasuper7803!'
const AUTH_COOKIE = 'stemarie_site_access'

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    const preferred = acceptLanguage.split(',')[0].split('-')[0]
    if (locales.includes(preferred)) return preferred
  }
  return defaultLocale
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip static assets, admin, API, and the gate page itself
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/media') ||
    pathname === '/gate' ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Check site access cookie
  const hasAccess = request.cookies.get(AUTH_COOKIE)?.value === 'granted'
  if (!hasAccess) {
    const gateUrl = new URL('/gate', request.url)
    gateUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(gateUrl)
  }

  // i18n locale routing
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return NextResponse.next()

  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: ['/', '/((?!_next|admin|api|media|favicon.ico).*)'],
}
