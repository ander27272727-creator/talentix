"use client"

import { useState, useEffect } from "react"
import { Briefcase, Search, Loader2, Inbox } from "lucide-react"
import { apiFetch } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

interface VacancyRow {
  id: string
  title: string
  company: string
  status: string
  category: string
  location: string
  type: string
  applicants: number
  matches: number
  avgMatch: number | null
  createdAt: string
}

const statusColors: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-800",
  PAUSED: "bg-amber-100 text-amber-800",
  DRAFT: "bg-gray-100 text-gray-800",
  CLOSED: "bg-red-100 text-red-800",
}

const statusLabels: Record<string, string> = {
  ACTIVE: "Activa",
  PAUSED: "Pausada",
  DRAFT: "Borrador",
  CLOSED: "Cerrada",
}

export default function AdminVacanciesPage() {
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [vacancies, setVacancies] = useState<VacancyRow[]>([])

  useEffect(() => {
    apiFetch("/api/admin/vacancies")
      .then(r => r.json())
      .then(data => { if (data.success) setVacancies(data.vacancies) })
      .finally(() => setLoading(false))
  }, [])

  const filtered = vacancies.filter(v =>
    v.title.toLowerCase().includes(search.toLowerCase()) ||
    v.company.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Briefcase className="h-8 w-8 text-primary" />
          Vacantes
        </h1>
        <p className="text-muted-foreground mt-1">Vista general de todas las vacantes de la plataforma.</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar por título o empresa..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Inbox className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              {search ? "No se encontraron vacantes con esa búsqueda." : "Aún no hay vacantes publicadas en la plataforma."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((v) => (
            <Card key={v.id} className="hover:shadow-md transition-all duration-200">
              <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold">{v.title}</h3>
                    <Badge className={statusColors[v.status] || "bg-gray-100 text-gray-800"}>
                      {statusLabels[v.status] || v.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-0.5">
                    {v.company} · 📍 {v.location} · {v.applicants} candidato{v.applicants !== 1 ? "s" : ""} derivado{v.applicants !== 1 ? "s" : ""} · {v.matches} matches
                  </div>
                </div>
                <div className="sm:text-right shrink-0">
                  {v.avgMatch != null ? (
                    <>
                      <div className="text-xl font-bold gradient-text">{v.avgMatch}%</div>
                      <div className="text-xs text-muted-foreground">avg match</div>
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground">Sin matches aún</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
