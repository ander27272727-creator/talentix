import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'

// GET /api/admin/directory — todos los usuarios de la plataforma (solo ADMIN)
export async function GET(request: NextRequest) {
  try {
    const auth = await requireRole(request, 'ADMIN')
    if ('error' in auth) return auth.error

    const users = await prisma.user.findMany({
      where: { id: { not: auth.user.id } },
      select: { id: true, name: true, role: true, email: true },
      orderBy: [{ role: 'asc' }, { name: 'asc' }],
    })

    return NextResponse.json({ success: true, users })
  } catch (error) {
    console.error('Error GET /api/admin/directory:', error)
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}
