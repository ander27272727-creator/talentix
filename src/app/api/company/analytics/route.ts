import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'

// GET /api/company/analytics?userId=... — métricas reales de hiring de la empresa
export async function GET(request: NextRequest) {
  try {
    const auth = await requireRole(request, 'COMPANY')
    if ('error' in auth) return auth.error

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Falta el ID de usuario' }, { status: 400 })
    }

    const company = await prisma.company.findUnique({ where: { userId } })
    if (!company) {
      return NextResponse.json({ success: false, error: 'Empresa no encontrada' }, { status: 404 })
    }

    const now = new Date()
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)

    const [companyVacancies, referrals, candidates] = await Promise.all([
      prisma.vacancy.findMany({ where: { companyId: company.id }, select: { id: true, createdAt: true, status: true } }),
      prisma.referral.findMany({
        where: { companyId: company.id },
        select: { status: true, referredAt: true, viewedAt: true, contactedAt: true },
      }),
      prisma.candidateProfile.findMany({ select: { createdAt: true } }),
    ])

    const vacancyIds = companyVacancies.map((v) => v.id)

    const matches = await prisma.matchResult.findMany({
      where: { vacancyId: { in: vacancyIds } },
      select: { createdAt: true },
    })

    // Contratados = derivaciones con estado HIRED
    const hiredTotal = referrals.filter((r) => r.status === 'HIRED').length
    const applications = referrals.length

    // Time-to-hire real: días entre derivación y contratación (proxy: último contacto registrado)
    const hiredReferrals = referrals.filter((r) => r.status === 'HIRED')
    const avgDaysToHire =
      hiredReferrals.length > 0
        ? Math.round(
            hiredReferrals.reduce((sum, r) => {
              const end = r.contactedAt || r.viewedAt || r.referredAt
              const days = Math.abs(new Date(end).getTime() - new Date(r.referredAt).getTime()) / 86400000
              return sum + days
            }, 0) / hiredReferrals.length
          )
        : 0

    const conversion = applications > 0 ? Math.round((hiredTotal / applications) * 100) : 0

    // Serie mensual de últimos 6 meses: candidatos derivados vs contratados
    const monthly: { month: string; candidates: number; hired: number }[] = []
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const next = new Date(d.getFullYear(), d.getMonth() + 1, 1)
      const inRange = (dt: Date | null) => dt && dt >= d && dt < next
      monthly.push({
        month: monthNames[d.getMonth()],
        candidates: referrals.filter((r) => inRange(new Date(r.referredAt))).length,
        hired: referrals.filter((r) => r.status === 'HIRED' && inRange(new Date(r.contactedAt || r.viewedAt || r.referredAt))).length,
      })
    }
    void sixMonthsAgo

    // Actividad de matches por mes (para contexto)
    const matchesThisMonth = matches.filter((m) => new Date(m.createdAt) >= new Date(now.getFullYear(), now.getMonth(), 1)).length

    return NextResponse.json({
      success: true,
      metrics: {
        timeToHire: avgDaysToHire > 0 ? `${avgDaysToHire} días` : 'Sin datos',
        timeToHireChange: avgDaysToHire > 0 ? `${hiredReferrals.length} contrataciones` : 'aún sin contrataciones',
        conversion: `${conversion}%`,
        conversionChange: 'derivadas → contratadas',
        matches: matches.length,
        matchesChange: `+${matchesThisMonth} este mes`,
        candidatesEvaluated: candidates.length,
      },
      monthly,
      totals: {
        vacancies: companyVacancies.length,
        activeVacancies: companyVacancies.filter((v) => v.status === 'ACTIVE').length,
        applications,
        hired: hiredTotal,
      },
    })
  } catch (error) {
    console.error('Error en /api/company/analytics:', error)
    return NextResponse.json({ success: false, error: 'Error al cargar las métricas' }, { status: 500 })
  }
}
