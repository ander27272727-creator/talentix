"use client"

import { BarChart3, TrendingUp, Users, Building2, Briefcase, Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const metrics = [
  { label: "Candidatos Registrados", value: "2,847", change: "+342 este mes", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Empresas Activas", value: "156", change: "+23 este mes", icon: Building2, color: "text-purple-600", bg: "bg-purple-50" },
  { label: "Matches Totales", value: "1,892", change: "+256 este mes", icon: Target, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Evaluaciones Completadas", value: "4,523", change: "+612 este mes", icon: Briefcase, color: "text-amber-600", bg: "bg-amber-50" },
  { label: "Tasa de Conversión", value: "28%", change: "+4%", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Revenue MRR", value: "$47,200", change: "+12%", icon: BarChart3, color: "text-fb-purple", bg: "bg-purple-50" },
]

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-primary" />
          Analytics
        </h1>
        <p className="text-muted-foreground mt-1">Métricas generales de rendimiento de la plataforma.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, i) => (
          <Card key={i} className="hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${metric.bg} flex items-center justify-center`}>
                  <metric.icon className={`h-6 w-6 ${metric.color}`} />
                </div>
                <Badge variant="success" className="text-xs">{metric.change}</Badge>
              </div>
              <div className="text-3xl font-bold">{metric.value}</div>
              <div className="text-sm text-muted-foreground">{metric.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Platform Health */}
      <Card>
        <CardHeader>
          <CardTitle>Salud de la Plataforma</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Distribución de Planes</h4>
              {[
                { plan: "Trial", count: 42, pct: 27, color: "bg-gray-400" },
                { plan: "Starter", count: 65, pct: 42, color: "bg-blue-500" },
                { plan: "Professional", count: 38, pct: 24, color: "bg-purple-500" },
                { plan: "Enterprise", count: 11, pct: 7, color: "bg-amber-500" },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{item.plan}</span>
                    <span className="font-medium">{item.count} empresas ({item.pct}%)</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Crecimiento Mensual</h4>
              {[
                { month: "Jul", candidates: 2100, companies: 120 },
                { month: "Ago", candidates: 2505, companies: 133 },
                { month: "Sep", candidates: 2847, companies: 156 },
              ].map((data, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="font-medium">{data.month} 2026</span>
                  <div className="flex gap-4 text-sm">
                    <span>{data.candidates.toLocaleString()} candidatos</span>
                    <span className="font-medium text-primary">{data.companies} empresas</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
