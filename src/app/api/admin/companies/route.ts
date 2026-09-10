import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'

// GET /api/admin/companies — lista real de empresas con conteos (solo ADMIN)
export async function GET(request: NextRequest) {
  try {
    const auth = await requireRole(request, 'ADMIN')
    if ('error' in auth) return auth.error
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    const where: Record<string, unknown> = {}
    if (search) {
      where.name = { contains: search, mode: 'insensitive' }
    }

    const companies = await prisma.company.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { vacancies: true, referrals: true },
        },
      },
    })

    const PLAN_LABELS: Record<string, string> = {
      TRIAL: 'Trial',
      STARTER: 'Starter',
      PROFESSIONAL: 'Professional',
      ENTERPRISE: 'Enterprise',
      CUSTOM: 'Personalizado',
    }

    return NextResponse.json({
      success: true,
      companies: companies.map((c) => ({
        id: c.id,
        name: c.name,
        industry: c.industry,
        size: c.size,
        plan: PLAN_LABELS[c.plan] || c.plan,
        planRaw: c.plan,
        vacancies: c._count.vacancies,
        candidates: c._count.referrals,
        location: c.location,
        createdAt: c.createdAt,
      })),
    })
  } catch (error) {
    console.error('Error GET /api/admin/companies:', error)
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}
