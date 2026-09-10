"use client"

import { useState, useEffect } from "react"
import { BarChart3, TrendingUp, TrendingDown, Lightbulb, Loader2, Users, Target, Zap, Brain, Sparkles, Building2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { apiFetch } from "@/lib/api"

interface WeekMetric {
  current: number
  previous: number
  change: number
}

interface Suggestion {
  priority: "alta" | "media" | "baja"
  title: string
  detail: string
}

interface ReportData {
  week: { start: string; label: string }
  weekly: {
    newCandidates: WeekMetric
    newMatches: WeekMetric
    newReferrals: WeekMetric
    newAssessments: WeekMetric
    newQuiz: WeekMetric
  }
  totals: {
    companies: number
    candidates: number
    activeVacancies: number
    referrals: number
    hired: number
  }
  plans: { plan: string; count: number }[]
  suggestions: Suggestion[]
}

const PRIORITY_STYLES: Record<string, { className: string; label: string }> = {
  alta: { className: "bg-red-100 text-red-800", label: "Prioridad alta" },
  media: { className: "bg-amber-100 text-amber-800", label: "Prioridad media" },
  baja: { className: "bg-emerald-100 text-emerald-800", label: "Informativo" },
}

export default function WeeklyReportPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<ReportData | null>(null)

  useEffect(() => {
    apiFetch("/api/admin/weekly-report")
      .then(r => r.json())
      .then(d => { if (d.success) setData(d) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  }

  if (!data) {
    return (
      <Card><CardContent className="py-12 text-center">
        <p className="text-muted-foreground">No se pudo cargar el reporte semanal.</p>
      </CardContent></Card>
    )
  }

  const metrics = [
    { label: "Nuevos candidatos", icon: Users, data: data.weekly.newCandidates, color: "text-purple-600" },
    { label: "Evaluaciones completadas", icon: Brain, data: data.weekly.newAssessments, color: "text-blue-600" },
    { label: "Matches generados", icon: Target, data: data.weekly.newMatches, color: "text-emerald-600" },
    { label: "Derivaciones", icon: Zap, data: data.weekly.newReferrals, color: "text-orange-600" },
    { label: "Quizzes virales", icon: Sparkles, data: data.weekly.newQuiz, color: "text-pink-600" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-primary" />
          Reporte Semanal
        </h1>
        <p className="text-muted-foreground mt-1">
          {data.week.label} · métricas reales de la plataforma y sugerencias automáticas.
        </p>
      </div>

      {/* Métricas de la semana vs semana anterior */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {metrics.map((m, i) => (
          <Card key={i} className="hover:shadow-md transition-all duration-200">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <m.icon className={`h-5 w-5 ${m.color}`} />
                <span className={`text-xs font-bold flex items-center gap-1 ${
                  m.data.change > 0 ? "text-emerald-600" : m.data.change < 0 ? "text-red-600" : "text-muted-foreground"
                }`}>
                  {m.data.change > 0 ? <TrendingUp className="h-3 w-3" /> : m.data.change < 0 ? <TrendingDown className="h-3 w-3" /> : null}
                  {m.data.change > 0 ? "+" : ""}{m.data.change}%
                </span>
              </div>
              <div className="text-2xl font-bold">{m.data.current}</div>
              <div className="text-xs text-muted-foreground">{m.label}</div>
              <div className="text-[10px] text-muted-foreground mt-1">Semana anterior: {m.data.previous}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Estado general */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              Estado General
            </CardTitle>
            <CardDescription>Totales acumulados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Empresas registradas", value: data.totals.companies },
              { label: "Candidatos registrados", value: data.totals.candidates },
              { label: "Vacantes activas", value: data.totals.activeVacancies },
              { label: "Derivaciones totales", value: data.totals.referrals },
              { label: "Contrataciones", value: data.totals.hired },
            ].map((t, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t.label}</span>
                <span className="font-bold">{t.value}</span>
              </div>
            ))}
            {data.plans.length > 0 && (
              <div className="pt-3 border-t">
                <p className="text-xs text-muted-foreground mb-2">Empresas por plan</p>
                <div className="flex gap-2 flex-wrap">
                  {data.plans.map((p) => (
                    <Badge key={p.plan} variant="outline" className="text-xs">
                      {p.plan}: {p.count}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sugerencias automáticas */}
        <Card className="lg:col-span-2 border-2 border-fb-purple/20 bg-gradient-to-r from-fb-purple/5 to-fb-blue/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              Sugerencias Automáticas
            </CardTitle>
            <CardDescription>Generadas por el sistema según tus métricas reales de esta semana</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.suggestions.map((s, i) => {
              const style = PRIORITY_STYLES[s.priority] || PRIORITY_STYLES.baja
              return (
                <div key={i} className="p-4 rounded-xl bg-white/70 border">
                  <div className="flex items-start gap-3">
                    <Badge className={`${style.className} shrink-0`}>{style.label}</Badge>
                    <div>
                      <p className="font-semibold text-sm">{s.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{s.detail}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
