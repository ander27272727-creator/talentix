import OpenAI from 'openai'

const apiKey = process.env.OPENAI_API_KEY || ''

let client: OpenAI | null = null
function getClient(): OpenAI | null {
  if (!apiKey) return null
  if (!client) client = new OpenAI({ apiKey })
  return client
}

interface MatchExplanationInput {
  candidateName: string
  vacancyTitle: string
  companyName: string
  overallMatch: number
  companyFitScore: number
  candidateFitScore: number
  skillsMatch: number | null
  experienceMatch: number | null
  assessmentMatch: number | null
  candidateSkills: string[]
  candidateExperience: string[]
  yearsExperience?: number
}

/**
 * Genera una explicación en español (máx 120 palabras) de por qué el match existe.
 * Si no hay OPENAI_API_KEY configurada, devuelve un fallback determinista basado en los datos.
 */
export async function generateMatchExplanation(input: MatchExplanationInput): Promise<string> {
  const openai = getClient()
  if (!openai) {
    return buildFallbackExplanation(input)
  }

  try {
    const res = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 220,
      temperature: 0.4,
      messages: [
        {
          role: 'system',
          content:
            'Eres un asesor de reclutamiento de Talentix. Explicas matches candidato-vacante en español claro, concreto y profesional, máximo 120 palabras. No inventes datos que no estén en la información proporcionada. Estructura: 1) por qué es buen match, 2) fortaleza principal, 3) qué validar en entrevista.',
        },
        {
          role: 'user',
          content: JSON.stringify({
            candidato: input.candidateName,
            vacante: input.vacancyTitle,
            empresa: input.companyName,
            match_general: `${input.overallMatch}%`,
            fit_empresa: `${input.companyFitScore}%`,
            fit_candidato: `${input.candidateFitScore}%`,
            match_skills: input.skillsMatch != null ? `${Math.round(input.skillsMatch)}%` : 'sin datos',
            match_experiencia: input.experienceMatch != null ? `${Math.round(input.experienceMatch)}%` : 'sin datos',
            match_evaluaciones: input.assessmentMatch != null ? `${Math.round(input.assessmentMatch)}%` : 'sin datos',
            skills_candidato: input.candidateSkills,
            experiencia_candidato: input.candidateExperience,
            años_experiencia: input.yearsExperience,
          }),
        },
      ],
    })
    return res.choices[0]?.message?.content?.trim() || buildFallbackExplanation(input)
  } catch (error) {
    console.error('OpenAI error, usando fallback:', error)
    return buildFallbackExplanation(input)
  }
}

/** Explicación determinista cuando no hay API key o falla la llamada. */
export function buildFallbackExplanation(input: MatchExplanationInput): string {
  const parts: string[] = []
  parts.push(
    `Con compatibilidad del ${input.overallMatch}%, ${input.candidateName} encaja con la vacante "${input.vacancyTitle}" de ${input.companyName}.`
  )
  const strengths: string[] = []
  if (input.skillsMatch != null && input.skillsMatch >= 70) strengths.push('sus habilidades cubren los requisitos clave')
  if (input.experienceMatch != null && input.experienceMatch >= 70) strengths.push('su experiencia se alinea con el nivel del puesto')
  if (input.assessmentMatch != null && input.assessmentMatch >= 70) strengths.push('sus evaluaciones cognitivas y psicométricas son sólidas para este rol')
  parts.push(strengths.length > 0 ? `Destaca que ${strengths.join(', ')}.` : 'El match se basa principalmente en el perfil general y las preferencias de ambas partes.')
  parts.push('En entrevista, valida los puntos más débiles del desglose y confirma expectativas salariales y de crecimiento.')
  return parts.join(' ')
}
