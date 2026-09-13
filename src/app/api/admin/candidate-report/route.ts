import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'

// GET /api/admin/candidate-report?candidateId=... — datos completos para el reporte imprimible (solo ADMIN)
export async function GET(request: NextRequest) {
  try {
    const auth = await requireRole(request, 'ADMIN')
    if ('error' in auth) return auth.error
    const { searchParams } = new URL(request.url)
    const candidateId = searchParams.get('candidateId')
    if (!candidateId) {
      return NextResponse.json({ success: false, error: 'Falta el ID del candidato' }, { status: 400 })
    }

    const profile = await prisma.candidateProfile.findUnique({
      where: { id: candidateId },
      include: {
        user: { select: { name: true, email: true } },
        education: { orderBy: { startDate: 'desc' } },
        experience: { orderBy: { startDate: 'desc' } },
        assessments: {
          where: { score: { not: null } },
          include: { assessment: { select: { name: true, category: true } } },
          orderBy: { completedAt: 'desc' },
        },
      },
    })
    if (!profile) {
      return NextResponse.json({ success: false, error: 'Candidato no encontrado' }, { status: 404 })
    }

    // Completitud del perfil
    const fields = [
      !!profile.bio, !!profile.location, !!profile.phone,
      (profile.skills?.length || 0) > 0, profile.education.length > 0, profile.experience.length > 0,
      !!profile.cvFileName,
    ]
    const profileCompletion = Math.round((fields.filter(Boolean).length / fields.length) * 100)

    // Años de experiencia
    const yearsExp = profile.experience.reduce((total, e) => {
      const start = new Date(e.startDate).getTime()
      const end = e.current || !e.endDate ? Date.now() : new Date(e.endDate).getTime()
      return total + Math.max(0, (end - start) / (1000 * 60 * 60 * 24 * 365))
    }, 0)

    // Matches reales con vacantes
    const matches = await prisma.matchResult.findMany({
      where: { candidateId: profile.id },
      orderBy: { overallMatch: 'desc' },
      take: 8,
      include: {
        vacancy: {
          select: { title: true, company: { select: { name: true } } },
        },
      },
    })

    // Derivaciones
    const referrals = await prisma.referral.findMany({
      where: { candidateId: profile.id },
      orderBy: { referredAt: 'desc' },
      include: {
        vacancy: { select: { title: true } },
        company: { select: { name: true } },
      },
    })

    return NextResponse.json({
      success: true,
      candidate: {
        id: profile.id,
        name: profile.user.name,
        email: profile.user.email,
        phone: profile.phone,
        location: profile.location,
        bio: profile.bio,
        skills: profile.skills || [],
        languages: (profile as unknown as { languages?: string[] }).languages || [],
        education: profile.education.map((e) => ({
          degree: e.degree,
          field: e.field,
          institution: e.institution,
          startDate: e.startDate,
          endDate: e.endDate,
        })),
        experience: profile.experience.map((e) => ({
          position: e.position,
          company: e.company,
          startDate: e.startDate,
          endDate: e.endDate,
          current: e.current,
        })),
        yearsExperience: Math.floor(yearsExp * 10) / 10,
        profileCompletion,
        registeredAt: profile.createdAt,
      },
      assessments: profile.assessments.map((a) => ({
        name: a.assessment.name,
        category: a.assessment.category,
        score: a.score,
        completedAt: a.completedAt,
        dimensionScores: (a.dimensionScores as Record<string, number> | null) || null,
        fraudFlags: (a.fraudFlags as string[] | null) || null,
        isValid: a.isValid,
      })),
      matches: matches.map((m) => ({
        score: Math.round(m.overallMatch),
        vacancy: m.vacancy.title,
        company: m.vacancy.company.name,
        reasons: (m.companyFitBreakdown as Record<string, unknown>)?.skillsMatch
          ? [`Skills: ${Math.round(Number((m.companyFitBreakdown as Record<string, unknown>).skillsMatch))}%`, `Evaluaciones: ${Math.round(Number((m.companyFitBreakdown as Record<string, unknown>).assessmentMatch || 0))}%`, `Experiencia: ${Math.round(Number((m.companyFitBreakdown as Record<string, unknown>).experienceMatch || 0))}%`]
          : [],
      })),
      referrals: referrals.map((r) => ({
        status: r.status,
        vacancy: r.vacancy.title,
        company: r.company.name,
        referredAt: r.referredAt,
      })),
    })
  } catch (error) {
    console.error('Error GET /api/admin/candidate-report:', error)
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}
