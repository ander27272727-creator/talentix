import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/stats — métricas reales de toda la plataforma
export async function GET() {
  try {
    const [totalCompanies, totalCandidates, totalVacancies, totalMatches, totalReferrals] = await Promise.all([
      prisma.company.count(),
      prisma.candidateProfile.count(),
      prisma.vacancy.count({ where: { status: 'ACTIVE' } }),
      prisma.matchResult.count(),
      prisma.referral.count(),
    ])

    const statusCounts = await prisma.referral.groupBy({
      by: ['status'],
      _count: true,
    })
    const countBy = (s: string) => statusCounts.find((sc) => sc.status === s)?._count || 0

    const hired = countBy('HIRED')
    const successRate = totalReferrals > 0 ? Math.round((hired / totalReferrals) * 100) : 0

    // Derivaciones recientes con datos reales
    const recentReferrals = await prisma.referral.findMany({
      orderBy: { referredAt: 'desc' },
      take: 6,
      include: {
        candidate: { include: { user: { select: { name: true } } } },
        company: { select: { name: true } },
        vacancy: { select: { title: true } },
      },
    })

    const completedAssessments = await prisma.assessmentResponse.count()
    const totalAnswers = await prisma.assessmentAnswer.count()

    return NextResponse.json({
      success: true,
      stats: {
        companies: totalCompanies,
        candidates: totalCandidates,
        activeVacancies: totalVacancies,
        matches: totalMatches,
        referrals: totalReferrals,
        hired,
        successRate,
        completedAssessments,
        totalAnswers,
      },
      recentReferrals: recentReferrals.map((r) => ({
        id: r.id,
        candidate: r.candidate.user.name,
        company: r.company.name,
        vacancy: r.vacancy.title,
        score: Math.round(r.matchScore),
        status: r.status,
        referredAt: r.referredAt,
      })),
    })
  } catch (error) {
    console.error('Error GET /api/admin/stats:', error)
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}
