import { NextRequest, NextResponse } from 'next/server'

const SITE_PASSWORD = 'Pasuper7803!'
const AUTH_COOKIE = 'stemarie_site_access'

export async function POST(request: NextRequest) {
  const { password } = await request.json()

  if (password === SITE_PASSWORD) {
    const response = NextResponse.json({ success: true })
    response.cookies.set(AUTH_COOKIE, 'granted', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    })
    return response
  }

  return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
}
