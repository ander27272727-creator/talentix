import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'

// GET /api/admin/vacancies — todas las vacantes reales de la plataforma (solo ADMIN)
export async function GET(request: NextRequest) {
  try {
    const auth = await requireRole(request, 'ADMIN')
    if ('error' in auth) return auth.error
    const vacancies = await prisma.vacancy.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        company: { select: { name: true } },
        _count: { select: { referrals: true, matches: true } },
      },
    })

    // Score promedio real por vacante a partir de sus matches
    const vacancyIds = vacancies.map((v) => v.id)
    const matchAgg = await prisma.matchResult.groupBy({
      by: ['vacancyId'],
      where: { vacancyId: { in: vacancyIds } },
      _avg: { overallMatch: true },
    })
    const avgByVacancy = new Map(matchAgg.map((m) => [m.vacancyId, Math.round(m._avg.overallMatch || 0)]))

    return NextResponse.json({
      success: true,
      vacancies: vacancies.map((v) => ({
        id: v.id,
        title: v.title,
        company: v.company.name,
        status: v.status,
        category: v.category,
        location: v.location,
        type: v.type,
        applicants: v._count.referrals,
        matches: v._count.matches,
        avgMatch: avgByVacancy.get(v.id) ?? null,
        createdAt: v.createdAt,
      })),
    })
  } catch (error) {
    console.error('Error GET /api/admin/vacancies:', error)
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}
