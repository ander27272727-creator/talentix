"use client"

import { useState } from "react"
import {
  Calendar, Plus, Check, Clock, Edit3, Trash2, Share2, Eye,
  ChevronLeft, ChevronRight, Sparkles, Video, MessageSquare,
  PenTool, BookOpen, Image, TrendingUp, BarChart3, Zap,
  Globe, Lightbulb, AlertCircle, Send, Copy, ExternalLink
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

const weekDays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

const currentWeekContent = [
  {
    day: "Lunes",
    platform: "TikTok/Reels",
    icon: Video,
    color: "text-pink-500",
    bgColor: "bg-pink-50",
    title: "3 preguntas que toda empresa hace en entrevistas técnicas",
    description: "Video de 30 segundos mostrando 3 preguntas con countdown y respuestas sorprendentes",
    status: "publicado",
    metrics: { views: 4520, likes: 234, shares: 67, registrations: 23 },
    hashtags: "#empleo #entrevista #desarrollador #tech",
    bestTime: "12:30",
  },
  {
    day: "Martes",
    platform: "LinkedIn",
    icon: PenTool,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    title: "Cómo la IA está cambiando el reclutamiento en 2026",
    description: "Artículo largo sobre tendencias de reclutamiento con IA, estadísticas y casos reales",
    status: "programado",
    metrics: null,
    hashtags: "#IA #reclutamiento #futurodetrabajo #HR",
    bestTime: "8:00",
  },
  {
    day: "Miércoles",
    platform: "Blog SEO",
    icon: BookOpen,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    title: "Guía completa: Evaluaciones psicométricas para desarrolladores",
    description: "Artículo de 2,000 palabras optimizado para SEO con keywords de alta búsqueda",
    status: "borrador",
    metrics: null,
    hashtags: "SEO: evaluación psicométrica, test personalidad trabajo",
    bestTime: "10:00",
  },
  {
    day: "Jueves",
    platform: "Instagram",
    icon: Share2,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    title: "Carrusel: 5 habilidades blandas que las empresas buscan en 2026",
    description: "Carrusel de 8 slides con estadísticas y tips accionables",
    status: "diseñando",
    metrics: null,
    hashtags: "#habilidadesblandas #carrera #desarrollprofesional",
    bestTime: "19:00",
  },
  {
    day: "Viernes",
    platform: "Twitter/X",
    icon: MessageSquare,
    color: "text-gray-800",
    bgColor: "bg-gray-50",
    title: "Hilo: 10 datos sorprendentes sobre el mercado laboral tech en LATAM",
    description: "Hilo de 10 tweets con datos impactantes y CTA a Talentix",
    status: "programado",
    metrics: null,
    hashtags: "#LATAM #tech #empleo #desarrolladores",
    bestTime: "17:00",
  },
  {
    day: "Sábado",
    platform: "TikTok",
    icon: Video,
    color: "text-pink-500",
    bgColor: "bg-pink-50",
    title: "POV: Cuando tu perfil tiene 95% de match con una empresa",
    description: "Video trending con audio popular mostrando el momento del match",
    status: "planificado",
    metrics: null,
    hashtags: "#match #empleo #tech #fyp",
    bestTime: "14:00",
  },
  {
    day: "Domingo",
    platform: "Blog SEO",
    icon: BookOpen,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    title: "Los 5 mejores sueldos de desarrolladores por país en 2026",
    description: "Artículo con datos de salarios por país, optimizado para tráfico orgánico",
    status: "borrador",
    metrics: null,
    hashtags: "SEO: sueldo desarrollador, salario programador",
    bestTime: "9:00",
  },
]

const contentStats = {
  postsThisWeek: 7,
  postsPublished: 2,
  totalViews: 12840,
  totalLikes: 892,
  totalShares: 234,
  newFollowers: 156,
  quizClicks: 347,
  registrationsFromContent: 89,
}

export default function ContentPage() {
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "publicado": return "bg-emerald-100 text-emerald-700"
      case "programado": return "bg-blue-100 text-blue-700"
      case "diseñando": return "bg-amber-100 text-amber-700"
      case "borrador": return "bg-gray-100 text-gray-700"
      case "planificado": return "bg-purple-100 text-purple-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-7 w-7 text-fb-blue" />
            Calendario de Contenido
          </h1>
          <p className="text-muted-foreground mt-1">
            Plan semanal de contenido para redes sociales y blog
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="fb-outline">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Semana Anterior
          </Button>
          <Button variant="fb-outline">
            Esta Semana
          </Button>
          <Button variant="fb">
            <Plus className="h-4 w-4 mr-1" />
            Nuevo Contenido
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{contentStats.postsThisWeek}</div>
                <div className="text-xs text-muted-foreground">Posts esta semana</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Eye className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{contentStats.totalViews.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Vistas totales</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{contentStats.registrationsFromContent}</div>
                <div className="text-xs text-muted-foreground">Registros por contenido</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Share2 className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{contentStats.totalShares}</div>
                <div className="text-xs text-muted-foreground">Compartidos</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Calendar */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-fb-blue" />
              Calendario Semanal
            </CardTitle>
            <div className="flex gap-2 text-xs">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Publicado</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500" /> Programado</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500" /> Diseñando</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-400" /> Borrador</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentWeekContent.map((item, i) => {
              const Icon = item.icon
              return (
                <div
                  key={i}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-sm ${
                    selectedDay === item.day ? "border-fb-blue shadow-md" : "border-border"
                  }`}
                  onClick={() => setSelectedDay(selectedDay === item.day ? null : item.day)}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-center shrink-0">
                      <div className="text-sm font-bold">{item.day.substring(0, 3)}</div>
                      <div className="text-xs text-muted-foreground">Oct {8 + i}</div>
                    </div>

                    <div className={`w-10 h-10 rounded-xl ${item.bgColor} flex items-center justify-center shrink-0`}>
                      <Icon className={`h-5 w-5 ${item.color}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-medium text-muted-foreground">{item.platform}</span>
                        <Badge className={`text-xs ${getStatusColor(item.status)}`}>{item.status}</Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {item.bestTime}
                        </span>
                      </div>
                      <h3 className="font-semibold text-sm mt-1">{item.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                      <div className="text-xs text-muted-foreground mt-2">
                        <span className="font-medium">Hashtags:</span> {item.hashtags}
                      </div>
                    </div>

                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>

                  {/* Metrics for published posts */}
                  {item.metrics && (
                    <div className="mt-3 pt-3 border-t flex gap-4 text-xs">
                      <div><span className="font-semibold">{item.metrics.views.toLocaleString()}</span> vistas</div>
                      <div><span className="font-semibold">{item.metrics.likes}</span> likes</div>
                      <div><span className="font-semibold">{item.metrics.shares}</span> compartidos</div>
                      <div className="text-emerald-600 font-semibold">+{item.metrics.registrations} registros</div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Content Suggestions */}
      <Card className="border-2 border-fb-purple/30 bg-gradient-to-br from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-fb-purple" />
            Sugerencias de IA para el Próximo Contenido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { platform: "TikTok", suggestion: "Video: '¿Sabías que el 73% de desarrolladores fallan esta pregunta de lógica?' — Quiz interactivo con resultado al final", potential: "Alto" },
              { platform: "LinkedIn", suggestion: "Post: 'Las 3 empresas que mejor pagan en LATAM para devs remotos — datos reales de Talentix'", potential: "Muy alto" },
              { platform: "Instagram", suggestion: "Story encuesta: '¿Prefieres remoto o presencial?' + CTA al perfil de Talentix", potential: "Medio" },
              { platform: "Blog", suggestion: "Guía SEO: 'Cómo pasar una evaluación psicométrica: 10 tips probados'", potential: "Muy alto" },
            ].map((s, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/70 border border-white">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-fb-purple/10 text-fb-purple">{s.platform}</Badge>
                  <Badge className={s.potential === "Muy alto" ? "bg-emerald-100 text-emerald-700" : s.potential === "Alto" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}>
                    Potencial: {s.potential}
                  </Badge>
                </div>
                <p className="text-sm">{s.suggestion}</p>
                <Button variant="ghost" size="sm" className="mt-2 text-fb-purple">
                  <Plus className="h-3 w-3 mr-1" />
                  Agregar al calendario
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
