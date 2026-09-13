"use client"

import { useState, useEffect } from "react"
import { BarChart3, TrendingUp, Users, Building2, Briefcase, Target, Loader2 } from "lucide-react"
import { apiFetch } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface Metric {
  key: string
  label: string
  value: string
  change: string
}

interface PlanDist {
  plan: string
  count: number
  pct: number
  color: string
}

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [planDistribution, setPlanDistribution] = useState<PlanDist[]>([])

  useEffect(() => {
    apiFetch("/api/admin/analytics")
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setMetrics(data.metrics)
          setPlanDistribution(data.planDistribution)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const icons = [Users, Building2, Target, Briefcase, TrendingUp, BarChart3]
  const colors = ["text-blue-600 bg-blue-50", "text-purple-600 bg-purple-50", "text-emerald-600 bg-emerald-50", "text-amber-600 bg-amber-50", "text-emerald-600 bg-emerald-50", "text-fb-purple bg-purple-50"]

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-primary" />
          Analytics
        </h1>
        <p className="text-muted-foreground mt-1">Métricas reales de rendimiento de la plataforma.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, i) => {
          const Icon = icons[i % icons.length]
          const colorClass = colors[i % colors.length]
          const [textColor, bgColor] = colorClass.split(" ")
          return (
            <Card key={metric.key} className="hover:shadow-md transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${textColor}`} />
                  </div>
                  <Badge variant="info" className="text-xs">{metric.change}</Badge>
                </div>
                <div className="text-3xl font-bold">{metric.value}</div>
                <div className="text-sm text-muted-foreground">{metric.label}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Plan distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Distribución de Planes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {planDistribution.map((item) => (
                <div key={item.plan}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{item.plan} ({item.count})</span>
                    <span className="text-muted-foreground">{item.pct}%</span>
                  </div>
                  <Progress value={item.pct} className="h-2" />
                </div>
              ))}
            </div>
            <div className="rounded-xl bg-muted/50 p-6">
              <h4 className="font-medium mb-3">Resumen</h4>
              <p className="text-sm text-muted-foreground">
                Estos números provienen directamente de la base de datos: empresas registradas,
                candidatos activos, matches generados por el motor y evaluaciones completadas.
                La conversión refleja empresas con plan de pago sobre el total.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
