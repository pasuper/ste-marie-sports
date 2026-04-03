import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getPayload } from '@/lib/payload'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
})

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook signature verification failed'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  const payload = await getPayload()

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent

      // Handle rental deposit
      if (paymentIntent.metadata?.type === 'rental-deposit') {
        const bookings = await payload.find({
          collection: 'rental-bookings',
          where: { stripePaymentIntentId: { equals: paymentIntent.id } },
          limit: 1,
        })
        if (bookings.docs[0]) {
          await payload.update({
            collection: 'rental-bookings',
            id: bookings.docs[0].id,
            data: { paymentStatus: 'paid', status: 'confirmed' },
          })
          // Block dates on the vehicle
          const booking = bookings.docs[0] as any
          const vehicleId = typeof booking.rentalVehicle === 'object' ? booking.rentalVehicle.id : booking.rentalVehicle
          if (vehicleId) {
            const vehicle = await payload.findByID({ collection: 'rental-vehicles', id: vehicleId })
            const existing = ((vehicle as any).blockedDates || []) as any[]
            const newDates = getDatesRange(booking.startDate, booking.endDate)
            const merged = [...existing, ...newDates.map((d: string) => ({ date: d }))]
            await payload.update({ collection: 'rental-vehicles', id: vehicleId, data: { blockedDates: merged } })
          }
        }
        break
      }

      // Update order payment status
      const orders = await payload.find({
        collection: 'orders',
        where: { stripePaymentIntentId: { equals: paymentIntent.id } },
        limit: 1,
      })
      if (orders.docs[0]) {
        await payload.update({
          collection: 'orders',
          id: orders.docs[0].id,
          data: { paymentStatus: 'paid', status: 'processing' },
        })
      }
      // Create transaction record
      await payload.create({
        collection: 'transactions',
        data: {
          transactionId: paymentIntent.id,
          order: orders.docs[0]?.id,
          type: 'payment',
          status: 'completed',
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency.toUpperCase(),
          provider: 'stripe',
          providerTransactionId: paymentIntent.id,
          metadata: { chargeId: paymentIntent.latest_charge },
        },
      })
      break
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      const orders = await payload.find({
        collection: 'orders',
        where: { stripePaymentIntentId: { equals: paymentIntent.id } },
        limit: 1,
      })
      if (orders.docs[0]) {
        await payload.update({
          collection: 'orders',
          id: orders.docs[0].id,
          data: { paymentStatus: 'failed' },
        })
      }
      break
    }

    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge
      const piId = charge.payment_intent as string
      const orders = await payload.find({
        collection: 'orders',
        where: { stripePaymentIntentId: { equals: piId } },
        limit: 1,
      })
      if (orders.docs[0]) {
        await payload.update({
          collection: 'orders',
          id: orders.docs[0].id,
          data: { paymentStatus: 'refunded', status: 'refunded' },
        })
        await payload.create({
          collection: 'transactions',
          data: {
            transactionId: `refund_${charge.id}`,
            order: orders.docs[0].id,
            type: 'refund',
            status: 'completed',
            amount: (charge.amount_refunded || 0) / 100,
            currency: charge.currency.toUpperCase(),
            provider: 'stripe',
            providerTransactionId: charge.id,
          },
        })
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}

function getDatesRange(start: string, end: string): string[] {
  const dates: string[] = []
  const d = new Date(start.split('T')[0])
  const e = new Date((end || start).split('T')[0])
  while (d <= e) {
    dates.push(d.toISOString().split('T')[0])
    d.setDate(d.getDate() + 1)
  }
  return dates
}
