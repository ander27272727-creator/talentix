import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'

// GET /api/company/dashboard?userId=... — datos reales del dashboard de empresa (solo COMPANY)
export async function GET(request: NextRequest) {
  try {
    const auth = await requireRole(request, 'COMPANY', 'ADMIN')
    if ('error' in auth) return auth.error
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Falta el ID de usuario' }, { status: 400 })
    }

    const company = await prisma.company.findUnique({
      where: { userId },
      select: {
        id: true,
        name: true,
        plan: true,
        planExpiresAt: true,
        vacancies: {
          where: { status: 'ACTIVE' },
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            location: true,
            type: true,
            createdAt: true,
            _count: { select: { referrals: true } },
          },
        },
      },
    })

    if (!company) {
      return NextResponse.json({ success: false, error: 'Empresa no encontrada' }, { status: 404 })
    }

    // Candidatos derivados (referrals) reales
    const referrals = await prisma.referral.findMany({
      where: { companyId: company.id },
      orderBy: { referredAt: 'desc' },
      take: 10,
      include: {
        candidate: {
          include: {
            user: { select: { name: true } },
          },
        },
        vacancy: { select: { title: true } },
      },
    })

    const statusCounts = await prisma.referral.groupBy({
      by: ['status'],
      where: { companyId: company.id },
      _count: true,
    })

    const countBy = (s: string) => statusCounts.find((sc) => sc.status === s)?._count || 0

    const totalReferrals = statusCounts.reduce((sum, sc) => sum + sc._count, 0)
    const hired = countBy('HIRED')
    const inPipeline = totalReferrals - countBy('REJECTED') - hired

    const recommendationLabels: Record<string, string> = {
      highly_recommended: 'Altamente Recomendado',
      recommended: 'Recomendado',
      possible: 'Posible',
      low_fit: 'Bajo Fit',
    }

    return NextResponse.json({
      success: true,
      company: {
        id: company.id,
        name: company.name,
        plan: company.plan,
        planExpiresAt: company.planExpiresAt,
      },
      stats: {
        totalReferrals,
        activeVacancies: company.vacancies.length,
        inPipeline,
        hired,
      },
      recentCandidates: referrals.map((r) => ({
        id: r.id,
        name: r.candidate.user.name,
        vacancyTitle: r.vacancy.title,
        score: Math.round(r.matchScore),
        status: r.status,
        referredAt: r.referredAt,
      })),
      activeVacancies: company.vacancies.map((v) => ({
        id: v.id,
        title: v.title,
        location: v.location,
        type: v.type,
        applicants: v._count.referrals,
        createdAt: v.createdAt,
      })),
    })
  } catch (error) {
    console.error('Error GET /api/company/dashboard:', error)
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}
