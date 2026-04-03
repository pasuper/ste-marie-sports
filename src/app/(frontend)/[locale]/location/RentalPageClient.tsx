'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { t } from '@/lib/i18n'
import RentalCalendar from '@/components/RentalCalendar'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

interface RentalVehicle {
  id: string
  title: string
  description: string
  vehicleType: string
  thumbnail: string | null
  pricing: {
    fourHours: number
    fourHoursMaxKm: number
    oneDay: number
    oneDayMaxKm: number
    weekend: number
    weekendMaxKm: number
  }
  blockedDates: string[]
}

interface Props {
  vehicles: RentalVehicle[]
  locale: string
}

export default function RentalPageClient({ vehicles, locale }: Props) {
  const loc = locale as 'fr' | 'en'
  const [selectedVehicle, setSelectedVehicle] = useState<RentalVehicle | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [rentalType, setRentalType] = useState<'4h' | '1day' | 'weekend'>('1day')
  const [step, setStep] = useState<'browse' | 'form' | 'payment' | 'confirmed'>('browse')

  // Form fields
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [license, setLicense] = useState('')
  const [formError, setFormError] = useState('')

  // Stripe
  const [clientSecret, setClientSecret] = useState('')
  const [bookingNumber, setBookingNumber] = useState('')

  const calendarRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  const handleChooseVehicle = (vehicle: RentalVehicle) => {
    setSelectedVehicle(vehicle)
    setSelectedDate(null)
    setStep('browse')
    setTimeout(() => calendarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setStep('form')
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  const getEndDate = (start: string, type: string): string => {
    if (type === 'weekend') {
      const d = new Date(start)
      d.setDate(d.getDate() + 2)
      return d.toISOString().split('T')[0]
    }
    return start
  }

  const getPrice = (): number => {
    if (!selectedVehicle) return 0
    const p = selectedVehicle.pricing
    if (rentalType === '4h') return p.fourHours
    if (rentalType === '1day') return p.oneDay
    return p.weekend
  }

  const handleSubmitForm = async () => {
    setFormError('')
    if (!name || !phone || !email || !license) {
      setFormError(locale === 'fr' ? 'Tous les champs sont requis.' : 'All fields are required.')
      return
    }
    if (!selectedVehicle || !selectedDate) return

    try {
      const res = await fetch('/api/rental-deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId: selectedVehicle.id,
          rentalType,
          startDate: selectedDate,
          endDate: getEndDate(selectedDate, rentalType),
          customerName: name,
          customerPhone: phone,
          customerEmail: email,
          driverLicenseNumber: license,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setFormError(data.error || 'Erreur')
        return
      }
      setClientSecret(data.clientSecret)
      setBookingNumber(data.bookingNumber)
      setStep('payment')
    } catch {
      setFormError(locale === 'fr' ? 'Erreur de connexion.' : 'Connection error.')
    }
  }

  // Merge all blocked dates or filter by selected vehicle
  const calendarBlockedDates = selectedVehicle
    ? selectedVehicle.blockedDates
    : vehicles.flatMap(v => v.blockedDates)

  return (
    <div className="rental-page">
      {/* HERO */}
      <section className="rental-hero">
        <div className="rental-hero__overlay" />
        <div className="container">
          <div className="rental-hero__content">
            <span className="rental-hero__eyebrow">CAN-AM</span>
            <h1>{t(loc, 'rental.title')}</h1>
            <p>{t(loc, 'rental.subtitle')}</p>
          </div>
        </div>
      </section>

      {/* VEHICLE GRID */}
      <section className="rental-vehicles">
        <div className="container">
          {vehicles.length === 0 ? (
            <p className="rental-empty">{t(loc, 'rental.noVehicles')}</p>
          ) : (
            <div className="rental-grid">
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className={`rental-card${selectedVehicle?.id === vehicle.id ? ' rental-card--active' : ''}`}>
                  <div className="rental-card__image">
                    {vehicle.thumbnail ? (
                      <img src={vehicle.thumbnail} alt={vehicle.title} />
                    ) : (
                      <div className="rental-card__placeholder">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M5 17a2 2 0 104 0 2 2 0 00-4 0zm10 0a2 2 0 104 0 2 2 0 00-4 0zM3 11l2-6h14l2 6"/></svg>
                      </div>
                    )}
                    <span className="rental-card__type">{vehicle.vehicleType.toUpperCase()}</span>
                  </div>
                  <div className="rental-card__body">
                    <h3>{vehicle.title}</h3>
                    {vehicle.description && <p className="rental-card__desc">{vehicle.description}</p>}
                    <div className="rental-card__pricing">
                      <div className="rental-card__pricing-row">
                        <span className="rental-card__pricing-label">{t(loc, 'rental.fourHours')}</span>
                        <span className="rental-card__pricing-price">{vehicle.pricing.fourHours} $</span>
                        <span className="rental-card__pricing-km">{vehicle.pricing.fourHoursMaxKm} km</span>
                      </div>
                      <div className="rental-card__pricing-row">
                        <span className="rental-card__pricing-label">{t(loc, 'rental.oneDay')}</span>
                        <span className="rental-card__pricing-price">{vehicle.pricing.oneDay} $</span>
                        <span className="rental-card__pricing-km">{vehicle.pricing.oneDayMaxKm} km</span>
                      </div>
                      <div className="rental-card__pricing-row">
                        <span className="rental-card__pricing-label">{t(loc, 'rental.weekend')}</span>
                        <span className="rental-card__pricing-price">{vehicle.pricing.weekend} $</span>
                        <span className="rental-card__pricing-km">{vehicle.pricing.weekendMaxKm} km</span>
                      </div>
                    </div>
                    <button className="rental-card__btn" onClick={() => handleChooseVehicle(vehicle)}>
                      {t(loc, 'rental.chooseVehicle')}
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14m-7-7l7 7-7 7"/></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CALENDAR */}
      <section className="rental-calendar-section" ref={calendarRef}>
        <div className="container">
          <div className="rental-calendar-header">
            <h2>{t(loc, 'rental.availability')}</h2>
            {selectedVehicle ? (
              <div className="rental-calendar-filter">
                <span>{selectedVehicle.title}</span>
                <button onClick={() => { setSelectedVehicle(null); setSelectedDate(null); setStep('browse') }} className="rental-calendar-filter__clear">
                  {t(loc, 'rental.allVehicles')} ×
                </button>
              </div>
            ) : (
              <span className="rental-calendar-filter__hint">{locale === 'fr' ? 'Choisissez un véhicule pour filtrer' : 'Choose a vehicle to filter'}</span>
            )}
          </div>
          <RentalCalendar
            blockedDates={calendarBlockedDates}
            onDateSelect={handleDateSelect}
            selectedDate={selectedDate}
            locale={locale}
          />
        </div>
      </section>

      {/* BOOKING FORM */}
      {step === 'form' && selectedVehicle && selectedDate && (
        <section className="rental-booking" ref={formRef}>
          <div className="container">
            <div className="rental-booking__layout">
              <div className="rental-booking__form">
                <h2>{t(loc, 'rental.bookingTitle')}</h2>
                <div className="rental-booking__fields">
                  <div className="rental-booking__field">
                    <label>{t(loc, 'rental.name')}</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} />
                  </div>
                  <div className="rental-booking__field">
                    <label>{t(loc, 'rental.phone')}</label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
                  </div>
                  <div className="rental-booking__field">
                    <label>{t(loc, 'rental.email')}</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                  <div className="rental-booking__field">
                    <label>{t(loc, 'rental.driverLicense')}</label>
                    <input type="text" value={license} onChange={e => setLicense(e.target.value)} />
                  </div>
                  <div className="rental-booking__field">
                    <label>{t(loc, 'rental.rentalType')}</label>
                    <div className="rental-booking__type-btns">
                      {(['4h', '1day', 'weekend'] as const).map(rt => (
                        <button
                          key={rt}
                          className={`rental-booking__type-btn${rentalType === rt ? ' rental-booking__type-btn--active' : ''}`}
                          onClick={() => setRentalType(rt)}
                          type="button"
                        >
                          {t(loc, rt === '4h' ? 'rental.fourHours' : rt === '1day' ? 'rental.oneDay' : 'rental.weekend')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                {formError && <p className="rental-booking__error">{formError}</p>}
                <button className="rental-booking__submit" onClick={handleSubmitForm}>
                  {t(loc, 'rental.reserve')}
                </button>
              </div>
              <div className="rental-booking__summary">
                <h3>{selectedVehicle.title}</h3>
                <div className="rental-booking__summary-row">
                  <span>{locale === 'fr' ? 'Date' : 'Date'}</span>
                  <span>{selectedDate}</span>
                </div>
                <div className="rental-booking__summary-row">
                  <span>{t(loc, 'rental.rentalType')}</span>
                  <span>{t(loc, rentalType === '4h' ? 'rental.fourHours' : rentalType === '1day' ? 'rental.oneDay' : 'rental.weekend')}</span>
                </div>
                <div className="rental-booking__summary-row">
                  <span>{locale === 'fr' ? 'Prix' : 'Price'}</span>
                  <span>{getPrice()} $</span>
                </div>
                <div className="rental-booking__summary-row rental-booking__summary-row--total">
                  <span>{t(loc, 'rental.deposit')}</span>
                  <span>100.00 $</span>
                </div>
                <p className="rental-booking__summary-note">
                  {locale === 'fr'
                    ? 'Le solde sera payable au moment de la prise en charge du véhicule.'
                    : 'The balance will be due at vehicle pickup.'}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* STRIPE PAYMENT */}
      {step === 'payment' && clientSecret && (
        <section className="rental-payment" ref={formRef}>
          <div className="container">
            <div className="rental-payment__card">
              <h2>{locale === 'fr' ? 'Paiement du dépôt' : 'Deposit Payment'}</h2>
              <p className="rental-payment__amount">100.00 $ CAD</p>
              <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                <RentalPaymentForm
                  locale={locale}
                  bookingNumber={bookingNumber}
                  onSuccess={() => setStep('confirmed')}
                />
              </Elements>
            </div>
          </div>
        </section>
      )}

      {/* CONFIRMATION */}
      {step === 'confirmed' && (
        <section className="rental-confirmation">
          <div className="container">
            <div className="rental-confirmation__card">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <path d="M22 4L12 14.01l-3-3"/>
              </svg>
              <h2>{t(loc, 'rental.confirmationTitle')}</h2>
              <p>{t(loc, 'rental.confirmationMessage')}</p>
              <div className="rental-confirmation__number">{bookingNumber}</div>
              <Link href={`/${locale}/location`} className="rental-confirmation__btn">
                {t(loc, 'rental.backToRentals')}
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

function RentalPaymentForm({ locale, bookingNumber, onSuccess }: { locale: string; bookingNumber: string; onSuccess: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)
    setError('')

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: 'if_required',
    })

    if (result.error) {
      setError(result.error.message || 'Payment failed')
      setLoading(false)
    } else if (result.paymentIntent?.status === 'succeeded') {
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {error && <p className="rental-payment__error">{error}</p>}
      <button type="submit" disabled={!stripe || loading} className="rental-payment__btn">
        {loading
          ? (locale === 'fr' ? 'Traitement...' : 'Processing...')
          : (locale === 'fr' ? 'Payer le dépôt de 100 $' : 'Pay $100 deposit')}
      </button>
    </form>
  )
}
