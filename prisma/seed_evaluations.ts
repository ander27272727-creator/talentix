import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🗑  Eliminando evaluaciones antiguas...')
  await prisma.question.deleteMany()
  await prisma.assessment.deleteMany()

  console.log('✅ Creando evaluaciones...')

  // ============================
  // 1. RAZONAMIENTO LÓGICO (12 preguntas)
  // ============================
  const cog = await prisma.assessment.create({
    data: {
      id: 'assess_cog_logic',
      name: 'Razonamiento Lógico',
      category: 'COGNITIVE',
      description: 'Evalúa tu capacidad para resolver problemas abstractos, detectar patrones, razonar deductivamente y pensar críticamente. Mide habilidades fundamentales para roles que requieren análisis, planificación y solución de problemas complejos.',
      timeLimitMinutes: 12,
      targetRoles: ['technology', 'operations', 'product', 'analyst'],
      isActive: true,
    },
  })

  const cogQuestions = [
    // === PATTERN RECOGNITION (4 preguntas) ===
    {
      questionId: 'q_cog_01', order: 1, type: 'MULTIPLE_CHOICE', dimension: 'pattern_recognition',
      text: '¿Cuál número continúa la secuencia? 1, 4, 9, 16, 25, ...',
      options: JSON.stringify([
        { text: '28', value: 0 },
        { text: '30', value: 0 },
        { text: '36', value: 1 },
        { text: '49', value: 0 },
      ]),
      subDimension: 'numerical_sequences',
      reverseScored: false,
    },
    {
      questionId: 'q_cog_02', order: 2, type: 'MULTIPLE_CHOICE', dimension: 'pattern_recognition',
      text: '¿Qué letra sigue en: A, C, E, G, I, ...?',
      options: JSON.stringify([
        { text: 'J', value: 0 },
        { text: 'H', value: 0 },
        { text: 'K', value: 0 },
        { text: 'L', value: 1 },
      ]),
      subDimension: 'alphabet_sequences',
      reverseScored: false,
    },
    {
      questionId: 'q_cog_03', order: 3, type: 'MULTIPLE_CHOICE', dimension: 'pattern_recognition',
      text: '¿Cuál es la regla de la secuencia: 2, 6, 12, 20, 30, ...?',
      options: JSON.stringify([
        { text: 'n² + n', value: 1 },
        { text: '2n', value: 0 },
        { text: 'n × 2', value: 0 },
        { text: 'n²', value: 0 },
      ]),
      subDimension: 'rule_finding',
      reverseScored: false,
    },
    {
      questionId: 'q_cog_04', order: 4, type: 'MULTIPLE_CHOICE', dimension: 'pattern_recognition',
      text: 'Completa la serie: 1, 1, 2, 3, 5, 8, 13, ...',
      options: JSON.stringify([
        { text: '18', value: 0 },
        { text: '20', value: 1 },
        { text: '21', value: 0 },
        { text: '15', value: 0 },
      ]),
      subDimension: 'fibonacci',
      reverseScored: false,
    },
    // === LOGICAL REASONING (4 preguntas) ===
    {
      questionId: 'q_cog_05', order: 5, type: 'MULTIPLE_CHOICE', dimension: 'logical_reasoning',
      text: 'Todos los gatos son mamíferos. Algunos mamíferos tienen colas. ¿Qué podemos concluir?',
      options: JSON.stringify([
        { text: 'Todos los gatos tienen cola', value: 0 },
        { text: 'Algunos gatos podrían tener cola', value: 1 },
        { text: 'Ningún gato tiene cola', value: 0 },
        { text: 'Todos los mamíferos son gatos', value: 0 },
      ]),
      subDimension: 'syllogisms',
      reverseScored: false,
    },
    {
      questionId: 'q_cog_06', order: 6, type: 'MULTIPLE_CHOICE', dimension: 'logical_reasoning',
      text: 'En una carrera, tú llegas en 3er lugar y adelantas al que iba en 2do. ¿Qué puesto ocupas ahora?',
      options: JSON.stringify([
        { text: '2do lugar', value: 1 },
        { text: '1er lugar', value: 0 },
        { text: '3er lugar (no puedes adelantar al primero)', value: 0 },
        { text: 'Sigues en 3ero', value: 0 },
      ]),
      subDimension: 'position_logic',
      reverseScored: false,
    },
    {
      questionId: 'q_cog_07', order: 7, type: 'MULTIPLE_CHOICE', dimension: 'logical_reasoning',
      text: '¿Cuántos meses tienen 28 días?',
      options: JSON.stringify([
        { text: 'Solo febrero', value: 0 },
        { text: 'Todos los meses tienen al menos 28 días', value: 1 },
        { text: '6 meses', value: 0 },
        { text: 'Ninguno tiene exactamente 28', value: 0 },
      ]),
      subDimension: 'common_trap',
      reverseScored: false,
    },
    {
      questionId: 'q_cog_08', order: 8, type: 'MULTIPLE_CHOICE', dimension: 'logical_reasoning',
      text: 'Un bate y una pelota cuestan $1.10 en total. El bate cuesta $1.00 más que la pelota. ¿Cuánto cuesta la pelota?',
      options: JSON.stringify([
        { text: '$0.05', value: 1 },
        { text: '$0.10', value: 0 },
        { text: '$0.50', value: 0 },
        { text: '$1.00', value: 0 },
      ]),
      subDimension: 'bat_ball_problem',
      reverseScored: false,
    },
    // === CRITICAL THINKING (2 preguntas) ===
    {
      questionId: 'q_cog_09', order: 9, type: 'MULTIPLE_CHOICE', dimension: 'critical_thinking',
      text: '¿Cuál es el error en: "Cd es la inicial de cada punto cardinal de la frontera de un país"?',
      options: JSON.stringify([
        { text: 'La frase es correcta pero no es inicial de países', value: 0 },
        { text: 'No hay error lógico', value: 0 },
        { text: 'Solo sale la I de cada punto cardinal', value: 0 },
        { text: 'Es un acertijo sin solución lógica', value: 1 },
      ]),
      subDimension: 'ambiguity_detection',
      reverseScored: false,
    },
    {
      questionId: 'q_cog_10', order: 10, type: 'MULTIPLE_CHOICE', dimension: 'critical_thinking',
      text: 'Si un comerciante compra algo por $100, lo vende por $120, pero gasta $20 en envío. ¿Cuál fue su ganancia?',
      options: JSON.stringify([
        { text: '$0 (sin ganancia)', value: 1 },
        { text: '$20', value: 0 },
        { text: '$10', value: 0 },
        { text: 'Perdió dinero', value: 0 },
      ]),
      subDimension: 'cost_benefit',
      reverseScored: false,
    },
    // === DEDUCTION (2 preguntas) ===
    {
      questionId: 'q_cog_11', order: 11, type: 'MULTIPLE_CHOICE', dimension: 'deduction',
      text: 'Si 3 personas producen 3 productos en 3 horas. ¿Cuántas personas se necesitan para producir 12 productos en 4 horas?',
      options: JSON.stringify([
        { text: '3 personas', value: 1 },
        { text: '9 personas', value: 0 },
        { text: '12 personas', value: 0 },
        { text: '4 personas', value: 0 },
      ]),
      subDimension: 'rate_problems',
      reverseScored: false,
    },
    {
      questionId: 'q_cog_12', order: 12, type: 'MULTIPLE_CHOICE', dimension: 'deduction',
      text: 'En un gimnasio, 5 personas en 5 máquinas en 5 minutos. ¿Cuánto tiempo para 100 personas y 100 máquinas?',
      options: JSON.stringify([
        { text: '5 minutos', value: 1 },
        { text: '100 minutos', value: 0 },
        { text: '20 minutos', value: 0 },
        { text: '1 hora', value: 0 },
      ]),
      subDimension: 'scaling',
      reverseScored: false,
    },
  ]

  for (const q of cogQuestions) {
    await prisma.question.create({
      data: {
        questionId: q.questionId,
        assessmentId: cog.id,
        ...q,
      },
    })
  }

  console.log('✅ Razonamiento Lógico: 12 preguntas creadas')

  // ============================
  // 2. PERSONALIDAD OCEAN (25 preguntas)
  // ============================
  const psych = await prisma.assessment.create({
    data: {
      id: 'assess_psych_personality',
      name: 'Personalidad OCEAN (Big Five)',
      category: 'PSYCHOMETRIC',
      description: 'Evalúa los 5 grandes rasgos de personalidad: Apertura (creatividad), Consciencia (organización), Extraversión (socialidad), Amabilidad (colaboración) y Neuroticismo (estabilidad emocional). Modelo Big Five más validado científicamente para predicción de comportamiento laboral.',
      timeLimitMinutes: 15,
      targetRoles: ['all'],
      isActive: true,
    },
  })

  const psychQuestions = [
    // === OPENNESS (6 preguntas) ===
    { questionId: 'p_01', order: 1, type: 'LIKERT_SCALE', dimension: 'openness', text: 'Disfruto explorar nuevas ideas y conceptos abstractos.', options: JSON.stringify([{ text: 'Totalmente en desacuerdo', value: 1 }, { text: 'En desacuerdo', value: 2 }, { text: 'Neutral', value: 3 }, { text: 'De acuerdo', value: 4 }, { text: 'Totalmente de acuerdo', value: 5 }]), subDimension: 'curiosity_about_ideas', reverseScored: false },
    { questionId: 'p_02', order: 2, type: 'LIKERT_SCALE', dimension: 'openness', text: 'Prefiero lo familiar y conocido en lugar de lo nuevo e inesperado.', options: JSON.stringify([{ text: 'Totalmente en desacuerdo', value: 5 }, { text: 'En desacuerdo', value: 4 }, { text: 'Neutral', value: 3 }, { text: 'De acuerdo', value: 2 }, { text: 'Totalmente de acuerdo', value: 1 }]), subDimension: 'resistance_to_change', reverseScored: true },
    { questionId: 'p_03', order: 3, type: 'LIKERT_SCALE', dimension: 'openness', text: 'Me interesa aprender sobre culturas, arte y experiencias diversas.', options: JSON.stringify([{ text: 'Totalmente en desacuerdo', value: 1 }, { text: 'En desacuerdo', value: 2 }, { text: 'Neutral', value: 3 }, { text: 'De acuerdo', value: 4 }, { text: 'Totalmente de acuerdo', value: 5 }]), subDimension: 'cultural_interest', reverseScored: false },
    { questionId: 'p_04', order: 4, type: 'LIKERT_SCALE', dimension: 'openness', text: 'Soy una persona creativa que disfruta encontrar soluciones no convencionales.', options: JSON.stringify([{ text: 'Totalmente en desacuerdo', value: 1 }, { text: 'En desacuerdo', value: 2 }, { text: 'Neutral', value: 3 }, { text: 'De acuerdo', value: 4 }, { text: 'Totalmente de acuerdo', value: 5 }]), subDimension: 'creative_thinking', reverseScored: false },
    { questionId: 'p_05', order: 5, type: 'LIKERT_SCALE', dimension: 'openness', text: 'Miedo a cambiar mis ideas cuando alguien me presenta un argumento diferente.', options: JSON.stringify([{ text: 'Totalmente en desacuerdo', value: 5 }, { text: 'En desacuerdo', value: 4 }, { text: 'Neutral', value: 3 }, { text: 'De acuerdo', value: 2 }, { text: 'Totalmente de acuerdo', value: 1 }]), subDimension: 'intellectual_flexibility', reverseScored: true },
    { questionId: 'p_06', order: 6, type: 'LIKERT_SCALE', dimension: 'openness', text: 'Tecnología nueva me genera curiosidad, no preocupación.', options: JSON.stringify([{ text: 'Totalmente en desacuerdo', value: 1 }, { text: 'En desacuerdo', value: 2 }, { text: 'Neutral', value: 3 }, { text: 'De acuerdo', value: 4 }, { text: 'Totalmente de acuerdo', value: 5 }]), subDimension: 'tech_curiosity', reverseScored: false },
    // === CONSCIENTIOUSNESS (6 preguntas) ===
    { questionId: 'p_07', order: 7, type: 'LIKERT_SCALE', dimension: 'conscientiousness', text: 'Siempre completo las tareas que empiezo, incluso si son difíciles.', options: JSON.stringify([{ text: 'Totalmente en desacuerdo', value: 1 }, { text: 'En desacuerdo', value: 2 }, { text: 'Neutral', value: 3 }, { text: 'De acuerdo', value: 4 }, { text: 'Totalmente de acuerdo', value: 5 }]), subDimension: 'dutifulness', reverseScored: false },
    { questionId: 'p_08', order: 8, type: 'LIKERT_SCALE', dimension: 'conscientiousness', text: 'Soy una persona desordenada que trabaja mejor bajo presión.', options: JSON.stringify([{ text: 'Totalmente en desacuerdo', value: 5 }, { text: 'En desacuerdo', value: 4 }, { text: 'Neutral', value: 3 }, { text: 'De acuerdo', value: 2 }, { text: 'Totalmente de acuerdo', value: 1 }]), subDimension: 'disorderliness', reverseScored: true },
    { questionId: 'p_09', order: 9, type: 'LIKERT_SCALE', dimension: 'conscientiousness', text: 'Pongo mucho esfuerzo en hacer las cosas bien, revisando detalles.', options: JSON.stringify([{ text: 'Totalmente en desacuerdo', value: 1 }, { text: 'En desacuerdo', value: 2 }, { text: 'Neutral', value: 3 }, { text: 'De acuerdo', value: 4 }, { text: 'Totalmente de acuerdo', value: 5 }]), subDimension: 'attention_to_detail', reverseScored: false },
    { questionId: 'p_10', order: 10, type: 'LIKERT_SCALE', dimension: 'conscientiousness', text: 'Me esfuerzo mucho para alcanzar mis metas, incluso si son difíciles.', options: JSON.stringify([{ text: 'Totalmente en desacuerdo', value: 1 }, { text: 'En desacuerdo', value: 2 }, { text: 'Neutral', value: 3 }, { text: 'De acuerdo', value: 4 }, { text: 'Totalmente de acuerdo', value: 5 }]), subDimension: 'achievement_striving', reverseScored: false },
    { questionId: 'p_11', order: 11, type: 'LIKERT_SCALE', dimension: 'conscientiousness', text: 'Suelo procrastinar hasta que el plazo es inminente.', options: JSON.stringify([{ text: 'Totalmente en desacuerdo', value: 5 }, { text: 'En desacuerdo', value: 4 }, { text: 'Neutral', value: 3 }, { text: 'De acuerdo', value: 2 }, { text: 'Totalmente de acuerdo', value: 1 }]), subDimension: 'procrastination', reverseScored: true },
    { questionId: 'p_12', order: 12, type: 'LIKERT_SCALE', dimension: 'conscientiousness', text: 'Mantengo mi espacio de trabajo limpio, ordenado y organizado.', options: JSON.stringify([{ text: 'Totalmente en desacuerdo', value: 1 }, { text: 'En desacuerdo', value: 2 }, { text: 'Neutral', value: 3 }, { text: 'De acuerdo', value: 4 }, { text: 'Totalmente de acuerdo', value: 5 }]), subDimension: 'orderliness', reverseScored: false },
    // === EXTRAVERSION (5 preguntas) ===
    { questionId: 'p_13', order: 13, type: 'LIKERT_SCALE', dimension: 'extraversion', text: 'Me siento energizado cuando estoy rodeado de gente.', options: JSON.stringify([{ text: 'Totalmente en desacuerdo', value: 1 }, { text: 'En desacuerdo', value: 2 }, { text: 'Neutral', value: 3 }, { text: 'De acuerdo', value: 4 }, { text: 'Totalmente de acuerdo', value: 5 }]), subDimension: 'social_energy', reverseScored: false },
    { questionId: 'p_14', order: 14, type: 'LIKERT_SCALE', dimension: 'extraversion', text: 'Prefiero actividades tranquilas y solas en lugar de eventos sociales.', options: JSON.stringify([{ text: 'Totalmente en desacuerdo', value: 5 }, { text: 'En desacuerdo', value: 4 }, { text: 'Neutral', value: 3 }, { text: 'De acuerdo', value: 2 }, { text: 'Totalmente de acuerdo', value: 1 }]), subDimension: 'solitude_preference', reverseScored: true },
    { questionId: 'p_15', order: 15, type: 'LIKERT_SCALE', dimension: 'extraversion', text: 'Fácilmente me uno a conversaciones en grupos grandes.', options: JSON.stringify([{ text: 'Totalmente en desacuerdo', value: 1 }, { text: 'En desacuerdo', value: 2 }, { text: 'Neutral', value: 3 }, { text: 'De acuerdo', value: 4 }, { text: 'Totalmente de acuerdo', value: 5 }]), subDimension: 'group_socializing', reverseScored: false },
    { questionId: 'p_16', order: 16, type: 'LIKERT_SCALE', dimension: 'extraversion', text: 'Soy más observador que participativo en reuniones.', options: JSON.stringify([{ text: 'Totalmente en desacuerdo', value: 5 }, { text: 'En desacuerdo', value: 4 }, { text: 'Neutral', value: 3 }, { text: 'De acuerdo', value: 2 }, { text: 'Totalmente de acuerdo', value: 1 }]), subDimension: 'reserved_behavior', reverseScored: true },
    { questionId: 'p_17', order: 17, type: 'LIKERT_SCALE', dimension: 'extraversion', text: 'Busco activamente nuevas redes de contacto y oportunidades sociales.', options: JSON.stringify([{ text: 'Totalmente en desacuerdo', value: 1 }, { text: 'En desacuerdo', value: 2 }, { text: 'Neutral', value: 3 }, { text: 'De acuerdo', value: 4 }, { text: 'Totalmente de acuerdo', value: 5 }]), subDimension: 'social_seeking', reverseScored: false },
    // === AGREEABLENESS (4 preguntas) ===
    { questionId: 'p_18', order: 18, type: 'LIKERT_SCALE', dimension: 'agreeableness', text: 'Muestro empatía hacia los sentimientos de los demás.', options: JSON.stringify([{ text: 'Totalmente en desacuerdo', value: 1 }, { text: 'En desacuerdo', value: 2 }, { text: 'Neutral', value: 3 }, { text: 'De acuerdo', value: 4 }, { text: 'Totalmente de acuerdo', value: 5 }]), subDimension: 'empathy', reverseScored: false },
    { questionId: 'p_19', order: 19, type: 'LIKERT_SCALE', dimension: 'agreeableness', text: 'Prefiero ganar discusiones en lugar de llegar a un acuerdo.', options: JSON.stringify([{ text: 'Totalmente en desacuerdo', value: 5 }, { text: 'En desacuerdo', value: 4 }, { text: 'Neutral', value: 3 }, { text: 'De acuerdo', value: 2 }, { text: 'Totalmente de acuerdo', value: 1 }]), subDimension: 'combativeness', reverseScored: true },
    { questionId: 'p_20', order: 20, type: 'LIKERT_SCALE', dimension: 'agreeableness', text: 'Ayudo a otros incluso cuando es difícil o me toma tiempo.', options: JSON.stringify([{ text: 'Totalmente en desacuerdo', value: 1 }, { text: 'En desacuerdo', value: 2 }, { text: 'Neutral', value: 3 }, { text: 'De acuerdo', value: 4 }, { text: 'Totalmente de acuerdo', value: 5 }]), subDimension: 'altruism', reverseScored: false },
    { questionId: 'p_21', order: 21, type: 'LIKERT_SCALE', dimension: 'agreeableness', text: 'Confío en las intenciones de las demás personas.', options: JSON.stringify([{ text: 'Totalmente en desacuerdo', value: 1 }, { text: 'En desacuerdo', value: 2 }, { text: 'Neutral', value: 3 }, { text: 'De acuerdo', value: 4 }, { text: 'Totalmente de acuerdo', value: 5 }]), subDimension: 'trust', reverseScored: false },
    // === NEUROTICISM (4 preguntas) ===
    { questionId: 'p_22', order: 22, type: 'LIKERT_SCALE', dimension: 'neuroticism', text: 'Me siento ansioso con facilidad cuando hay plazos ajustados.', options: JSON.stringify([{ text: 'Totalmente en desacuerdo', value: 5 }, { text: 'En desacuerdo', value: 4 }, { text: 'Neutral', value: 3 }, { text: 'De acuerdo', value: 2 }, { text: 'Totalmente de acuerdo', value: 1 }]), subDimension: 'stress_resilience', reverseScored: true },
    { questionId: 'p_23', order: 23, type: 'LIKERT_SCALE', dimension: 'neuroticism', text: 'Me cuesta conciliar el sueño cuando estoy preocupado.', options: JSON.stringify([{ text: 'Totalmente en desacuerdo', value: 5 }, { text: 'En desacuerdo', value: 4 }, { text: 'Neutral', value: 3 }, { text: 'De acuerdo', value: 2 }, { text: 'Totalmente de acuerdo', value: 1 }]), subDimension: 'sleep_disturbance', reverseScored: true },
    { questionId: 'p_24', order: 24, type: 'LIKERT_SCALE', dimension: 'neuroticism', text: 'Me siento deprimido cuando las cosas no salen como espero.', options: JSON.stringify([{ text: 'Totalmente en desacuerdo', value: 5 }, { text: 'En desacuerdo', value: 4 }, { text: 'Neutral', value: 3 }, { text: 'De acuerdo', value: 2 }, { text: 'Totalmente de acuerdo', value: 1 }]), subDimension: 'mood_swings', reverseScored: true },
    { questionId: 'p_25', order: 25, type: 'LIKERT_SCALE', dimension: 'neuroticism', text: 'Mantenerme calmado bajo presión es algo que practico y mejoro.', options: JSON.stringify([{ text: 'Totalmente en desacuerdo', value: 1 }, { text: 'En desacuerdo', value: 2 }, { text: 'Neutral', value: 3 }, { text: 'De acuerdo', value: 4 }, { text: 'Totalmente de acuerdo', value: 5 }]), subDimension: 'emotional_stability', reverseScored: false },
  ]

  for (const q of psychQuestions) {
    await prisma.question.create({
      data: {
        questionId: q.questionId,
        assessmentId: psych.id,
        ...q,
      },
    })
  }

  console.log('✅ Personalidad OCEAN: 25 preguntas creadas')

  // ============================
  // 3. JUICIO SITUACIONAL SJT (10 preguntas)
  // ============================
  const sjt = await prisma.assessment.create({
    data: {
      id: 'assess_behav_sjt',
      name: 'Juicio Situacional (SJT)',
      category: 'BEHAVIORAL',
      description: 'Evalúa cómo respondes ante situaciones laborales realistas. Mide leadership, trabajo en equipo, resolución de conflictos, ética profesional y manejo de presión. No hay respuestas "correctas" absolutas, se evalúa qué tan efectiva es tu reacción.',
      timeLimitMinutes: 12,
      targetRoles: ['manager', 'operations', 'sales', 'marketing', 'all'],
      isActive: true,
    },
  })

  const sjtQuestions = [
    // === LEADERSHIP (3 preguntas) ===
    { questionId: 'sjt_01', order: 1, type: 'SCENARIO', dimension: 'leadership', text: 'Tu equipo tiene dos desarrolladores en conflicto sobre la arquitectura de un proyecto crítico. La fecha límite es en 2 semanas.', scenario: '¿Qué harías?', options: JSON.stringify([{ text: 'Decides tu postura y la impones como líder', value: 1 }, { text: 'Organizas una sesión de brainstorming para que encuentren solución conjunta', value: 5 }, { text: 'Dejas que resuelvan solos para que asuman responsabilidad', value: 2 }, { text: 'Escalas al director de ingeniería para que decida', value: 3 }]), subDimension: 'conflict_resolution', reverseScored: false },
    { questionId: 'sjt_02', order: 2, type: 'SCENARIO', dimension: 'leadership', text: 'Tu equipo no está alcanzando las metas de rendimiento. Dos miembros clave tienen problemas de adicción.', scenario: '¿Qué harías?', options: JSON.stringify([{ text: 'Confrontas directamente y los reemplazas', value: 1 }, { text: 'Organizas una reunión y aplicas políticas de rehabilitación', value: 5 }, { text: 'Informas a la empresa para que busque ayuda profesional', value: 3 }, { text: 'Ignoras el problema y esperas que se resuelva', value: 2 }]), subDimension: 'performance_management', reverseScored: false },
    { questionId: 'sjt_03', order: 3, type: 'SCENARIO', dimension: 'leadership', text: 'Eres responsable de una fusión entre dos equipos con diferentes culturas. Uno es muy formal y el otro muy informal.', scenario: '¿Qué harías?', options: JSON.stringify([{ text: 'Impones la cultura formal para mantener profesionalismo', value: 1 }, { text: 'Identificas los mejores aspectos de ambas culturas y los integras', value: 5 }, { text: 'Dejas que cada equipo mantenga su cultura', value: 2 }, { text: 'Escalas al CEO para que decida la cultura', value: 3 }]), subDimension: 'culture_integration', reverseScored: false },
    // === TEAMWORK (2 preguntas) ===
    { questionId: 'sjt_04', order: 4, type: 'SCENARIO', dimension: 'teamwork', text: 'Un compañero de equipo tiene problemas personales graves y su rendimiento ha bajado. El proyecto depende de su entrega.', scenario: '¿Qué harías?', options: JSON.stringify([{ text: 'Organizas una reunión para ofrecer apoyo y ajustar cargas', value: 5 }, { text: 'Reportas la situación a tu manager', value: 3 }, { text: 'Tomas sus tareas sin preguntar', value: 1 }, { text: 'Ignoras la situación y esperas que se resuelva', value: 2 }]), subDimension: 'peer_support', reverseScored: false },
    { questionId: 'sjt_05', order: 5, type: 'SCENARIO', dimension: 'teamwork', text: 'Estás en un equipo donde hay sociedades competitivas y poco colaboradoras. Sientes que el trabajo no avanza.', scenario: '¿Qué harías?', options: JSON.stringify([{ text: 'Comunicas el problema al manager y propones actividades de team building', value: 5 }, { text: 'Tratas de ser más amable con cada uno individualmente', value: 3 }, { text: 'Mientes a otros sobre el avance para "presionar" al equipo', value: 1 }, { text: 'Te retiras del equipo para evitar el conflicto', value: 2 }]), subDimension: 'collaboration_building', reverseScored: false },
    // === CONFLICT RESOLUTION (2 preguntas) ===
    { questionId: 'sjt_06', order: 6, type: 'SCENARIO', dimension: 'conflict_resolution', text: 'Un cliente importante está muy enojado porque un producto falló. Exige una disculpa pública.', scenario: '¿Qué harías?', options: JSON.stringify([{ text: 'Concédes la disculpa inmediata sin investigar', value: 1 }, { text: 'Investigas el problema, haces seguimiento personalizado y ofreces solución', value: 5 }, { text: 'Rechazas la disculpa porque no fue tu culpa', value: 3 }, { text: 'Escalas a legal para evitar responsabilidad', value: 2 }]), subDimension: 'customer_management', reverseScored: false },
    { questionId: 'sjt_07', order: 7, type: 'SCENARIO', dimension: 'conflict_resolution', text: 'En una reunión, un colega ataca personalmente a otro miembro. El ambiente se vuelve hostil.', scenario: '¿Qué harías?', options: JSON.stringify([{ text: 'Defiendes al atacado respondiendo con la misma intensidad', value: 1 }, { text: 'Intervienes calmadamente para redirigir la discusión al tema profesional', value: 5 }, { text: 'Ignoras el ataque y tomas notas', value: 3 }, { text: 'Reportas el incidente a recursos humanos', value: 2 }]), subDimension: 'de_escalation', reverseScored: false },
    // === ETHICS (2 preguntas) ===
    { questionId: 'sjt_08', order: 8, type: 'SCENARIO', dimension: 'ethics', text: 'Descubres que un compañero ha usado información confidencial de un cliente para beneficio personal. Lo sabes por segunda mano, sin prueba directa.', scenario: '¿Qué harías?', options: JSON.stringify([{ text: 'Reportas al compañero al supervisor si tienes evidencia', value: 5 }, { text: 'Lo confrontas directamente para que se corrija', value: 3 }, { text: 'Lo ignoras porque no tienes prueba directa', value: 1 }, { text: 'Escalas sin investigación y sin evidencia', value: 2 }]), subDimension: 'whistleblower', reverseScored: false },
    { questionId: 'sjt_09', order: 9, type: 'SCENARIO', dimension: 'ethics', text: 'Eres manager y un cliente te ofrece dinero para priorizar su proyecto sobre otros clientes.', scenario: '¿Qué harías?', options: JSON.stringify([{ text: 'Aceptas pero lo oculto a la empresa', value: 1 }, { text: 'Rechazas la oferta y reportas la situación', value: 5 }, { text: 'Aceptas pero tratas a todos por igual', value: 2 }, { text: 'No respondes al cliente pero mantienes la prioridad', value: 3 }]), subDimension: 'bribery', reverseScored: false },
    // === PRESSURE (1 pregunta) ===
    { questionId: 'sjt_10', order: 10, type: 'SCENARIO', dimension: 'pressure_management', text: 'Tienes una presentación importante en 1 hora, pero un problema técnico crítico aparece y no hay laptop de respaldo.', scenario: '¿Qué harías?', options: JSON.stringify([{ text: 'Cancelas la presentación y te vas', value: 1 }, { text: 'Usas tu laptop personal y preparas una versión simplificada', value: 5 }, { text: 'Pides a alguien que te preste su equipo', value: 2 }, { text: 'Presentas solo con tu smartphone', value: 3 }]), subDimension: 'crisis_response', reverseScored: false },
  ]

  for (const q of sjtQuestions) {
    await prisma.question.create({
      data: {
        questionId: q.questionId,
        assessmentId: sjt.id,
        ...q,
      },
    })
  }

  console.log('✅ Juicio Situacional: 10 preguntas creadas')

  // ============================
  // 4. EVALUACIÓN TÉCNICA (12 preguntas)
  // ============================
  const tech = await prisma.assessment.create({
    data: {
      id: 'assess_tech_dev',
      name: 'Evaluación Técnica - Desarrollo',
      category: 'TECHNICAL',
      description: 'Evalúa conceptos fundamentales de desarrollo de software: algoritmos y estructuras de datos, arquitectura de sistemas, bases de datos y buenas prácticas de código. No prueba lenguajes específicos sino conceptos universales.',
      timeLimitMinutes: 12,
      targetRoles: ['technology', 'developer', 'engineer', 'analyst'],
      isActive: true,
    },
  })

  const techQuestions = [
    // === ARCHITECTURE (3 preguntas) ===
    { questionId: 't_01', order: 1, type: 'MULTIPLE_CHOICE', dimension: 'architecture', text: '¿Cuál patrón de diseño es más adecuado para crear una única instancia de una clase que gestiona recursos compartidos?', options: JSON.stringify([{ text: 'Factory', value: 0 }, { text: 'Singleton', value: 1 }, { text: 'Observer', value: 0 }, { text: 'Strategy', value: 0 }]), reverseScored: false },
    { questionId: 't_02', order: 2, type: 'MULTIPLE_CHOICE', dimension: 'architecture', text: '¿Cuál es la diferencia principal entre LEFT JOIN e INNER JOIN?', options: JSON.stringify([{ text: 'LEFT JOIN retorna todo de la tabla izquierda con NULL si hay match', value: 1 }, { text: 'INNER JOIN retorna filas de ambas con match', value: 1 }, { text: 'Son iguales', value: 0 }, { text: 'LEFT JOIN es más rápido', value: 0 }]), reverseScored: false },
    { questionId: 't_03', order: 3, type: 'MULTIPLE_CHOICE', dimension: 'architecture', text: '¿Qué principio SOLID se aplica cuando una clase tiene una única responsabilidad?', options: JSON.stringify([{ text: 'Single Responsibility Principle (SRP)', value: 1 }, { text: 'Open-Closed Principle', value: 0 }, { text: 'Liskov Substitution Principle', value: 0 }, { text: 'Interface Segregation', value: 0 }]), reverseScored: false },
    // === DATABASES (3 preguntas) ===
    { questionId: 't_04', order: 4, type: 'MULTIPLE_CHOICE', dimension: 'databases', text: '¿Cuál es la complejidad temporal de acceder a un elemento por índice en un array?', options: JSON.stringify([{ text: 'O(1)', value: 1 }, { text: 'O(n)', value: 0 }, { text: 'O(log n)', value: 0 }, { text: 'O(n²)', value: 0 }]), reverseScored: false },
    { questionId: 't_05', order: 5, type: 'MULTIPLE_CHOICE', dimension: 'databases', text: '¿Qué tipo de índice es más eficiente para consultas de rango?', options: JSON.stringify([{ text: 'B-Tree (árbol balanceado)', value: 1 }, { text: 'Hash Index', value: 0 }, { text: 'Bitmap Index', value: 0 }, { text: 'No hay diferencia', value: 0 }]), reverseScored: false },
    { questionId: 't_06', order: 6, type: 'MULTIPLE_CHOICE', dimension: 'databases', text: '¿Cuál es la ventaja principal de una base de datos NoSQL como MongoDB sobre SQL?', options: JSON.stringify([{ text: 'Escalabilidad horizontal flexible y esquema flexible', value: 1 }, { text: 'Siempre más rápido', value: 0 }, { text: 'Soporta transacciones ACID', value: 0 }, { text: 'Más seguro', value: 0 }]), reverseScored: false },
    // === ALGORITHMS (3 preguntas) ===
    { questionId: 't_07', order: 7, type: 'MULTIPLE_CHOICE', dimension: 'algorithms', text: '¿Cuál es la complejidad temporal de Merge Sort en el peor caso?', options: JSON.stringify([{ text: 'O(n log n)', value: 1 }, { text: 'O(n²)', value: 0 }, { text: 'O(n)', value: 0 }, { text: 'O(log n)', value: 0 }]), reverseScored: false },
    { questionId: 't_08', order: 8, type: 'MULTIPLE_CHOICE', dimension: 'algorithms', text: 'Dado un array ordenado, ¿cuál algoritmo de búsqueda tiene mejor complejidad?', options: JSON.stringify([{ text: 'Binary Search: O(log n)', value: 1 }, { text: 'Linear Search: O(n)', value: 0 }, { text: 'Ambos son iguales', value: 0 }, { text: 'Depende del lenguaje', value: 0 }]), reverseScored: false },
    { questionId: 't_09', order: 9, type: 'MULTIPLE_CHOICE', dimension: 'algorithms', text: '¿Qué estructura de datos usa FIFO (First In, First Out)?', options: JSON.stringify([{ text: 'Queue (Cola)', value: 1 }, { text: 'Stack (Pila)', value: 0 }, { text: 'Array', value: 0 }, { text: 'Hash Table', value: 0 }]), reverseScored: false },
    // === CODE QUALITY & BEST PRACTICES (3 preguntas) ===
    { questionId: 't_10', order: 10, type: 'MULTIPLE_CHOICE', dimension: 'code_quality', text: '¿Cuál es el propósito principal de los tests automatizados?', options: JSON.stringify([{ text: 'Detectar bugs antes de producción y facilitar refactoring', value: 1 }, { text: 'Aumentar tiempo de desarrollo', value: 0 }, { text: 'Reemplazar código manual', value: 0 }, { text: 'Eliminar bugs completamente', value: 0 }]), reverseScored: false },
    { questionId: 't_11', order: 11, type: 'MULTIPLE_CHOICE', dimension: 'code_quality', text: '¿Qué es DRY en desarrollo de software?', options: JSON.stringify([{ text: "Don't Repeat Yourself - evitar código duplicado", value: 1 }, { text: 'Do Repeat Yourself', value: 0 }, { text: 'Design Review Yearly', value: 0 }, { text: 'Data Recovery Y', value: 0 }]), reverseScored: false },
    { questionId: 't_12', order: 12, type: 'MULTIPLE_CHOICE', dimension: 'code_quality', text: '¿Cuál es la diferencia principal entre TDD y desarrollo tradicional?', options: JSON.stringify([{ text: 'En TDD se escriben tests primero antes del código', value: 1 }, { text: 'No hay diferencia', value: 0 }, { text: 'TDD es más lento siempre', value: 0 }, { text: 'Solo se usa para pequeños proyectos', value: 0 }]), reverseScored: false },
  ]

  for (const q of techQuestions) {
    await prisma.question.create({
      data: {
        questionId: q.questionId,
        assessmentId: tech.id,
        ...q,
      },
    })
  }

  console.log('✅ Evaluación Técnica: 12 preguntas creadas')

  // ============================
  // RESUMEN
  // ============================
  const totalQuestions = await prisma.question.count()
  console.log(`
================================================
✅ EVALUACIONES CREADAS EN SUPRABASE
================================================
1. Razonamiento Lógico (COGNITIVE):     12 preguntas
2. Personalidad OCEAN (PSYCHOMETRIC):   25 preguntas
3. Juicio Situacional (BEHAVIORAL):     10 preguntas
4. Evaluación Técnica (TECHNICAL):      12 preguntas
------------------------------------------------
TOTAL: 61 preguntas en 4 evaluaciones
================================================
  `)

  await prisma.$disconnect()
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
