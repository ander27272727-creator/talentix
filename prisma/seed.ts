import { PrismaClient, CompanyPlan, UserRole, VacancyStatus, AssessmentCategory } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Create Plan Pricing
  const plans = await Promise.all([
    prisma.planPricing.create({
      data: {
        plan: CompanyPlan.TRIAL,
        name: "Demo / Prueba",
        description: "Demostración del sistema - no incluye acceso completo",
        monthlyPrice: 0,
        annualPrice: 0,
        maxVacancies: 1,
        maxCandidates: 5,
        maxAssessments: 1,
        hasAPIAccess: false,
        hasCustomAssess: false,
        hasAnalytics: false,
        hasExport: false,
        hasDedicatedCSM: false,
      },
    }),
    prisma.planPricing.create({
      data: {
        plan: CompanyPlan.STARTER,
        name: "Starter",
        description: "Para empresas pequeñas que empiezan",
        monthlyPrice: 199,
        annualPrice: 1990,
        maxVacancies: 3,
        maxCandidates: 30,
        maxAssessments: 0,
        hasAPIAccess: false,
        hasCustomAssess: false,
        hasAnalytics: true,
        hasExport: false,
        hasDedicatedCSM: false,
      },
    }),
    prisma.planPricing.create({
      data: {
        plan: CompanyPlan.PROFESSIONAL,
        name: "Professional",
        description: "Para empresas en crecimiento",
        monthlyPrice: 599,
        annualPrice: 5990,
        maxVacancies: 10,
        maxCandidates: 100,
        maxAssessments: 2,
        hasAPIAccess: false,
        hasCustomAssess: true,
        hasAnalytics: true,
        hasExport: true,
        hasDedicatedCSM: false,
      },
    }),
    prisma.planPricing.create({
      data: {
        plan: CompanyPlan.ENTERPRISE,
        name: "Enterprise",
        description: "Para grandes organizaciones",
        monthlyPrice: 1499,
        annualPrice: 14990,
        maxVacancies: 30,
        maxCandidates: 500,
        maxAssessments: 5,
        hasAPIAccess: true,
        hasCustomAssess: true,
        hasAnalytics: true,
        hasExport: true,
        hasDedicatedCSM: true,
      },
    }),
  ])

  console.log(`✅ Created ${plans.length} plan pricings`)

  // Create sample assessments
  const assessments = await Promise.all([
    prisma.assessment.create({
      data: {
        name: "Perfil de Personalidad - Big Five (OCEAN)",
        category: AssessmentCategory.PSYCHOMETRIC,
        description: "Mide los cinco grandes rasgos de personalidad: Apertura, Conciencia, Extraversión, Amabilidad y Neuroticismo.",
        timeLimitMinutes: 12,
        targetRoles: ["Todos los cargos"],
        isActive: true,
        questions: {
          create: [
            {
              type: "LIKERT_SCALE",
              dimension: "openness",
              subDimension: "curiosity",
              text: "Me gusta explorar ideas nuevas y conceptos abstractos.",
              options: JSON.stringify(["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]),
              reverseScored: false,
              order: 1,
            },
            {
              type: "LIKERT_SCALE",
              dimension: "openness",
              subDimension: "creativity",
              text: "Disfruto resolver problemas de maneras poco convencionales.",
              options: JSON.stringify(["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]),
              reverseScored: false,
              order: 2,
            },
            {
              type: "LIKERT_SCALE",
              dimension: "conscientiousness",
              subDimension: "organization",
              text: "Siempre completo las tareas que empiezo.",
              options: JSON.stringify(["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]),
              reverseScored: false,
              order: 3,
            },
            {
              type: "LIKERT_SCALE",
              dimension: "extraversion",
              subDimension: "sociability",
              text: "Me siento cómodo hablando con personas que no conozco.",
              options: JSON.stringify(["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]),
              reverseScored: false,
              order: 4,
            },
            {
              type: "LIKERT_SCALE",
              dimension: "agreeableness",
              subDimension: "empathy",
              text: "Me importa mucho cómo se sienten los demás.",
              options: JSON.stringify(["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]),
              reverseScored: false,
              order: 5,
            },
            {
              type: "LIKERT_SCALE",
              dimension: "neuroticism",
              subDimension: "anxiety",
              text: "Me preocupo mucho por cosas que podrían salir mal.",
              options: JSON.stringify(["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]),
              reverseScored: false,
              order: 6,
            },
          ],
        },
      },
    }),
    prisma.assessment.create({
      data: {
        name: "Razonamiento Lógico",
        category: AssessmentCategory.COGNITIVE,
        description: "Evalúa tu capacidad para resolver problemas abstractos, detectar patrones y razonar de forma lógica.",
        timeLimitMinutes: 15,
        targetRoles: ["Developer", "Analista", "Ingeniero", "Data Scientist"],
        isActive: true,
        questions: {
          create: [
            {
              type: "MULTIPLE_CHOICE",
              dimension: "logical_reasoning",
              subDimension: "pattern_recognition",
              text: "¿Cuál es el siguiente número en la secuencia: 2, 6, 12, 20, 30, ?",
              options: JSON.stringify(["36", "40", "42", "44"]),
              reverseScored: false,
              order: 1,
            },
            {
              type: "MULTIPLE_CHOICE",
              dimension: "logical_reasoning",
              subDimension: "deduction",
              text: "Si todos los A son B, y algunos B son C, ¿qué podemos afirmar con certeza?",
              options: JSON.stringify([
                "Todos los A son C",
                "Algunos A pueden ser C",
                "Ningún A es C",
                "Todos los C son A",
              ]),
              reverseScored: false,
              order: 2,
            },
          ],
        },
      },
    }),
    prisma.assessment.create({
      data: {
        name: "Situaciones Laborales (SJT)",
        category: AssessmentCategory.BEHAVIORAL,
        description: "Evalúa tu juicio ante situaciones reales del entorno laboral.",
        timeLimitMinutes: 20,
        targetRoles: ["Manager", "Líder", "Team Lead", "Director"],
        isActive: true,
        questions: {
          create: [
            {
              type: "SCENARIO",
              dimension: "judgment",
              subDimension: "conflict_resolution",
              text: "¿Qué haces primero?",
              scenario: "Tu jefe te asigna un proyecto con un plazo de 2 semanas, pero según tu estimación, necesitarías al menos 4 semanas para hacerlo correctamente.",
              options: JSON.stringify([
                "Aceptas el plazo y trabajas las horas necesarias para cumplir",
                "Explicas al jefe tu estimación y propones un plan alternativo",
                "Acceptas el plazo pero reduces la calidad del trabajo",
                "Le pides a tu equipo que trabaje horas extra sin consultarlos",
              ]),
              reverseScored: false,
              order: 1,
            },
          ],
        },
      },
    }),
  ])

  console.log(`✅ Created ${assessments.length} assessments`)

  console.log("🎉 Seeding completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
