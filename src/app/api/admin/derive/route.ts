import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/admin/derive — deriva un candidato a una empresa
// Crea un Referral por cada match compatible con las vacantes ACTIVAS de esa empresa
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { candidateId, companyId } = body as { candidateId: string; companyId: string }

    if (!candidateId || !companyId) {
      return NextResponse.json({ success: false, error: 'Faltan datos' }, { status: 400 })
    }

    const candidate = await prisma.candidateProfile.findUnique({
      where: { id: candidateId },
      select: { id: true, userId: true },
    })
    if (!candidate) {
      return NextResponse.json({ success: false, error: 'Candidato no encontrado' }, { status: 404 })
    }

    const company = await prisma.company.findUnique({ where: { id: companyId }, select: { id: true, name: true } })
    if (!company) {
      return NextResponse.json({ success: false, error: 'Empresa no encontrada' }, { status: 404 })
    }

    // Matches reales del candidato con vacantes ACTIVAS de esta empresa
    const matches = await prisma.matchResult.findMany({
      where: {
        candidateId,
        vacancy: { companyId, status: 'ACTIVE' },
      },
      select: { id: true, vacancyId: true, overallMatch: true },
    })

    if (matches.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Este candidato no tiene matches compatibles con las vacantes activas de esta empresa. Verifica que la empresa tenga vacantes activas y que el candidato haya completado evaluaciones.',
      }, { status: 400 })
    }

    // Crear referrals evitando duplicados
    let created = 0
    for (const match of matches) {
      const existing = await prisma.referral.findFirst({
        where: { candidateId, companyId, vacancyId: match.vacancyId },
      })
      if (!existing) {
        await prisma.referral.create({
          data: {
            candidateId,
            companyId,
            vacancyId: match.vacancyId,
            matchScore: match.overallMatch,
            status: 'PENDING',
          },
        })
        created++
      }
    }

    return NextResponse.json({
      success: true,
      created,
      message: created > 0
        ? `Derivación creada para ${created} vacante${created !== 1 ? 's' : ''} compatible${created !== 1 ? 's' : ''}`
        : 'Este candidato ya estaba derivado a todas las vacantes compatibles',
    })
  } catch (error) {
    console.error('Error POST /api/admin/derive:', error)
    return NextResponse.json({ success: false, error: 'Error interno al derivar' }, { status: 500 })
  }
}
