import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Número de preguntas que se presentan al candidato por evaluación
const QUESTIONS_PER_SESSION = 10

// GET /api/assessments/[id] — devuelve un muestreo aleatorio del pool de preguntas
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const assessment = await prisma.assessment.findUnique({
      where: { id },
    })

    if (!assessment) {
      return NextResponse.json({ error: 'Evaluación no encontrada' }, { status: 404 })
    }

    const allQuestions = await prisma.question.findMany({
      where: { assessmentId: id },
      orderBy: { order: 'asc' },
    })

    if (allQuestions.length === 0) {
      return NextResponse.json({ success: true, assessment: { ...assessment, questions: [] } })
    }

    // Para el Track de Carrera se respeta el flujo adaptativo:
    // orientación (careerBranch = null) + TODAS las preguntas de la rama revelada.
    if (assessment.careerTrack) {
      const orientation = allQuestions.filter((q) => q.careerBranch == null)
      // Muestreo aleatorio de orientación: máximo 4
      const sampledOrientation = orientation.sort(() => Math.random() - 0.5).slice(0, 4)
      return NextResponse.json({
        success: true,
        assessment: { ...assessment, questions: sampledOrientation },
        branchPoolSize: allQuestions.filter((q) => q.careerBranch != null).length / 4,
      })
    }

    // Muestreo aleatorio estándar: barajar y tomar N preguntas
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5)
    const sampled = shuffled.slice(0, Math.min(QUESTIONS_PER_SESSION, allQuestions.length))

    return NextResponse.json({ success: true, assessment: { ...assessment, questions: sampled } })
  } catch (error) {
    console.error('Error obteniendo evaluación:', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
