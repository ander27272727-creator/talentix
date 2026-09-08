import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/candidate/matches?userId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

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
