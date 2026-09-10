// ==================== PSYCHOMETRIC ASSESSMENTS ====================

export const bigFivePersonality = {
  id: "psych_bigfive_001",
  name: "Perfil de Personalidad - Big Five (OCEAN)",
  category: "PSYCHOMETRIC",
  description: "Mide los cinco grandes rasgos de personalidad: Apertura, Conciencia, Extraversión, Amabilidad y Neuroticismo.",
  timeLimitMinutes: 12,
  targetRoles: ["Todos los cargos"],
  questions: [
    // Openness (Apertura)
    {
      id: "q_o1",
      type: "likert_scale",
      dimension: "openness",
      subDimension: "curiosity",
      text: "Me gusta explorar ideas nuevas y conceptos abstractos.",
      options: ["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"],
      weights: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 },
      reverseScored: false,
    },
    {
      id: "q_o2",
      type: "likert_scale",
      dimension: "openness",
      subDimension: "creativity",
      text: "Disfruto resolver problemas de maneras poco convencionales.",
      options: ["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"],
      weights: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 },
      reverseScored: false,
    },
    {
      id: "q_o3",
      type: "likert_scale",
      dimension: "openness",
      subDimension: "adventure",
      text: "Prefiero las rutinas familiares a las experiencias nuevas.",
      options: ["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"],
      weights: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 },
      reverseScored: true,
    },
    // Conscientiousness (Conciencia)
    {
      id: "q_c1",
      type: "likert_scale",
      dimension: "conscientiousness",
      subDimension: "organization",
      text: "Siempre completo las tareas que empiezo.",
      options: ["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"],
      weights: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 },
      reverseScored: false,
    },
    {
      id: "q_c2",
      type: "likert_scale",
      dimension: "conscientiousness",
      subDimension: "discipline",
      text: "Prefiero tener un plan detallado antes de comenzar cualquier proyecto.",
      options: ["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"],
      weights: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 },
      reverseScored: false,
    },
    {
      id: "q_c3",
      type: "likert_scale",
      dimension: "conscientiousness",
      subDimension: "reliability",
      text: "Soy una persona muy organizada y metódica.",
      options: ["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"],
      weights: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 },
      reverseScored: false,
    },
    // Extraversion (Extraversión)
    {
      id: "q_e1",
      type: "likert_scale",
      dimension: "extraversion",
      subDimension: "sociability",
      text: "Me siento cómodo hablando con personas que no conozco.",
      options: ["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"],
      weights: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 },
      reverseScored: false,
    },
    {
      id: "q_e2",
      type: "likert_scale",
      dimension: "extraversion",
      subDimension: "energy",
      text: "Las reuniones de equipo me dan energía.",
      options: ["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"],
      weights: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 },
      reverseScored: false,
    },
    {
      id: "q_e3",
      type: "likert_scale",
      dimension: "extraversion",
      subDimension: "assertiveness",
      text: "Tiendo a tomar la iniciativa en situaciones sociales.",
      options: ["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"],
      weights: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 },
      reverseScored: false,
    },
    // Agreeableness (Amabilidad)
    {
      id: "q_a1",
      type: "likert_scale",
      dimension: "agreeableness",
      subDimension: "empathy",
      text: "Me importa mucho cómo se sienten los demás.",
      options: ["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"],
      weights: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 },
      reverseScored: false,
    },
    {
      id: "q_a2",
      type: "likert_scale",
      dimension: "agreeableness",
      subDimension: "cooperation",
      text: "Prefiero cooperar con los demás antes que competir.",
      options: ["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"],
      weights: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 },
      reverseScored: false,
    },
    {
      id: "q_a3",
      type: "likert_scale",
      dimension: "agreeableness",
      subDimension: "tolerance",
      text: "Soy tolerante con las diferencias de opinión.",
      options: ["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"],
      weights: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 },
      reverseScored: false,
    },
    // Neuroticism (Neuroticismo)
    {
      id: "q_n1",
      type: "likert_scale",
      dimension: "neuroticism",
      subDimension: "anxiety",
      text: "Me preocupo mucho por cosas que podrían salir mal.",
      options: ["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"],
      weights: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 },
      reverseScored: false,
    },
    {
      id: "q_n2",
      type: "likert_scale",
      dimension: "neuroticism",
      subDimension: "stress",
      text: "El estrés me afecta mucho en mi trabajo diario.",
      options: ["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"],
      weights: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 },
      reverseScored: false,
    },
    {
      id: "q_n3",
      type: "likert_scale",
      dimension: "neuroticism",
      subDimension: "stability",
      text: "Mantengo la calma bajo presión.",
      options: ["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"],
      weights: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 },
      reverseScored: true,
    },
  ],
}

// ==================== COGNITIVE ASSESSMENTS ====================

export const logicalReasoning = {
  id: "cog_logic_001",
  name: "Razonamiento Lógico",
  category: "COGNITIVE",
  description: "Evalúa tu capacidad para resolver problemas abstractos, detectar patrones y razonar de forma lógica.",
  timeLimitMinutes: 15,
  targetRoles: ["Developer", "Analista", "Ingeniero", "Data Scientist"],
  questions: [
    {
      id: "q_l1",
      type: "multiple_choice",
      dimension: "logical_reasoning",
      subDimension: "pattern_recognition",
      text: "¿Cuál es el siguiente número en la secuencia: 2, 6, 12, 20, 30, ?",
      options: ["36", "40", "42", "44"],
      correctAnswer: "42",
      explanation: "Las diferencias son 4, 6, 8, 10, 12. El siguiente número es 30 + 12 = 42.",
    },
    {
      id: "q_l2",
      type: "multiple_choice",
      dimension: "logical_reasoning",
      subDimension: "deduction",
      text: "Si todos los A son B, y algunos B son C, ¿qué podemos afirmar con certeza?",
      options: [
        "Todos los A son C",
        "Algunos A pueden ser C",
        "Ningún A es C",
        "Todos los C son A",
      ],
      correctAnswer: "Algunos A pueden ser C",
      explanation: "De las premisas no se puede concluir que todos los A son C, solo que es posible.",
    },
    {
      id: "q_l3",
      type: "multiple_choice",
      dimension: "logical_reasoning",
      subDimension: "problem_solving",
      text: "Un tren sale de Madrid a las 9:00 a 80 km/h. Otro sale de Barcelona a las 9:30 a 100 km/h. Si la distancia es 620 km, ¿a qué hora se encuentran?",
      options: ["12:30", "13:00", "13:30", "14:00"],
      correctAnswer: "13:00",
      explanation: "El primer tren lleva 4h (320km), el segundo 3.5h (350km). Total: 670km > 620km. Se encuentran entre 12:30 y 13:00.",
    },
  ],
}

export const verbalReasoning = {
  id: "cog_verbal_001",
  name: "Razonamiento Verbal",
  category: "COGNITIVE",
  description: "Evalúa tu comprensión lectora, vocabulario y capacidad de análisis de texto.",
  timeLimitMinutes: 12,
  targetRoles: ["Todos los cargos"],
  questions: [
    {
      id: "q_v1",
      type: "multiple_choice",
      dimension: "verbal_reasoning",
      subDimension: "comprehension",
      text: "Lee: 'La empresa implementó nuevas políticas de flexibilidad laboral, resultando en un aumento del 23% en la productividad y una reducción del 15% en la rotación.' ¿Cuál es la conclusión más lógica?",
      options: [
        "La flexibilidad laboral mejora la productidad y reduce la rotación",
        "Las empresas deben eliminar todas las políticas antiguas",
        "El 23% de los empleados son más productivos",
        "La rotación siempre disminuye con cambios de política",
      ],
      correctAnswer: "La flexibilidad laboral mejora la productidad y reduce la rotación",
      explanation: "El texto establish una relación causal entre flexibilidad y mejores resultados.",
    },
    {
      id: "q_v2",
      type: "multiple_choice",
      dimension: "verbal_reasoning",
      subDimension: "vocabulary",
      text: "¿Qué significa 'preponderancia' en el contexto: 'La preponderancia de los datos sugiere una tendencia clara'?",
      options: [
        "Mayor cantidad o importancia",
        "Falta de datos",
        "Unidad de medida",
        "Error en los datos",
      ],
      correctAnswer: "Mayor cantidad o importancia",
      explanation: "Preponderancia significa predominio, superioridad en cantidad o calidad.",
    },
  ],
}

// ==================== BEHAVIORAL ASSESSMENTS ====================

export const situationalJudgment = {
  id: "beh_sjt_001",
  name: "Situaciones Laborales (SJT)",
  category: "BEHAVIORAL",
  description: "Evalúa tu juicio ante situaciones reales del entorno laboral. No hay respuestas correctas o incorrectas, sino más o menos adecuadas.",
  timeLimitMinutes: 20,
  targetRoles: ["Manager", "Líder", "Team Lead", "Director"],
  questions: [
    {
      id: "q_s1",
      type: "scenario",
      dimension: "judgment",
      subDimension: "conflict_resolution",
      scenario: "Tu jefe te asigna un proyecto con un plazo de 2 semanas, pero según tu estimación, necesitarías al menos 4 semanas para hacerlo correctamente.",
      text: "¿Qué haces primero?",
      options: [
        "Aceptas el plazo y trabajas las horas necesarias para cumplir",
        "Explicas al jefe tu estimación y propones un plan alternativo",
        "Acceptas el plazo pero reduces la calidad del trabajo",
        "Le pides a tu equipo que trabaje horas extra sin consultarlos",
      ],
      weights: {
        "Explicas al jefe tu estimación y propones un plan alternativo": 5,
        "Aceptas el plazo y trabajas las horas necesarias para cumplir": 3,
        "Acceptas el plazo pero reduces la calidad del trabajo": 2,
        "Le pides a tu equipo que trabaje horas extra sin consultarlos": 1,
      },
    },
    {
      id: "q_s2",
      type: "scenario",
      dimension: "judgment",
      subDimension: "team_management",
      scenario: "Dos miembros de tu equipo tienen un desacuerdo público sobre la dirección técnica de un proyecto. El ambiente se está tensando.",
      text: "¿Cómo manejas la situación?",
      options: [
        "Ignoras el conflicto, se resolverán solos",
        "Reúnes a ambos por separado para entender sus perspectivas y mediar",
        "Tomas la decisión tú sin consultarlos",
        "Reúnes a todo el equipo para votar la dirección",
      ],
      weights: {
        "Reúnes a ambos por separado para entender sus perspectivas y mediar": 5,
        "Reúnes a todo el equipo para votar la dirección": 3,
        "Tomas la decisión tú sin consultarlos": 2,
        "Ignoras el conflicto, se resolverán solos": 1,
      },
    },
  ],
}

export const leadershipAssessment = {
  id: "beh_leader_001",
  name: "Liderazgo y Toma de Decisiones",
  category: "BEHAVIORAL",
  description: "Evalúa tu estilo de liderazgo, capacidad de decisión y gestión de equipos.",
  timeLimitMinutes: 15,
  targetRoles: ["Director", "Manager", "Team Lead"],
  questions: [
    {
      id: "q_ld1",
      type: "scenario",
      dimension: "leadership",
      subDimension: "decision_making",
      scenario: "Tu empresa necesita reducir costos un 20%. Tienes que decidir entre tres opciones: despedir personal, reducir salarios, o eliminar beneficios.",
      text: "¿Cuál es tu enfoque?",
      options: [
        "Consultas al equipo para buscar alternativas antes de decidir",
        "Despedir al 10% menos productivo de la plantilla",
        "Reducir todos los salarios un 10% de forma temporal",
        "Eliminar beneficios como comidas y gimnasio",
      ],
      weights: {
        "Consultas al equipo para buscar alternativas antes de decidir": 5,
        "Reducir todos los salarios un 10% de forma temporal": 3,
        "Eliminar beneficios como comidas y gimnasio": 3,
        "Despedir al 10% menos productivo de la plantilla": 2,
      },
    },
  ],
}

// ==================== TECHNICAL ASSESSMENTS ====================

// ==================== CRIAR CARGO 2 ====================


// ==================== CAREER TRACK ====================
// ==================== TRACK DE CARRERA PROFESIONAL ====================
export const careerTrackAssessment = {
  id: "career_track_main",
  name: "Track de Carrera: Orientación Profesional",
  category: "TECHNICAL",
  description:
    "Determina tu orientación profesional principal para enfocar tu evaluación técnica específica. Responde las preguntas y el sistema te asignará las preguntas relevantes a la rama que más se ajuste a tu perfil.",
  timeLimitMinutes: 8,
  targetRoles: ["Todos los cargos"],
  careerTrack: true,
  questions: [
    {
      id: "q_ct_1",
      type: "multiple_choice",
      dimension: "career_orientation",
      subDimension: "work_area",
      text: "¿En cuál de estas áreas te gustaría trabajar o desarrollarte profesionalmente?",
      options: [
        "Administración, cuentas, RRHH, atención al cliente, ventas o gestión general de empresas",
        "Informática: sistemas, desarrollo, redes, soporte técnico o ciberseguridad",
        "Salud y cuidado: medicina, enfermería, farmacia, terapia, cuidado de personas",
        "Comercio, ventas, retail, atención al cliente o gestión de negocios",
      ],
      careerBranch: "admin",
      correctAnswer: null,
      weight: {
        admin: 3,
        tech: 1,
        health: 1,
        sales: 1,
      },
    },
    {
      id: "q_ct_2",
      type: "multiple_choice",
      dimension: "career_orientation",
      subDimension: "work_style",
      text: "En el día a día, ¿qué tipo de tareas realizas o te gustaría realizar con más frecuencia?",
      options: [
        "Organizar, planificar, controlar presupuestos, evaluar resultados y mejorar procesos",
        "Revisar, probar y mejorar sistemas, software, redes o soluciones técnicas",
        "Planificar y coordinar cuidados, aplicar protocolos y mantener comunicación con pacientes y familias",
        "Prospección, contactar clientes, vender, negociar y cerrar ventas",
      ],
      careerBranch: "admin",
      correctAnswer: null,
      weight: {
        admin: 3,
        tech: 1,
        health: 1,
        sales: 2,
      },
    },
    // TRACE: ADMINISTRACIÓN Y GESTIÓN EMPRESARIAL
    {
      id: "q_ct_a1",
      type: "multiple_choice",
      dimension: "admin_knowledge",
      subDimension: "planning_control",
      text: "En gestión empresarial, ¿qué herramienta permite visualizar el estado de un proyecto en términos de % de trabajo realizado vs tiempo planificado?",
      options: [
        "Diagrama de Gantt",
        "Matriz de responsabilidades (RACI)",
        "Análisis FODA (SWOT)",
        "Gráfico de dispersión",
      ],
      correctAnswer: "Diagrama de Gantt",
      careerBranch: "admin",
      explanation:
        "El diagrama de Gantt permite verificar el avance comparando el % de tareas completadas con el tiempo planificado.",
    },
    {
      id: "q_ct_a2",
      type: "multiple_choice",
      dimension: "admin_knowledge",
      subDimension: "processes",
      text: "¿Qué documento registral se utiliza habitualmente para anotar observaciones relevantes del día a día de un proceso?",
      options: ["Bitácora", "Acta de reunión", "Informe de gestión", "Registro de necesidades"],
      correctAnswer: "Bitácora",
      careerBranch: "admin",
      explanation:
        "La bitácora es el registro continuo que deja constancia de observaciones, incidencias y actividades del día a día.",
    },
    {
      id: "q_ct_a3",
      type: "multiple_choice",
      dimension: "admin_knowledge",
      subDimension: "administration_type",
      text: "En procesos administrativos, ¿cuál de los siguientes NO es un tipo de gestión o función administrativa básica?",
      options: ["Planificación", "Organización", "Dirección", "Corrección"],
      correctAnswer: "Corrección",
      careerBranch: "admin",
      explanation:
        "Las funciones básicas clásicas de la administración son planificación, organización, dirección y control.",
    },
    {
      id: "q_ct_a4",
      type: "multiple_choice",
      dimension: "admin_knowledge",
      subDimension: "work_style",
      text: "¿Qué capacidad es clave para que la administración de una empresa o institución funcione de forma ordenada?",
      options: [
        "Capacidad de organización, comunicación clara y atención a procesos",
        "Repetir siempre lo mismo sin preguntar",
        "Evitar entregar informes y documentación",
        "Asignar tareas sin coordinación",
      ],
      correctAnswer: "Capacidad de organización, comunicación clara y atención a procesos",
      careerBranch: "admin",
      explanation:
        "Una buena práctica administrativa depende de organización, comunicación clara y coordinación de procesos.",
    },
    {
      id: "q_ct_a5",
      type: "multiple_choice",
      dimension: "admin_knowledge",
      subDimension: "work_style",
      text: "En un entorno administrativo, ¿qué es una decisión bien fundamentada?",
      options: [
        "Una decisión basada en información verificada, análisis y criterios claros",
        "Una decisión arbitraria sin contexto",
        "Una decisión basada en intuiciones sin datos",
        "Una decisión atribuida a supuestos sin verificación",
      ],
      correctAnswer: "Una decisión basada en información verificada, análisis y criterios claros",
      careerBranch: "admin",
      explanation:
        "Las decisiones administrativas efectivas suelen basarse en datos, análisis y criterios lógicos, no en arbitrariedades.",
    },
    // TRACE: INFORMÁTICA
    {
      id: "q_ct_t1",
      type: "multiple_choice",
      dimension: "tech_knowledge",
      subDimension: "security",
      text: "¿Cuál es una medida básica y efectiva para proteger el acceso a sistemas y datos sensibles?",
      options: [
        "Usar la misma contraseña en todos los servicios",
        "Usar autenticación de dos factores (2FA) y contraseñas únicas por servicio",
        "Dejar la computadora sin contraseña para que todos puedan acceder",
        "Eliminar el firewall para mayor velocidad",
      ],
      correctAnswer: "Usar autenticación de dos factores (2FA) y contraseñas únicas por servicio",
      careerBranch: "tech",
      explanation:
        "El uso de autenticación de dos factores y contraseñas únicas por servicio es una de las prácticas más efectivas para proteger sistemas y datos.",
    },
    {
      id: "q_ct_t2",
      type: "multiple_choice",
      dimension: "tech_knowledge",
      subDimension: "troubleshooting",
      text: "Un usuario reporta que su computadora no enciende. ¿Cuál es el primer paso lógico de diagnóstico?",
      options: [
        "Reemplazar inmediatamente la computadora",
        "Verificar la fuente de energía, cables y estado de la red/cables de alimentación",
        "Cambiar todos los archivos del usuario sin preguntar",
        "Reinstalar el sistema operativo sin diagnóstico",
      ],
      correctAnswer: "Verificar la fuente de energía, cables y estado de la red/cables de alimentación",
      careerBranch: "tech",
      explanation:
        "El primer paso en soporte técnico es verificar los elementos básicos (energía, conexiones físicas) antes de asumir fallos complejos.",
    },
    {
      id: "q_ct_t3",
      type: "multiple_choice",
      dimension: "tech_knowledge",
      subDimension: "software",
      text: "¿Qué práctica es fundamental para mantener la disponibilidad de información digital y prevenir pérdidas por fallos?",
      options: [
        "No guardar copias de seguridad",
        "Realizar copias de seguridad (backup) periódicas y comprobar su recuperación",
        "Borrar los archivos importantes regularmente",
        "No documentar los cambios de configuración",
      ],
      correctAnswer: "Realizar copias de seguridad (backup) periódicas y comprobar su recuperación",
      careerBranch: "tech",
      explanation:
        "Las copias de seguridad periódicas y la verificación de su restauración son esenciales para garantizar la continuidad y disponibilidad de la información.",
    },
    {
      id: "q_ct_t4",
      type: "multiple_choice",
      dimension: "tech_knowledge",
      subDimension: "databases",
      text: "En las bases de datos, ¿qué operación se utiliza comúnmente para traer información de dos tablas relacionadas?",
      options: ["UNION", "JOIN", "ARCHIVE", "BACKUP"],
      correctAnswer: "JOIN",
      careerBranch: "tech",
      explanation:
        "JOIN es la operación fundamental para combinar datos de dos o más tablas relacionadas en una consulta.",
    },
    {
      id: "q_ct_t5",
      type: "multiple_choice",
      dimension: "tech_knowledge",
      subDimension: "troubleshooting",
      text: "Como técnico de nivel 1, ¿qué es lo más útil para resolver un problema de forma eficiente?",
      options: [
        "Adivinar varias veces hasta que funcione",
        "Consultar registros (logs), documentación y realizar cambios controlados",
        "Asignar el problema a otro sin revisarlo",
        "Cambiar todos los archivos sin control",
      ],
      correctAnswer: "Consultar registros (logs), documentación y realizar cambios controlados",
      careerBranch: "tech",
      explanation:
        "Los técnicos profesionales diagnostican leyendo registros, consultando documentación y aplicando cambios controlados antes de escalar.",
    },
    // TRACE: SALUD Y CUIDADO
    {
      id: "q_ct_h1",
      type: "multiple_choice",
      dimension: "health_knowledge",
      subDimension: "patient_care",
      text: "En el cuidado de personas, ¿qué principio ético profesional se considera prioritario antes de cualquier procedimiento?",
      options: [
        "Consentimiento informado",
        "Confidencialidad",
        "Benevolencia",
        "Justicia",
      ],
      correctAnswer: "Consentimiento informado",
      careerBranch: "health",
      explanation:
        "El consentimiento informado garantiza que la persona comprende y acepta el procedimiento, siendo un principio ético prioritario.",
    },
    {
      id: "q_ct_h2",
      type: "multiple_choice",
      dimension: "health_knowledge",
      subDimension: "patient_care",
      text: "La capacidad de trabajo en equipo y la comunicación clara son especialmente importantes en el cuidado de personas porque:",
      options: [
        "Mejoran la coordinación y calidad del cuidado",
        "Crea más ruido en el entorno",
        "No es relevante en salud",
        "Solo aplica a médicos",
      ],
      correctAnswer: "Mejoran la coordinación y calidad del cuidado",
      careerBranch: "health",
      explanation:
        "Un equipo de salud que se comunica bien coordina mejor el cuidado, reduce errores y mejora la calidad del servicio.",
    },
    {
      id: "q_ct_h3",
      type: "multiple_choice",
      dimension: "health_knowledge",
      subDimension: "patient_care",
      text: "¿Qué práctica está especialmente asociada a la prevención de infecciones en entornos de cuidado?",
      options: [
        "Higiene de manos correcta antes y después del contacto",
        "Limpiar solo el consultorio al final del día",
        "No tocar nunca al paciente",
        "Usar calzado deportivo",
      ],
      correctAnswer: "Higiene de manos correcta antes y después del contacto",
      careerBranch: "health",
      explanation:
        "La higiene de manos es la medida más básica y efectiva para prevenir infecciones asociadas a la atención sanitaria.",
    },
    {
      id: "q_ct_h4",
      type: "multiple_choice",
      dimension: "health_knowledge",
      subDimension: "patient_care",
      text: "¿Cuál es un indicador clave del buen cuidado de una persona en un proceso de salud o cuidado?",
      options: [
        "Quejas sin solución",
        "Tiempo de respuesta rápido, acción y perspectiva centrada en la persona",
        "Más tiempo administrativo y menos cuidado",
        "Manejo exclusivo sin coordinación",
      ],
      correctAnswer: "Tiempo de respuesta rápido, acción y perspectiva centrada en la persona",
      careerBranch: "health",
      explanation:
        "El cuidado centrado en la persona y la respuesta oportuna son indicadores clave de calidad en salud y cuidado.",
    },
    {
      id: "q_ct_h5",
      type: "multiple_choice",
      dimension: "health_knowledge",
      subDimension: "patient_care",
      text: "En el trabajo con personas, ¿cómo se considera ante un incidente o error en seguridad del paciente?",
      options: [
        "Ignorarlo para no generar conflicto",
        "Reporte, análisis de causa y mejora del sistema",
        "Asignar la culpa al coordinador sin investigación",
        "Ocultar el hecho al paciente",
      ],
      correctAnswer: "Reporte, análisis de causa y mejora del sistema",
      careerBranch: "health",
      explanation:
        "La cultura de seguridad del paciente promueve el reporte, el análisis de causa raíz y la mejora del sistema, no la culpabilización.",
    },
    // TRACE: VENTAS Y COMERCIO
    {
      id: "q_ct_s1",
      type: "multiple_choice",
      dimension: "sales_knowledge",
      subDimension: "process",
      text: "En un proceso de venta, ¿cuál es la etapa que permite identificar la necesidad real del cliente antes de proponer la solución?",
      options: [
        "Cierre",
        "Identificación de necesidades (needs discovery)",
        "Facturación",
        "Entrega del producto",
      ],
      correctAnswer: "Identificación de necesidades (needs discovery)",
      careerBranch: "sales",
      explanation:
        "La identificación de necesidades es la fase central en la que se descubren las oportunidades y problemas reales del cliente.",
    },
    {
      id: "q_ct_s2",
      type: "multiple_choice",
      dimension: "sales_knowledge",
      subDimension: "negotiation",
      text: "Cuando el cliente objetaba el precio, ¿cuál es la mejor práctica de negociación profesional?",
      options: [
        "Recortar el precio de forma inmediata sin valor",
        "Reconocer la objeción, explicar el valor diferencial y explorar alternativas",
        "Terminar la relación con el cliente",
        "Ignorar la objeción para no detener la venta",
      ],
      correctAnswer: "Reconocer la objeción, explicar el valor diferencial y explorar alternativas",
      careerBranch: "sales",
      explanation:
        "Una buena negociación no es solo bajar el precio, es entender la objeción, aclarar valor y ofrecer alternativas sensatas.",
    },
    {
      id: "q_ct_s3",
      type: "multiple_choice",
      dimension: "sales_knowledge",
      subDimension: "customer_focus",
      text: "La base de una relación comercial a largo plazo y la fidelización del cliente se sustenta en:",
      options: [
        "Confianza, servicio al cliente y entrega de valor real",
        "Solo el precio más bajo",
        "Comprar sin calidad",
        "Solo promociones",
      ],
      correctAnswer: "Confianza, servicio al cliente y entrega de valor real",
      careerBranch: "sales",
      explanation:
        "La fidelización del cliente se basa en confianza, servicio al cliente y entrega de valor real a lo largo del tiempo.",
    },
    {
      id: "q_ct_s4",
      type: "multiple_choice",
      dimension: "sales_knowledge",
      subDimension: "negotiation",
      text: "¿Qué indicador sugiere que el cliente está preparado para avanzar en la venta?",
      options: [
        "Silencio o frases sin compromiso",
        "Preguntas sobre detalles de entrega, uso o pedir una prueba / compromiso de seguimiento",
        "Crítica desinteresada",
        "Expresar solo interés general",
      ],
      correctAnswer: "Preguntas sobre detalles de entrega, uso o pedir una prueba / compromiso de seguimiento",
      careerBranch: "sales",
      explanation:
        "Las señales de cierre anticipado suelen ser preguntas sobre entrega, uso o pruebas, lo que indica intención real de avanzar.",
    },
    {
      id: "q_ct_s5",
      type: "multiple_choice",
      dimension: "sales_knowledge",
      subDimension: "metrics",
      text: "¿Qué representa el pipeline de ventas en una oportunidad comercial?",
      options: [
        "La cuenta de inventario",
        "Un conjunto de oportunidades de venta en distintas etapas del proceso",
        "El ranking de seguidores en redes sociales",
        "El historial de reembolsos",
      ],
      correctAnswer: "Un conjunto de oportunidades de venta en distintas etapas del proceso",
      careerBranch: "sales",
      explanation:
        "El pipeline de ventas es el flujo de oportunidades que pasan por las etapas del proceso comercial, desde la identificación hasta el cierre.",
    },
  ],
};
// ==================== ASSESSMENT WEIGHTS BY ROLE ====================

export const roleAssessmentWeights: Record<string, Record<string, number>> = {
  // Executive roles
  director: {
    psychometric: 20,
    cognitive: 10,
    behavioral: 30,
    technical: 10,
    experience: 25,
    skills: 5,
  },
  manager: {
    psychometric: 15,
    cognitive: 15,
    behavioral: 25,
    technical: 10,
    experience: 25,
    skills: 10,
  },
  // Technical roles
  developer: {
    psychometric: 10,
    cognitive: 15,
    behavioral: 10,
    technical: 35,
    experience: 15,
    skills: 15,
  },
  engineer: {
    psychometric: 10,
    cognitive: 15,
    behavioral: 10,
    technical: 35,
    experience: 15,
    skills: 15,
  },
  // Commercial roles
  sales: {
    psychometric: 20,
    cognitive: 10,
    behavioral: 30,
    technical: 5,
    experience: 25,
    skills: 10,
  },
  // Default
  default: {
    psychometric: 15,
    cognitive: 15,
    behavioral: 15,
    technical: 15,
    experience: 25,
    skills: 15,
  },
}

// ==================== ALL ASSESSMENTS LIST ====================

export const allAssessments = [
  bigFivePersonality,
  logicalReasoning,
  verbalReasoning,
  situationalJudgment,
  leadershipAssessment,
  careerTrackAssessment,
]

export function getAssessmentById(id: string) {
  return allAssessments.find(a => a.id === id)
}

export function getAssessmentsByCategory(category: string) {
  return allAssessments.filter(a => a.category === category)
}

export function getAssessmentsByRole(role: string) {
  return allAssessments.filter(a => 
    a.targetRoles.some(r => r.toLowerCase().includes(role.toLowerCase())) ||
    a.targetRoles.includes("Todos los cargos")
  )
}

export function getCareerTrackAssessment() {
  return allAssessments.find(a => 'careerTrack' in a && a.careerTrack === true) || careerTrackAssessment
}

export interface CareerTrackInput {
  questionId: string
  optionIndex: number
}

export function getRamaFromAnswers(answers: CareerTrackInput[]): string | null {
  const ramas: Record<string, number> = {}
  const mapaRamas: Record<string, { ramas: string[]; ponderar: Record<number, Record<string, number>> }> = {
    q_ct_1: { ramas: ['admin','tech','health','sales'], ponderar: { 0: { admin: 3, tech: 1, health: 1, sales: 1 } } },
    q_ct_2: { ramas: ['admin','tech','health','sales'], ponderar: { 0: { admin: 3, tech: 1, health: 1, sales: 2 } } },
  }
  for (const a of answers) {
    const meta = mapaRamas[a.questionId]
    if (!meta || !meta.ponderar[a.optionIndex]) continue
    for (const rama of meta.ramas) {
      ramas[rama] = (ramas[rama] || 0) + (meta.ponderar[a.optionIndex]?.[rama] || 0)
    }
  }
  const total = Object.values(ramas).reduce((s,v) => s+v, 0)
  if (total === 0) return null
  const ganadora = Object.entries(ramas).sort((a,b) => b[1]-a[1])[0][0]
  return ganadora
}
