import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateMatchesForCandidate } from '@/lib/matching/engine'
import { detectFraud, FraudReport } from '@/lib/assessments/fraud-detection'

// POST /api/assessments/[id]/submit
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: assessmentId } = await params
    const body = await request.json()
    const { userId, answers, score, dimensionScores, totalTimeSpent, careerBranch } = body

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

    // Cargar dimensiones de las preguntas para la detección de trampa
    const questions = await prisma.question.findMany({
      where: { assessmentId },
      select: { id: true, dimension: true, reverseScored: true },
    })
    const questionMeta = new Map(questions.map((q) => [q.id, q]))

    // ===== Detección de trampa =====
    const fraudReport: FraudReport = detectFraud(answers, {
      totalTimeSpent: totalTimeSpent || 0,
      questionCount: questions.length,
      questionMeta,
    })

    const isValid = fraudReport.riskLevel !== 'HIGH'

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
        isValid,
        careerBranch: careerBranch || null,
        fraudFlags: fraudReport as unknown as import('@prisma/client').Prisma.InputJsonValue,
      },
    })

    // Si el Track de Carrera reveló una rama, guardarla en el perfil del candidato
    // para que el motor de recomendación y matching la usen de inmediato
    if (careerBranch && ['admin', 'tech', 'health', 'sales'].includes(careerBranch)) {
      try {
        await prisma.candidateProfile.update({
          where: { id: profile.id },
          data: { careerBranch },
        })
      } catch (branchError) {
        console.error('Error guardando rama en perfil:', branchError)
      }
    }

    // Regenerar matches del candidato con los nuevos datos de evaluación
    // (solo si la evaluación es válida; las marcadas como fraude no alimentan el matching)
    let matchesGenerated = 0
    if (isValid) {
      try {
        matchesGenerated = await generateMatchesForCandidate(userId)
      } catch (matchError) {
        console.error('Error regenerando matches:', matchError)
      }
    }

    return NextResponse.json({
      success: true,
      response,
      matchesGenerated,
      fraud: {
        riskLevel: fraudReport.riskLevel,
        flags: fraudReport.flags,
        recommendation: fraudReport.recommendation,
      },
    })
  } catch (error) {
    console.error('Error guardando respuesta:', error)
    return NextResponse.json({ error: 'Error del servidor al guardar respuesta' }, { status: 500 })
  }
}
