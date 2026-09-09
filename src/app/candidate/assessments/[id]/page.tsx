"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowRight, ArrowLeft, Clock, CheckCircle2, Brain,
  Target, Sparkles, AlertCircle, ChevronRight, Loader2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useStore } from "@/store/useStore"

// Assessment questions database
const assessmentDB: Record<string, {
  name: string
  category: string
  description: string
  timeLimitMinutes: number
  dimensions: string[]
  questions: Array<{
    id: string
    type: string
    dimension: string
    text: string
    scenario?: string
    options: Array<{ text: string; value: number; originalValue?: number; dimension: string }>
    weights: Record<string, number>
  }>
}> = {
  "cognitive-logic": {
    name: "Evaluación Cognitiva - Razonamiento Lógico",
    category: "COGNITIVE",
    description: "Mide tu capacidad para resolver problemas abstractos, detectar patrones y razonar de forma lógica.",
    timeLimitMinutes: 15,
    dimensions: ["logical_reasoning", "pattern_recognition", "deduction", "critical_thinking"],
    questions: [
      {
        id: "q1",
        type: "MULTIPLE_CHOICE",
        dimension: "pattern_recognition",
        text: "¿Cuál es el siguiente número en la secuencia: 2, 6, 12, 20, 30, ?",
        options: [
          { text: "36", value: 1, dimension: "pattern_recognition" },
          { text: "40", value: 2, dimension: "pattern_recognition" },
          { text: "42", value: 5, dimension: "pattern_recognition" },
          { text: "44", value: 1, dimension: "pattern_recognition" },
        ],
        weights: { pattern_recognition: 1.0 },
      },
      {
        id: "q2",
        type: "MULTIPLE_CHOICE",
        dimension: "deduction",
        text: "Si todos los A son B, y algunos B son C, ¿qué podemos afirmar con certeza?",
        scenario: "Razonamiento lógico deductivo",
        options: [
          { text: "Todos los A son C", value: 1, dimension: "deduction" },
          { text: "Algunos A pueden ser C", value: 5, dimension: "deduction" },
          { text: "Ningún A es C", value: 1, dimension: "deduction" },
          { text: "Todos los C son A", value: 1, dimension: "deduction" },
        ],
        weights: { deduction: 1.0 },
      },
      {
        id: "q3",
        type: "LIKERT_SCALE",
        dimension: "critical_thinking",
        text: "Antes de tomar una decisión importante, tiendo a analizar todas las alternativas disponibles.",
        options: [
          { text: "Totalmente en desacuerdo", value: 1, dimension: "critical_thinking" },
          { text: "En desacuerdo", value: 2, dimension: "critical_thinking" },
          { text: "Neutral", value: 3, dimension: "critical_thinking" },
          { text: "De acuerdo", value: 4, dimension: "critical_thinking" },
          { text: "Totalmente de acuerdo", value: 5, dimension: "critical_thinking" },
        ],
        weights: { critical_thinking: 1.0 },
      },
      {
        id: "q4",
        type: "MULTIPLE_CHOICE",
        dimension: "logical_reasoning",
        text: "Si A > B, B > C, y C > D, ¿cuál es correcto?",
        options: [
          { text: "A > D", value: 5, dimension: "logical_reasoning" },
          { text: "D > A", value: 1, dimension: "logical_reasoning" },
          { text: "A = D", value: 1, dimension: "logical_reasoning" },
          { text: "No se puede determinar", value: 1, dimension: "logical_reasoning" },
        ],
        weights: { logical_reasoning: 1.0 },
      },
      {
        id: "q5",
        type: "SCENARIO",
        dimension: "critical_thinking",
        text: "¿Qué haces primero?",
        scenario: "Tu equipo descubre un bug crítico en producción que afecta al 30% de los usuarios. Hay varias soluciones posibles pero ninguna es perfecta.",
        options: [
          { text: "Implemento la solución rápida y planeo una revisión después", value: 3, dimension: "critical_thinking" },
          { text: "Analizo todas las opciones, evalúo riesgos y luego decido", value: 5, dimension: "critical_thinking" },
          { text: "Delego la decisión al technical lead", value: 2, dimension: "critical_thinking" },
          { text: "Espero a que el equipo se reúna para decidir juntos", value: 3, dimension: "critical_thinking" },
        ],
        weights: { critical_thinking: 0.7, logical_reasoning: 0.3 },
      },
      {
        id: "q6",
        type: "MULTIPLE_CHOICE",
        dimension: "pattern_recognition",
        text: "¿Qué patrón sigue esta serie? J, F, M, A, M, J, J, ?",
        options: [
          { text: "S (Septiembre)", value: 1, dimension: "pattern_recognition" },
          { text: "A (Agosto)", value: 5, dimension: "pattern_recognition" },
          { text: "O (Octubre)", value: 1, dimension: "pattern_recognition" },
          { text: "N (Noviembre)", value: 1, dimension: "pattern_recognition" },
        ],
        weights: { pattern_recognition: 1.0 },
      },
      {
        id: "q7",
        type: "LIKERT_SCALE",
        dimension: "logical_reasoning",
        text: "Prefiero resolver problemas que requieran pensamiento analítico antes que tareas rutinarias.",
        options: [
          { text: "Totalmente en desacuerdo", value: 1, dimension: "logical_reasoning" },
          { text: "En desacuerdo", value: 2, dimension: "logical_reasoning" },
          { text: "Neutral", value: 3, dimension: "logical_reasoning" },
          { text: "De acuerdo", value: 4, dimension: "logical_reasoning" },
          { text: "Totalmente de acuerdo", value: 5, dimension: "logical_reasoning" },
        ],
        weights: { logical_reasoning: 1.0 },
      },
      {
        id: "q8",
        type: "MULTIPLE_CHOICE",
        dimension: "deduction",
        text: "Si hoy es miércoles, ¿qué día será dentro de 100 días?",
        options: [
          { text: "Miércoles", value: 1, dimension: "deduction" },
          { text: "Jueves", value: 1, dimension: "deduction" },
          { text: "Viernes", value: 5, dimension: "deduction" },
          { text: "Sábado", value: 1, dimension: "deduction" },
        ],
        weights: { deduction: 1.0 },
      },
    ],
  },
  "psychometric-bigfive": {
    name: "Perfil de Personalidad - Big Five (OCEAN)",
    category: "PSYCHOMETRIC",
    description: "Mide los cinco grandes rasgos de personalidad: Apertura, Conciencia, Extraversión, Amabilidad y Neuroticismo.",
    timeLimitMinutes: 12,
    dimensions: ["openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"],
    questions: [
      {
        id: "p1", type: "LIKERT_SCALE", dimension: "openness",
        text: "Me gusta explorar ideas nuevas y conceptos abstractos.",
        options: [
          { text: "Totalmente en desacuerdo", value: 1, dimension: "openness" },
          { text: "En desacuerdo", value: 2, dimension: "openness" },
          { text: "Neutral", value: 3, dimension: "openness" },
          { text: "De acuerdo", value: 4, dimension: "openness" },
          { text: "Totalmente de acuerdo", value: 5, dimension: "openness" },
        ],
        weights: { openness: 1.0 },
      },
      {
        id: "p2", type: "LIKERT_SCALE", dimension: "conscientiousness",
        text: "Siempre completo las tareas que empiezo.",
        options: [
          { text: "Totalmente en desacuerdo", value: 1, dimension: "conscientiousness" },
          { text: "En desacuerdo", value: 2, dimension: "conscientiousness" },
          { text: "Neutral", value: 3, dimension: "conscientiousness" },
          { text: "De acuerdo", value: 4, dimension: "conscientiousness" },
          { text: "Totalmente de acuerdo", value: 5, dimension: "conscientiousness" },
        ],
        weights: { conscientiousness: 1.0 },
      },
      {
        id: "p3", type: "LIKERT_SCALE", dimension: "extraversion",
        text: "Me siento cómodo hablando con personas que no conozco.",
        options: [
          { text: "Totalmente en desacuerdo", value: 1, dimension: "extraversion" },
          { text: "En desacuerdo", value: 2, dimension: "extraversion" },
          { text: "Neutral", value: 3, dimension: "extraversion" },
          { text: "De acuerdo", value: 4, dimension: "extraversion" },
          { text: "Totalmente de acuerdo", value: 5, dimension: "extraversion" },
        ],
        weights: { extraversion: 1.0 },
      },
      {
        id: "p4", type: "LIKERT_SCALE", dimension: "agreeableness",
        text: "Me importa mucho cómo se sienten los demás.",
        options: [
          { text: "Totalmente en desacuerdo", value: 1, dimension: "agreeableness" },
          { text: "En desacuerdo", value: 2, dimension: "agreeableness" },
          { text: "Neutral", value: 3, dimension: "agreeableness" },
          { text: "De acuerdo", value: 4, dimension: "agreeableness" },
          { text: "Totalmente de acuerdo", value: 5, dimension: "agreeableness" },
        ],
        weights: { agreeableness: 1.0 },
      },
      {
        id: "p5", type: "LIKERT_SCALE", dimension: "neuroticism",
        text: "Me preocupo mucho por cosas que podrían salir mal.",
        options: [
          { text: "Totalmente en desacuerdo", value: 1, dimension: "neuroticism" },
          { text: "En desacuerdo", value: 2, dimension: "neuroticism" },
          { text: "Neutral", value: 3, dimension: "neuroticism" },
          { text: "De acuerdo", value: 4, dimension: "neuroticism" },
          { text: "Totalmente de acuerdo", value: 5, dimension: "neuroticism" },
        ],
        weights: { neuroticism: 1.0 },
      },
      {
        id: "p6", type: "LIKERT_SCALE", dimension: "openness",
        text: "Disfruto resolver problemas de maneras poco convencionales.",
        options: [
          { text: "Totalmente en desacuerdo", value: 1, dimension: "openness" },
          { text: "En desacuerdo", value: 2, dimension: "openness" },
          { text: "Neutral", value: 3, dimension: "openness" },
          { text: "De acuerdo", value: 4, dimension: "openness" },
          { text: "Totalmente de acuerdo", value: 5, dimension: "openness" },
        ],
        weights: { openness: 1.0 },
      },
      {
        id: "p7", type: "LIKERT_SCALE", dimension: "conscientiousness",
        text: "Mantengo mi espacio de trabajo ordenado y mi agenda organizada.",
        options: [
          { text: "Totalmente en desacuerdo", value: 1, dimension: "conscientiousness" },
          { text: "En desacuerdo", value: 2, dimension: "conscientiousness" },
          { text: "Neutral", value: 3, dimension: "conscientiousness" },
          { text: "De acuerdo", value: 4, dimension: "conscientiousness" },
          { text: "Totalmente de acuerdo", value: 5, dimension: "conscientiousness" },
        ],
        weights: { conscientiousness: 1.0 },
      },
      {
        id: "p8", type: "LIKERT_SCALE", dimension: "extraversion",
        text: "En reuniones sociales, tiendo a ser el que más habla.",
        options: [
          { text: "Totalmente en desacuerdo", value: 1, dimension: "extraversion" },
          { text: "En desacuerdo", value: 2, dimension: "extraversion" },
          { text: "Neutral", value: 3, dimension: "extraversion" },
          { text: "De acuerdo", value: 4, dimension: "extraversion" },
          { text: "Totalmente de acuerdo", value: 5, dimension: "extraversion" },
        ],
        weights: { extraversion: 1.0 },
      },
      {
        id: "p9", type: "SCENARIO", dimension: "agreeableness",
        text: "¿Qué haces?",
        scenario: "Un compañero de equipo comete un error que retrasa el proyecto. Nadie lo ha notado todavía.",
        options: [
          { text: "Le informo directamente y ayudo a corregirlo", value: 5, dimension: "agreeableness" },
          { text: "Lo reporto a mi manager", value: 2, dimension: "agreeableness" },
          { text: "No digo nada, no es mi responsabilidad", value: 1, dimension: "agreeableness" },
          { text: "Espero a que alguien más lo note", value: 2, dimension: "agreeableness" },
        ],
        weights: { agreeableness: 0.7, conscientiousness: 0.3 },
      },
      {
        id: "p10", type: "LIKERT_SCALE", dimension: "neuroticism",
        text: "En situaciones de presión, mantengo la calma y enfoco en la solución.",
        options: [
          { text: "Totalmente en desacuerdo", value: 1, dimension: "neuroticism" },
          { text: "En desacuerdo", value: 2, dimension: "neuroticism" },
          { text: "Neutral", value: 3, dimension: "neuroticism" },
          { text: "De acuerdo", value: 4, dimension: "neuroticism" },
          { text: "Totalmente de acuerdo", value: 5, dimension: "neuroticism" },
        ],
        weights: { neuroticism: 1.0 },
      },
    ],
  },
  "behavioral-sjt": {
    name: "Situaciones Laborales (SJT)",
    category: "BEHAVIORAL",
    description: "Evalúa tu juicio ante situaciones reales del entorno laboral.",
    timeLimitMinutes: 20,
    dimensions: ["judgment", "leadership", "teamwork", "conflict_resolution"],
    questions: [
      {
        id: "s1", type: "SCENARIO", dimension: "conflict_resolution",
        text: "¿Qué haces primero?",
        scenario: "Tu jefe te asigna un proyecto con un plazo de 2 semanas, pero según tu estimación, necesitarías al menos 4 semanas para hacerlo correctamente.",
        options: [
          { text: "Aceptas el plazo y trabajas las horas necesarias para cumplir", value: 2, dimension: "conflict_resolution" },
          { text: "Explicas al jefe tu estimación y propones un plan alternativo", value: 5, dimension: "conflict_resolution" },
          { text: "Aceptas el plazo pero reduces la calidad del trabajo", value: 1, dimension: "conflict_resolution" },
          { text: "Le pides a tu equipo que trabaje horas extra sin consultarlos", value: 1, dimension: "conflict_resolution" },
        ],
        weights: { conflict_resolution: 0.6, leadership: 0.4 },
      },
      {
        id: "s2", type: "SCENARIO", dimension: "teamwork",
        text: "¿Cómo respondes?",
        scenario: "Un miembro de tu equipo consistentemente no cumple con sus entregables, afectando al resto del equipo.",
        options: [
          { text: "Hablas con esa persona en privado para entender su situación", value: 5, dimension: "teamwork" },
          { text: "Lo reportas a tu manager inmediatamente", value: 2, dimension: "teamwork" },
          { text: "Ignoras la situación y esperas que mejore", value: 1, dimension: "teamwork" },
          { text: "Asignas sus tareas a otros miembros del equipo", value: 1, dimension: "teamwork" },
        ],
        weights: { teamwork: 0.7, conflict_resolution: 0.3 },
      },
      {
        id: "s3", type: "SCENARIO", dimension: "leadership",
        text: "¿Cuál es tu enfoque?",
        scenario: "Estás liderando un equipo de 5 personas. El proyecto va retrasado y el moral del equipo está bajo.",
        options: [
          { text: "Organizas una reunión transparente sobre el estado y buscas input del equipo", value: 5, dimension: "leadership" },
          { text: "Trabajas más horas tú solo para compensar", value: 2, dimension: "leadership" },
          { text: "Exiges al equipo que cumpla sin cuestionamientos", value: 1, dimension: "leadership" },
          { text: "Solicitas una extensión del plazo sin explicar al equipo", value: 2, dimension: "leadership" },
        ],
        weights: { leadership: 0.8, teamwork: 0.2 },
      },
      {
        id: "s4", type: "SCENARIO", dimension: "judgment",
        text: "¿Qué decides?",
        scenario: "Descubres que una decisión de tu manager podría causar un problema grave en el futuro, pero cuestionarla podría generar conflicto.",
        options: [
          { text: "Preparas un análisis documentado y lo presentas de forma constructiva", value: 5, dimension: "judgment" },
          { text: "No dices nada para evitar problemas", value: 1, dimension: "judgment" },
          { text: "Hablas con el manager de forma informal sin datos", value: 3, dimension: "judgment" },
          { text: "Lo mencionas en la próxima reunión de equipo públicamente", value: 2, dimension: "judgment" },
        ],
        weights: { judgment: 0.6, leadership: 0.4 },
      },
    ],
  },
}

interface Answer {
  questionId: string
  value: number
  timeSpentSeconds: number
}

// Etiquetas en español para cada dimensión evaluada
const DIMENSION_LABELS: Record<string, string> = {
  // Cognitivas
  pattern_recognition: "Reconocimiento de Patrones",
  logical_reasoning: "Razonamiento Lógico",
  critical_thinking: "Pensamiento Crítico",
  deduction: "Deducción",
  judgment: "Juicio Profesional",
  // Personalidad (Big Five)
  openness: "Apertura a la Experiencia",
  conscientiousness: "Responsabilidad y Disciplina",
  extraversion: "Extraversión",
  agreeableness: "Amabilidad y Colaboración",
  neuroticism: "Estabilidad Emocional",
  // Comportamentales (SJT)
  leadership: "Liderazgo",
  teamwork: "Trabajo en Equipo",
  conflict_resolution: "Resolución de Conflictos",
  ethics: "Ética Profesional",
  pressure_management: "Manejo bajo Presión",
  // Técnicas
  architecture: "Arquitectura de Software",
  databases: "Bases de Datos",
  algorithms: "Algoritmos y Estructuras",
  security: "Seguridad",
  performance: "Optimización y Rendimiento",
  best_practices: "Buenas Prácticas",
}

// Contexto de qué mide cada dimensión
const DIMENSION_EXPLANATIONS: Record<string, string> = {
  pattern_recognition: "Detectar secuencias y regularidades — clave para análisis de datos y programación.",
  logical_reasoning: "Sacar conclusiones válidas a partir de premisas dadas.",
  critical_thinking: "Evaluar información y decisiones con objetividad antes de actuar.",
  deduction: "Aplicar reglas generales a casos concretos.",
  judgment: "Elegir la mejor acción en situaciones profesionales ambiguas.",
  openness: "Curiosidad, creatividad y disposición ante lo nuevo.",
  conscientiousness: "Organización, disciplina y cumplimiento de metas — el rasgo que mejor predice desempeño laboral.",
  extraversion: "Energía social y comodidad en interacción con grupos.",
  agreeableness: "Empatía, colaboración y orientación al equipo.",
  neuroticism: "Capacidad de mantener la calma y estabilidad ante el estrés.",
  leadership: "Guiar equipos y tomar decisiones con responsabilidad.",
  teamwork: "Colaboración y apoyo mutuo para lograr objetivos comunes.",
  conflict_resolution: "Manejar desacuerdos de forma constructiva y profesional.",
  ethics: "Actuar con integridad incluso cuando nadie supervisa.",
  pressure_management: "Rendir con calidad cuando el tiempo o la exigencia aprietan.",
  architecture: "Diseñar sistemas escalables y mantenibles.",
  databases: "Consultas, modelado y optimización de datos.",
  algorithms: "Resolver problemas con eficiencia computacional.",
  security: "Proteger sistemas y datos ante vulnerabilidades.",
  performance: "Identificar y eliminar cuellos de botella.",
  best_practices: "Escribir código limpio, testeable y sostenible.",
}

export default function AssessmentPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { addAssessmentResponse, addNotification } = useStore()
  const [assessmentId, setAssessmentId] = useState("")
  const [assessment, setAssessment] = useState<typeof assessmentDB[string] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [totalTimeSpent, setTotalTimeSpent] = useState(0)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [isCompleted, setIsCompleted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [scores, setScores] = useState<Record<string, number>>({})

  useEffect(() => {
    params.then(p => {
      setAssessmentId(p.id)
      // Intentar cargar desde Supabase primero
      fetch(`/api/assessments/${p.id}`)
        .then(r => r.json())
        .then(data => {
          if (data.success && data.assessment) {
            const a = data.assessment
            // Mapear preguntas de Supabase al formato UI
            const questions = (a.questions || []).map((q: Record<string, unknown>, i: number) => {
              // Las opciones pueden llegar como string JSON (desde Supabase) o como array
              let opts: Array<{text: string; value: number}> = []
              if (typeof q.options === 'string') {
                try { opts = JSON.parse(q.options) } catch { opts = [] }
              } else if (Array.isArray(q.options)) {
                opts = q.options as Array<{text: string; value: number}>
              }
              return {
                // IMPORTANTE: usar el `id` (cuid) porque AssessmentAnswer.questionId referencia Question.id
                id: (q.id as string) || `q${i}`,
                type: (q.type as string)?.toLowerCase().replace(/_/g, '_') || 'MULTIPLE_CHOICE',
                dimension: q.dimension as string || 'general',
                text: q.text as string,
                scenario: q.scenario as string || undefined,
                options: opts.map((o, j: number) => ({
                  text: o.text,
                  value: j,
                  originalValue: typeof o.value === 'number' ? o.value : j + 1,
                  dimension: q.dimension as string || 'general',
                })),
                weights: { [q.dimension as string || 'general']: 1.0 },
              }
            })
            if (questions.length === 0) {
              setError("Esta evaluación no tiene preguntas disponibles. Contacta al administrador.")
              setLoading(false)
              return
            }
            setAssessment({
              name: a.name,
              category: a.category,
              description: a.description,
              timeLimitMinutes: a.timeLimitMinutes,
              dimensions: [...new Set(a.questions?.map((q: Record<string, unknown>) => q.dimension as string) || [])] as string[],
              questions,
            })
            setTimeLeft((a.timeLimitMinutes || 15) * 60)
            setLoading(false)
          } else {
            // Fallback al DB local
            const found = assessmentDB[p.id]
            if (found) {
              setAssessment(found)
              setTimeLeft(found.timeLimitMinutes * 60)
            } else {
              setError("Esta evaluación no existe o no está disponible en este momento.")
            }
            setLoading(false)
          }
        })
        .catch(() => {
          // Fallback al DB local
          const found = assessmentDB[p.id]
          if (found) {
            setAssessment(found)
            setTimeLeft(found.timeLimitMinutes * 60)
          } else {
            setError("No se pudo cargar la evaluación. Verifica tu conexión e inténtalo de nuevo.")
          }
          setLoading(false)
        })
    })
  }, [params])

  const answersRef = useRef<Answer[]>([])
  answersRef.current = answers

  // Timer
  useEffect(() => {
    if (isCompleted || !assessment) return
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setIsCompleted(true)
          calculateScores(answersRef.current)
          return 0
        }
        return prev - 1
      })
      setTotalTimeSpent((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [isCompleted, assessment])

  const handleSelectOption = (optionIndex: number) => {
    setSelectedOption(optionIndex)
  }

  const handleNext = () => {
    if (selectedOption === null || !assessment) return

    const question = assessment.questions[currentQuestion]
    const option = question.options[selectedOption]
    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000)

    const newAnswer: Answer = {
      questionId: question.id,
      value: option.value,
      timeSpentSeconds: timeSpent,
    }

    const newAnswers = [...answers, newAnswer]
    setAnswers(newAnswers)
    setSelectedOption(null)
    setQuestionStartTime(Date.now())

    if (currentQuestion < assessment.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateScores(newAnswers)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      const prevAnswer = answers[currentQuestion - 1]
      if (prevAnswer) {
        setSelectedOption(null)
      }
    }
  }

  const calculateScores = useCallback((finalAnswers: Answer[]) => {
    const store = useStore.getState()
    if (!assessment) return

    const dimensionScores: Record<string, { total: number; count: number }> = {}
    let correctCount = 0
    let gradableCount = 0

    finalAnswers.forEach((answer) => {
      const question = assessment.questions.find((q) => q.id === answer.questionId)
      if (!question) return

      // El valor guardado es el índice de la opción seleccionada.
      // La opción elegida tiene el valor real (1=correcta en cognitivas/técnicas, 1-5 en Likert).
      const selectedOptionObj = question.options[answer.value]
      if (!selectedOptionObj) return

      // Puntuación por dimensión: las opciones traen value real (1-5 en Likert, 0/1 en multiple choice)
      // Normalizamos: para LIKERT el value 1-5 ya es proporcional; para choice correcto=1
      const rawValue = selectedOptionObj.originalValue ?? (answer.value + 1)
      const normalized = Math.max(0, Math.min(100, (rawValue / 5) * 100))

      // Contar aciertos en preguntas tipo test (correctas = valor 1)
      if (question.type === 'multiple_choice' || question.type === 'scenario') {
        gradableCount++
        if ((selectedOptionObj.originalValue ?? 0) >= 1) correctCount++
      }

      Object.entries(question.weights).forEach(([dimension, weight]) => {
        if (!dimensionScores[dimension]) {
          dimensionScores[dimension] = { total: 0, count: 0 }
        }
        dimensionScores[dimension].total += normalized * weight
        dimensionScores[dimension].count += weight
      })
    })

    const finalScores: Record<string, number> = {}
    Object.entries(dimensionScores).forEach(([dim, data]) => {
      finalScores[dim] = Math.round(data.total / data.count)
    })

    // Score general: promedio de dimensiones, o % de aciertos si hay preguntas gradables
    let overallScore: number
    if (gradableCount > 0) {
      // Evaluaciones tipo test: 70% aciertos + 30% promedio de dimensiones
      const accuracy = (correctCount / gradableCount) * 100
      const dimAvg = Object.keys(finalScores).length > 0
        ? Object.values(finalScores).reduce((a, b) => a + b, 0) / Object.keys(finalScores).length
        : accuracy
      overallScore = Math.round(accuracy * 0.7 + dimAvg * 0.3)
    } else {
      overallScore = Math.round(
        Object.values(finalScores).reduce((a, b) => a + b, 0) / Math.max(1, Object.values(finalScores).length)
      )
    }
    finalScores["overall"] = overallScore

    setScores(finalScores)
    setIsCompleted(true)
    setShowResults(true)

    // Save to Supabase API
    const user = useStore.getState().user
    if (user?.id) {
      fetch(`/api/assessments/${assessmentId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          answers: finalAnswers.map(a => ({
            questionId: a.questionId,
            value: a.value,
            timeSpentSeconds: a.timeSpentSeconds,
          })),
          score: overallScore,
          dimensionScores: finalScores,
          totalTimeSpent,
        }),
      }).then(r => r.json())
      .then(data => {
        if (data.success) {
          addAssessmentResponse({
            id: data.response.id,
            candidateId: user.id,
            assessmentId,
            answers: finalAnswers,
            startedAt: new Date(Date.now() - totalTimeSpent * 1000).toISOString(),
            completedAt: new Date().toISOString(),
            score: overallScore,
            dimensionScores: finalScores,
          })
          store.addNotification({
            id: `save-ok-${Date.now()}`,
            type: "success",
            title: "Resultado guardado",
            message: "Tu evaluación quedó registrada en tu perfil y tus matches fueron actualizados.",
            createdAt: new Date().toISOString(),
          })
        } else {
          console.error('Error guardando respuesta:', data.error)
          store.addNotification({
            id: `save-err-${Date.now()}`,
            type: "error",
            title: "No se pudo guardar",
            message: data.error || "Tu resultado no se guardó. Inténtalo de nuevo desde la lista de evaluaciones.",
            createdAt: new Date().toISOString(),
          })
        }
      })
      .catch(err => {
        console.error('Error guardando respuesta:', err)
        store.addNotification({
          id: `save-err-${Date.now()}`,
          type: "error",
          title: "No se pudo guardar",
          message: "Error de conexión. Tu resultado no se guardó — vuelve a intentarlo.",
          createdAt: new Date().toISOString(),
        })
      })
    }

    store.addNotification({
      id: `notif-${Date.now()}`,
      type: "success",
      title: "¡Evaluación Completada!",
      message: `Has obtenido ${overallScore}% en ${assessment.name}`,
      createdAt: new Date().toISOString(),
    })
  }, [assessment, assessmentId, totalTimeSpent, addAssessmentResponse, addNotification])

  if (!assessment) {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-fb-blue mx-auto mb-4" />
            <p className="text-muted-foreground">Cargando evaluación...</p>
          </div>
        </div>
      )
    }
    if (error) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-semibold mb-2 text-red-600">Error al cargar</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Link href="/candidate/assessments">
              <Button variant="fb">Volver a Evaluaciones</Button>
            </Link>
          </div>
        </div>
      )
    }
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Evaluación no encontrada</h2>
          <p className="text-muted-foreground mb-4">Esta evaluación no existe o no está disponible.</p>
          <Link href="/candidate/assessments">
            <Button variant="fb">Volver a Evaluaciones</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Results screen
  if (showResults) {
    const overallScore = scores["overall"] || 0
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-blue-50">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">¡Evaluación Completada!</h2>
            <p className="text-muted-foreground mb-6">{assessment.name}</p>

            <div className="text-6xl font-bold gradient-text mb-2">{overallScore}%</div>
            <p className="text-muted-foreground mb-6">Score General</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-md mx-auto">
              {Object.entries(scores).filter(([k]) => k !== "overall").map(([dim, score]) => (
                <div key={dim} className="p-3 rounded-xl bg-white/60">
                  <div className="text-sm font-medium mb-1">
                    {DIMENSION_LABELS[dim] || dim.replace(/_/g, " ").replace(/^\w/, c => c.toUpperCase())}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{DIMENSION_EXPLANATIONS[dim] || ""}</p>
                  <div className="flex items-center gap-2">
                    <Progress value={score} className="h-2 flex-1" />
                    <span className="font-semibold text-sm">{score}%</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-white/60">
              <div className="flex items-center gap-2 justify-center mb-2">
                <Sparkles className="h-4 w-4 text-fb-purple" />
                <span className="font-medium text-sm">Insight de IA</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {overallScore >= 80
                  ? "¡Excelente! Tus resultados son sobresalientes y fortalecerán significativamente tu perfil ante las empresas. Sigue así."
                  : overallScore >= 60
                  ? "Buenos resultados. Completar el resto de evaluaciones disponibles mejorará tu visibilidad ante reclutadores."
                  : "Tus resultados muestran áreas de oportunidad. Completa las demás evaluaciones y mejora tu perfil para mejores matches."}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-center">
          <Link href="/candidate/assessments">
            <Button variant="fb-outline">Volver a Evaluaciones</Button>
          </Link>
          <Link href="/candidate/matches">
            <Button variant="fb">
              Ver Mis Matches
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const question = assessment.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / assessment.questions.length) * 100
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const isLowTime = timeLeft < 120

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">{assessment.name}</h1>
          <p className="text-sm text-muted-foreground">
            Pregunta {currentQuestion + 1} de {assessment.questions.length}
          </p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${isLowTime ? "bg-red-50 text-red-600" : "bg-muted"}`}>
          <Clock className="h-4 w-4" />
          <span className="font-mono font-semibold">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div>
        <Progress value={progress} className="h-3" />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{Math.round(progress)}% completado</span>
          <span>{assessment.timeLimitMinutes} min límite</span>
        </div>
      </div>

      {/* Question Card */}
      <Card className="border-2">
        <CardContent className="p-8">
          {question.scenario && (
            <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
              <div className="flex items-center gap-2 text-amber-700 font-medium mb-2">
                <AlertCircle className="h-4 w-4" />
                Situación
              </div>
              <p className="text-sm text-amber-800">{question.scenario}</p>
            </div>
          )}

          <h2 className="text-lg font-semibold mb-6">{question.text}</h2>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelectOption(index)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedOption === index
                    ? "border-fb-blue bg-fb-blue/5 shadow-md"
                    : "border-border hover:border-fb-blue/30 hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    selectedOption === index
                      ? "bg-fb-blue text-white"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="flex-1">{option.text}</span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Anterior
        </Button>

        <Button
          variant="fb"
          onClick={handleNext}
          disabled={selectedOption === null}
        >
          {currentQuestion === assessment.questions.length - 1 ? "Finalizar" : "Siguiente"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Low time warning */}
      {isLowTime && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-center">
          <p className="text-sm text-red-600 font-medium">
            ⚠️ Quedan menos de 2 minutos. ¡Apúrate!
          </p>
        </div>
      )}
    </div>
  )
}
