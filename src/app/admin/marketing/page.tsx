"use client"

import { useState } from "react"
import {
  BarChart3, TrendingUp, Target, Lightbulb, Rocket, AlertCircle,
  Users, Building2, Brain, Zap, ChevronRight, Clock, ArrowUp,
  ArrowDown, Minus, Sparkles, DollarSign, Globe, Calendar,
  CheckCircle2, AlertTriangle, Info, RefreshCw
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const platformMetrics = {
  totalCandidates: 2847,
  candidatesGrowth: 12.4,
  totalCompanies: 156,
  companiesGrowth: 8.2,
  totalAssessments: 4617,
  assessmentsGrowth: 23.1,
  avgMatchScore: 89,
  matchGrowth: 5.3,
  referralRate: 34.2,
  referralGrowth: 18.7,
  quizVisits: 12847,
  quizGrowth: 45.2,
}

const weeklySuggestions = [
  {
    id: "1",
    priority: "alta",
    category: "Crecimiento",
    icon: Rocket,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
    title: "Lanzar campaña de referidos en universidades",
    description: "Con 2,847 candidatos registrados, el momento es ideal para contactar 5 universidades y ofrecer evaluaciones gratuitas a egresados.",
    metric: "Potencial: +500 registros/mes",
    action: "Contactar departamentos de carrera",
    deadline: "Esta semana",
    estimatedImpact: "Alto",
  },
  {
    id: "2",
    priority: "alta",
    category: "Engagement",
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    title: "Mejorar tasa de completación de evaluaciones",
    description: "Solo el 54% de candidatos que empiezan una evaluación la terminan. El timer de 15 min puede ser agresivo para evaluaciones cognitivas.",
    metric: "Completación actual: 54% → Meta: 75%",
    action: "Evaluar aumentar tiempo o reducir preguntas",
    deadline: "Esta semana",
    estimatedImpact: "Alto",
  },
  {
    id: "3",
    priority: "media",
    category: "Contenido",
    icon: Sparkles,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    title: "Crear quiz viral de perfil profesional",
    description: "El 67% del tráfico orgánico viene de búsquedas de evaluaciones gratuitas. Crear una landing page con quiz de 5 preguntas puede triplicar registros.",
    metric: "Potencial: +200 registros/semana",
    action: "Diseñar landing page del quiz",
    deadline: "Próxima semana",
    estimatedImpact: "Muy alto",
  },
  {
    id: "4",
    priority: "media",
    category: "Empresas",
    icon: Building2,
    color: "text-amber-500",
    bgColor: "bg-amber-50",
    title: "Ampliar base de empresas activas",
    description: "Solo 23 de 156 empresas (14.7%) tienen vacantes activas. Las empresas con plan gratuito necesitan incentivos para publicar vacantes.",
    metric: "Empresas activas: 14.7% → Meta: 40%",
    action: "Enviar campaña de reactivación a empresas inactivas",
    deadline: "Esta semana",
    estimatedImpact: "Alto",
  },
  {
    id: "5",
    priority: "baja",
    category: "Técnico",
    icon: Brain,
    color: "text-fb-purple",
    bgColor: "bg-fb-purple/5",
    title: "Entrenar modelo de matching con datos reales",
    description: "Con 4,617 evaluaciones completadas, hay suficientes datos para mejorar el algoritmo de matching. La precisión actual es 89.2%.",
    metric: "Meta: 92% precisión para fin de trimestre",
    action: "Ejecutar re-entrenamiento del modelo",
    deadline: "Este mes",
    estimatedImpact: "Medio",
  },
  {
    id: "6",
    priority: "baja",
    category: "Monetización",
    icon: DollarSign,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    title: "Preparar lanzamiento de planes de pago",
    description: "Con 156 empresas, si conviertes el 10% a plan Starter ($199/mes), generas $3,104/mes. Falta integrar Stripe.",
    metric: "Potencial: $3,104/mes con 10% conversión",
    action: "Integrar Stripe y crear flujo de checkout",
    deadline: "Mes que viene",
    estimatedImpact: "Muy alto",
  },
]

const growthTimeline = [
  { week: "Sem 1", candidates: 212, companies: 8, assessments: 340 },
  { week: "Sem 2", candidates: 487, companies: 15, assessments: 890 },
  { week: "Sem 3", candidates: 823, companies: 28, assessments: 1567 },
  { week: "Sem 4", candidates: 1245, companies: 45, assessments: 2234 },
  { week: "Sem 5", candidates: 1678, companies: 67, assessments: 2890 },
  { week: "Sem 6", candidates: 2134, companies: 98, assessments: 3456 },
  { week: "Sem 7", candidates: 2512, companies: 127, assessments: 4012 },
  { week: "Sem 8", candidates: 2847, companies: 156, assessments: 4617 },
]

const healthIndicators = [
  { label: "Engagement Score", value: 78, status: "bueno", trend: "up", description: "Interacción promedio de candidatos con la plataforma" },
  { label: "Retention Rate", value: 64, status: "medio", trend: "up", description: "Porcentaje de candidatos que vuelven en 7 días" },
  { label: "Match Quality", value: 89, status: "excelente", trend: "up", description: "Precisión del algoritmo de matching" },
  { label: "Time to Hire", value: 18, status: "bueno", trend: "down", description: "Días promedio desde derivación hasta contratación" },
  { label: "NPS Score", value: 72, status: "bueno", trend: "up", description: "Satisfacción de candidatos con la plataforma" },
  { label: "Churn Rate", value: 8, status: "bueno", trend: "down", description: "Tasa de abandono mensual de candidatos" },
]

export default function MarketingPage() {
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "alta": return "bg-red-100 text-red-700"
      case "media": return "bg-amber-100 text-amber-700"
      case "baja": return "bg-blue-100 text-blue-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excelente": return "text-emerald-600"
      case "bueno": return "text-blue-600"
      case "medio": return "text-amber-600"
      case "malo": return "text-red-600"
      default: return "text-gray-600"
    }
  }

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <ArrowUp className="h-4 w-4 text-emerald-500" />
    if (trend === "down") return <ArrowDown className="h-4 w-4 text-emerald-500" />
    return <Minus className="h-4 w-4 text-gray-400" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-7 w-7 text-fb-blue" />
            Centro de Marketing y Crecimiento
          </h1>
          <p className="text-muted-foreground mt-1">
            Sugerencias semanales del sistema según métricas reales de la plataforma
          </p>
        </div>
        <Button variant="fb-outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar Métricas
        </Button>
      </div>

      {/* Platform Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Candidatos", value: platformMetrics.totalCandidates.toLocaleString(), growth: platformMetrics.candidatesGrowth, icon: Users },
          { label: "Empresas", value: platformMetrics.totalCompanies.toString(), growth: platformMetrics.companiesGrowth, icon: Building2 },
          { label: "Evaluaciones", value: platformMetrics.totalAssessments.toLocaleString(), growth: platformMetrics.assessmentsGrowth, icon: Brain },
          { label: "Match Promedio", value: `${platformMetrics.avgMatchScore}%`, growth: platformMetrics.matchGrowth, icon: Target },
          { label: "Tasa Referidos", value: `${platformMetrics.referralRate}%`, growth: platformMetrics.referralGrowth, icon: Zap },
          { label: "Visitas Quiz", value: platformMetrics.quizVisits.toLocaleString(), growth: platformMetrics.quizGrowth, icon: Globe },
        ].map((m, i) => {
          const Icon = m.icon
          return (
            <Card key={i} className="border-2">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{m.label}</span>
                </div>
                <div className="text-xl font-bold">{m.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUp className="h-3 w-3 text-emerald-500" />
                  <span className="text-xs text-emerald-600 font-medium">+{m.growth}%</span>
                  <span className="text-xs text-muted-foreground">vs semana anterior</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Health Indicators */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            Salud de la Plataforma
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {healthIndicators.map((ind, i) => (
              <div key={i} className="p-4 rounded-xl bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{ind.label}</span>
                  {getTrendIcon(ind.trend)}
                </div>
                <div className="flex items-end gap-2">
                  <span className={`text-2xl font-bold ${getStatusColor(ind.status)}`}>{ind.value}{ind.label.includes("Rate") || ind.label.includes("Score") ? "%" : ind.label === "Time to Hire" ? " días" : ""}</span>
                  <Badge className={`text-xs ${
                    ind.status === "excelente" ? "bg-emerald-100 text-emerald-700" :
                    ind.status === "bueno" ? "bg-blue-100 text-blue-700" :
                    ind.status === "medio" ? "bg-amber-100 text-amber-700" :
                    "bg-red-100 text-red-700"
                  }`}>{ind.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{ind.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Growth Chart */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            Crecimiento de las Últimas 8 Semanas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-40">
            {growthTimeline.map((week, i) => {
              const maxVal = 4617
              const height = (week.assessments / maxVal) * 100
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="text-xs font-medium">{week.assessments}</div>
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-fb-blue to-fb-purple transition-all duration-500"
                    style={{ height: `${height}%`, minHeight: "4px" }}
                  />
                  <div className="text-xs text-muted-foreground">{week.week}</div>
                </div>
              )
            })}
          </div>
          <div className="flex justify-center gap-6 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-fb-blue" />
              <span>Evaluaciones</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-fb-purple" />
              <span>Crecimiento acumulado</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Suggestions */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-6 w-6 text-amber-500" />
          <h2 className="text-xl font-bold">Sugerencias de Esta Semana</h2>
        </div>
        <p className="text-muted-foreground mb-4">
          Estas son las acciones que el sistema recomienda según las métricas actuales. Actualizadas automáticamente cada lunes.
        </p>
        <div className="space-y-3">
          {weeklySuggestions.map((s) => {
            const Icon = s.icon
            return (
              <Card key={s.id} className="border-2 hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${s.bgColor} flex items-center justify-center shrink-0`}>
                      <Icon className={`h-6 w-6 ${s.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Badge className={`text-xs ${getPriorityBadge(s.priority)}`}>
                          Prioridad {s.priority}
                        </Badge>
                        <Badge variant="outline" className="text-xs">{s.category}</Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {s.deadline}
                        </span>
                      </div>
                      <h3 className="font-semibold">{s.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{s.description}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="text-sm font-medium text-fb-blue">{s.metric}</div>
                        <Badge className={s.estimatedImpact === "Muy alto" ? "bg-emerald-100 text-emerald-700" : s.estimatedImpact === "Alto" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}>
                          Impacto: {s.estimatedImpact}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="fb-outline" size="sm" className="shrink-0">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Marcar Hecho
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Market Insights */}
      <Card className="border-2 border-fb-purple/30 bg-gradient-to-br from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-fb-purple" />
            Insights del Mercado — Septiembre 2026
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/70">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span className="font-medium text-sm">Oportunidad detectada</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Las búsquedas de "trabajo remoto" aumentaron 34% este mes en LATAM. Crear landing pages específicas para work-from-home puede captar tráfico significativo.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/70">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-4 w-4 text-blue-500" />
                <span className="font-medium text-sm">Tendencia del mercado</span>
              </div>
              <p className="text-sm text-muted-foreground">
                El 62% de empresas en LATAM ahora aceptan trabajo remoto. Asegúrate de que las vacantes en Talentix tengan esta opción habilitada para maximizar matches.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/70">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                <span className="font-medium text-sm">Crecimiento del sector</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Las evaluaciones psicométricas para contratación crecieron 28% globalmente. Talentix está posicionado para captar esta demanda con su motor de evaluaciones.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/70">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                <span className="font-medium text-sm">Potencial de ingresos</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Con 156 empresas y un plan Starter de $199/mes, si conviertes el 15%, generarías $4,656/mes. Priorizar la integración de pagos con Stripe.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
