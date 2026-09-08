import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/auth/register
export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role, companyName, industry, companySize } = await request.json()

    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'Email, contraseña, nombre y rol son requeridos' },
        { status: 400 }
      )
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email ya está registrado' },
        { status: 409 }
      )
    }

    // Crear hash simple de contraseña (en producción usar bcrypt)
    const passwordHash = password

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        passwordHash,
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
    if (role === 'COMPANY') {
      await prisma.company.create({
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
    }

    // Retornar usuario sin passwordHash
    const { passwordHash: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
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
