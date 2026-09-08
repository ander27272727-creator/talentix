"use client"

import { useState, useEffect } from "react"
import {
  Brain, Clock, CheckCircle2, ArrowRight, Play,
  Target, Sparkles, Filter, Loader2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { useStore } from "@/store/useStore"

interface AssessmentItem {
  id: string
  name: string
  category: string
  description: string
  timeLimitMinutes: number
  questionCount: number
  completed: boolean
  score: number | null
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  COGNITIVE: { bg: "bg-blue-50", text: "text-blue-600", label: "Cognitiva" },
  PSYCHOMETRIC: { bg: "bg-purple-50", text: "text-purple-600", label: "Psicométrica" },
  BEHAVIORAL: { bg: "bg-emerald-50", text: "text-emerald-600", label: "Comportamental" },
  TECHNICAL: { bg: "bg-orange-50", text: "text-orange-600", label: "Técnica" },
}

export default function AssessmentsPage() {
  const { user } = useStore()
  const [loading, setLoading] = useState(true)
  const [assessments, setAssessments] = useState<AssessmentItem[]>([])
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    if (!user?.id) return
    fetch(`/api/candidate/assessments?userId=${user.id}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setAssessments(data.assessments)
      })
      .finally(() => setLoading(false))
  }, [user?.id])

  const completed = assessments.filter(a => a.completed)
  const pending = assessments.filter(a => !a.completed)

  const filtered = activeTab === "all" ? assessments
    : activeTab === "completed" ? completed
    : pending

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Brain className="h-8 w-8 text-primary" />
          Evaluaciones
        </h1>
        <p className="text-muted-foreground mt-1">Completa evaluaciones para mejorar tus matches.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary">{assessments.length}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-emerald-600">{completed.length}</div>
            <div className="text-sm text-muted-foreground">Completadas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-600">{pending.length}</div>
            <div className="text-sm text-muted-foreground">Pendientes</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Todas ({assessments.length})</TabsTrigger>
          <TabsTrigger value="pending">Pendientes ({pending.length})</TabsTrigger>
          <TabsTrigger value="completed">Completadas ({completed.length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {filtered.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                {activeTab === "completed" ? (
                  <>
                    <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                    <p className="text-muted-foreground">Aún no has completado ninguna evaluación.</p>
                    <p className="text-sm text-muted-foreground mt-1">¡Empieza con una evaluación pendiente!</p>
                  </>
                ) : (
                  <p className="text-muted-foreground">No hay evaluaciones disponibles.</p>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map(a => {
                const cat = CATEGORY_COLORS[a.category] || { bg: "bg-gray-50", text: "text-gray-600", label: a.category }
                return (
                  <Card key={a.id} className="hover:shadow-md transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-12 h-12 rounded-xl ${cat.bg} flex items-center justify-center`}>
                          <Brain className={`h-6 w-6 ${cat.text}`} />
                        </div>
                        <Badge variant={a.completed ? "success" : "secondary"}>
                          {a.completed ? "Completada" : "Pendiente"}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{a.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{a.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {a.timeLimitMinutes} min</span>
                        <span className="flex items-center gap-1"><Target className="h-3 w-3" /> {a.questionCount} preguntas</span>
                        <Badge variant="outline" className={`text-xs ${cat.text}`}>{cat.label}</Badge>
                      </div>
                      {a.completed && a.score !== null ? (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Score</span>
                            <span className="font-bold">{Math.round(a.score)}%</span>
                          </div>
                          <Progress value={a.score} />
                        </div>
                      ) : null}
                      <Link href={`/candidate/assessments/${a.id}`}>
                        <Button variant={a.completed ? "outline" : "fb"} className="w-full" size="sm">
                          {a.completed ? (
                            <><CheckCircle2 className="mr-2 h-4 w-4" /> Ver Resultados</>
                          ) : (
                            <><Play className="mr-2 h-4 w-4" /> Iniciar Evaluación</>
                          )}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* AI Insight */}
      {pending.length > 0 && (
        <Card className="bg-gradient-to-r from-fb-blue/5 to-fb-purple/5 border-fb-blue/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shrink-0">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">💡 Insight de IA</h3>
                <p className="text-sm text-muted-foreground">
                  Tienes {pending.length} evaluación{pending.length > 1 ? "es" : ""} pendiente{pending.length > 1 ? "s" : ""}.
                  Completar todas mejora la precisión de tus matches hasta en un 40%.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
