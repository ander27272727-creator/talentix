import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/referrals — todas las derivaciones reales + métricas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    const referrals = await prisma.referral.findMany({
      where: search
        ? {
            OR: [
              { candidate: { user: { name: { contains: search, mode: 'insensitive' } } } },
              { company: { name: { contains: search, mode: 'insensitive' } } },
              { vacancy: { title: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : undefined,
      orderBy: { referredAt: 'desc' },
      include: {
        candidate: { include: { user: { select: { name: true } } } },
        company: { select: { name: true } },
        vacancy: { select: { title: true } },
      },
    })

    const statusCounts = await prisma.referral.groupBy({ by: ['status'], _count: true })
    const countBy = (s: string) => statusCounts.find((sc) => sc.status === s)?._count || 0
    const total = statusCounts.reduce((sum, sc) => sum + sc._count, 0)
    const inProcess = countBy('VIEWED') + countBy('CONTACTED') + countBy('INTERVIEW')

    return NextResponse.json({
      success: true,
      stats: {
        total,
        pending: countBy('PENDING'),
        inProcess,
        hired: countBy('HIRED'),
        rejected: countBy('REJECTED'),
      },
      referrals: referrals.map((r) => ({
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
    console.error('Error GET /api/admin/referrals:', error)
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}
