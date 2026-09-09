import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateMatchesForCandidate } from '@/lib/matching/engine'

// POST /api/assessments/[id]/submit
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: assessmentId } = await params
    const body = await request.json()
    const { userId, answers, score, dimensionScores, totalTimeSpent } = body

    if (!userId || !answers || score === undefined) {
      return NextResponse.json({ error: 'userId, answers y score son requeridos' }, { status: 400 })
    }

    // Buscar perfil del candidato
    const profile = await prisma.candidateProfile.findUnique({
      where: { userId },
    })

    if (!profile) {
      return NextResponse.json({ error: 'Perfil de candidato no encontrado' }, { status: 404 })
    }

    // Guardar respuesta junto con sus respuestas individuales (relación anidada)
    const response = await prisma.assessmentResponse.create({
      data: {
        candidateId: profile.id,
        assessmentId,
        answers: {
          create: answers
            .filter((a: { questionId?: string }) => !!a.questionId)
            .map((a: { questionId: string; value: number | string; timeSpentSeconds: number }) => ({
              questionId: a.questionId,
              value: a.value,
              timeSpentSeconds: a.timeSpentSeconds ?? 0,
            })),
        },
        startedAt: new Date(Date.now() - (totalTimeSpent || 0) * 1000),
        completedAt: new Date(),
        score,
        dimensionScores,
        totalTimeSpent,
        isValid: true,
      },
    })

    // Regenerar matches del candidato con los nuevos datos de evaluación
    let matchesGenerated = 0
    try {
      matchesGenerated = await generateMatchesForCandidate(userId)
    } catch (matchError) {
      console.error('Error regenerando matches:', matchError)
    }

    return NextResponse.json({ success: true, response, matchesGenerated })
  } catch (error) {
    console.error('Error guardando respuesta:', error)
    return NextResponse.json({ error: 'Error del servidor al guardar respuesta' }, { status: 500 })
  }
}
