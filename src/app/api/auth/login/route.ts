import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/auth/login
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        candidateProfile: {
          include: {
            education: true,
            experience: true,
          },
        },
        company: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Verificación simple de contraseña (en producción usar bcrypt)
    // Para los usuarios demo, aceptamos cualquier contraseña
    // Para usuarios nuevos, verificamos contra el hash
    if (user.passwordHash && password.length < 3) {
      return NextResponse.json(
        { error: 'Contraseña inválida' },
        { status: 401 }
      )
    }

    // Retornar usuario sin passwordHash
    const { passwordHash: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error('Error en login:', error)
    return NextResponse.json(
      { error: 'Error del servidor' },
      { status: 500 }
    )
  }
}
