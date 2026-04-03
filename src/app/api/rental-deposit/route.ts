import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getPayload } from '@/lib/payload'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
})

export async function POST(request: NextRequest) {
  try {
    const { vehicleId, rentalType, startDate, endDate, customerName, customerPhone, customerEmail, driverLicenseNumber } = await request.json()

    if (!vehicleId || !rentalType || !startDate || !customerName || !customerPhone || !customerEmail || !driverLicenseNumber) {
      return NextResponse.json({ error: 'Tous les champs sont requis.' }, { status: 400 })
    }

    const payload = await getPayload()

    const vehicle = await payload.findByID({ collection: 'rental-vehicles', id: vehicleId })
    if (!vehicle) {
      return NextResponse.json({ error: 'Véhicule introuvable.' }, { status: 404 })
    }

    // Check dates not blocked
    const blockedDates = ((vehicle as any).blockedDates || []).map((d: any) => d.date?.split('T')[0])
    const datesToBook = getDatesToBlock(startDate, endDate || startDate, rentalType)
    const conflict = datesToBook.find(d => blockedDates.includes(d))
    if (conflict) {
      return NextResponse.json({ error: `La date ${conflict} n'est pas disponible.` }, { status: 409 })
    }

    const bookingNumber = `LOC-${Date.now()}`
    const vehicleTitle = typeof vehicle.title === 'string' ? vehicle.title : (vehicle.title as any)?.fr || ''

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 10000,
      currency: 'cad',
      metadata: {
        type: 'rental-deposit',
        bookingNumber,
        vehicleId,
        vehicleTitle,
        rentalType,
        startDate,
        endDate: endDate || startDate,
        customerName,
        customerEmail,
      },
      automatic_payment_methods: { enabled: true },
    })

    await payload.create({
      collection: 'rental-bookings',
      data: {
        bookingNumber,
        rentalVehicle: vehicleId,
        rentalType,
        startDate,
        endDate: endDate || startDate,
        customerName,
        customerPhone,
        customerEmail,
        driverLicenseNumber,
        depositAmount: 10000,
        stripePaymentIntentId: paymentIntent.id,
        status: 'pending',
        paymentStatus: 'pending',
      },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret, bookingNumber })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur lors de la création de la réservation.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

function getDatesToBlock(start: string, end: string, rentalType: string): string[] {
  const dates: string[] = [start]
  if (rentalType === 'weekend') {
    const d = new Date(start)
    for (let i = 1; i <= 2; i++) {
      const next = new Date(d)
      next.setDate(next.getDate() + i)
      dates.push(next.toISOString().split('T')[0])
    }
  } else if (end && end !== start) {
    dates.push(end)
  }
  return dates
}
