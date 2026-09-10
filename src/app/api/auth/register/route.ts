import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSupabaseAdmin } from '@/lib/supabase'

// POST /api/auth/register — registro con Supabase Auth real
export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role, companyName, industry, companySize } = await request.json()

    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'Email, contraseña, nombre y rol son requeridos' },
        { status: 400 }
      )
    }

    if (typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Verificar si el email ya existe en nuestra BD
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email ya está registrado' },
        { status: 409 }
      )
    }

    // Validar rol permitido (ADMIN no se auto-registra)
    if (!['CANDIDATE', 'COMPANY'].includes(role)) {
      return NextResponse.json(
        { error: 'Rol no válido para registro público' },
        { status: 400 }
      )
    }

    // Crear usuario en Supabase Auth
    let supabaseUserId: string
    try {
      const supabase = getSupabaseAdmin()
      const { data, error } = await supabase.auth.admin.createUser({
        email: normalizedEmail,
        password,
        email_confirm: true, // confirmado automáticamente por ahora
        user_metadata: { name: name.trim(), role },
      })
      if (error) {
        const msg = error.message.includes('already')
          ? 'Este email ya está registrado'
          : 'No se pudo crear la cuenta de autenticación'
        return NextResponse.json({ error: msg }, { status: error.message.includes('already') ? 409 : 500 })
      }
      supabaseUserId = data.user.id
    } catch (err) {
      console.error('Supabase admin no disponible:', err)
      return NextResponse.json(
        { error: 'Servicio de autenticación no disponible. Contacta al administrador.' },
        { status: 503 }
      )
    }

    // Crear usuario en nuestra BD (passwordHash ya no se usa; Auth vive en Supabase)
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash: `supabase:${supabaseUserId}`,
        name: name.trim(),
        role: role as 'CANDIDATE' | 'COMPANY' | 'ADMIN',
      },
    })

    // Si es candidato, crear perfil
    if (role === 'CANDIDATE') {
      await prisma.candidateProfile.create({
        data: {
          userId: user.id,
          skills: [],
        },
      })
    }

    // Si es empresa, crear perfil de empresa
    let companyId: string | undefined
    if (role === 'COMPANY') {
      const company = await prisma.company.create({
        data: {
          userId: user.id,
          name: companyName || name.trim(),
          industry: industry || 'No especificada',
          size: companySize || '1-10',
          description: 'Empresa recién registrada en Talentix',
          location: 'No especificada',
          culture: [],
          benefits: [],
          plan: 'TRIAL',
        },
      })
      companyId = company.id
    }

    // Retornar usuario sin passwordHash
    const { passwordHash: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      companyId,
      message: 'Cuenta creada exitosamente',
    })
  } catch (error) {
    console.error('Error en registro:', error)
    return NextResponse.json(
      { error: 'Error del servidor al crear la cuenta' },
      { status: 500 }
    )
  }
}
