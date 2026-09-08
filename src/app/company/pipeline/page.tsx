"use client"

import { Target, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const pipeline = [
  { stage: "Derivados", count: 24, color: "bg-blue-500", candidates: ["María García", "Laura López", "Roberto Díaz"] },
  { stage: "Revisados", count: 18, color: "bg-amber-500", candidates: ["Carlos Ruiz", "Ana Martínez", "Pedro Sánchez"] },
  { stage: "Contactados", count: 12, color: "bg-purple-500", candidates: ["Sofía Torres", "Diego Morales"] },
  { stage: "Entrevista", count: 6, color: "bg-indigo-500", candidates: ["Pedro Sánchez", "Lucía Vega"] },
  { stage: "Oferta", count: 2, color: "bg-orange-500", candidates: ["Carlos Ruiz"] },
  { stage: "Contratado", count: 3, color: "bg-emerald-500", candidates: ["Ana Martínez"] },
]

export default function CompanyPipelinePage() {
  const maxCount = Math.max(...pipeline.map(p => p.count))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Target className="h-8 w-8 text-primary" />
          Pipeline de Candidatos
        </h1>
        <p className="text-muted-foreground mt-1">
          Seguimiento del proceso de selección de cada candidato.
        </p>
      </div>

      {/* Funnel */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {pipeline.map((stage, i) => (
          <Card key={i} className="relative overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-1 ${stage.color}`} />
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold mb-1">{stage.count}</div>
              <div className="text-sm font-medium mb-2">{stage.stage}</div>
              <Progress value={(stage.count / maxCount) * 100} className="h-2" />
              {i < pipeline.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent in each stage */}
      <div className="grid md:grid-cols-2 gap-6">
        {pipeline.filter(s => s.candidates.length > 0).map((stage, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                {stage.stage}
                <Badge variant="outline">{stage.count}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stage.candidates.map((name, j) => (
                  <div key={j} className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fb-blue to-fb-purple flex items-center justify-center text-white text-xs font-medium">
                        {name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="text-sm font-medium">{name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
