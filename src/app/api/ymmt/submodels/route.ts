import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from '@/lib/payload'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const year = searchParams.get('year')
    const makeId = searchParams.get('makeId')
    const model = searchParams.get('model')

    if (!year || !makeId || !model) {
      return NextResponse.json(
        { error: 'year, makeId, and model parameters are required' },
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
          { model: { equals: model } },
        ],
      },
      limit: 10000,
      select: {
        submodel: true,
        trim: true,
      },
    })

    const submodels = [...new Set(
      docs
        .map((doc) => {
          const parts = [doc.submodel, doc.trim].filter(Boolean)
          return parts.length > 0 ? parts.join(' ') : null
        })
        .filter(Boolean),
    )] as string[]
    submodels.sort((a, b) => a.localeCompare(b))

    return NextResponse.json({ submodels })
  } catch (error) {
    console.error('Error fetching YMMT submodels:', error)
    return NextResponse.json({ error: 'Failed to fetch submodels' }, { status: 500 })
  }
}
