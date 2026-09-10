import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'

// POST /api/quiz — público: guarda el resultado del quiz viral
export async function POST(request: NextRequest) {
  try {
    const { scores } = await request.json()
    if (!scores || typeof scores !== 'object') {
      return NextResponse.json({ success: false, error: 'Scores inválidos' }, { status: 400 })
    }

    const winner = Object.entries(scores as Record<string, number>)
      .sort((a, b) => b[1] - a[1])[0]?.[0]

    if (!winner) {
      return NextResponse.json({ success: false, error: 'No se pudo determinar el arquetipo' }, { status: 400 })
    }

    const result = await prisma.quizResult.create({
      data: { archetype: winner, scores },
    })

    return NextResponse.json({ success: true, resultId: result.id, archetype: winner })
  } catch (error) {
    console.error('Error POST /api/quiz:', error)
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}

// GET /api/quiz — métricas reales del quiz (solo ADMIN)
export async function GET(request: NextRequest) {
  try {
    const auth = await requireRole(request, 'ADMIN')
    if ('error' in auth) return auth.error

    const [total, converted, byArchetype] = await Promise.all([
      prisma.quizResult.count(),
      prisma.quizResult.count({ where: { converted: true } }),
      prisma.quizResult.groupBy({ by: ['archetype'], _count: true }),
    ])

    return NextResponse.json({
      success: true,
      metrics: {
        total,
        converted,
        conversionRate: total > 0 ? Math.round((converted / total) * 100) : 0,
        byArchetype: byArchetype.map((a) => ({ archetype: a.archetype, count: a._count })),
      },
    })
  } catch (error) {
    console.error('Error GET /api/quiz:', error)
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}
