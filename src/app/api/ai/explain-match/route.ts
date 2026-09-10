import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'
import { generateMatchExplanation, buildFallbackExplanation } from '@/lib/ai/openai'

// GET /api/ai/explain-match?matchId=... — explicación en español de un match
export async function GET(request: NextRequest) {
  try {
    const auth = await requireRole(request, 'CANDIDATE', 'COMPANY', 'ADMIN')
    if ('error' in auth) return auth.error

    const { searchParams } = new URL(request.url)
    const matchId = searchParams.get('matchId')
    if (!matchId) {
      return NextResponse.json({ success: false, error: 'Falta matchId' }, { status: 400 })
    }

    // Cache: si ya existe la explicación, devolverla
    const match = await prisma.matchResult.findUnique({
      where: { id: matchId },
      include: {
        candidate: {
          include: {
            user: { select: { name: true } },
            experience: { orderBy: { startDate: 'desc' }, take: 3 },
          },
        },
        vacancy: {
          include: { company: { select: { name: true, industry: true } } },
        },
      },
    })

    if (!match) {
      return NextResponse.json({ success: false, error: 'Match no encontrado' }, { status: 404 })
    }

    if (match.aiExplanation) {
      return NextResponse.json({ success: true, explanation: match.aiExplanation, cached: true })
    }

    const assessmentScores = (match.candidateFitBreakdown as Record<string, number>) || {}
    const companyBreakdown = (match.companyFitBreakdown as Record<string, number>) || {}

    const explanation = await generateMatchExplanation({
      candidateName: match.candidate.user.name,
      vacancyTitle: match.vacancy.title,
      companyName: match.vacancy.company.name,
      overallMatch: Math.round(match.overallMatch),
      companyFitScore: Math.round(match.companyFitScore),
      candidateFitScore: Math.round(match.candidateFitScore),
      skillsMatch: companyBreakdown.skillsMatch ?? null,
      experienceMatch: companyBreakdown.experienceMatch ?? null,
      assessmentMatch: companyBreakdown.assessmentMatch ?? null,
      candidateSkills: match.candidate.skills.slice(0, 10),
      candidateExperience: match.candidate.experience.map((e) => e.position),
      yearsExperience: undefined,
    })

    // Guardar en cache (70 días)
    const expiresAt = new Date(Date.now() + 70 * 24 * 60 * 60 * 1000)
    await prisma.matchResult.update({
      where: { id: matchId },
      data: { aiExplanation: explanation, aiExplanationExpiresAt: expiresAt },
    })

    return NextResponse.json({ success: true, explanation, cached: false })
  } catch (error) {
    console.error('Error GET /api/ai/explain-match:', error)
    return NextResponse.json({ success: false, error: 'Error generando explicación' }, { status: 500 })
  }
}

// keep buildFallbackExplanation referenced for future use when OpenAI key is absent
void buildFallbackExplanation
