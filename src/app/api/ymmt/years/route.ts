import { NextResponse } from 'next/server'
import { getPayload } from '@/lib/payload'

export async function GET() {
  try {
    const payload = await getPayload()

    const { docs } = await payload.find({
      collection: 'ymmts',
      where: {
        isActive: { equals: true },
      },
      limit: 10000,
      select: {
        year: true,
      },
    })

    const years = [...new Set(docs.map((doc) => doc.year).filter(Boolean))] as number[]
    years.sort((a, b) => b - a)

    return NextResponse.json({ years })
  } catch (error) {
    console.error('Error fetching YMMT years:', error)
    return NextResponse.json({ error: 'Failed to fetch years' }, { status: 500 })
  }
}
