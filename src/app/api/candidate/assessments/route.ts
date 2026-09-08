import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/candidate/assessments?userId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId requerido' }, { status: 400 })
    }

    // Buscar perfil del candidato
    const profile = await prisma.candidateProfile.findUnique({
      where: { userId },
    })

    // Obtener todas las evaluaciones activas
    const assessments = await prisma.assessment.findMany({
      where: { isActive: true },
      include: {
        questions: {
          select: { id: true },
        },
      },
      orderBy: { category: 'asc' },
    })

    // Obtener respuestas del candidato (evaluaciones completadas)
    const responses = profile
      ? await prisma.assessmentResponse.findMany({
          where: { candidateId: profile.id },
          select: {
            assessmentId: true,
            score: true,
            completedAt: true,
          },
        })
      : []

    // Mapear evaluaciones con estado
    const assessmentsWithStatus = assessments.map((a) => {
      const response = responses.find((r) => r.assessmentId === a.id)
      return {
        id: a.id,
        name: a.name,
        category: a.category,
        description: a.description,
        timeLimitMinutes: a.timeLimitMinutes,
        targetRoles: a.targetRoles,
        questionCount: a.questions.length,
        completed: !!response,
        score: response?.score || null,
        completedAt: response?.completedAt || null,
      }
    })

    return NextResponse.json({ success: true, assessments: assessmentsWithStatus })
  } catch (error) {
    console.error('Error obteniendo evaluaciones:', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
