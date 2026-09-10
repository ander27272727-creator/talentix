"use client"

import { useState, useEffect } from "react"
import { Target, ArrowRight, Loader2, Inbox } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useStore } from "@/store/useStore"
import { apiFetch } from "@/lib/api"

interface PipelineStage {
  stage: string
  label: string
  color: string
  count: number
  candidates: { id: string; name: string; score: number }[]
}

export default function CompanyPipelinePage() {
  const { user } = useStore()
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [pipeline, setPipeline] = useState<PipelineStage[]>([])

  useEffect(() => {
    if (!user?.id) return
    fetch(`/api/company/pipeline?userId=${user.id}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setPipeline(data.pipeline)
          setTotal(data.total)
        }
      })
      .finally(() => setLoading(false))
  }, [user?.id])

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  }

  const activeStages = pipeline.filter(p => p.stage !== "REJECTED")
  const maxCount = Math.max(1, ...activeStages.map(p => p.count))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Target className="h-8 w-8 text-primary" />
          Pipeline de Candidatos
        </h1>
        <p className="text-muted-foreground mt-1">
          Seguimiento del proceso de selección · {total} candidato{total !== 1 ? "s" : ""} en total.
        </p>
      </div>

      {total === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Inbox className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              Tu pipeline está vacío. Aparecerá actividad cuando recibas candidatos derivados por la IA.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Funnel */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {activeStages.map((stage, i) => (
              <Card key={stage.stage} className="relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1 ${stage.color}`} />
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold mb-1">{stage.count}</div>
                  <div className="text-sm font-medium mb-2">{stage.label}</div>
                  <Progress value={(stage.count / maxCount) * 100} className="h-2" />
                  {i < activeStages.length - 1 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Candidatos por etapa */}
          <div className="grid md:grid-cols-2 gap-6">
            {pipeline.filter(s => s.candidates.length > 0).map((stage) => (
              <Card key={stage.stage}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    {stage.label}
                    <Badge variant="outline">{stage.count}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {stage.candidates.map((c) => (
                      <div key={c.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fb-blue to-fb-purple flex items-center justify-center text-white text-xs font-medium">
                            {c.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                          </div>
                          <span className="text-sm font-medium">{c.name}</span>
                        </div>
                        <span className="text-sm font-bold gradient-text">{c.score}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
