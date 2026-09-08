"use client"

import { Target, TrendingUp, Brain, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const recentMatches = [
  { candidate: "María García", company: "TechCorp Solutions", vacancy: "Senior Developer", score: 95, recommendation: "Altamente Recomendado", timestamp: "Hace 2h" },
  { candidate: "Carlos Ruiz", company: "InnovateLab", vacancy: "Product Manager", score: 88, recommendation: "Recomendado", timestamp: "Hace 5h" },
  { candidate: "Ana Martínez", company: "DataPro", vacancy: "UX Designer", score: 82, recommendation: "Recomendado", timestamp: "Hace 8h" },
  { candidate: "Pedro Sánchez", company: "TechCorp Solutions", vacancy: "DevOps Engineer", score: 78, recommendation: "Posible", timestamp: "Hace 1d" },
]

const modelMetrics = [
  { label: "Precisión del Modelo", value: "94.2%", change: "+2.1%", trend: "up" },
  { label: "Tasa de Contratación", value: "34%", change: "+5%", trend: "up" },
  { label: "Satisfacción con Matches", value: "4.6/5", change: "+0.2", trend: "up" },
  { label: "Matches Descartados", value: "8%", change: "-3%", trend: "up" },
]

export default function AdminMatchingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Target className="h-8 w-8 text-primary" />
          Matching
        </h1>
        <p className="text-muted-foreground mt-1">Supervisión del algoritmo de matching y su rendimiento.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {modelMetrics.map((metric, i) => (
          <Card key={i} className="hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                <Badge variant="success" className="text-xs">{metric.change}</Badge>
              </div>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="text-sm text-muted-foreground">{metric.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Model Status */}
      <Card className="border-2 border-fb-purple/20 bg-gradient-to-r from-fb-purple/5 to-fb-blue/5">
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center gap-4">
          <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Modelo de IA Activo — v2.4</h3>
            <p className="text-sm text-muted-foreground">Último entrenamiento: 1 Sep 2026 · Próximo: 1 Oct 2026</p>
          </div>
          <Badge variant="success">Activo</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Últimos Matches Generados</CardTitle>
          <CardDescription>Matches creados por el algoritmo en las últimas 24h</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentMatches.map((match, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fb-blue to-fb-purple flex items-center justify-center text-white text-sm font-medium">
                  {match.candidate.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{match.candidate} → {match.company}</div>
                  <div className="text-sm text-muted-foreground">{match.vacancy} · {match.timestamp}</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold gradient-text">{match.score}%</div>
                  <div className="text-xs text-muted-foreground">{match.recommendation}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
