"use client"

import { useState, useEffect } from "react"
import { BarChart3, TrendingUp, Users, Clock, Target, Inbox, Loader2 } from "lucide-react"
import { apiFetch } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useStore } from "@/store/useStore"

interface Metrics {
  timeToHire: string
  timeToHireChange: string
  conversion: string
  conversionChange: string
  matches: number
  matchesChange: string
  candidatesEvaluated: number
}

interface MonthlyPoint {
  month: string
  candidates: number
  hired: number
}

interface Totals {
  vacancies: number
  activeVacancies: number
  applications: number
  hired: number
}

export default function CompanyAnalyticsPage() {
  const { user } = useStore()
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [monthly, setMonthly] = useState<MonthlyPoint[]>([])
  const [totals, setTotals] = useState<Totals | null>(null)

  useEffect(() => {
    if (!user?.id) return
    apiFetch(`/api/company/analytics?userId=${user.id}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setMetrics(data.metrics)
          setMonthly(data.monthly)
          setTotals(data.totals)
        }
      })
      .finally(() => setLoading(false))
  }, [user?.id])

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  }

  const metricCards = metrics
    ? [
        { label: "Time-to-Hire", value: metrics.timeToHire, change: metrics.timeToHireChange, icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Tasa de Conversión", value: metrics.conversion, change: metrics.conversionChange, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Matches Recibidos", value: String(metrics.matches), change: metrics.matchesChange, icon: Target, color: "text-purple-600", bg: "bg-purple-50" },
        { label: "Vacantes Activas", value: `${totals?.activeVacancies ?? 0}/${totals?.vacancies ?? 0}`, change: "publicadas / totales", icon: Users, color: "text-amber-600", bg: "bg-amber-50" },
      ]
    : []

  const maxCandidates = Math.max(1, ...monthly.map((m) => m.candidates))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-primary" />
          Analytics
        </h1>
        <p className="text-muted-foreground mt-1">
          Métricas reales de hiring de tu empresa, calculadas desde tus vacantes y derivaciones.
        </p>
      </div>

      {metrics && metrics.matches === 0 && (totals?.applications ?? 0) === 0 && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-6 flex items-center gap-3">
            <Inbox className="h-6 w-6 text-amber-500 shrink-0" />
            <p className="text-sm text-muted-foreground">
              Aún no hay actividad para calcular métricas. Publica vacantes y recibe candidatos para ver tu time-to-hire, conversión y más.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((metric, i) => (
          <Card key={i} className="hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${metric.bg} flex items-center justify-center`}>
                  <metric.icon className={`h-6 w-6 ${metric.color}`} />
                </div>
                <Badge variant="info" className="text-xs">{metric.change}</Badge>
              </div>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="text-sm text-muted-foreground">{metric.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Monthly chart */}
      <Card>
        <CardHeader>
          <CardTitle>Candidatos Derivados vs Contratados (Últimos 6 meses)</CardTitle>
          <CardDescription>Rendimiento mensual de tu proceso de selección</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthly.map((data, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 text-sm font-medium text-muted-foreground">{data.month}</div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1">
                    <Progress value={(data.candidates / maxCandidates) * 100} className="h-6" />
                  </div>
                  <span className="text-sm font-medium w-24 text-right">{data.candidates} derivados</span>
                </div>
                <div className="w-24 text-right">
                  <Badge variant="success">{data.hired} contratados</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Totals summary */}
      {totals && (
        <Card>
          <CardHeader>
            <CardTitle>Resumen Acumulado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-muted/50 text-center">
                <div className="text-2xl font-bold">{totals.vacancies}</div>
                <div className="text-xs text-muted-foreground">Vacantes totales</div>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 text-center">
                <div className="text-2xl font-bold">{totals.applications}</div>
                <div className="text-xs text-muted-foreground">Candidatos derivados</div>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 text-center">
                <div className="text-2xl font-bold">{totals.hired}</div>
                <div className="text-xs text-muted-foreground">Contratados</div>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 text-center">
                <div className="text-2xl font-bold">{metrics?.candidatesEvaluated ?? 0}</div>
                <div className="text-xs text-muted-foreground">Candidatos en la plataforma</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
