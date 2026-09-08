"use client"

import { useState, useEffect } from "react"
import {
  Target, Building2, MapPin, Star, TrendingUp,
  Briefcase, Sparkles, Loader2, Search
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useStore } from "@/store/useStore"

interface MatchData {
  id: string
  overallMatch: number
  recommendation: string
  companyFitScore: number
  companyFitBreakdown: Record<string, number>
  candidateFitScore: number
  candidateFitBreakdown: Record<string, number>
  vacancy: {
    title: string
    description: string
    location: string
    type: string
    salaryMin?: number
    salaryMax?: number
    salaryCurrency?: string
    company: { name: string; industry: string; logo?: string; location: string }
  }
}

const REC_LABELS: Record<string, { label: string; color: string }> = {
  highly_recommended: { label: "Altamente Recomendado", color: "text-emerald-600" },
  recommended: { label: "Recomendado", color: "text-blue-600" },
  possible: { label: "Posible", color: "text-orange-600" },
  low_fit: { label: "Bajo Fit", color: "text-red-600" },
}

export default function MatchesPage() {
  const { user } = useStore()
  const [loading, setLoading] = useState(true)
  const [matches, setMatches] = useState<MatchData[]>([])
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    if (!user?.id) return
    fetch(`/api/candidate/matches?userId=${user.id}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setMatches(data.matches)
      })
      .finally(() => setLoading(false))
  }, [user?.id])

  const highMatches = matches.filter(m => m.overallMatch >= 85)
  const filtered = search
    ? matches.filter(m => m.vacancy.title.toLowerCase().includes(search.toLowerCase()) || m.vacancy.company.name.toLowerCase().includes(search.toLowerCase()))
    : activeTab === "high" ? highMatches : matches

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Target className="h-8 w-8 text-primary" />
          Mis Matches
        </h1>
        <p className="text-muted-foreground mt-1">Empresas compatibles con tu perfil.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-6 text-center">
          <div className="text-3xl font-bold text-primary">{matches.length}</div>
          <div className="text-sm text-muted-foreground">Total Matches</div>
        </CardContent></Card>
        <Card><CardContent className="p-6 text-center">
          <div className="text-3xl font-bold text-emerald-600">{highMatches.length}</div>
          <div className="text-sm text-muted-foreground">Alta Compatibilidad</div>
        </CardContent></Card>
        <Card><CardContent className="p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">
            {matches.length > 0 ? Math.round(matches.reduce((s, m) => s + m.overallMatch, 0) / matches.length) : 0}%
          </div>
          <div className="text-sm text-muted-foreground">Score Promedio</div>
        </CardContent></Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar por cargo o empresa..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Todos ({matches.length})</TabsTrigger>
          <TabsTrigger value="high">Alta Compatibilidad ({highMatches.length})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Matches list */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              {search ? "No se encontraron matches con esa búsqueda." : "Aún no tienes matches. Completa tus evaluaciones para obtener resultados."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map(m => {
            const rec = REC_LABELS[m.recommendation] || { label: m.recommendation, color: "text-gray-600" }
            return (
              <Card key={m.id} className="hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {m.vacancy.company.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg">{m.vacancy.title}</h3>
                      <p className="text-muted-foreground">{m.vacancy.company.name}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {m.vacancy.location}</span>
                        <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> {m.vacancy.type}</span>
                        {m.vacancy.salaryMin && m.vacancy.salaryMax && (
                          <span>${m.vacancy.salaryMin.toLocaleString()} - ${m.vacancy.salaryMax.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-center shrink-0">
                      <div className="text-3xl font-bold text-primary">{Math.round(m.overallMatch)}%</div>
                      <Badge variant="outline" className={`text-xs ${rec.color}`}>{rec.label}</Badge>
                    </div>
                  </div>

                  {/* Score breakdown */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t">
                    {Object.entries(m.companyFitBreakdown || {}).map(([key, val]) => (
                      <div key={key}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span className="font-medium">{val as number}%</span>
                        </div>
                        <Progress value={val as number} className="h-1.5" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* AI Insight */}
      {matches.length > 0 && (
        <Card className="bg-gradient-to-r from-fb-blue/5 to-fb-purple/5 border-fb-blue/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shrink-0">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">💡 Insight de IA</h3>
                <p className="text-sm text-muted-foreground">
                  {highMatches.length > 0
                    ? `Tienes ${highMatches.length} match${highMatches.length > 1 ? "es" : ""} de alta compatibilidad. Considera aplicar directamente a estas oportunidades.`
                    : `Completando más evaluaciones mejorarás la precisión de tus matches.`
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
