import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'

function startOfWeek(offsetWeeks = 0): Date {
  const d = new Date()
  const day = d.getUTCDay()
  const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1) // lunes como inicio
  d.setUTCDate(diff + offsetWeeks * 7)
  d.setUTCHours(0, 0, 0, 0)
  return d
}

type CountableModel = 'user' | 'candidateProfile' | 'matchResult' | 'referral' | 'assessmentResponse' | 'quizResult'

async function countBetween(model: CountableModel, from: Date, to: Date) {
  const anyModel = (prisma as unknown as Record<string, { count: (a: { where: { createdAt: { gte: Date; lt: Date } } }) => Promise<number> }>)[model]
  return anyModel.count({ where: { createdAt: { gte: from, lt: to } } })
}

// GET /api/admin/weekly-report — panel de métricas semanales con sugerencias automáticas
export async function GET(request: NextRequest) {
  try {
    const auth = await requireRole(request, 'ADMIN')
    if ('error' in auth) return auth.error

    const thisWeekStart = startOfWeek(0)
    const lastWeekStart = startOfWeek(-1)

    const weekOverWeek = async (model: CountableModel) => {
      const [current, previous] = await Promise.all([
        countBetween(model, thisWeekStart, new Date()),
        countBetween(model, lastWeekStart, thisWeekStart),
      ])
      const change = previous === 0 ? (current > 0 ? 100 : 0) : Math.round(((current - previous) / previous) * 100)
      return { current, previous, change }
    }

    const [newCandidates, newMatches, newReferrals, newAssessments, newQuiz] = await Promise.all([
      weekOverWeek('candidateProfile'),
      weekOverWeek('matchResult'),
      weekOverWeek('referral'),
      weekOverWeek('assessmentResponse'),
      weekOverWeek('quizResult'),
    ])

    // Totales actuales
    const [totalCompanies, totalCandidates, activeVacancies, totalReferrals, hired] = await Promise.all([
      prisma.company.count(),
      prisma.candidateProfile.count(),
      prisma.vacancy.count({ where: { status: 'ACTIVE' } }),
      prisma.referral.count(),
      prisma.referral.count({ where: { status: 'HIRED' } }),
    ])

    // Empresas por plan
    const planCounts = await prisma.company.groupBy({ by: ['plan'], _count: true })

    // ===== Sugerencias automáticas basadas en datos =====
    const suggestions: { priority: 'alta' | 'media' | 'baja'; title: string; detail: string }[] = []

    if (totalCompanies === 0) {
      suggestions.push({
        priority: 'alta',
        title: 'No hay empresas registradas',
        detail: 'Sin empresas no hay vacantes ni matches. Contacta empresas objetivo (outbound) u ofrece el plan Trial gratuito de 14 días para captar las primeras 10.',
      })
    } else if (activeVacancies === 0) {
      suggestions.push({
        priority: 'alta',
        title: 'Ninguna vacante activa',
        detail: `Hay ${totalCompanies} empresa${totalCompanies !== 1 ? 's' : ''} registrada${totalCompanies !== 1 ? 's' : ''} pero sin vacantes activas. Contáctalas para ayudarles a publicar sus primeras vacantes; el matching se activa con vacantes.`,
      })
    }

    if (newAssessments.current === 0 && totalCandidates > 0) {
      suggestions.push({
        priority: 'alta',
        title: 'Los candidatos no completan evaluaciones',
        detail: 'Promueve el quiz público (/quiz) en redes sociales y envía recordatorios por email a candidatos con evaluaciones pendientes.',
      })
    }

    if (newQuiz.current > 0 && newCandidates.current === 0) {
      suggestions.push({
        priority: 'media',
        title: 'El quiz atrae pero no convierte',
        detail: `${newQuiz.current} personas hicieron el quiz esta semana pero nadie se registró. Considera mostrar el registro más temprano o un incentivo (desbloquear evaluación premium).`,
      })
    }

    if (newReferrals.current === 0 && newMatches.previous > 0) {
      suggestions.push({
        priority: 'media',
        title: 'Hay matches pero no derivaciones',
        detail: 'El motor está generando matches pero no se están derivando candidatos a empresas. Dedica tiempo esta semana a revisar matches ≥85% y derivarlos.',
      })
    }

    const highMatches = await prisma.matchResult.count({ where: { overallMatch: { gte: 85 } } })
    if (highMatches > 0) {
      suggestions.push({
        priority: 'baja',
        title: `${highMatches} matches de alta compatibilidad esperando`,
        detail: 'Tienes matches ≥85% listos para derivar. Las derivaciones rápidas mejoran la tasa de contratación y la reputación con las empresas.',
      })
    }

    if (totalReferrals > 0 && hired === 0) {
      suggestions.push({
        priority: 'media',
        title: 'Sin contrataciones aún',
        detail: 'Ya hay derivaciones pero ninguna contratación. Haz seguimiento con las empresas receptoras para conocer bloqueos (salario, perfil, tiempo).',
      })
    }

    if (suggestions.length === 0) {
      suggestions.push({
        priority: 'baja',
        title: 'Todo en orden',
        detail: 'La plataforma muestra actividad saludable. Sigue monitoreando las métricas semana a semana y escala lo que funciona.',
      })
    }

    return NextResponse.json({
      success: true,
      week: { start: thisWeekStart, label: `Semana del ${thisWeekStart.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}` },
      weekly: {
        newCandidates,
        newMatches,
        newReferrals,
        newAssessments,
        newQuiz,
      },
      totals: {
        companies: totalCompanies,
        candidates: totalCandidates,
        activeVacancies,
        referrals: totalReferrals,
        hired,
      },
      plans: planCounts.map((p) => ({ plan: p.plan, count: p._count })),
      suggestions,
    })
  } catch (error) {
    console.error('Error GET /api/admin/weekly-report:', error)
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}
