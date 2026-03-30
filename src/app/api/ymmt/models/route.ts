import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from '@/lib/payload'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const year = searchParams.get('year')
    const makeId = searchParams.get('makeId')

    if (!year || !makeId) {
      return NextResponse.json(
        { error: 'year and makeId parameters are required' },
        { status: 400 },
      )
    }

    const payload = await getPayload()

    const { docs } = await payload.find({
      collection: 'ymmts',
      where: {
        and: [
          { isActive: { equals: true } },
          { year: { equals: Number(year) } },
          { make: { equals: makeId } },
        ],
      },
      limit: 10000,
      select: {
        model: true,
      },
    })

    const models = [...new Set(docs.map((doc) => doc.model).filter(Boolean))] as string[]
    models.sort((a, b) => a.localeCompare(b))

    return NextResponse.json({ models })
  } catch (error) {
    console.error('Error fetching YMMT models:', error)
    return NextResponse.json({ error: 'Failed to fetch models' }, { status: 500 })
  }
}
