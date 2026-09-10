/**
 * Detección de trampa/inconsistencia en evaluaciones.
 * Analiza patrones que los reclutadores reales usan para detectar respuestas no confiables:
 *
 * 1. Straight-lining: todas las respuestas Likert iguales (sin variación = posible spam)
 * 2. Tiempos imposibles: responder demasiado rápido para leer la pregunta
 * 3. Inconsistencia entre pares: dimensiones medidas con preguntas directas e inversas
 *    que deberían correlacionar pero se contradicen
 * 4. Ausencia total de respuestas "neutras/medias" en tests largos (patrón de extremismo)
 */

export interface FraudFlag {
  type: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH'
  description: string
  affectedQuestions?: string[]
}

export interface FraudReport {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  flags: FraudFlag[]
  consistencyScore: number // 0-100, 100 = totalmente consistente
  recommendation: string
}

interface AnswerInput {
  questionId: string
  value: number | string
  timeSpentSeconds: number
}

interface QuestionMeta {
  dimension: string
  reverseScored: boolean
}

const MIN_READ_TIME_SECONDS = 3 // tiempo mínimo razonable para leer y responder
const STRAIGHT_LINE_THRESHOLD = 0.92 // % de respuestas idénticas que activa la alerta

export function detectFraud(
  answers: AnswerInput[],
  context: {
    totalTimeSpent: number
    questionCount: number
    questionMeta: Map<string, QuestionMeta>
  }
): FraudReport {
  const flags: FraudFlag[] = []
  const numericAnswers = answers.filter((a) => typeof a.value === 'number') as (AnswerInput & { value: number })[]
  const likertAnswers = numericAnswers.filter((a) => a.value >= 1 && a.value <= 5)

  // ===== 1. Straight-lining (todas iguales) =====
  if (likertAnswers.length >= 8) {
    const valueCounts = new Map<number, number>()
    for (const a of likertAnswers) {
      valueCounts.set(a.value, (valueCounts.get(a.value) || 0) + 1)
    }
    const maxCount = Math.max(...valueCounts.values())
    const ratio = maxCount / likertAnswers.length
    if (ratio >= STRAIGHT_LINE_THRESHOLD) {
      flags.push({
        type: 'STRAIGHT_LINING',
        severity: likertAnswers.length >= 15 ? 'HIGH' : 'MEDIUM',
        description: `El ${Math.round(ratio * 100)}% de las respuestas de escala tienen el mismo valor, sin variación. Patrón típico de respuestas al azar.`,
        affectedQuestions: likertAnswers.map((a) => a.questionId),
      })
    }
  }

  // ===== 2. Tiempos imposibles =====
  const tooFast = answers.filter((a) => a.timeSpentSeconds > 0 && a.timeSpentSeconds < MIN_READ_TIME_SECONDS)
  const fastRatio = answers.length > 0 ? tooFast.length / answers.length : 0
  if (answers.length >= 5 && fastRatio >= 0.5) {
    flags.push({
      type: 'RUSHED_ANSWERS',
      severity: fastRatio >= 0.8 ? 'HIGH' : 'MEDIUM',
      description: `${Math.round(fastRatio * 100)}% de las preguntas se respondieron en menos de ${MIN_READ_TIME_SECONDS} segundos, insuficiente para leerlas.`,
      affectedQuestions: tooFast.map((a) => a.questionId),
    })
  }

  // Tiempo total incompatible con el número de preguntas
  const minTotalTime = context.questionCount * MIN_READ_TIME_SECONDS
  if (context.questionCount >= 8 && context.totalTimeSpent > 0 && context.totalTimeSpent < minTotalTime * 0.4) {
    flags.push({
      type: 'TOTAL_TIME_TOO_SHORT',
      severity: 'MEDIUM',
      description: `Tiempo total (${Math.round(context.totalTimeSpent / 60)} min) muy bajo para ${context.questionCount} preguntas.`,
    })
  }

  // ===== 3. Inconsistencia entre pares directos/inversos =====
  const byDimension = new Map<string, { direct: number[]; reverse: number[] }>()
  for (const a of answers) {
    const meta = context.questionMeta.get(a.questionId)
    if (!meta || typeof a.value !== 'number' || a.value < 1 || a.value > 5) continue
    const entry = byDimension.get(meta.dimension) || { direct: [], reverse: [] }
    if (meta.reverseScored) entry.reverse.push(a.value)
    else entry.direct.push(a.value)
    byDimension.set(meta.dimension, entry)
  }

  let contradictions = 0
  let pairsChecked = 0
  for (const [, { direct, reverse }] of byDimension) {
    if (direct.length === 0 || reverse.length === 0) continue
    pairsChecked++
    const avgDirect = direct.reduce((s, v) => s + v, 0) / direct.length
    const avgReverseRaw = reverse.reduce((s, v) => s + v, 0) / reverse.length
    // La inversa normalizada debería ser similar a la directa (6 - v)
    const avgReverseNormalized = 6 - avgReverseRaw
    if (Math.abs(avgDirect - avgReverseNormalized) > 2.0) {
      contradictions++
    }
  }
  if (pairsChecked >= 2 && contradictions >= Math.ceil(pairsChecked / 2)) {
    flags.push({
      type: 'INCONSISTENT_PAIRS',
      severity: contradictions === pairsChecked ? 'HIGH' : 'MEDIUM',
      description: `${contradictions} de ${pairsChecked} dimensiones muestran contradicción entre preguntas directas e inversas (ej. "Soy organizado" = muy de acuerdo pero "Dejo todo para el último momento" = muy de acuerdo).`,
    })
  }

  // ===== 4. Extremismo absoluto (todo 1 o 5, nada intermedio) =====
  if (likertAnswers.length >= 12) {
    const extremes = likertAnswers.filter((a) => a.value === 1 || a.value === 5).length
    const extremeRatio = extremes / likertAnswers.length
    if (extremeRatio >= 0.95) {
      flags.push({
        type: 'EXTREME_PATTERN',
        severity: 'LOW',
        description: `El ${Math.round(extremeRatio * 100)}% de respuestas son extremas (1 o 5). Puede indicar perfil muy polarizado o respuestas poco reflexivas.`,
      })
    }
  }

  // ===== Score de consistencia y nivel de riesgo =====
  const severityWeight = { LOW: 10, MEDIUM: 25, HIGH: 45 }
  const penalty = flags.reduce((sum, f) => sum + severityWeight[f.severity], 0)
  const consistencyScore = Math.max(0, 100 - penalty)

  const riskLevel: FraudReport['riskLevel'] =
    flags.some((f) => f.severity === 'HIGH') ? 'HIGH'
    : flags.some((f) => f.severity === 'MEDIUM') ? 'MEDIUM'
    : 'LOW'

  const recommendation =
    riskLevel === 'HIGH'
      ? 'Resultado NO confiable. Se recomienda repetir la evaluación bajo supervisión o en entrevista.'
      : riskLevel === 'MEDIUM'
        ? 'Resultado con inconsistencias moderadas. Interpretar con cautela y validar en entrevista.'
        : 'Resultado consistente y confiable.'

  return { riskLevel, flags, consistencyScore, recommendation }
}
