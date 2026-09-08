import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/candidate/vacancies
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // REMOTE, HYBRID, ONSITE
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const where: Record<string, unknown> = { status: 'ACTIVE' }

    if (type && type !== 'ALL') {
      where.type = type
    }
    if (category && category !== 'ALL') {
      where.category = category
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const vacancies = await prisma.vacancy.findMany({
      where,
      include: {
        company: {
          select: { name: true, industry: true, logo: true, location: true, size: true },
        },
        _count: {
          select: { matches: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, vacancies })
  } catch (error) {
    console.error('Error obteniendo vacantes:', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
