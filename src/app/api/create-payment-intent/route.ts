import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
})

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'cad', metadata = {} } = await request.json()

    if (!amount || amount < 50) {
      return NextResponse.json(
        { error: 'Invalid amount. Minimum is 50 cents.' },
        { status: 400 }
      )
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata,
      automatic_payment_methods: { enabled: true },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create payment intent'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
