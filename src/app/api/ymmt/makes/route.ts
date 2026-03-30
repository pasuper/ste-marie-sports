import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from '@/lib/payload'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const year = searchParams.get('year')

    if (!year) {
      return NextResponse.json({ error: 'year parameter is required' }, { status: 400 })
    }

    const payload = await getPayload()

    const { docs } = await payload.find({
      collection: 'ymmts',
      where: {
        and: [
          { isActive: { equals: true } },
          { year: { equals: Number(year) } },
        ],
      },
      limit: 10000,
      depth: 1,
    })

    const makesMap = new Map<string, { id: string; name: string }>()

    for (const doc of docs) {
      const make = doc.make
      if (make && typeof make === 'object' && 'id' in make) {
        const id = String(make.id)
        if (!makesMap.has(id)) {
          makesMap.set(id, {
            id,
            name: (make as { id: string; name: string }).name,
          })
        }
      }
    }

    const makes = [...makesMap.values()].sort((a, b) =>
      a.name.localeCompare(b.name),
    )

    return NextResponse.json({ makes })
  } catch (error) {
    console.error('Error fetching YMMT makes:', error)
    return NextResponse.json({ error: 'Failed to fetch makes' }, { status: 500 })
  }
}
