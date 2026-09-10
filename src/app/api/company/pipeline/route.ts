import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'

// GET /api/company/pipeline?userId=... — funnel real de la empresa (solo COMPANY)
export async function GET(request: NextRequest) {
  try {
    const auth = await requireRole(request, 'COMPANY', 'ADMIN')
    if ('error' in auth) return auth.error
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Falta el ID de usuario' }, { status: 400 })
    }

    const company = await prisma.company.findUnique({ where: { userId }, select: { id: true } })
    if (!company) {
      return NextResponse.json({ success: false, error: 'Empresa no encontrada' }, { status: 404 })
    }

    const referrals = await prisma.referral.findMany({
      where: { companyId: company.id },
      orderBy: { referredAt: 'desc' },
      include: {
        candidate: { include: { user: { select: { name: true } } } },
      },
    })

    const STAGES = ['PENDING', 'VIEWED', 'CONTACTED', 'INTERVIEW', 'HIRED', 'REJECTED'] as const
    const STAGE_LABELS: Record<string, string> = {
      PENDING: 'Derivados',
      VIEWED: 'Revisados',
      CONTACTED: 'Contactados',
      INTERVIEW: 'Entrevista',
      HIRED: 'Contratado',
      REJECTED: 'Descartados',
    }
    const STAGE_COLORS: Record<string, string> = {
      PENDING: 'bg-blue-500',
      VIEWED: 'bg-amber-500',
      CONTACTED: 'bg-purple-500',
      INTERVIEW: 'bg-indigo-500',
      HIRED: 'bg-emerald-500',
      REJECTED: 'bg-red-500',
    }

    const pipeline = STAGES.map((stage) => {
      const items = referrals.filter((r) => r.status === stage)
      return {
        stage,
        label: STAGE_LABELS[stage],
        color: STAGE_COLORS[stage],
        count: items.length,
        candidates: items.slice(0, 6).map((r) => ({
          id: r.id,
          name: r.candidate.user.name,
          score: Math.round(r.matchScore),
        })),
      }
    })

    return NextResponse.json({
      success: true,
      total: referrals.length,
      pipeline: pipeline.filter((p) => p.stage !== 'REJECTED' || p.count > 0),
    })
  } catch (error) {
    console.error('Error GET /api/company/pipeline:', error)
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}
