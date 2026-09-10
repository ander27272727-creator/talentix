"use client"

import { useState, useEffect } from "react"
import { Target, TrendingUp, Brain, Loader2, Inbox } from "lucide-react"
import { apiFetch } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface MatchRow {
  id: string
  candidate: string
  company: string
  vacancy: string
  score: number
  recommendation: string
  createdAt: string
}

export default function AdminMatchingPage() {
  const [loading, setLoading] = useState(true)
  const [matches, setMatches] = useState<MatchRow[]>([])
  const [metrics, setMetrics] = useState({ totalMatches: 0, highMatches: 0, avgScore: 0, highRate: 0 })

  useEffect(() => {
    apiFetch("/api/admin/matches")
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setMatches(data.matches)
          setMetrics(data.metrics)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  }

  const modelMetrics = [
    { label: "Matches Generados", value: metrics.totalMatches.toString(), badge: "total" },
    { label: "Alta Compatibilidad (≥85%)", value: metrics.highMatches.toString(), badge: "high" },
    { label: "Score Promedio", value: `${metrics.avgScore}%`, badge: "avg" },
    { label: "Tasa de Alta Compatibilidad", value: `${metrics.highRate}%`, badge: "rate" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Target className="h-8 w-8 text-primary" />
          Matching
        </h1>
        <p className="text-muted-foreground mt-1">Supervisión del algoritmo de matching y su rendimiento real.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {modelMetrics.map((metric, i) => (
          <Card key={i} className="hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="text-sm text-muted-foreground">{metric.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Estado del modelo (basado en actividad real) */}
      <Card className="border-2 border-fb-purple/20 bg-gradient-to-r from-fb-purple/5 to-fb-blue/5">
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center gap-4">
          <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shrink-0">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Motor de Matching Bidireccional</h3>
            <p className="text-sm text-muted-foreground">
              {metrics.totalMatches > 0
                ? `Activo · ha generado ${metrics.totalMatches} matches con score promedio de ${metrics.avgScore}%. Cada evaluación completada regenera los matches del candidato.`
                : "Activo y a la espera de datos. Generará matches automáticamente cuando haya candidatos con evaluaciones y vacantes activas."}
            </p>
          </div>
          <Badge variant="success">Activo</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Últimos Matches Generados</CardTitle>
          <CardDescription>Matches creados por el algoritmo, del más reciente al más antiguo</CardDescription>
        </CardHeader>
        <CardContent>
          {matches.length === 0 ? (
            <div className="text-center py-10">
              <Inbox className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
              <p className="text-muted-foreground">
                Aún no hay matches. Aparecerán automáticamente cuando candidatos completen evaluaciones y haya vacantes activas.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map((match) => (
                <div key={match.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fb-blue to-fb-purple flex items-center justify-center text-white text-sm font-medium shrink-0">
                    {match.candidate.split(" ").map(n => n[0]).slice(0, 2).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{match.candidate} → {match.company}</div>
                    <div className="text-sm text-muted-foreground truncate">
                      {match.vacancy} · {new Date(match.createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <div className="text-xl font-bold gradient-text">{match.score}%</div>
                    <div className="text-xs text-muted-foreground">{match.recommendation}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
