import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/matches — matches reales del motor + métricas
export async function GET() {
  try {
    const matches = await prisma.matchResult.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        candidate: { include: { user: { select: { name: true } } } },
        vacancy: {
          select: { title: true, company: { select: { name: true } } },
        },
      },
    })

    const totalMatches = await prisma.matchResult.count()
    const highMatches = await prisma.matchResult.count({ where: { overallMatch: { gte: 85 } } })
    const avgScore = totalMatches > 0
      ? Math.round(
          (await prisma.matchResult.aggregate({ _avg: { overallMatch: true } }))._avg.overallMatch || 0
        )
      : 0

    const RECOMMENDATION_LABELS: Record<string, string> = {
      highly_recommended: 'Altamente Recomendado',
      recommended: 'Recomendado',
      possible: 'Posible',
      low_fit: 'Bajo Fit',
    }

    return NextResponse.json({
      success: true,
      metrics: {
        totalMatches,
        highMatches,
        avgScore,
        highRate: totalMatches > 0 ? Math.round((highMatches / totalMatches) * 100) : 0,
      },
      matches: matches.map((m) => ({
        id: m.id,
        candidate: m.candidate.user.name,
        company: m.vacancy.company.name,
        vacancy: m.vacancy.title,
        score: Math.round(m.overallMatch),
        recommendation: RECOMMENDATION_LABELS[m.recommendation] || m.recommendation,
        createdAt: m.createdAt,
      })),
    })
  } catch (error) {
    console.error('Error GET /api/admin/matches:', error)
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}
