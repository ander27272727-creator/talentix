import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export type Role = 'CANDIDATE' | 'COMPANY' | 'ADMIN'

export interface AuthUser {
  id: string
  role: Role
  email: string
  name: string
}

/**
 * Autenticación ligera basada en header x-user-id (enviado por el cliente desde su sesión).
 * Valida que el usuario exista y devuelve su rol real desde la BD.
 * Devuelve null si la sesión no es válida.
 */
export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  const userId = request.headers.get('x-user-id')
  if (!userId) return null

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, email: true, name: true },
  })

  return user as AuthUser | null
}

/** Requiere un rol específico; devuelve una respuesta 401/403 si falla, o el usuario si pasa. */
export async function requireRole(
  request: NextRequest,
  ...roles: Role[]
): Promise<{ user: AuthUser } | { error: NextResponse }> {
  const user = await getAuthUser(request)
  if (!user) {
    return { error: NextResponse.json({ success: false, error: 'No autenticado' }, { status: 401 }) }
  }
  if (roles.length > 0 && !roles.includes(user.role)) {
    return { error: NextResponse.json({ success: false, error: 'No autorizado' }, { status: 403 }) }
  }
  return { user }
}
