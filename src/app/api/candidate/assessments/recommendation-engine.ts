import { prisma } from '@/lib/prisma'

// correo del admin para sanitizar los datos antes de cualquier lectura pública
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@freebuff.local'

/**
 * Compute recommended ramas, skills exposed and assessment state for a candidate.
 * This is used by /api/candidate/assessments (and later by /admin/* and matching)
 * to decide qué evaluaciones mostrar primero, en función de lo que el sistema va
 * conociendo del candidato: rama profesional, skills del perfil, experiencia, etc.
 */

export interface RecommendationResult {
  profileId: string
  profileHasItems: boolean
  revealedRamas: string[]            // ramas que se pueden inferir (admin/tech/sales/health u otras)
  skillsExposed: string[]            // skills del perfil que todavía no tienen evaluación asociada
  exposedAssessments: string[]       // evaluaciones que se recomiendan según ramas reveladas
  careerTrackId: string | null       // id de la evaluación de track de carrera (si existe)
  trackCompleted: boolean            // si el candidato ya completó el track
  educationCount: number
  experienceCount: number
  skillsCount: number
  assessmentsDone: number
  assessmentsTotal: number
}

const LINKEDIN_INDUSTRY_TO_RAMAS: Record<string, string[]> = {
  'technology': ['tech'],
  'information-technology': ['tech'],
  'software-development': ['tech'],
  'computer-networking': ['tech'],
  'health-wellness': ['health'],
  'hospital-health-care': ['health'],
  'medical-practice': ['health'],
  'hospitality-restaurants': ['health'],
  'sales-retail': ['sales'],
  'retail': ['sales'],
  'real-estate': ['sales'],
  'banking-finance': ['admin'],
  'accounting': ['admin'],
  'insurance': ['admin'],
  'human-resources': ['admin'],
  'management-consulting': ['admin'],
}

function mapIndustryToRamas(industry: string | null): string[] {
  if (!industry) return []
  const key = industry.toLowerCase().replace(/[^a-z0-9]/g, '-')
  // tries exact match
  if (LINKEDIN_INDUSTRY_TO_RAMAS[key]) return LINKEDIN_INDUSTRY_TO_RAMAS[key]
  // tries contains
  for (const [k, v] of Object.entries(LINKEDIN_INDUSTRY_TO_RAMAS)) {
    if (key.includes(k) || k.includes(key)) return v
  }
  return []
}

function mergeRamas(existing: string[], incoming: string[]): string[] {
  const set = new Set(existing)
  for (const r of incoming) set.add(r)
  // Prefer the first non-empty entry (LinkedIn > education)
  if (incoming.length > 0) {
    // move the first incoming to front if existing is empty
    if (existing.length === 0) return incoming
    return Array.from(set)
  }
  return Array.from(set)
}

/**
 * Given a candidate profile with its education/experience/skills, return
 * the list of ramas that can be revealed (ocupacional orientation hints).
 */
export function computeRecommendedRamas(userId: string): Promise<RecommendationResult> {
  return (async () => {
    const profile = await prisma.candidateProfile.findUnique({
      where: { userId },
      include: {
        user: { select: { email: true } },
        education: true,
        experience: true,
        _count: { select: { assessments: true } },
      },
    })

    if (!profile) {
      throw new Error('ProfileNotFound')
    }

    const educationCount = profile.education.length
    const experienceCount = profile.experience.length
    const skillsCount = profile.skills?.length ?? 0
    const assessmentsDone = profile._count.assessments
    const assessmentsTotal = 0 // will be filled later if needed

    // Determine revealed ramas
    let revealedRamas: string[] = []

    if (profile.user.email === ADMIN_EMAIL) {
      // admin users have no candidate meaning — sensible defaults
      revealedRamas = []
    } else {
      // LinkedIn industry hint
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true },
      })
      const industry = user?.email // placeholder — we use profile.user.email above;
      // We'll re-fetch with industry if we ever add user.industry, for now keep simple.

      // Use education field as a hint
      const educationFields = profile.education.map(e => (e.field || '').toLowerCase())
      const educationIndustries = educationFields
        .flatMap(field => {
          const mapped: string[] = []
          // crude mapping for demo purposes
          if (field.includes('admin') || field.includes('contabilidad') || field.includes('rrhh') || field.includes('gesti'))
            mapped.push('admin')
          if (field.includes('inform') || field.includes('sistem') || field.includes('desarrollo') || field.includes('software') || field.includes('redes') || field.includes('ciberseguridad'))
            mapped.push('tech')
          if (field.includes('salud') || field.includes('medicina') || field.includes('enfer') || field.includes('farmacia') || field.includes('cuidado') || field.includes('terapia'))
            mapped.push('health')
          if (field.includes('venta') || field.includes('comercio') || field.includes('negocio') || field.includes('marketing') || field.includes('comercial'))
            mapped.push('sales')
          return mapped
        })

      // Use experience position/title as hint
      const positionHints = profile.experience.flatMap(e => {
        const pos = (e.position || '').toLowerCase()
        const comp = (e.company || '').toLowerCase()
        const desc = (e.description || '').toLowerCase()
        const combined = `${pos} ${comp} ${desc}`
        const mapped: string[] = []
        if (combined.includes('admin') || combined.includes('contabilidad') || combined.includes('rrhh') || combined.includes('gesti') || combined.includes('nómina') || combined.includes('factur') || combined.includes('control') || combined.includes('presupuest'))
          mapped.push('admin')
        if (combined.includes('inform') || combined.includes('sistem') || combined.includes('desarrollo') || combined.includes('software') || combined.includes('redes') || combined.includes('soporte') || combined.includes('seguridad') || combined.includes('programaci') || combined.includes('codigo') || combined.includes('back') || combined.includes('front'))
          mapped.push('tech')
        if (combined.includes('salud') || combined.includes('medicina') || combined.includes('enfer') || combined.includes('farmacia') || combined.includes('cuidado') || combined.includes('paciente') || combined.includes('terapia') || combined.includes('hospital'))
          mapped.push('health')
        if (combined.includes('venta') || combined.includes('comercio') || combined.includes('retail') || combined.includes('comercial') || combined.includes('client') || combined.includes('negocio') || combined.includes('market'))
          mapped.push('sales')
        return mapped
      })

      // Use skills hint
      const skillHints = (profile.skills || []).flatMap(s => {
        const sk = (s || '').toLowerCase()
        const mapped: string[] = []
        if (sk.includes('admin') || sk.includes('contabilidad') || sk.includes('rrhh') || sk.includes('gestión') || sk.includes('nómina') || sk.includes('factur'))
          mapped.push('admin')
        if (sk.includes('inform') || sk.includes('sistem') || sk.includes('desarrollo') || sk.includes('software') || sk.includes('red') || sk.includes('soporte') || sk.includes('seguridad') || sk.includes('program') || sk.includes('front') || sk.includes('back') || sk.includes('base de datos') || sk.includes('redes'))
          mapped.push('tech')
        if (sk.includes('salud') || sk.includes('medicina') || sk.includes('enfermer') || sk.includes('farmacia') || sk.includes('cuidado') || sk.includes('paciente') || sk.includes('terapia') || sk.includes('hospital'))
          mapped.push('health')
        if (sk.includes('venta') || sk.includes('comercio') || sk.includes('retail') || sk.includes('comercial') || sk.includes('cliente') || sk.includes('negocio') || sk.includes('market') || sk.includes('prospección') || sk.includes('cierre'))
          mapped.push('sales')
        return mapped
      })

      revealedRamas = Array.from(new Set([
        // La rama confirmada por el Track de Carrera tiene la máxima prioridad
        ...(profile.careerBranch ? [profile.careerBranch] : []),
        ...educationIndustries,
        ...positionHints,
        ...skillHints,
      ]))
    }

    // Compute exposed assessments (evaluations that are recommended based on revealed ramas)
    const exposedAssessments = computeExposedAssessments(revealedRamas)

    // Determine careerTrack assessment id (find assessment with careerTrack=true)
    let careerTrackId: string | null = null
    let trackCompleted = false
    try {
      const track = await prisma.assessment.findFirst({
        where: { careerTrack: true, isActive: true },
        select: { id: true },
      })
      if (track) {
        careerTrackId = track.id
        // check completion
        const response = await prisma.assessmentResponse.findFirst({
          where: {
            candidateId: profile.id,
            assessmentId: track.id,
            completedAt: { not: null },
          },
          select: { id: true },
        })
        trackCompleted = !!response
      }
    } catch {
      // ignore
    }

    // Skills exposed: skills that don't yet have an assessment
    const skillsExposed = profile.skills ? profile.skills.filter(s => !skillsHaveAssessment(s)) : []

    const result: RecommendationResult = {
      profileId: profile.id,
      profileHasItems: educationCount > 0 || experienceCount > 0 || skillsCount > 0,
      revealedRamas,
      skillsExposed,
      exposedAssessments,
      careerTrackId: careerTrackId || null,
      trackCompleted,
      educationCount,
      experienceCount,
      skillsCount,
      assessmentsDone,
      assessmentsTotal,
    }

    return result
  })()
}

/**
 * Determine which assessments are exposed (recommended) given a list of ramas.
 * This can be customized based on platform catalog; for now returns a static mapping.
 */
function computeExposedAssessments(revealedRamas: string[]): string[] {
  // Evaluaciones del catálogo real (seed_evaluations.ts) relevantes por rama
  const ramaToAssessments: Record<string, string[]> = {
    admin: ['assess_cog_logic', 'assess_behav_sjt'],
    tech: ['assess_cog_logic', 'assess_tech_dev'],
    health: ['assess_psych_personality', 'assess_behav_sjt'],
    sales: ['assess_psych_personality', 'assess_behav_sjt'],
  }
  const exposed = new Set<string>()
  for (const rama of revealedRamas) {
    const asses = ramaToAssessments[rama]
    if (asses) for (const a of asses) exposed.add(a)
  }
  return Array.from(exposed)
}

/**
 * Check whether a skill (by keyword) already has an associated assessment.
 * For demo, returns false for all; in future we can check skill -> assessment mapping.
 */
function skillsHaveAssessment(skill: string): boolean {
  // For now return false; implement mapping later
  return false
}
