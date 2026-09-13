import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'

// GET /api/admin/analytics — métricas reales agregadas de toda la plataforma (solo ADMIN)
export async function GET(request: NextRequest) {
  try {
    const auth = await requireRole(request, 'ADMIN')
    if ('error' in auth) return auth.error

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const [
      totalCandidates,
      candidatesThisMonth,
      totalCompanies,
      companiesThisMonth,
      totalMatches,
      matchesThisMonth,
      completedAssessments,
      assessmentsThisMonth,
      planCounts,
      companiesByPlanRaw,
    ] = await Promise.all([
      prisma.candidateProfile.count(),
      prisma.candidateProfile.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.company.count(),
      prisma.company.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.matchResult.count(),
      prisma.matchResult.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.assessmentResponse.count({ where: { completedAt: { not: null } } }),
      prisma.assessmentResponse.count({ where: { completedAt: { gte: startOfMonth } } }),
      prisma.planPricing.findMany({ where: { isActive: true } }),
      prisma.company.groupBy({ by: ['plan'], _count: true }),
    ])

    // MRR real desde los contratos activos (precio mensual del plan de cada empresa)
    const activeCompanies = await prisma.company.findMany({
      where: { plan: { notIn: ['TRIAL'] } },
      select: { plan: true },
    })
    const planPrice = new Map<string, number>()
    for (const p of planCounts) {
      planPrice.set(p.plan, Number(p.monthlyPrice))
    }
    let mrr = 0
    for (const c of activeCompanies) {
      mrr += planPrice.get(c.plan) || 0
    }

    // Tasa de conversión: empresas con plan pagado / empresas totales
    const paidCompanies = await prisma.company.count({ where: { plan: { notIn: ['TRIAL'] } } })
    const conversion = totalCompanies > 0 ? Math.round((paidCompanies / totalCompanies) * 100) : 0

    const countByPlan = (plan: string) => companiesByPlanRaw.find((c) => c.plan === plan)?._count || 0
    const trial = countByPlan('TRIAL')
    const starter = countByPlan('STARTER')
    const professional = countByPlan('PROFESSIONAL')
    const enterprise = countByPlan('ENTERPRISE')
    const planTotal = trial + starter + professional + enterprise
    const pct = (n: number) => (planTotal > 0 ? Math.round((n / planTotal) * 100) : 0)

    return NextResponse.json({
      success: true,
      metrics: [
        { key: 'candidates', label: 'Candidatos Registrados', value: totalCandidates, change: `+${candidatesThisMonth} este mes` },
        { key: 'companies', label: 'Empresas Activas', value: totalCompanies, change: `+${companiesThisMonth} este mes` },
        { key: 'matches', label: 'Matches Totales', value: totalMatches, change: `+${matchesThisMonth} este mes` },
        { key: 'assessments', label: 'Evaluaciones Completadas', value: completedAssessments, change: `+${assessmentsThisMonth} este mes` },
        { key: 'conversion', label: 'Tasa de Conversión', value: `${conversion}%`, change: 'empresas con plan activo' },
        { key: 'mrr', label: 'Revenue MRR', value: `$${mrr.toLocaleString('en-US')}`, change: 'contratos activos' },
      ],
      planDistribution: [
        { plan: 'Trial', count: trial, pct: pct(trial), color: 'bg-gray-400' },
        { plan: 'Starter', count: starter, pct: pct(starter), color: 'bg-blue-500' },
        { plan: 'Professional', count: professional, pct: pct(professional), color: 'bg-purple-500' },
        { plan: 'Enterprise', count: enterprise, pct: pct(enterprise), color: 'bg-amber-500' },
      ],
    })
  } catch (error) {
    console.error('Error en /api/admin/analytics:', error)
    return NextResponse.json({ success: false, error: 'Error al cargar las métricas' }, { status: 500 })
  }
}
