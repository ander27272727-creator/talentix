import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/candidate/profile?userId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId requerido' }, { status: 400 })
    }

    const profile = await prisma.candidateProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true, createdAt: true },
        },
        education: true,
        experience: true,
      },
    })

    if (!profile) {
      return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 404 })
    }

    return NextResponse.json({ success: true, profile })
  } catch (error) {
    console.error('Error obteniendo perfil:', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}

// PUT /api/candidate/profile
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, bio, location, phone, skills, linkedInUrl, portfolioUrl } = body

    if (!userId) {
      return NextResponse.json({ error: 'userId requerido' }, { status: 400 })
    }

    const profile = await prisma.candidateProfile.update({
      where: { userId },
      data: {
        bio: bio || undefined,
        location: location || undefined,
        phone: phone || undefined,
        skills: skills || undefined,
        linkedInUrl: linkedInUrl || undefined,
        portfolioUrl: portfolioUrl || undefined,
      },
      include: {
        education: true,
        experience: true,
      },
    })

    return NextResponse.json({ success: true, profile })
  } catch (error) {
    console.error('Error actualizando perfil:', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
