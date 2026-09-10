import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/company/referrals?userId=... — candidatos derivados reales
export async function GET(request: NextRequest) {
  try {
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
        candidate: {
          include: {
            user: { select: { name: true } },
            experience: { orderBy: { startDate: 'desc' }, take: 1 },
          },
        },
        vacancy: { select: { title: true } },
      },
    })

    const STATUS_MAP: Record<string, string> = {
      PENDING: 'Derivado',
      VIEWED: 'Visto',
      CONTACTED: 'Contactado',
      INTERVIEW: 'Entrevista',
      HIRED: 'Contratado',
      REJECTED: 'Rechazado',
    }

    return NextResponse.json({
      success: true,
      candidates: referrals.map((r) => ({
        id: r.id,
        name: r.candidate.user.name,
        role: r.vacancy.title,
        lastPosition: r.candidate.experience[0]?.position || null,
        score: Math.round(r.matchScore),
        recommendation: r.matchScore >= 85 ? 'Altamente Recomendado' : r.matchScore >= 70 ? 'Recomendado' : 'Posible',
        status: r.status,
        statusLabel: STATUS_MAP[r.status] || r.status,
        referredAt: r.referredAt,
        skills: r.candidate.skills.slice(0, 4),
      })),
    })
  } catch (error) {
    console.error('Error GET /api/company/referrals:', error)
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}
