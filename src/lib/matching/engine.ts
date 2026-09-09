import { prisma } from '@/lib/prisma'
import { calculateMatch, type CandidateProfile, type Vacancy, type CompanyProfile, type Experience, type Education } from './algorithm'

/**
 * Motor de matching real: toma datos de Supabase (evaluaciones completadas,
 * experiencia, educación, skills) y vacantes activas, ejecuta el algoritmo
 * y persiste los resultados en MatchResult.
 */

// Nivel educativo según el grado (para el algoritmo: 1=secundaria ... 5=doctorado)
function educationLevel(degree: string): number {
  const d = (degree || '').toLowerCase()
  if (d.includes('doctor') || d.includes('phd')) return 5
  if (d.includes('maestr') || d.includes('master') || d.includes('msc')) return 4
  if (d.includes('universit') || d.includes('licenci') || d.includes('ingenier') || d.includes('bachelor') || d.includes('grado')) return 3
  if (d.includes('técnic') || d.includes('tecnolog') || d.includes('asociad') || d.includes('associate')) return 2
  if (d.includes('secundaria') || d.includes('bachiller') || d.includes('high school')) return 1
  return 2 // default: técnico
}

function yearsBetween(start: Date, end?: Date | null, current?: boolean): number {
  const endDate = end || (current ? new Date() : start)
  const years = (endDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
  return Math.max(0, Math.round(years * 10) / 10)
}

// Convierte una experiencia de la BD al formato del algoritmo
function toAlgExperience(exp: { company: string; position: string; description: string; startDate: Date; endDate: Date | null; current: boolean; skills: string[] }): Experience {
  return {
    company: exp.company,
    position: exp.position,
    years: yearsBetween(new Date(exp.startDate), exp.endDate ? new Date(exp.endDate) : null, exp.current),
    skills: exp.skills || [],
  }
}

/**
 * Obtiene las puntuaciones de evaluaciones del candidato, mapeadas a las
 * dimensiones que entiende el algoritmo (psychometric, cognitive, behavioral, technical).
 */
async function getAssessmentScores(candidateProfileId: string): Promise<Record<string, number>> {
  const responses = await prisma.assessmentResponse.findMany({
    where: {
      candidateId: candidateProfileId,
      completedAt: { not: null },
    },
    orderBy: { completedAt: 'desc' },
  })

  const scores: Record<string, number> = {}
  const CATEGORY_TO_DIM: Record<string, string> = {
    PSYCHOMETRIC: 'psychometric',
    COGNITIVE: 'cognitive',
    BEHAVIORAL: 'behavioral',
    TECHNICAL: 'technical',
  }

  for (const r of responses) {
    const assessment = await prisma.assessment.findUnique({ where: { id: r.assessmentId } })
    if (!assessment) continue
    const dim = CATEGORY_TO_DIM[assessment.category]
    if (!dim) continue
    // Queda el score más reciente por dimensión
    if (scores[dim] === undefined && r.score !== null) {
      scores[dim] = r.score
    }
  }

  return scores
}

/**
 * Genera (o regenera) los matches de un candidato contra todas las vacantes ACTIVAS.
 * Usa evaluaciones reales, experiencia, educación, skills y preferencias del candidato.
 * Devuelve la cantidad de matches creados/actualizados.
 */
export async function generateMatchesForCandidate(userId: string): Promise<number> {
  const profile = await prisma.candidateProfile.findUnique({
    where: { userId },
    include: {
      education: true,
      experience: true,
      user: { select: { id: true, name: true } },
    },
  })
  if (!profile) return 0

  // 1. Scores de evaluaciones reales
  const assessmentScores = await getAssessmentScores(profile.id)

  // 2. Perfil compatible con el algoritmo
  const algCandidate: CandidateProfile = {
    id: profile.id,
    skills: profile.skills || [],
    experience: profile.experience.map(toAlgExperience),
    education: profile.education.map((e) => ({
      degree: e.degree,
      field: e.field,
      level: educationLevel(e.degree),
    })),
    assessmentScores,
    location: profile.location || '',
    workPreference: 'REMOTE', // se recalcula abajo con preferencias reales
    age: undefined,
    languages: [],
  }

  // 3. Vacantes activas con sus empresas
  const vacancies = await prisma.vacancy.findMany({
    where: { status: 'ACTIVE' },
    include: {
      company: true,
    },
  })

  if (vacancies.length === 0) return 0

  let created = 0
  for (const v of vacancies) {
    const assessmentConfig = (v.assessmentConfig as Record<string, unknown> | null) || {}
    const vacancyType = (v.type as 'REMOTE' | 'HYBRID' | 'ONSITE') || 'ONSITE'

    // Preferencia de trabajo del candidato (guardada en el perfil del usuario)
    const rawPref = (assessmentConfig.workPreference as string) || ''
    const candidateWorkPref = (['REMOTE', 'HYBRID', 'ONSITE'].includes(rawPref) ? rawPref : 'REMOTE') as 'REMOTE' | 'HYBRID' | 'ONSITE'

    const algVacancy: Vacancy = {
      id: v.id,
      title: v.title,
      category: v.category,
      requiredSkills: (assessmentConfig.requiredSkills as string[]) || v.requirements || [],
      preferredSkills: (assessmentConfig.preferredSkills as string[]) || [],
      minExperience: (assessmentConfig.minExperience as number) || 0,
      minEducation: (assessmentConfig.minEducation as number) || 1,
      salaryRange: {
        min: v.salaryMin ? Number(v.salaryMin) : 0,
        max: v.salaryMax ? Number(v.salaryMax) : 0,
      },
      location: v.location,
      type: vacancyType,
      assessmentWeights: (assessmentConfig.weights as Record<string, number>) || {},
      companyId: v.companyId,
    }

    const algCompany: CompanyProfile = {
      id: v.company.id,
      name: v.company.name,
      industry: v.company.industry,
      culture: v.company.culture || [],
      size: v.company.size,
      benefits: v.company.benefits || [],
      growthRate: 50,
    }

    // Asignar la preferencia real al candidato antes de calcular
    algCandidate.workPreference = candidateWorkPref

    const result = calculateMatch(algCandidate, algVacancy, algCompany)

    await prisma.matchResult.upsert({
      where: { candidateId_vacancyId: { candidateId: profile.id, vacancyId: v.id } },
      create: {
        candidateId: profile.id,
        vacancyId: v.id,
        companyId: v.companyId,
        companyFitScore: result.companyFitScore,
        companyFitBreakdown: result.companyFitBreakdown,
        candidateFitScore: result.candidateFitScore,
        candidateFitBreakdown: result.candidateFitBreakdown,
        overallMatch: result.overallMatch,
        recommendation: result.recommendation,
      },
      update: {
        companyFitScore: result.companyFitScore,
        companyFitBreakdown: result.companyFitBreakdown,
        candidateFitScore: result.candidateFitScore,
        candidateFitBreakdown: result.candidateFitBreakdown,
        overallMatch: result.overallMatch,
        recommendation: result.recommendation,
      },
    })
    created++
  }

  return created
}
