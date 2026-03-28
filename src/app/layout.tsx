import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ste-Marie Sports',
  description: 'Ste-Marie Sports - Véhicules, pièces et accessoires',
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body>{children}</body>
    </html>
  )
}
