"use client"

import { useState } from "react"
import {
  Brain, Share2, Eye, BarChart3, Plus, Trash2, GripVertical,
  ExternalLink, TrendingUp, Users, Zap, Copy, Check, Sparkles,
  Video, MessageSquare, PenTool, BookOpen, Globe, Target,
  ChevronDown, ChevronUp, Lightbulb, Rocket, Award, Clock
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

const quizStats = {
  totalViews: 12847,
  totalStarts: 8234,
  totalCompletions: 5621,
  registrationsGenerated: 2341,
  conversionRate: 28.4,
  sharesCount: 3892,
  avgTimeMinutes: 2.3,
}

const quizQuestions = [
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

const socialPlatforms = [
  {
    name: "TikTok",
    icon: Video,
    color: "from-black to-gray-800",
    textColor: "text-white",
    content: "\"Haz este quiz y descubre tu perfil profesional\"",
    format: "Videos de 30-60 segundos",
    frequency: "3x por semana",
    tips: [
      "Mostrar preguntas en pantalla con countdown",
      "Revelar resultado al final con CTA a Talentix",
      "Usar música trending del momento",
      "Hashtags: #empleo #evaluación #perfilprofesional #desarrolllaboral",
    ],
    estimatedReach: "5,000-50,000 vistas/video",
    bestTime: "12:00-14:00 y 19:00-21:00",
  },
  {
    name: "Instagram Stories/Reels",
    icon: Share2,
    color: "from-purple-500 via-pink-500 to-orange-400",
    textColor: "text-white",
    content: "Encuestas interactivas + carruseles educativos",
    format: "Stories (15 seg) + Reels (30-90 seg)",
    frequency: "4x por semana",
    tips: [
      "Usar encuestas de Instagram para cada pregunta del quiz",
      "Carruseles: '5 señales de que necesitas cambiar de empleo'",
      "Reels con resultados de evaluaciones reales (anónimos)",
      "Hashtags: #careeradvice #jobsearch #futurodetrabajo",
    ],
    estimatedReach: "2,000-20,000 impresiones/story",
    bestTime: "9:00-11:00 y 18:00-20:00",
  },
  {
    name: "Twitter/X",
    icon: MessageSquare,
    color: "from-black to-gray-900",
    textColor: "text-white",
    content: "Hilos educativos + preguntas virales",
    format: "Hilos (5-10 tweets) + Polls",
    frequency: "Diario",
    tips: [
      "Hilo: 'El 73% de las personas responden mal esta pregunta de razonamiento...'",
      "Polls semanales con preguntas tipo evaluación",
      "Compartir datos de tendencias laborales",
      "Hilos de consejos profesionales con CTA a Talentix",
    ],
    estimatedReach: "1,000-10,000 impresiones/hilo",
    bestTime: "8:00-10:00 y 17:00-19:00",
  },
  {
    name: "LinkedIn",
    icon: PenTool,
    color: "from-blue-600 to-blue-800",
    textColor: "text-white",
    content: "Artículos profesionales + posts de valor",
    format: "Artículos largos + Posts con imágenes",
    frequency: "2x por semana",
    tips: [
      "'Cómo la IA está revolucionando el reclutamiento'",
      "Posts con datos: 'Las 5 habilidades más buscadas en 2026'",
      "Casos de éxito de candidatos que encontraron empleo",
      "Artículos SEO sobre evaluaciones psicométricas",
    ],
    estimatedReach: "3,000-30,000 impresiones/post",
    bestTime: "Martes-Jueves 7:30-8:30",
  },
  {
    name: "Blog SEO",
    icon: BookOpen,
    color: "from-emerald-500 to-teal-600",
    textColor: "text-white",
    content: "Artículos educativos optimizados para Google",
    format: "Artículos de 1,500-3,000 palabras",
    frequency: "2x por semana",
    tips: [
      "'Cómo prepararte para una evaluación psicométrica'",
      "'Evaluaciones Big Five vs MBTI: diferencias'",
      "Guías por carrera: 'Desarrollador Full Stack 2026'",
      "Optimizar para keywords de alta búsqueda",
    ],
    estimatedReach: "100-10,000 visitas/artículo (SEO)",
    bestTime: "Publicar martes o miércoles",
  },
]

export default function QuizAdminPage() {
  const [copiedLink, setCopiedLink] = useState(false)
  const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null)

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://talentix.com/quiz")
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-7 w-7 text-fb-purple" />
            Quiz Viral — Generador de Candidatos
          </h1>
          <p className="text-muted-foreground mt-1">
            Evalúa tu perfil profesional en 2 minutos y descubre tu match con empresas reales
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="fb-outline" onClick={handleCopyLink}>
            {copiedLink ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            {copiedLink ? "¡Copiado!" : "Copiar Link"}
          </Button>
          <Button variant="fb">
            <Eye className="h-4 w-4 mr-2" />
            Ver Quiz Público
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{quizStats.totalViews.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Visitas totales</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <Brain className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{quizStats.totalCompletions.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Quiz completados</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{quizStats.registrationsGenerated.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Registros generados</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{quizStats.conversionRate}%</div>
                <div className="text-xs text-muted-foreground">Tasa de conversión</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Funnel */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-fb-blue" />
            Embudo de Conversión del Quiz
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { label: "Visitas a la página del quiz", value: quizStats.totalViews, pct: 100, color: "bg-blue-500" },
              { label: "Empezaron el quiz", value: quizStats.totalStarts, pct: (quizStats.totalStarts / quizStats.totalViews) * 100, color: "bg-purple-500" },
              { label: "Completaron el quiz", value: quizStats.totalCompletions, pct: (quizStats.totalCompletions / quizStats.totalViews) * 100, color: "bg-emerald-500" },
              { label: "Se registraron en Talentix", value: quizStats.registrationsGenerated, pct: (quizStats.registrationsGenerated / quizStats.totalViews) * 100, color: "bg-fb-purple" },
            ].map((step, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{step.label}</span>
                  <span className="text-muted-foreground">{step.value.toLocaleString()} ({step.pct.toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-muted rounded-full h-4">
                  <div className={`${step.color} h-4 rounded-full transition-all duration-500`} style={{ width: `${step.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quiz Questions Preview */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              Preguntas del Quiz ({quizQuestions.length})
            </CardTitle>
            <Button variant="fb-outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Agregar Pregunta
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {quizQuestions.map((q, i) => (
              <div key={q.id} className="p-4 rounded-xl border bg-card hover:shadow-sm transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-fb-blue/10 flex items-center justify-center shrink-0">
                    <GripVertical className="h-4 w-4 text-fb-blue" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">Pregunta {i + 1}</div>
                    <p className="text-sm text-muted-foreground mt-1">{q.text}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {q.options.map((opt, j) => (
                        <Badge key={j} variant="outline" className="text-xs">
                          {String.fromCharCode(65 + j)}: {opt.substring(0, 40)}{opt.length > 40 ? "..." : ""}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Social Media Platforms */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Rocket className="h-6 w-6 text-fb-purple" />
          <h2 className="text-xl font-bold">Dónde Compartir el Quiz</h2>
        </div>
        <p className="text-muted-foreground mb-4">
          Material orientativo semanal para compartir el quiz en cada plataforma. Haz clic en cada una para ver detalles.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {socialPlatforms.map((platform) => {
            const Icon = platform.icon
            const isExpanded = expandedPlatform === platform.name
            return (
              <Card key={platform.name} className="border-2 hover:shadow-md transition-shadow overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center`}>
                        <Icon className={`h-6 w-6 ${platform.textColor}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{platform.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">{platform.format}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setExpandedPlatform(isExpanded ? null : platform.name)}
                      className="p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="text-xs font-medium text-muted-foreground mb-1">Formato de contenido:</div>
                      <p className="text-sm font-medium">{platform.content}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {platform.frequency}
                      </div>
                      <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                        <TrendingUp className="h-3 w-3 inline mr-1" />
                        {platform.estimatedReach}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">Mejor hora:</span> {platform.bestTime}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 space-y-2 border-t pt-4">
                      <div className="text-sm font-medium mb-2">💡 Tips específicos para {platform.name}:</div>
                      {platform.tips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
