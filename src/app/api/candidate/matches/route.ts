import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateMatchesForCandidate } from '@/lib/matching/engine'

// GET /api/candidate/matches?userId=xxx&regenerate=true
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const regenerate = searchParams.get('regenerate') === 'true'

    if (!userId) {
      return NextResponse.json({ error: 'userId requerido' }, { status: 400 })
    }

    // Buscar el perfil del candidato
    const profile = await prisma.candidateProfile.findUnique({
      where: { userId },
    })

    if (!profile) {
      return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 404 })
    }

    // Si no hay matches previos o se pide regeneración explícita,
    // calcular matches con datos reales (evaluaciones, experiencia, skills)
    const existingCount = await prisma.matchResult.count({ where: { candidateId: profile.id } })
    if (existingCount === 0 || regenerate) {
      try {
        await generateMatchesForCandidate(userId)
      } catch (matchError) {
        console.error('Error generando matches:', matchError)
      }
    }

    // Obtener matches del candidato con info de empresa y vacante
    const matches = await prisma.matchResult.findMany({
      where: { candidateId: profile.id },
      include: {
        vacancy: {
          include: {
            company: {
              select: { name: true, industry: true, logo: true, location: true },
            },
          },
        },
      },
      orderBy: { overallMatch: 'desc' },
    })

    return NextResponse.json({ success: true, matches })
  } catch (error) {
    console.error('Error obteniendo matches:', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
