process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Evaluaciones específicas por tipo de puesto:
// 1. Ventas / Call Center — habilidades comerciales reales (prospección, resiliencia, objeciones, cierre)
// 2. Salud y Cuidado — protocolos, prioridad clínica, empatía, confidencialidad
// Idempotente: usa upsert para no duplicar.

const SALES_ID = 'assess_sales_callcenter'
const HEALTH_ID = 'assess_health_care'

function likert(text, dimension, reverse = false, weight = 1) {
  return {
    type: 'LIKERT_SCALE', dimension, subDimension: dimension, text,
    options: [
      'Totalmente en desacuerdo', 'En desacuerdo', 'Neutral', 'De acuerdo', 'Totalmente de acuerdo',
    ].map(t => ({ text: t, value: 0 })),
    reverseScored: reverse, weight,
  }
}

function situational(text, options, correctIdx, dimension, subDimension, weight = 1) {
  return {
    type: 'MULTIPLE_CHOICE', dimension, subDimension, text,
    options: options.map((t, i) => ({ text: t, value: i === correctIdx ? 1 : 0 })),
    reverseScored: false, weight,
  }
}

const SALES_QUESTIONS = [
  likert('Disfruto contactar a personas desconocidas para ofrecerles un producto o servicio.', 'persuasion_resilience'),
  likert('Cuando un cliente me dice "no", suelo intentarlo de nuevo con un enfoque diferente.', 'persuasion_resilience'),
  likert('Me molesta tener que repetir la misma información varias veces al día.', 'persuasion_resilience', true),
  likert('Me es fácil explicar temas complicados con palabras sencillas.', 'communication_clarity'),
  likert('Ante un cliente enojado, mantengo la calma y me enfoco en resolver su problema.', 'customer_orientation'),
  likert('Prefiero que sea el cliente quien me contacte a mí en lugar de buscarlo yo activamente.', 'persuasion_resilience', true),
  situational(
    'Un cliente te dice que el precio está muy alto. ¿Qué haces PRIMERO?',
    [
      'Preguntar qué valor o presupuesto espera y destacar lo que recibe por el precio',
      'Ofrecer un descuento inmediato para no perderlo',
      'Decirle que es el precio final y despedirte',
      'Bajar el tema del precio y hablar de otra cosa',
    ],
    0, 'objection_handling', 'price_objection', 2
  ),
  situational(
    'Vas 30% por debajo de tu meta y falta la mitad del mes. ¿Cuál es tu mejor acción?',
    [
      'Revisar tu embudo, intensificar prospección y priorizar los casos más avanzados',
      'Esperar a que la empresa te asigne más clientes',
      'Bajar la meta mentalmente y esperar el próximo mes',
      'Enfocarte solo en los clientes más fáciles aunque sean pocos',
    ],
    0, 'results_orientation', 'goal_management', 2
  ),
  situational(
    'El cliente menciona que la competencia ofrece algo similar más barato. ¿Qué haces?',
    [
      'Destacar objetivamente tus diferencias y beneficios sin descalificar a nadie',
      'Descalificar a la competencia para quedarte con la venta',
      'Ignorar el comentario y seguir con tu discurso',
      'Admitir que es mejor y terminar la llamada',
    ],
    0, 'objection_handling', 'competition', 2
  ),
  situational(
    'El cliente dice "lo voy a pensar" al momento del cierre. ¿Qué haces?',
    [
      'Explorar amablemente qué le genera duda y resolver esa objeción concreta',
      'Presionarlo con urgencia artificial ("solo hoy")',
      'Despedirte cortésmente y esperar que contacte',
      'Ofrecer un descuento inmediato sin preguntar',
    ],
    0, 'objection_handling', 'closing', 2
  ),
  situational(
    'En un call center, la llamada anterior terminó mal y entra la siguiente. ¿Cuál es la actitud correcta?',
    [
      'Reiniciar en segundos: cada llamada es una nueva oportunidad con tono positivo',
      'Avisar al cliente que tuviste un mal día',
      'Tomarte unos minutos para recuperarte aunque haya clientes en espera',
      'Ser breve y frío para evitar otro problema',
    ],
    0, 'customer_orientation', 'emotional_reset', 2
  ),
  situational(
    'Un cliente solicita algo que la empresa no ofrece. ¿Qué haces?',
    [
      'Explicar con claridad que no está disponible y ofrecer la mejor alternativa real',
      'Prometer que pronto lo habrá para mantener el interés',
      'Decir simplemente "no" y colgar',
      'Transferir la llamada sin contexto',
    ],
    0, 'communication_clarity', 'honest_alternatives', 1
  ),
]

const HEALTH_QUESTIONS = [
  situational(
    'Un paciente se niega a tomar su medicamento. ¿Cuál es la actuación correcta?',
    [
      'Indagar el motivo, explicarle la importancia y registrar/comunicar al responsable',
      'Insistir hasta que lo tome, aunque se moleste',
      'Dejarlo pasar y no anotar nada',
      'Regañarlo para que obedezca',
    ],
    0, 'patient_safety', 'medication_adherence', 2
  ),
  situational(
    'Encuentras a un adulto mayor caído en el suelo. ¿Cuál es el PRIMER paso?',
    [
      'Evaluar su estado (consciencia, respiración) y no movilizarlo hasta valorar riesgos',
      'Levantarlo rápido para que no se resfríe',
      'Llamar a la familia antes que nada',
      'Esperar a que se levante solo',
    ],
    0, 'patient_safety', 'falls_response', 2
  ),
  situational(
    '¿En qué momento es OBLIGATORIO el lavado de manos en la atención de pacientes?',
    [
      'Antes y después de todo contacto con el paciente o sus pertenencias',
      'Solo al iniciar el turno',
      'Solo cuando las manos se ven sucias',
      'Solo después del contacto, no antes',
    ],
    0, 'protocols', 'hand_hygiene', 2
  ),
  situational(
    '¿Cuál de estos signos requiere aviso INMEDIATO al personal de enfermería o médico?',
    [
      'Dificultad respiratoria súbita o dolor intenso en el pecho',
      'El paciente pidió más agua',
      'Quiere dormir una siesta más temprano',
      'Se quejó del sabor de la comida',
    ],
    0, 'patient_safety', 'warning_signs', 2
  ),
  situational(
    'Tienes varios pacientes a la vez y todos te llaman. ¿Cómo priorizas?',
    [
      'Por gravedad y riesgo: primero lo que comprometa la seguridad o salud',
      'Por orden de llegada estricto, sin evaluar urgencia',
      'Atendiendo primero al que más grita',
      'Atendiendo primero al más amable',
    ],
    0, 'prioritization', 'triage_basics', 2
  ),
  situational(
    'Un familiar no autorizado te pide información sobre el diagnóstico del paciente. ¿Qué haces?',
    [
      'Explicar con respeto que no puedes dar información sin autorización del paciente',
      'Darle un resumen general para no quedar mal',
      'Darle toda la información si insiste',
      'Ignorarlo y seguir tu tarea',
    ],
    0, 'ethics_confidentiality', 'information_handling', 2
  ),
  likert('Me mantengo sereno y actúo con criterio en situaciones urgentes.', 'composure_under_pressure'),
  likert('Me es fácil mostrar empatía con personas enfermas o vulnerables.', 'empathy_care'),
  likert('Las tareas de higiene y cuidado personal de otras personas me resultan desagradables.', 'empathy_care', true),
  situational(
    '¿Por qué es crucial registrar los signos vitales con exactitud?',
    [
      'Porque sustentan las decisiones clínicas y detectan deterioros a tiempo',
      'Porque es papeleo que pide la supervisora',
      'Porque solo importan al final del turno',
      'En realidad no afectan la atención',
    ],
    0, 'protocols', 'vital_signs_accuracy', 2
  ),
]

async function main() {
  console.log('📥 Creando evaluaciones por tipo de puesto...')

  await prisma.assessment.upsert({
    where: { id: SALES_ID },
    update: {
      name: 'Habilidades Comerciales: Ventas y Call Center',
      category: 'TECHNICAL',
      description: 'Evalúa tus aptitudes reales para ventas y atención al cliente: prospección, manejo de objeciones, resiliencia ante el rechazo, comunicación clara y orientación al cliente. Es la evaluación clave para roles comerciales y de call center.',
      timeLimitMinutes: 12,
      targetRoles: ['Ventas', 'Comercial', 'Call Center', 'Atención al Cliente', 'Telemarketing', 'Retail'],
      careerBranch: 'sales',
      isActive: true,
    },
    create: {
      id: SALES_ID,
      name: 'Habilidades Comerciales: Ventas y Call Center',
      category: 'TECHNICAL',
      description: 'Evalúa tus aptitudes reales para ventas y atención al cliente: prospección, manejo de objeciones, resiliencia ante el rechazo, comunicación clara y orientación al cliente. Es la evaluación clave para roles comerciales y de call center.',
      timeLimitMinutes: 12,
      targetRoles: ['Ventas', 'Comercial', 'Call Center', 'Atención al Cliente', 'Telemarketing', 'Retail'],
      careerBranch: 'sales',
      isActive: true,
    },
  })

  for (let i = 0; i < SALES_QUESTIONS.length; i++) {
    const q = SALES_QUESTIONS[i]
    const questionId = `q_sales_${String(i + 1).padStart(2, '0')}`
    await prisma.question.upsert({
      where: { questionId },
      update: { assessmentId: SALES_ID, text: q.text, options: JSON.stringify(q.options), dimension: q.dimension, subDimension: q.subDimension, reverseScored: q.reverseScored, order: i + 1, careerBranch: 'sales' },
      create: { assessmentId: SALES_ID, questionId, order: i + 1, type: q.type, text: q.text, options: JSON.stringify(q.options), dimension: q.dimension, subDimension: q.subDimension, reverseScored: q.reverseScored, careerBranch: 'sales' },
    })
  }

  await prisma.assessment.upsert({
    where: { id: HEALTH_ID },
    update: {
      name: 'Conocimientos en Salud y Cuidado',
      category: 'TECHNICAL',
      description: 'Evalúa tus conocimientos y actitudes para roles de salud y cuidado: protocolos de seguridad, respuesta a emergencias, priorización clínica, empatía y manejo de información confidencial del paciente.',
      timeLimitMinutes: 10,
      targetRoles: ['Salud', 'Enfermería', 'Cuidado', 'Medicina', 'Auxiliar', 'Terapia'],
      careerBranch: 'health',
      isActive: true,
    },
    create: {
      id: HEALTH_ID,
      name: 'Conocimientos en Salud y Cuidado',
      category: 'TECHNICAL',
      description: 'Evalúa tus conocimientos y actitudes para roles de salud y cuidado: protocolos de seguridad, respuesta a emergencias, priorización clínica, empatía y manejo de información confidencial del paciente.',
      timeLimitMinutes: 10,
      targetRoles: ['Salud', 'Enfermería', 'Cuidado', 'Medicina', 'Auxiliar', 'Terapia'],
      careerBranch: 'health',
      isActive: true,
    },
  })

  for (let i = 0; i < HEALTH_QUESTIONS.length; i++) {
    const q = HEALTH_QUESTIONS[i]
    const questionId = `q_health_${String(i + 1).padStart(2, '0')}`
    await prisma.question.upsert({
      where: { questionId },
      update: { assessmentId: HEALTH_ID, text: q.text, options: JSON.stringify(q.options), dimension: q.dimension, subDimension: q.subDimension, reverseScored: q.reverseScored, order: i + 1, careerBranch: 'health' },
      create: { assessmentId: HEALTH_ID, questionId, order: i + 1, type: q.type, text: q.text, options: JSON.stringify(q.options), dimension: q.dimension, subDimension: q.subDimension, reverseScored: q.reverseScored, careerBranch: 'health' },
    })
  }

  console.log('✅ Evaluaciones por puesto listas:')
  console.log(`   - ${SALES_ID}: ${SALES_QUESTIONS.length} preguntas (ventas/call center)`)
  console.log(`   - ${HEALTH_ID}: ${HEALTH_QUESTIONS.length} preguntas (salud/cuidado)`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
