import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'
import { notify } from '@/lib/notifications'

// GET /api/company/interviews?userId=... — entrevistas de la empresa
export async function GET(request: NextRequest) {
  try {
    const auth = await requireRole(request, 'COMPANY', 'ADMIN')
    if ('error' in auth) return auth.error
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Falta el ID de usuario' }, { status: 400 })
    }

    const company = await prisma.company.findUnique({ where: { userId }, select: { id: true, name: true } })
    if (!company) {
      return NextResponse.json({ success: false, error: 'Empresa no encontrada' }, { status: 404 })
    }

    const interviews = await prisma.interview.findMany({
      where: { companyId: company.id },
      orderBy: { scheduledAt: 'asc' },
    })

    // Resolver referidos, candidatos y vacantes manualmente (sin relación Prisma)
    const referralIds = Array.from(new Set(interviews.map((i) => i.referralId)))
    const referrals = await prisma.referral.findMany({
      where: { id: { in: referralIds } },
      include: {
        candidate: { include: { user: { select: { name: true, email: true } } } },
        vacancy: { select: { title: true } },
      },
    })
    const referralMap = new Map(referrals.map((r) => [r.id, r]))

    return NextResponse.json({
      success: true,
      interviews: interviews.map((i) => {
        const r = referralMap.get(i.referralId)
        return {
          id: i.id,
          scheduledAt: i.scheduledAt,
          durationMin: i.durationMin,
          mode: i.mode,
          notes: i.notes,
          status: i.status,
          candidate: r?.candidate.user.name || 'Candidato',
          candidateEmail: r?.candidate.user.email || '',
          vacancy: r?.vacancy.title || 'Vacante',
        }
      }),
    })
  } catch (error) {
    console.error('Error en GET /api/company/interviews:', error)
    return NextResponse.json({ success: false, error: 'Error al cargar entrevistas' }, { status: 500 })
  }
}

// POST /api/company/interviews — agendar entrevista sobre una derivación
export async function POST(request: NextRequest) {
  try {
    const auth = await requireRole(request, 'COMPANY', 'ADMIN')
    if ('error' in auth) return auth.error
    const body = await request.json()
    const { userId, referralId, scheduledAt, mode, durationMin, notes } = body

    if (!userId || !referralId || !scheduledAt) {
      return NextResponse.json({ success: false, error: 'Faltan datos obligatorios' }, { status: 400 })
    }

    const company = await prisma.company.findUnique({ where: { userId }, select: { id: true, name: true } })
    if (!company) {
      return NextResponse.json({ success: false, error: 'Empresa no encontrada' }, { status: 404 })
    }

    const referral = await prisma.referral.findUnique({
      where: { id: referralId },
      include: {
        candidate: { include: { user: { select: { id: true, name: true, email: true } } } },
        vacancy: { select: { title: true } },
      },
    })
    if (!referral || referral.companyId !== company.id) {
      return NextResponse.json({ success: false, error: 'Derivación no encontrada' }, { status: 404 })
    }

    const when = new Date(scheduledAt)
    if (isNaN(when.getTime())) {
      return NextResponse.json({ success: false, error: 'Fecha inválida' }, { status: 400 })
    }

    const interview = await prisma.interview.upsert({
      where: { referralId },
      update: { scheduledAt: when, mode: mode || 'VIDEO', durationMin: Number(durationMin) || 45, notes: notes || null, status: 'SCHEDULED' },
      create: {
        referralId,
        companyId: company.id,
        candidateId: referral.candidateId,
        scheduledAt: when,
        mode: mode || 'VIDEO',
        durationMin: Number(durationMin) || 45,
        notes: notes || null,
      },
    })

    // El pipeline avanza a INTERVIEW automáticamente
    await prisma.referral.update({ where: { id: referralId }, data: { status: 'INTERVIEW' } })

    // Notificar al candidato (in-app + email + WhatsApp si tiene teléfono)
    await notify({
      userId: referral.candidate.user.id,
      type: 'INTERVIEW_SCHEDULED',
      title: `¡Entrevista agendada con ${company.name}!`,
      body: `Para el puesto de ${referral.vacancy.title}, el ${when.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })} a las ${when.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} (${mode === 'PHONE' ? 'teléfono' : mode === 'ONSITE' ? 'presencial' : 'videollamada'}).`,
      link: '/candidate',
    })

    return NextResponse.json({ success: true, interview })
  } catch (error) {
    console.error('Error en POST /api/company/interviews:', error)
    return NextResponse.json({ success: false, error: 'Error al agendar la entrevista' }, { status: 500 })
  }
}
