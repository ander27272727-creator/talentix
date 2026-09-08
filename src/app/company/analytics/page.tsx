"use client"

import { BarChart3, TrendingUp, Users, Briefcase, Clock, Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const metrics = [
  { label: "Time-to-Hire", value: "18 días", change: "-45%", icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Tasa de Conversión", value: "12%", change: "+3%", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Cost per Hire", value: "$2,400", change: "-15%", icon: Target, color: "text-purple-600", bg: "bg-purple-50" },
  { label: "Satisfacción Candidatos", value: "4.8/5", change: "+0.3", icon: Users, color: "text-amber-600", bg: "bg-amber-50" },
]

const monthlyData = [
  { month: "Ene", candidates: 45, hired: 3 },
  { month: "Feb", candidates: 52, hired: 5 },
  { month: "Mar", candidates: 38, hired: 4 },
  { month: "Abr", candidates: 61, hired: 7 },
  { month: "May", candidates: 55, hired: 6 },
  { month: "Jun", candidates: 48, hired: 3 },
]

export default function CompanyAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-primary" />
          Analytics
        </h1>
        <p className="text-muted-foreground mt-1">
          Métricas de hiring y rendimiento de tu proceso de selección.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <Card key={i} className="hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${metric.bg} flex items-center justify-center`}>
                  <metric.icon className={`h-6 w-6 ${metric.color}`} />
                </div>
                <Badge variant="success" className="text-xs">{metric.change}</Badge>
              </div>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="text-sm text-muted-foreground">{metric.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Monthly chart simulation */}
      <Card>
        <CardHeader>
          <CardTitle>Candidatos vs Contratados (Últimos 6 meses)</CardTitle>
          <CardDescription>Rendimiento mensual de tu proceso de selección</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyData.map((data, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 text-sm font-medium text-muted-foreground">{data.month}</div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1">
                    <Progress value={(data.candidates / 70) * 100} className="h-6" />
                  </div>
                  <span className="text-sm font-medium w-16 text-right">{data.candidates} candidatos</span>
                </div>
                <div className="w-20 text-right">
                  <Badge variant="success">{data.hired} contratados</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Skills Más Demandadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { skill: "React/Next.js", count: 12, pct: 85 },
              { skill: "TypeScript", count: 10, pct: 78 },
              { skill: "Node.js", count: 8, pct: 65 },
              { skill: "Python", count: 7, pct: 58 },
              { skill: "AWS/Cloud", count: 6, pct: 50 },
              { skill: "Docker", count: 5, pct: 42 },
              { skill: "PostgreSQL", count: 4, pct: 35 },
              { skill: "Agile/Scrum", count: 3, pct: 28 },
            ].map((item, i) => (
              <div key={i} className="p-3 rounded-xl bg-muted/50">
                <div className="text-sm font-medium mb-1">{item.skill}</div>
                <Progress value={item.pct} className="h-2 mb-1" />
                <div className="text-xs text-muted-foreground">{item.count} vacantes</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
