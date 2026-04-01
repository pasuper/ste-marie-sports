'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieConsent({ locale }: { locale: string }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="cookie-consent" role="dialog" aria-label={locale === 'fr' ? 'Consentement aux cookies' : 'Cookie consent'}>
      <div className="cookie-consent__icon">🍪</div>
      {locale === 'fr' ? (
        <>
          <h3>Nous utilisons des cookies</h3>
          <p>
            Ce site utilise des cookies pour améliorer votre expérience et analyser le trafic.{' '}
            <Link href="/fr/page/confidentialite">Politique de confidentialité</Link>
          </p>
        </>
      ) : (
        <>
          <h3>We use cookies</h3>
          <p>
            This site uses cookies to improve your experience and analyze traffic.{' '}
            <Link href="/en/page/confidentialite">Privacy Policy</Link>
          </p>
        </>
      )}
      <div className="cookie-consent__actions">
        <button className="cookie-consent__accept" onClick={accept}>
          {locale === 'fr' ? 'Accepter' : 'Accept'}
        </button>
        <button className="cookie-consent__decline" onClick={decline}>
          {locale === 'fr' ? 'Refuser' : 'Decline'}
        </button>
      </div>
    </div>
  )
}
