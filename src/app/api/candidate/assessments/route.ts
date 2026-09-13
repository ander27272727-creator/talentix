import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { computeRecommendedRamas } from './recommendation-engine'

// GET /api/candidate/assessments?userId=xxx
// Devuelve evaluaciones organizadas en:
//  - Revisión (ya completadas): ver resultados
//  - Prioritarias (Extraer primero según lo que el sistema va revelando):
//       - Ramas reveladas por el perfil o el Track de Carrera
//       - Habilidades exh (Skills de Education/Experience sin cubrir)
//       - Exposicion SI (assessment); evaluaciones expuestas que NO se han hecho
//  - Opcionales (complementarias, cuando se hayan cubierto las prioritarias)
//
// El objetivo: no saturar al candidato con todo el banco. Ir moendando qué evaluar
// a partir de lo que se va conociendo: rama profesional, skills del perfil, experiencia.
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId requerido' }, { status: 400 })
    }

    const entries = await computeRecommendedRamas(userId)

    // REGLA DE NEGOCIO: un candidato solo ve las evaluaciones relevantes para su rama.
    // - Track de Carrera: siempre visible hasta completarlo
    // - Genéricas (sin careerBranch): lógica, OCEAN, SJT — aplican a todos
    // - Específicas de área: SOLO las de la rama confirmada/detectada
    const BRANCH_MAP: Record<string, string> = {
      admin: 'admin',
      tech: 'tech',
      sales: 'sales',
      health: 'health',
      collections: 'collections',
      customer_service: 'customer_service',
      retail_sales: 'retail_sales',
      driver: 'driver',
      writing: 'writing',
      security: 'security',
    }
    const primaryRama = entries.revealedRamas[0]
    const primaryBranchKey = primaryRama ? BRANCH_MAP[primaryRama] : undefined
    // Si ya completó evaluaciones específicas de otra rama, esas se conservan (historial)
    const doneAssessmentIds = new Set(
      (
        await prisma.assessmentResponse.findMany({
          where: { candidateId: entries.profileId, completedAt: { not: null } },
          select: { assessmentId: true },
        })
      ).map((r) => r.assessmentId)
    )

    const assessment = await prisma.assessment.findMany({
      where: {
        isActive: true,
        OR: [
          { careerTrack: true },
          { careerBranch: null },
          ...(primaryBranchKey ? [{ careerBranch: primaryBranchKey }] : []),
        ],
      },
      include: {
        questions: { select: { id: true } },
      },
      orderBy: { category: 'asc' },
    })

    // Añadir al catálogo las evaluaciones ya completadas de otras ramas (historial,
    // aparecen en la sección Revisión aunque no sean de la rama actual)
    const missingDone = doneAssessmentIds.size > 0
      ? await prisma.assessment.findMany({
          where: { isActive: true, id: { in: Array.from(doneAssessmentIds) }, NOT: { id: { in: assessment.map((a) => a.id) } } },
          include: { questions: { select: { id: true } } },
        })
      : []
    const allCatalog = [...assessment, ...missingDone]

    const responses = await prisma.assessmentResponse.findMany({
      where: { candidateId: entries.profileId },
      select: {
        id: true,
        assessmentId: true,
        score: true,
        completedAt: true,
        isValid: true,
        fraudFlags: true,
      },
    })

    const byAssessmentId = new Map(responses.map(r => [r.assessmentId, r]))

    // ---------- evaluaciones de rama (mapeado por TRACK y SKILLS) ----------
    // careerTrackAssessment (el assessment con `careerTrack: true`) siempre va en
    // prioritarias hasta que quede completado; básicamente determina las ramas a explorar.
    const trackAssessmentId = entries.careerTrackId ?? null

    // Estados revelados/pendientes
    const revealed = entries.revealedRamas ?? []
    const exposedAssessments = entries.exposedAssessments ?? []

    const assessmentsWithStatus = allCatalog.map((a) => {
      const response = byAssessmentId.get(a.id)
      const completed = !!response && response.completedAt !== null
      const score = response?.score ?? null
      const isValid = response?.isValid ?? true
      const fraudFlags = response?.fraudFlags ?? null

      return {
        id: a.id,
        name: a.name,
        category: a.category,
        description: a.description,
        timeLimitMinutes: a.timeLimitMinutes,
        targetRoles: a.targetRoles,
        questionCount: a.questions.length,
        completed,
        score,
        completedAt: response?.completedAt ?? null,
        isValid,
        fraudFlags,
        careerTrack: a.careerTrack,
        group: '',
      }
    })

    // ---------- reordenar por grupos de prioridad ----------
    const completedIds = new Set(responses.filter(r => r.completedAt !== null).map(r => r.assessmentId))
    const ctx = {
      trackAssessmentId,
      revealedRamas: revealed,
      exposedAssessments,
      completedIds,
      skillsExposed: entries.skillsExposed ?? [],
      profileHasItems: entries.profileHasItems ?? false,
    }

    const ordered = assessmentsWithStatus
      .map(a => ({
        a,
        priority: priorityOfAssessment(a, ctx),
        group: groupLabelOf(a, ctx),
      }))
      .sort((x, y) => {
        if (x.priority.order !== y.priority.order) return x.priority.order - y.priority.order
        return 0
      })
      .map(x => ({
        ...x.a,
        group: x.group,
      }))

    return NextResponse.json({
      success: true,
      profileId: entries.profileId,
      revealedRamas: revealed,
      skillsExposed: entries.skillsExposed ?? [],
      trackAssessmentId,
      assessments: ordered,
      groups: groupList(ordered),
    })
  } catch (error) {
    console.error('Error obteniendo evaluaciones:', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}

// Prioridad de una evaluación dentro de la lista
function priorityOfAssessment(
  a: {
    id: string
    category: string
    careerTrack?: boolean
  },
  ctx: {
    trackAssessmentId: string | null
    revealedRamas: string[]
    exposedAssessments: string[]
    completedIds: Set<string>
    skillsExposed: string[]
    profileHasItems: boolean
  }
): { order: number; label: string } {
  const isCompleted = ctx.completedIds.has(a.id)
  if (isCompleted) return { order: 1, label: 'Revisión' }

  // Evaluación de rama (careerTrack) — siempre extraer primero si no está hecha
  if (a.careerTrack) return { order: 2, label: 'Rama profesional (Track de Carrera)' }

  // Evaluaciones que el perfil considera prioritarias (por rama revelada)
  if (ctx.revealedRamas.length > 0 && ctx.exposedAssessments.includes(a.id)) {
    return { order: 3, label: 'Prioritario (según rama detectada)' }
  }

  // Habilidades del perfil que aún no tienen evaluación asociada
  if (ctx.skillsExposed.length > 0 && !isCompleted) {
    return { order: 4, label: 'Según skills del perfil' }
  }

  // Resto: evaluaciones complementarias (sección opcionales)
  return { order: 5, label: 'Complementaria' }
}

// Etiqueta de grupo para la UI
function groupLabelOf(
  a: {
    id: string
    category: string
    careerTrack?: boolean
  },
  ctx: {
    trackAssessmentId: string | null
    revealedRamas: string[]
    exposedAssessments: string[]
    completedIds: Set<string>
    skillsExposed: string[]
    profileHasItems: boolean
  }
): string {
  const isCompleted = ctx.completedIds.has(a.id)
  if (isCompleted) return 'Revisión'

  if (a.careerTrack) return 'Rama profesional (Track de Carrera)'

  if (ctx.revealedRamas.length > 0 && ctx.exposedAssessments.includes(a.id)) {
    return 'Prioritario (según rama detectada)'
  }

  if (ctx.skillsExposed.length > 0) return 'Según skills del perfil'

  return 'Complementaria'
}

function groupList(assessments: { id: string; group: string }[]): { label: string; items: { id: string; group: string }[] }[] {
  const grouped: { label: string; items: { id: string; group: string }[] }[] = []
  for (const a of assessments) {
    let g = grouped.find(gg => gg.label === a.group)
    if (!g) {
      g = { label: a.group, items: [] }
      grouped.push(g)
    }
    g.items.push(a)
  }
  return grouped
}
