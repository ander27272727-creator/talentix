import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/candidates?search=... — candidatos reales con su progreso real
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    const candidates = await prisma.candidateProfile.findMany({
      where: search
        ? { user: { name: { contains: search, mode: 'insensitive' } } }
        : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        education: { orderBy: { startDate: 'desc' } },
        experience: { orderBy: { startDate: 'desc' } },
        assessments: {
          include: { assessment: { select: { name: true, category: true } } },
        },
        matches: { select: { id: true } },
        referrals: { select: { id: true, status: true, companyId: true, vacancyId: true } },
      },
    })

    // Fechas de experiencia → años totales
    const yearsExp = (exp: { startDate: Date; endDate: Date | null; current: boolean }[]) =>
      exp.reduce((total, e) => {
        const start = new Date(e.startDate).getTime()
        const end = e.current || !e.endDate ? Date.now() : new Date(e.endDate).getTime()
        return total + Math.max(0, (end - start) / (1000 * 60 * 60 * 24 * 365))
      }, 0)

    // Completitud real del perfil
    const completion = (c: {
      bio: string | null; location: string | null; phone: string | null
      skills: string[]; cvFileName: string | null
      education: unknown[]; experience: unknown[]
    }) => {
      const fields = [
        !!(c.bio), !!(c.location), !!(c.phone),
        c.skills.length > 0, c.education.length > 0, c.experience.length > 0,
        !!c.cvFileName,
      ]
      return Math.round((fields.filter(Boolean).length / fields.length) * 100)
    }

    return NextResponse.json({
      success: true,
      candidates: candidates.map((c) => {
        const scores = c.assessments.filter((a) => a.score != null)
        const avgScore = scores.length > 0
          ? Math.round(scores.reduce((s, a) => s + (a.score || 0), 0) / scores.length)
          : null
        const byCategory: Record<string, number | null> = {}
        for (const a of c.assessments) {
          if (a.score != null) byCategory[a.assessment.category.toLowerCase()] = Math.round(a.score)
        }
        const derived = c.referrals.length > 0
        return {
          id: c.id,
          userId: c.userId,
          name: c.user.name,
          email: c.user.email,
          phone: c.phone,
          location: c.location,
          skills: c.skills.slice(0, 8),
          allSkillsCount: c.skills.length,
          bio: c.bio,
          cvFileName: c.cvFileName,
          education: c.education.map((e) => ({ degree: e.degree, field: e.field, institution: e.institution })),
          experience: c.experience.map((e) => ({ position: e.position, company: e.company, current: e.current })),
          yearsExperience: Math.floor(yearsExp(c.experience) * 10) / 10,
          languages: (c as unknown as { languages?: string[] }).languages || [],
          assessmentsCompleted: scores.length,
          assessmentsTotal: c.assessments.length,
          scoresByCategory: byCategory,
          avgScore,
          matches: c.matches.length,
          referrals: c.referrals.length,
          derived,
          profileCompletion: completion(c),
          registeredAt: c.createdAt,
        }
      }),
    })
  } catch (error) {
    console.error('Error GET /api/admin/candidates:', error)
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}
