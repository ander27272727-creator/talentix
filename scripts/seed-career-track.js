process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Preguntas del Track de Carrera — fuente de verdad: src/lib/assessments/questions.ts
// 2 de orientación (peso por rama) + 5 técnicas por rama (admin/tech/health/sales)
const QUESTIONS = [
  // ===== ORIENTACIÓN (2) =====
  {
    questionId: 'q_ct_1', type: 'MULTIPLE_CHOICE', dimension: 'career_orientation', subDimension: 'work_area',
    text: '¿En cuál de estas áreas te gustaría trabajar o desarrollarte profesionalmente?',
    options: [
      'Administración, cuentas, RRHH, atención al cliente, ventas o gestión general de empresas',
      'Informática: sistemas, desarrollo, redes, soporte técnico o ciberseguridad',
      'Salud y cuidado: medicina, enfermería, farmacia, terapia, cuidado de personas',
      'Comercio, ventas, retail, atención al cliente o gestión de negocios',
    ].map(t => ({ text: t, value: 0 })),
    correct: null, branch: null, weight: 1, weights: { admin: 3, tech: 1, health: 1, sales: 1 },
  },
  {
    questionId: 'q_ct_2', type: 'MULTIPLE_CHOICE', dimension: 'career_orientation', subDimension: 'work_style',
    text: 'En el día a día, ¿qué tipo de tareas realizas o te gustaría realizar con más frecuencia?',
    options: [
      'Organizar, planificar, controlar presupuestos, evaluar resultados y mejorar procesos',
      'Revisar, probar y mejorar sistemas, software, redes o soluciones técnicas',
      'Planificar y coordinar cuidados, aplicar protocolos y mantener comunicación con pacientes y familias',
      'Prospección, contactar clientes, vender, negociar y cerrar ventas',
    ].map(t => ({ text: t, value: 0 })),
    correct: null, branch: null, weight: 2, weights: { admin: 3, tech: 1, health: 1, sales: 2 },
  },
  // ===== RAMA: ADMINISTRACIÓN (5) =====
  {
    questionId: 'q_ct_a1', type: 'MULTIPLE_CHOICE', dimension: 'admin_knowledge', subDimension: 'planning_control',
    text: 'En gestión empresarial, ¿qué herramienta permite visualizar el estado de un proyecto en términos de % de trabajo realizado vs tiempo planificado?',
    options: ['Diagrama de Gantt', 'Matriz de responsabilidades (RACI)', 'Análisis FODA (SWOT)', 'Gráfico de dispersión'].map((t, i) => ({ text: t, value: i === 0 ? 1 : 0 })),
    correct: 'Diagrama de Gantt', branch: 'admin', weight: 1,
  },
  {
    questionId: 'q_ct_a2', type: 'MULTIPLE_CHOICE', dimension: 'admin_knowledge', subDimension: 'processes',
    text: '¿Qué documento registral se utiliza habitualmente para anotar observaciones relevantes del día a día de un proceso?',
    options: ['Bitácora', 'Acta de reunión', 'Informe de gestión', 'Registro de necesidades'].map((t, i) => ({ text: t, value: i === 0 ? 1 : 0 })),
    correct: 'Bitácora', branch: 'admin', weight: 1,
  },
  {
    questionId: 'q_ct_a3', type: 'MULTIPLE_CHOICE', dimension: 'admin_knowledge', subDimension: 'administration_type',
    text: 'En procesos administrativos, ¿cuál de los siguientes NO es un tipo de gestión o función administrativa básica?',
    options: ['Planificación', 'Organización', 'Dirección', 'Corrección'].map((t, i) => ({ text: t, value: i === 3 ? 1 : 0 })),
    correct: 'Corrección', branch: 'admin', weight: 1,
  },
  {
    questionId: 'q_ct_a4', type: 'MULTIPLE_CHOICE', dimension: 'admin_knowledge', subDimension: 'work_style',
    text: '¿Qué capacidad es clave para que la administración de una empresa o institución funcione de forma ordenada?',
    options: [
      'Capacidad de organización, comunicación clara y atención a procesos',
      'Repetir siempre lo mismo sin preguntar',
      'Evitar entregar informes y documentación',
      'Asignar tareas sin coordinación',
    ].map((t, i) => ({ text: t, value: i === 0 ? 1 : 0 })),
    correct: 'Capacidad de organización, comunicación clara y atención a procesos', branch: 'admin', weight: 1,
  },
  {
    questionId: 'q_ct_a5', type: 'MULTIPLE_CHOICE', dimension: 'admin_knowledge', subDimension: 'work_style',
    text: 'En un entorno administrativo, ¿qué es una decisión bien fundamentada?',
    options: [
      'Una decisión basada en información verificada, análisis y criterios claros',
      'Una decisión arbitraria sin contexto',
      'Una decisión basada en intuiciones sin datos',
      'Una decisión atribuida a supuestos sin verificación',
    ].map((t, i) => ({ text: t, value: i === 0 ? 1 : 0 })),
    correct: 'Una decisión basada en información verificada, análisis y criterios claros', branch: 'admin', weight: 1,
  },
  // ===== RAMA: INFORMÁTICA (5) =====
  {
    questionId: 'q_ct_t1', type: 'MULTIPLE_CHOICE', dimension: 'tech_knowledge', subDimension: 'security',
    text: '¿Cuál es una medida básica y efectiva para proteger el acceso a sistemas y datos sensibles?',
    options: [
      'Usar la misma contraseña en todos los servicios',
      'Usar autenticación de dos factores (2FA) y contraseñas únicas por servicio',
      'Dejar la computadora sin contraseña para que todos puedan acceder',
      'Eliminar el firewall para mayor velocidad',
    ].map((t, i) => ({ text: t, value: i === 1 ? 1 : 0 })),
    correct: 'Usar autenticación de dos factores (2FA) y contraseñas únicas por servicio', branch: 'tech', weight: 1,
  },
  {
    questionId: 'q_ct_t2', type: 'MULTIPLE_CHOICE', dimension: 'tech_knowledge', subDimension: 'troubleshooting',
    text: 'Un usuario reporta que su computadora no enciende. ¿Cuál es el primer paso lógico de diagnóstico?',
    options: [
      'Reemplazar inmediatamente la computadora',
      'Verificar la fuente de energía, cables y estado de la red/cables de alimentación',
      'Cambiar todos los archivos del usuario sin preguntar',
      'Reinstalar el sistema operativo sin diagnóstico',
    ].map((t, i) => ({ text: t, value: i === 1 ? 1 : 0 })),
    correct: 'Verificar la fuente de energía, cables y estado de la red/cables de alimentación', branch: 'tech', weight: 1,
  },
  {
    questionId: 'q_ct_t3', type: 'MULTIPLE_CHOICE', dimension: 'tech_knowledge', subDimension: 'software',
    text: '¿Qué práctica es fundamental para mantener la disponibilidad de información digital y prevenir pérdidas por fallos?',
    options: [
      'No guardar copias de seguridad',
      'Realizar copias de seguridad (backup) periódicas y comprobar su recuperación',
      'Borrar los archivos importantes regularmente',
      'No documentar los cambios de configuración',
    ].map((t, i) => ({ text: t, value: i === 1 ? 1 : 0 })),
    correct: 'Realizar copias de seguridad (backup) periódicas y comprobar su recuperación', branch: 'tech', weight: 1,
  },
  {
    questionId: 'q_ct_t4', type: 'MULTIPLE_CHOICE', dimension: 'tech_knowledge', subDimension: 'databases',
    text: 'En las bases de datos, ¿qué operación se utiliza comúnmente para traer información de dos tablas relacionadas?',
    options: ['UNION', 'JOIN', 'ARCHIVE', 'BACKUP'].map((t, i) => ({ text: t, value: i === 1 ? 1 : 0 })),
    correct: 'JOIN', branch: 'tech', weight: 1,
  },
  {
    questionId: 'q_ct_t5', type: 'MULTIPLE_CHOICE', dimension: 'tech_knowledge', subDimension: 'troubleshooting',
    text: 'Como técnico de nivel 1, ¿qué es lo más útil para resolver un problema de forma eficiente?',
    options: [
      'Adivinar varias veces hasta que funcione',
      'Consultar registros (logs), documentación y realizar cambios controlados',
      'Asignar el problema a otro sin revisarlo',
      'Cambiar todos los archivos sin control',
    ].map((t, i) => ({ text: t, value: i === 1 ? 1 : 0 })),
    correct: 'Consultar registros (logs), documentación y realizar cambios controlados', branch: 'tech', weight: 1,
  },
  // ===== RAMA: SALUD (5) =====
  {
    questionId: 'q_ct_h1', type: 'MULTIPLE_CHOICE', dimension: 'health_knowledge', subDimension: 'patient_care',
    text: 'En el cuidado de personas, ¿qué principio ético profesional se considera prioritario antes de cualquier procedimiento?',
    options: ['Consentimiento informado', 'Confidencialidad', 'Benevolencia', 'Justicia'].map((t, i) => ({ text: t, value: i === 0 ? 1 : 0 })),
    correct: 'Consentimiento informado', branch: 'health', weight: 1,
  },
  {
    questionId: 'q_ct_h2', type: 'MULTIPLE_CHOICE', dimension: 'health_knowledge', subDimension: 'patient_care',
    text: 'La capacidad de trabajo en equipo y la comunicación clara son especialmente importantes en el cuidado de personas porque:',
    options: [
      'Mejoran la coordinación y calidad del cuidado',
      'Crea más ruido en el entorno',
      'No es relevante en salud',
      'Solo aplica a médicos',
    ].map((t, i) => ({ text: t, value: i === 0 ? 1 : 0 })),
    correct: 'Mejoran la coordinación y calidad del cuidado', branch: 'health', weight: 1,
  },
  {
    questionId: 'q_ct_h3', type: 'MULTIPLE_CHOICE', dimension: 'health_knowledge', subDimension: 'patient_care',
    text: '¿Qué práctica está especialmente asociada a la prevención de infecciones en entornos de cuidado?',
    options: [
      'Higiene de manos correcta antes y después del contacto',
      'Limpiar solo el consultorio al final del día',
      'No tocar nunca al paciente',
      'Usar calzado deportivo',
    ].map((t, i) => ({ text: t, value: i === 0 ? 1 : 0 })),
    correct: 'Higiene de manos correcta antes y después del contacto', branch: 'health', weight: 1,
  },
  {
    questionId: 'q_ct_h4', type: 'MULTIPLE_CHOICE', dimension: 'health_knowledge', subDimension: 'patient_care',
    text: '¿Cuál es un indicador clave del buen cuidado de una persona en un proceso de salud o cuidado?',
    options: [
      'Quejas sin solución',
      'Tiempo de respuesta rápido, acción y perspectiva centrada en la persona',
      'Más tiempo administrativo y menos cuidado',
      'Manejo exclusivo sin coordinación',
    ].map((t, i) => ({ text: t, value: i === 1 ? 1 : 0 })),
    correct: 'Tiempo de respuesta rápido, acción y perspectiva centrada en la persona', branch: 'health', weight: 1,
  },
  {
    questionId: 'q_ct_h5', type: 'MULTIPLE_CHOICE', dimension: 'health_knowledge', subDimension: 'patient_care',
    text: 'En el trabajo con personas, ¿cómo se considera ante un incidente o error en seguridad del paciente?',
    options: [
      'Ignorarlo para no generar conflicto',
      'Reporte, análisis de causa y mejora del sistema',
      'Asignar la culpa al coordinador sin investigación',
      'Ocultar el hecho al paciente',
    ].map((t, i) => ({ text: t, value: i === 1 ? 1 : 0 })),
    correct: 'Reporte, análisis de causa y mejora del sistema', branch: 'health', weight: 1,
  },
  // ===== RAMA: VENTAS (5) =====
  {
    questionId: 'q_ct_s1', type: 'MULTIPLE_CHOICE', dimension: 'sales_knowledge', subDimension: 'process',
    text: 'En un proceso de venta, ¿cuál es la etapa que permite identificar la necesidad real del cliente antes de proponer la solución?',
    options: ['Cierre', 'Identificación de necesidades (needs discovery)', 'Facturación', 'Entrega del producto'].map((t, i) => ({ text: t, value: i === 1 ? 1 : 0 })),
    correct: 'Identificación de necesidades (needs discovery)', branch: 'sales', weight: 1,
  },
  {
    questionId: 'q_ct_s2', type: 'MULTIPLE_CHOICE', dimension: 'sales_knowledge', subDimension: 'negotiation',
    text: 'Cuando el cliente objeta el precio, ¿cuál es la mejor práctica de negociación profesional?',
    options: [
      'Recortar el precio de forma inmediata sin valor',
      'Reconocer la objeción, explicar el valor diferencial y explorar alternativas',
      'Terminar la relación con el cliente',
      'Ignorar la objeción para no detener la venta',
    ].map((t, i) => ({ text: t, value: i === 1 ? 1 : 0 })),
    correct: 'Reconocer la objeción, explicar el valor diferencial y explorar alternativas', branch: 'sales', weight: 1,
  },
  {
    questionId: 'q_ct_s3', type: 'MULTIPLE_CHOICE', dimension: 'sales_knowledge', subDimension: 'customer_focus',
    text: 'La base de una relación comercial a largo plazo y la fidelización del cliente se sustenta en:',
    options: [
      'Confianza, servicio al cliente y entrega de valor real',
      'Solo el precio más bajo',
      'Comprar sin calidad',
      'Solo promociones',
    ].map((t, i) => ({ text: t, value: i === 0 ? 1 : 0 })),
    correct: 'Confianza, servicio al cliente y entrega de valor real', branch: 'sales', weight: 1,
  },
  {
    questionId: 'q_ct_s4', type: 'MULTIPLE_CHOICE', dimension: 'sales_knowledge', subDimension: 'negotiation',
    text: '¿Qué indicador sugiere que el cliente está preparado para avanzar en la venta?',
    options: [
      'Silencio o frases sin compromiso',
      'Preguntas sobre detalles de entrega, uso o pedir una prueba / compromiso de seguimiento',
      'Crítica desinteresada',
      'Expresar solo interés general',
    ].map((t, i) => ({ text: t, value: i === 1 ? 1 : 0 })),
    correct: 'Preguntas sobre detalles de entrega, uso o pedir una prueba / compromiso de seguimiento', branch: 'sales', weight: 1,
  },
  {
    questionId: 'q_ct_s5', type: 'MULTIPLE_CHOICE', dimension: 'sales_knowledge', subDimension: 'metrics',
    text: '¿Qué representa el pipeline de ventas en una oportunidad comercial?',
    options: [
      'La cuenta de inventario',
      'Un conjunto de oportunidades de venta en distintas etapas del proceso',
      'El ranking de seguidores en redes sociales',
      'El historial de reembolsos',
    ].map((t, i) => ({ text: t, value: i === 1 ? 1 : 0 })),
    correct: 'Un conjunto de oportunidades de venta en distintas etapas del proceso', branch: 'sales', weight: 1,
  },
]

async function main() {
  console.log('⏳ Sincronizando Track de Carrera con la base de datos...')

  // 1. Upsert de la evaluación
  const assessment = await prisma.assessment.upsert({
    where: { id: 'career_track_main' },
    update: {
      name: 'Track de Carrera: Orientación Profesional',
      category: 'TECHNICAL',
      description: 'Descubre tu orientación profesional (Administración, Informática, Salud o Ventas) y demuestra tus conocimientos en tu rama. El sistema usa este resultado para recomendar las evaluaciones y vacantes adecuadas para ti.',
      timeLimitMinutes: 12,
      careerTrack: true,
      isActive: true,
    },
    create: {
      id: 'career_track_main',
      name: 'Track de Carrera: Orientación Profesional',
      category: 'TECHNICAL',
      description: 'Descubre tu orientación profesional (Administración, Informática, Salud o Ventas) y demuestra tus conocimientos en tu rama. El sistema usa este resultado para recomendar las evaluaciones y vacantes adecuadas para ti.',
      timeLimitMinutes: 12,
      targetRoles: ['Todos los cargos'],
      careerTrack: true,
      isActive: true,
    },
  })
  console.log(`✅ Evaluación "${assessment.name}" sincronizada`)

  // 2. Upsert de las 17 preguntas en orden
  for (let i = 0; i < QUESTIONS.length; i++) {
    const q = QUESTIONS[i]
    await prisma.question.upsert({
      where: { questionId: q.questionId },
      update: {
        type: q.type,
        dimension: q.dimension,
        subDimension: q.subDimension || null,
        text: q.text,
        options: q.options,
        careerBranch: q.branch || null,
        order: i,
        assessmentId: assessment.id,
      },
      create: {
        questionId: q.questionId,
        assessmentId: assessment.id,
        type: q.type,
        dimension: q.dimension,
        subDimension: q.subDimension || null,
        text: q.text,
        options: q.options,
        careerBranch: q.branch || null,
        order: i,
      },
    })
  }
  console.log(`✅ ${QUESTIONS.length} preguntas sincronizadas (2 orientación + 15 técnicas)`)
}

main()
  .catch((e) => { console.error('❌ Error:', e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
