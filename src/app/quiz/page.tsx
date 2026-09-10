"use client"

import { useState } from "react"
import Link from "next/link"
import { Sparkles, ArrowRight, RotateCcw, Share2, Brain, Target, Users, Lightbulb, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { apiFetch } from "@/lib/api"

interface QuizQuestion {
  id: string
  text: string
  options: string[]
  weights: Record<string, number>
}

// Banco de preguntas del quiz viral (mismo que gestiona el admin)
const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    text: "¿Qué haces cuando enfrentas un problema que no tienes experiencia directa?",
    options: [
      "Busco tutoriales y documentación antes de pedir ayuda",
      "Pido ayuda a un colega experimentado",
      "Intento varias soluciones hasta que funcione",
      "Analizo el problema profundamente antes de actuar",
    ],
    weights: { analytic: 3, leader: 1, creative: 2, teamplayer: 1 },
  },
  {
    id: "q2",
    text: "En una reunión de equipo, tu jefe presenta una idea que tiene un problema grave. ¿Qué haces?",
    options: [
      "Lo menciono después en privado con datos",
      "Lo digo en la reunión de forma respetuosa",
      "Propongo una alternativa que soluciona el problema",
      "Espero a ver si alguien más lo nota",
    ],
    weights: { leader: 3, analytic: 2, teamplayer: 1, creative: 1 },
  },
  {
    id: "q3",
    text: "¿Qué tipo de proyecto te emociona más?",
    options: [
      "Optimizar un proceso que consume mucho tiempo",
      "Crear algo completamente nuevo desde cero",
      "Liderar un equipo para alcanzar un objetivo ambicioso",
      "Mejorar la experiencia de usuario de un producto existente",
    ],
    weights: { analytic: 3, creative: 3, leader: 2, teamplayer: 1 },
  },
  {
    id: "q4",
    text: "¿Cómo prefieres trabajar en un proyecto importante?",
    options: [
      "Con un plan detallado y plazos claros",
      "Con flexibilidad para adaptarme a cambios",
      "En equipo, con tareas asignadas y revisión periódica",
      "Con libertad creativa y horarios flexibles",
    ],
    weights: { analytic: 2, leader: 1, teamplayer: 3, creative: 3 },
  },
  {
    id: "q5",
    text: "Tu empresa lanza un nuevo producto. ¿Qué rol te gustaría?",
    options: [
      "Analizar métricas y optimizar la estrategia",
      "Diseñar la experiencia del usuario",
      "Coordinar el equipo de lanzamiento",
      "Crear el contenido de marketing",
    ],
    weights: { analytic: 3, creative: 2, leader: 3, teamplayer: 1 },
  },
]

const ARCHETYPES: Record<string, {
  name: string
  emoji: string
  description: string
  strengths: string[]
  idealRoles: string[]
  gradient: string
}> = {
  analytic: {
    name: "El Estratega Analítico",
    emoji: "🧠",
    description: "Resuelves problemas con lógica y datos. Te encanta entender el porqué de las cosas y optimizar procesos hasta la perfección.",
    strengths: ["Pensamiento crítico", "Análisis de datos", "Resolución de problemas"],
    idealRoles: ["Analista", "Data Scientist", "Consultor", "Ingeniero"],
    gradient: "from-blue-500 to-indigo-600",
  },
  creative: {
    name: "El Innovador Creativo",
    emoji: "💡",
    description: "Ves posibilidades donde otros ven obstáculos. La innovación y el diseño de experiencias son tu terreno natural.",
    strengths: ["Creatividad", "Pensamiento visual", "Innovación"],
    idealRoles: ["Diseñador UX/UI", "Product Manager", "Marketing", "Content Creator"],
    gradient: "from-purple-500 to-pink-600",
  },
  leader: {
    name: "El Líder Natural",
    emoji: "🚀",
    description: "Tomas la iniciativa y motivas a otros a lograr objetivos ambiciosos. Los equipos te siguen con confianza.",
    strengths: ["Liderazgo", "Comunicación", "Toma de decisiones"],
    idealRoles: ["Project Manager", "Team Lead", "Director", "Founder"],
    gradient: "from-orange-500 to-red-600",
  },
  teamplayer: {
    name: "El Colaborador Estrella",
    emoji: "🤝",
    description: "Creas armonía y productividad en equipo. Sabes cuándo apoyar, cuándo escuchar y cuándo empujar hacia adelante.",
    strengths: ["Colaboración", "Empatía", "Coordinación"],
    idealRoles: ["Scrum Master", "HR", "Customer Success", "Coordinador"],
    gradient: "from-emerald-500 to-teal-600",
  },
}

export default function PublicQuizPage() {
  const [started, setStarted] = useState(false)
  const [current, setCurrent] = useState(0)
  const [scores, setScores] = useState<Record<string, number>>({ analytic: 0, creative: 0, leader: 0, teamplayer: 0 })
  const [finished, setFinished] = useState(false)
  const [resultId, setResultId] = useState<string | null>(null)
  const [shareCopied, setShareCopied] = useState(false)

  const total = quizQuestions.length
  const progress = (current / total) * 100

  function answer(optionIndex: number) {
    const q = quizQuestions[current]
    const weightEntries = Object.entries(q.weights)
    // La opción elegida corresponde a la entrada i-ésima de weights
    const [archetype, weight] = weightEntries[optionIndex] || weightEntries[0]
    setScores(prev => ({ ...prev, [archetype]: (prev[archetype] || 0) + weight }))

    if (current + 1 < total) {
      setCurrent(current + 1)
    } else {
      finishQuiz()
    }
  }

  async function finishQuiz() {
    setFinished(true)
    try {
      const res = await apiFetch("/api/quiz", {
        method: "POST",
        body: JSON.stringify({ scores }),
      })
      const data = await res.json()
      if (data.success) setResultId(data.resultId)
    } catch { /* el quiz funciona sin guardar también */ }
  }

  function restart() {
    setStarted(false)
    setCurrent(0)
    setScores({ analytic: 0, creative: 0, leader: 0, teamplayer: 0 })
    setFinished(false)
    setResultId(null)
  }

  const maxScore = Math.max(...Object.values(scores), 1)
  const winner = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] || "analytic"
  const archetype = ARCHETYPES[winner]

  function shareResult() {
    const text = `Hice el quiz de Talentix y mi perfil profesional es: ${archetype.emoji} ${archetype.name}. ¿Cuál es el tuyo?`
    if (navigator.share) {
      navigator.share({ title: "Quiz Talentix", text, url: typeof window !== "undefined" ? window.location.origin + "/quiz" : "" }).catch(() => {})
    } else {
      navigator.clipboard.writeText(`${text} ${typeof window !== "undefined" ? window.location.origin + "/quiz" : ""}`)
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 2500)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">Talentix</span>
        </Link>
      </header>

      <main className="container mx-auto px-4 pb-16 max-w-2xl">
        {!started && !finished && (
          /* Pantalla de inicio */
          <div className="text-center pt-8">
            <Badge className="mb-6 bg-purple-100 text-purple-800">⚡ Quiz de 2 minutos · Sin registro</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Descubre tu{" "}
              <span className="gradient-text">Perfil Profesional</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              5 preguntas revelan tu arquetipo laboral: cómo resuelves problemas,
              lideras equipos y creas valor. Miles ya lo han hecho.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {(Object.keys(ARCHETYPES) as string[]).map((key) => (
                <div key={key} className="p-3 rounded-xl bg-white/70 border text-center">
                  <div className="text-2xl mb-1">{ARCHETYPES[key].emoji}</div>
                  <div className="text-xs font-medium">{ARCHETYPES[key].name.replace("El ", "").replace("La ", "")}</div>
                </div>
              ))}
            </div>

            <Button variant="fb" size="lg" className="text-lg px-8 py-6" onClick={() => setStarted(true)}>
              <Brain className="mr-2 h-5 w-5" />
              Comenzar el Quiz Gratis
            </Button>

            <p className="text-xs text-muted-foreground mt-4">
              Al completarlo podrás registrarte gratis para ver con qué empresas haces match.
            </p>
          </div>
        )}

        {started && !finished && (
          /* Pregunta actual */
          <div>
            <Progress value={progress} className="h-2 mb-6" />
            <p className="text-sm text-muted-foreground mb-2">Pregunta {current + 1} de {total}</p>
            <h2 className="text-2xl font-bold mb-6">{quizQuestions[current].text}</h2>
            <div className="space-y-3">
              {quizQuestions[current].options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => answer(i)}
                  className="w-full text-left p-4 rounded-xl bg-white border-2 border-transparent hover:border-fb-purple/50 hover:shadow-md transition-all"
                >
                  <span className="font-medium">{option}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {finished && (
          /* Resultado */
          <div className="text-center">
            <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${archetype.gradient} flex items-center justify-center mx-auto mb-6 text-5xl`}>
              {archetype.emoji}
            </div>
            <Badge className="mb-3 bg-emerald-100 text-emerald-800">¡Tu resultado está listo!</Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{archetype.name}</h1>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">{archetype.description}</p>

            {/* Desglose */}
            <div className="space-y-2 mb-6 text-left max-w-md mx-auto">
              {(Object.keys(ARCHETYPES) as string[]).map((key) => (
                <div key={key}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>{ARCHETYPES[key].emoji} {ARCHETYPES[key].name.replace("El ", "")}</span>
                    <span className="font-bold">{Math.round((scores[key] / maxScore) * 100)}%</span>
                  </div>
                  <Progress value={(scores[key] / maxScore) * 100} className="h-2" />
                </div>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-8 text-left max-w-md mx-auto">
              <div className="p-4 rounded-xl bg-white border">
                <p className="text-sm font-semibold mb-2 flex items-center gap-1"><Target className="h-4 w-4" /> Fortalezas</p>
                <div className="flex flex-wrap gap-1">
                  {archetype.strengths.map((s, i) => (
                    <Badge key={i} variant="outline" className="text-xs">{s}</Badge>
                  ))}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white border">
                <p className="text-sm font-semibold mb-2 flex items-center gap-1"><TrendingUp className="h-4 w-4" /> Roles ideales</p>
                <div className="flex flex-wrap gap-1">
                  {archetype.idealRoles.map((r, i) => (
                    <Badge key={i} variant="outline" className="text-xs">{r}</Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Conversión a registro */}
            <div className="p-6 rounded-2xl bg-white border-2 border-fb-purple/20 shadow-lg mb-6">
              <h3 className="font-bold text-lg mb-2">
                ¿Quieres saber con qué empresas haces match?
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Regístrate gratis y completa las evaluaciones completas para que nuestra IA
                te conecte con las mejores oportunidades para tu perfil {archetype.emoji}.
              </p>
              <Link href="/register">
                <Button variant="fb" size="lg" className="w-full">
                  Crear mi cuenta gratis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={shareResult}>
                <Share2 className="h-4 w-4 mr-1" />
                {shareCopied ? "¡Copiado!" : "Compartir resultado"}
              </Button>
              <Button variant="ghost" onClick={restart}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Repetir
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
