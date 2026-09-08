import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/assessments/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const assessment = await prisma.assessment.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!assessment) {
      return NextResponse.json({ error: 'Evaluación no encontrada' }, { status: 404 })
    }

    return NextResponse.json({ success: true, assessment })
  } catch (error) {
    console.error('Error obteniendo evaluación:', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
