import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'
import { notify } from '@/lib/notifications'

// POST /api/admin/contract-check — revisa contratos que vencen en ≤7 días y notifica (idempotente por día)
export async function POST(request: NextRequest) {
  try {
    const auth = await requireRole(request, 'ADMIN')
    if ('error' in auth) return auth.error

    const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' }, select: { id: true } })
    if (!admin) return NextResponse.json({ success: true, alerts: 0 })

    const in7Days = new Date()
    in7Days.setDate(in7Days.getDate() + 7)
    const now = new Date()

    const expiring = await prisma.company.findMany({
      where: {
        plan: { notIn: ['TRIAL'] },
        planExpiresAt: { not: null, gte: now, lte: in7Days },
      },
      select: { id: true, name: true, plan: true, planExpiresAt: true },
    })

    // Idempotencia: no repetir la misma alerta el mismo día
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    let created = 0
    for (const c of expiring) {
      const title = `Contrato de ${c.name} vence pronto`
      const exists = await prisma.notification.findFirst({
        where: { userId: admin.id, title, createdAt: { gte: startOfDay } },
      })
      if (exists) continue
      await notify({
        userId: admin.id,
        type: 'CONTRACT_EXPIRING',
        title,
        body: `El plan ${c.plan} vence el ${new Date(c.planExpiresAt!).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}. Contacta a la empresa para renovar.`,
        link: '/admin/companies',
      })
      created++
    }

    return NextResponse.json({ success: true, alerts: created })
  } catch (error) {
    console.error('Error en /api/admin/contract-check:', error)
    return NextResponse.json({ success: false, error: 'Error al verificar contratos' }, { status: 500 })
  }
}
