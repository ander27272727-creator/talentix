import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'

// GET /api/notifications — notificaciones del usuario autenticado
export async function GET(request: NextRequest) {
  try {
    const auth = await requireRole(request)
    if ('error' in auth) return auth.error
    const userId = auth.user.id

    const [notifications, unread] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 30,
      }),
      prisma.notification.count({ where: { userId, readAt: null } }),
    ])

    return NextResponse.json({ success: true, notifications, unread })
  } catch (error) {
    console.error('Error en /api/notifications:', error)
    return NextResponse.json({ success: false, error: 'Error al cargar notificaciones' }, { status: 500 })
  }
}

// PATCH /api/notifications — marcar todas (o una) como leídas
export async function PATCH(request: NextRequest) {
  try {
    const auth = await requireRole(request)
    if ('error' in auth) return auth.error
    const userId = auth.user.id
    const body = await request.json().catch(() => ({}))
    const id = body?.id as string | undefined

    const where = id ? { userId, id } : { userId, readAt: null }
    await prisma.notification.updateMany({ where, data: { readAt: new Date() } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error en PATCH /api/notifications:', error)
    return NextResponse.json({ success: false, error: 'Error al actualizar' }, { status: 500 })
  }
}
