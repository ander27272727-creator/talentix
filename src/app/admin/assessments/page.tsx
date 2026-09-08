"use client"

import { useState } from "react"
import { Brain, Plus, Clock, Users, BarChart3, Edit, X, Save, Eye, EyeOff, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const defaultAssessments = [
  { id: "1", name: "Perfil de Personalidad - Big Five (OCEAN)", category: "PSYCHOMETRIC", questions: 30, time: 12, responses: 1247, avgScore: 72, active: true, description: "Mide los cinco grandes rasgos de personalidad: Apertura, Conciencia, Extraversión, Amabilidad y Neuroticismo." },
  { id: "2", name: "Razonamiento Lógico", category: "COGNITIVE", questions: 20, time: 15, responses: 985, avgScore: 68, active: true, description: "Evalúa la capacidad de razonamiento deductivo, detección de patrones y resolución de problemas abstractos." },
  { id: "3", name: "Situaciones Laborales (SJT)", category: "BEHAVIORAL", questions: 15, time: 20, responses: 756, avgScore: 74, active: true, description: "Evalúa el juicio profesional ante situaciones reales del entorno laboral." },
  { id: "4", name: "Inteligencia Emocional", category: "PSYCHOMETRIC", questions: 25, time: 15, responses: 654, avgScore: 70, active: true, description: "Mide la capacidad de reconocer, comprender y gestionar las emociones propias y ajenas." },
  { id: "5", name: "Razonamiento Verbal", category: "COGNITIVE", questions: 18, time: 12, responses: 543, avgScore: 65, active: false, description: "Evalúa comprensión lectora, vocabulario y capacidad de análisis de textos." },
  { id: "6", name: "Liderazgo y Toma de Decisiones", category: "BEHAVIORAL", questions: 12, time: 18, responses: 432, avgScore: 76, active: true, description: "Evalúa habilidades de liderazgo, toma de decisiones bajo presión y gestión de equipos." },
]

const categoryColors: Record<string, string> = {
  PSYCHOMETRIC: "bg-purple-100 text-purple-800",
  COGNITIVE: "bg-blue-100 text-blue-800",
  BEHAVIORAL: "bg-emerald-100 text-emerald-800",
  TECHNICAL: "bg-amber-100 text-amber-800",
}

const categoryLabels: Record<string, string> = {
  PSYCHOMETRIC: "Psicométrica",
  COGNITIVE: "Cognitiva",
  BEHAVIORAL: "Comportamental",
  TECHNICAL: "Técnica",
}

type Assessment = typeof defaultAssessments[0]

export default function AdminAssessmentsPage() {
  const [assessments, setAssessments] = useState(defaultAssessments)
  const [editing, setEditing] = useState<Assessment | null>(null)
  const [editForm, setEditForm] = useState<Partial<Assessment>>({})

  const handleEdit = (assessment: Assessment) => {
    setEditing(assessment)
    setEditForm({ ...assessment })
  }

  const handleSave = () => {
    if (!editing) return
    setAssessments(assessments.map(a => a.id === editing.id ? { ...a, ...editForm } : a))
    setEditing(null)
    setEditForm({})
  }

  const handleToggleActive = (id: string) => {
    setAssessments(assessments.map(a => a.id === id ? { ...a, active: !a.active } : a))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            Evaluaciones
          </h1>
          <p className="text-muted-foreground mt-1">Gestión del banco de evaluaciones de la plataforma.</p>
        </div>
        <Button variant="fb">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Evaluación
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold gradient-text mb-1">{assessments.length}</div>
            <div className="text-sm text-muted-foreground">Evaluaciones Activas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold gradient-text mb-1">{assessments.reduce((a, b) => a + b.responses, 0).toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Respuestas Totales</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold gradient-text mb-1">71%</div>
            <div className="text-sm text-muted-foreground">Score Promedio</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {assessments.map((assessment) => (
          <Card key={assessment.id} className="hover:shadow-md transition-all duration-200">
            <CardContent className="p-6 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-semibold">{assessment.name}</h3>
                  <Badge className={categoryColors[assessment.category]}>{categoryLabels[assessment.category]}</Badge>
                  {!assessment.active && <Badge variant="outline">Inactiva</Badge>}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{assessment.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {assessment.responses.toLocaleString()} respuestas</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {assessment.time} min</span>
                  <span>{assessment.questions} preguntas</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-center mr-2">
                  <div className="text-xl font-bold">{assessment.avgScore}%</div>
                  <div className="text-xs text-muted-foreground">Avg Score</div>
                </div>
                <Button variant="ghost" size="icon" title="Editar evaluación" onClick={() => handleEdit(assessment)}>
                  <Edit className="h-4 w-4 text-fb-blue" />
                </Button>
                <Button variant="ghost" size="icon" title={assessment.active ? "Desactivar" : "Activar"} onClick={() => handleToggleActive(assessment.id)}>
                  {assessment.active ? <Eye className="h-4 w-4 text-emerald-500" /> : <EyeOff className="h-4 w-4 text-gray-400" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-background rounded-2xl max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Edit className="h-5 w-5 text-fb-blue" />
                Editar Evaluación
              </h2>
              <button onClick={() => setEditing(null)} className="p-2 hover:bg-muted rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Nombre</label>
                <Input
                  value={editForm.name || ""}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Descripción</label>
                <Textarea
                  value={editForm.description || ""}
                  onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                  className="min-h-[80px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Categoría</label>
                  <select
                    className="w-full p-2 rounded-lg border bg-background text-sm"
                    value={editForm.category || ""}
                    onChange={e => setEditForm({ ...editForm, category: e.target.value as Assessment["category"] })}
                  >
                    <option value="PSYCHOMETRIC">Psicométrica</option>
                    <option value="COGNITIVE">Cognitiva</option>
                    <option value="BEHAVIORAL">Comportamental</option>
                    <option value="TECHNICAL">Técnica</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Tiempo (min)</label>
                  <Input
                    type="number"
                    value={editForm.time || 0}
                    onChange={e => setEditForm({ ...editForm, time: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Preguntas</label>
                  <Input
                    type="number"
                    value={editForm.questions || 0}
                    onChange={e => setEditForm({ ...editForm, questions: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Estado</label>
                  <div className="flex items-center gap-3 h-10">
                    <button
                      onClick={() => setEditForm({ ...editForm, active: !editForm.active })}
                      className={`relative w-12 h-6 rounded-full transition-colors ${editForm.active ? "bg-emerald-500" : "bg-gray-300"}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${editForm.active ? "left-7" : "left-1"}`} />
                    </button>
                    <span className="text-sm">{editForm.active ? "Activa" : "Inactiva"}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setEditing(null)}>Cancelar</Button>
              <Button variant="fb" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Guardar Cambios
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
