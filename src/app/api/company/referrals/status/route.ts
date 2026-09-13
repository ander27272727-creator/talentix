import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'
import { notify } from '@/lib/notifications'

// PATCH /api/company/referrals/status — empresa actualiza el estado de una derivación
// Al marcar como VIEWED por primera vez, notifica al admin que la derivó.
export async function PATCH(request: NextRequest) {
  try {
    const auth = await requireRole(request, 'COMPANY', 'ADMIN')
    if ('error' in auth) return auth.error
    const body = await request.json()
    const { userId, referralId, status } = body

    if (!userId || !referralId || !status) {
      return NextResponse.json({ success: false, error: 'Faltan datos obligatorios' }, { status: 400 })
    }

    const allowed = ['VIEWED', 'CONTACTED', 'INTERVIEW', 'HIRED', 'REJECTED']
    if (!allowed.includes(status)) {
      return NextResponse.json({ success: false, error: 'Estado inválido' }, { status: 400 })
    }

    const company = await prisma.company.findUnique({ where: { userId }, select: { id: true, name: true } })
    if (!company) {
      return NextResponse.json({ success: false, error: 'Empresa no encontrada' }, { status: 404 })
    }

    const referral = await prisma.referral.findUnique({
      where: { id: referralId },
      include: {
        candidate: { include: { user: { select: { id: true, name: true } } } },
        vacancy: { select: { title: true } },
      },
    })
    if (!referral || referral.companyId !== company.id) {
      return NextResponse.json({ success: false, error: 'Derivación no encontrada' }, { status: 404 })
    }

    const updateData: Record<string, unknown> = { status }
    const now = new Date()
    if (status === 'VIEWED' && !referral.viewedAt) updateData.viewedAt = now
    if (status === 'CONTACTED' && !referral.contactedAt) updateData.contactedAt = now

    await prisma.referral.update({ where: { id: referralId }, data: updateData })

    // Primera vez que la empresa la ve → notificar al admin (quien derivó)
    if (status === 'VIEWED' && !referral.viewedAt) {
      const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' }, select: { id: true } })
      if (admin) {
        await notify({
          userId: admin.id,
          type: 'REFERRAL_VIEWED',
          title: `${company.name} vio un candidato derivado`,
          body: `${referral.candidate.user.name} fue revisado para el puesto de ${referral.vacancy.title}. Si avanza, coordina el contacto directo con la empresa.`,
          link: '/admin/referrals',
        })
      }
      // También avisar al candidato que su perfil fue visto
      await notify({
        userId: referral.candidate.user.id,
        type: 'REFERRAL_VIEWED',
        title: `¡${company.name} vio tu perfil!`,
        body: `Tu perfil fue revisado para el puesto de ${referral.vacancy.title}. Sigue completando evaluaciones para mantenerte en los primeros puestos.`,
        link: '/candidate',
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error en PATCH /api/company/referrals/status:', error)
    return NextResponse.json({ success: false, error: 'Error al actualizar el estado' }, { status: 500 })
  }
}
