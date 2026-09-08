"use client"

import { useState } from "react"
import {
  Brain, Clock, CheckCircle2, ArrowRight, Play, FileText,
  Target, BarChart3, Sparkles, Filter, Search, AlertCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import Link from "next/link"

// Mock assessments data
const availableAssessments = [
  {
    id: "cognitive-logic",
    name: "Razonamiento Lógico",
    category: "COGNITIVE",
    description: "Evalúa tu capacidad para resolver problemas abstractos y detectar patrones.",
    timeLimit: 15,
    questions: 20,
    difficulty: "Media",
    targetRoles: ["Developer", "Analista", "Ingeniero"],
  },
  {
    id: "psychometric-bigfive",
    name: "Personalidad Big Five (OCEAN)",
    category: "PSYCHOMETRIC",
    description: "Mide tus rasgos de personalidad: Apertura, Conciencia, Extraversión, Amabilidad, Neuroticismo.",
    timeLimit: 12,
    questions: 30,
    difficulty: "Baja",
    targetRoles: ["Todos los cargos"],
  },
  {
    id: "behavioral-sjt",
    name: "Situaciones Laborales (SJT)",
    category: "BEHAVIORAL",
    description: "Evalúa tu juicio ante situaciones reales del entorno laboral.",
    timeLimit: 20,
    questions: 15,
    difficulty: "Media",
    targetRoles: ["Manager", "Líder", "Team Lead"],
  },
  {
    id: "4",
    name: "Razonamiento Numérico",
    category: "COGNITIVE",
    description: "Evalúa tu capacidad para analizar datos, gráficas y realizar cálculos.",
    timeLimit: 18,
    questions: 25,
    difficulty: "Media",
    targetRoles: ["Analista", "Finance", "Data"],
  },
  {
    id: "5",
    name: "Liderazgo y Toma de Decisiones",
    category: "BEHAVIORAL",
    description: "Evalúa tu estilo de liderazgo y capacidad de decisión bajo presión.",
    timeLimit: 15,
    questions: 20,
    difficulty: "Alta",
    targetRoles: ["Director", "Manager", "Team Lead"],
  },
  {
    id: "6",
    name: "Inteligencia Emocional",
    category: "PSYCHOMETRIC",
    description: "Mide tu autoconciencia, empatía y regulación emocional.",
    timeLimit: 10,
    questions: 25,
    difficulty: "Baja",
    targetRoles: ["Todos los cargos"],
  },
]

const completedAssessments = [
  {
    id: "c1",
    name: "Razonamiento Verbal",
    category: "COGNITIVE",
    completedAt: "Hace 3 días",
    score: 85,
    percentile: 78,
  },
  {
    id: "c2",
    name: "Atención al Detalle",
    category: "COGNITIVE",
    completedAt: "Hace 5 días",
    score: 92,
    percentile: 88,
  },
  {
    id: "c3",
    name: "Trabajo en Equipo",
    category: "BEHAVIORAL",
    completedAt: "Hace 1 semana",
    score: 78,
    percentile: 65,
  },
  {
    id: "c4",
    name: "Motivación Intrínseca",
    category: "PSYCHOMETRIC",
    completedAt: "Hace 1 semana",
    score: 88,
    percentile: 82,
  },
]

export default function CandidateAssessmentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")

  const filteredAvailable = availableAssessments.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === "all" || a.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      COGNITIVE: "info",
      PSYCHOMETRIC: "purple",
      BEHAVIORAL: "warning",
      TECHNICAL: "success",
    }
    return colors[category] || "secondary"
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      COGNITIVE: "Cognitiva",
      PSYCHOMETRIC: "Psicométrica",
      BEHAVIORAL: "Comportamental",
      TECHNICAL: "Técnica",
    }
    return labels[category] || category
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      Baja: "text-emerald-600",
      Media: "text-amber-600",
      Alta: "text-red-600",
    }
    return colors[difficulty] || "text-muted-foreground"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-purple-600" />
            Evaluaciones
          </h1>
          <p className="text-muted-foreground mt-1">
            Completa evaluaciones para mejorar tus matches y descubrir tu potencial.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="info" className="px-3 py-1">
            {completedAssessments.length} completadas
          </Badge>
          <Badge variant="purple" className="px-3 py-1">
            {availableAssessments.length} disponibles
          </Badge>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="border-2 border-purple-200 bg-purple-50/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                Progreso de Evaluaciones
              </h3>
              <p className="text-sm text-muted-foreground">
                Completa más evaluaciones para obtener matches más precisos
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">
                {completedAssessments.length}/{availableAssessments.length + completedAssessments.length}
              </div>
              <div className="text-xs text-muted-foreground">completadas</div>
            </div>
          </div>
          <Progress 
            value={(completedAssessments.length / (availableAssessments.length + completedAssessments.length)) * 100} 
            className="h-3"
            indicatorClassName="bg-gradient-to-r from-purple-500 to-blue-500"
          />
        </CardContent>
      </Card>

      {/* AI Insight */}
      <Card className="border-2 border-fb-purple/20 bg-gradient-to-r from-fb-purple/5 to-fb-blue/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-fb-purple to-fb-blue flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium">
                Recomendación de IA 🎯
              </p>
              <p className="text-xs text-muted-foreground">
                Para mejorar tus matches con empresas de liderazgo, te recomendamos completar 
                la evaluación de "Liderazgo y Toma de Decisiones". Esto podría aumentar tu 
                match promedio en un 15%.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="available">
        <TabsList>
          <TabsTrigger value="available">
            Disponibles ({availableAssessments.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completadas ({completedAssessments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="mt-6 space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar evaluación..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {["all", "COGNITIVE", "PSYCHOMETRIC", "BEHAVIORAL"].map((cat) => (
                <Button
                  key={cat}
                  variant={filterCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterCategory(cat)}
                >
                  {cat === "all" ? "Todas" : getCategoryLabel(cat)}
                </Button>
              ))}
            </div>
          </div>

          {/* Assessment Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAvailable.map((assessment) => (
              <Card key={assessment.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant={getCategoryColor(assessment.category) as any}>
                      {getCategoryLabel(assessment.category)}
                    </Badge>
                    <span className={`text-xs font-medium ${getDifficultyColor(assessment.difficulty)}`}>
                      {assessment.difficulty}
                    </span>
                  </div>

                  <h3 className="font-semibold text-lg mb-2">{assessment.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {assessment.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {assessment.timeLimit} min
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {assessment.questions} preguntas
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {assessment.targetRoles.slice(0, 3).map((role) => (
                      <Badge key={role} variant="secondary" className="text-xs">
                        {role}
                      </Badge>
                    ))}
                    {assessment.targetRoles.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{assessment.targetRoles.length - 3}
                      </Badge>
                    )}
                  </div>

                  <Link href={`/candidate/assessments/${assessment.id}`}>
                    <Button variant="fb" className="w-full">
                      <Play className="mr-2 h-4 w-4" />
                      Comenzar Evaluación
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="space-y-4">
            {completedAssessments.map((assessment) => (
              <Card key={assessment.id} className="hover:shadow-md transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{assessment.name}</h3>
                        <Badge variant={getCategoryColor(assessment.category) as any} className="text-xs">
                          {getCategoryLabel(assessment.category)}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Completada {assessment.completedAt}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{assessment.score}%</div>
                      <div className="text-xs text-muted-foreground">
                        Percentil {assessment.percentile}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
