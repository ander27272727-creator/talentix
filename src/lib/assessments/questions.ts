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

export const technicalDeveloper = {
  id: "tech_dev_001",
  name: "Evaluación Técnica - Desarrollo de Software",
  category: "TECHNICAL",
  description: "Evalúa conocimientos técnicos en desarrollo de software, arquitectura y buenas prácticas.",
  timeLimitMinutes: 25,
  targetRoles: ["Developer", "Engineer", "Architect"],
  questions: [
    {
      id: "q_t1",
      type: "multiple_choice",
      dimension: "technical_knowledge",
      subDimension: "architecture",
      text: "¿Cuál es el principio SOLID que establece que una clase debe tener una sola razón para cambiar?",
      options: [
        "Single Responsibility Principle",
        "Open/Closed Principle",
        "Liskov Substitution Principle",
        "Interface Segregation Principle",
      ],
      correctAnswer: "Single Responsibility Principle",
      explanation: "SRP establece que una clase debe tener una única responsabilidad.",
    },
    {
      id: "q_t2",
      type: "multiple_choice",
      dimension: "technical_knowledge",
      subDimension: "database",
      text: "¿Qué normalización elimina las dependencias transitivas?",
      options: ["1NF", "2NF", "3NF", "BCNF"],
      correctAnswer: "3NF",
      explanation: "La Tercera Forma Normal (3NF) elimina las dependencias transitivas.",
    },
  ],
}

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
  technicalDeveloper,
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
