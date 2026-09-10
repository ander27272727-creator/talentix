import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSupabaseAdmin } from '@/lib/supabase'

// POST /api/auth/login — login real con Supabase Auth
// Verifica credenciales contra Supabase Auth (service role) y devuelve el usuario de nuestra BD.
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Verificar credenciales contra Supabase Auth
    const supabase = getSupabaseAdmin()
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    })

    if (authError || !authData.user) {
      // No revelar si el usuario existe o no
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // Buscar usuario en nuestra BD
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
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
        { error: 'Usuario no encontrado en la plataforma' },
        { status: 404 }
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
