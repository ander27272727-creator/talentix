"use client"

import { useState, useEffect } from "react"
import { Briefcase, MapPin, Globe, Building2, Map, Loader2, Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useStore } from "@/store/useStore"

interface VacancyData {
  id: string
  title: string
  description: string
  location: string
  type: string
  category: string
  salaryMin?: number
  salaryMax?: number
  salaryCurrency?: string
  company: { name: string; industry: string; logo?: string; location: string; size: string }
}

const typeConfig: Record<string, { label: string; icon: typeof Globe; color: string }> = {
  REMOTE: { label: "Remoto", icon: Globe, color: "bg-emerald-100 text-emerald-800" },
  HYBRID: { label: "Híbrido", icon: Building2, color: "bg-amber-100 text-amber-800" },
  ONSITE: { label: "Presencial", icon: Map, color: "bg-blue-100 text-blue-800" },
}

export default function CandidateVacanciesPage() {
  const { user } = useStore()
  const [loading, setLoading] = useState(true)
  const [vacancies, setVacancies] = useState<VacancyData[]>([])
  const [filterType, setFilterType] = useState("ALL")
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetch("/api/candidate/vacancies")
      .then(r => r.json())
      .then(data => {
        if (data.success) setVacancies(data.vacancies)
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = vacancies.filter(v => {
    if (filterType !== "ALL" && v.type !== filterType) return false
    if (search && !v.title.toLowerCase().includes(search.toLowerCase()) && !v.company.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Briefcase className="h-8 w-8 text-primary" />
          Vacantes Disponibles
        </h1>
        <p className="text-muted-foreground mt-1">{vacancies.length} vacantes activas en la plataforma.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar cargo o empresa..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <div className="flex gap-2">
          {["ALL", "REMOTE", "HYBRID", "ONSITE"].map(t => (
            <Button key={t} size="sm" variant={filterType === t ? "fb" : "outline"} onClick={() => setFilterType(t)}>
              {t === "ALL" ? "Todas" : typeConfig[t]?.label || t}
            </Button>
          ))}
        </div>
      </div>

      {/* Vacancies */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No se encontraron vacantes con esos filtros.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(v => {
            const tc = typeConfig[v.type] || typeConfig.ONSITE
            const Icon = tc.icon
            return (
              <Card key={v.id} className="hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center text-white font-bold text-sm">
                      {v.company.name.substring(0, 2).toUpperCase()}
                    </div>
                    <Badge className={tc.color}><Icon className="h-3 w-3 mr-1" /> {tc.label}</Badge>
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{v.title}</h3>
                  <p className="text-sm text-muted-foreground">{v.company.name}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {v.location}</span>
                    {v.salaryMin && v.salaryMax && (
                      <span>${v.salaryMin.toLocaleString()} - ${v.salaryMax.toLocaleString()} {v.salaryCurrency}</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{v.description}</p>
                  <Button variant="fb-outline" className="w-full mt-4" size="sm">
                    Ver Detalles
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
